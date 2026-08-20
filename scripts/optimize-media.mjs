/**
 * Build web-ready derivatives of the source footage in `public/assets`.
 *
 * Run with `npm run media`. Sources are never modified; everything lands in
 * `public/media/`, which is what the site actually serves.
 *
 * For each clip it emits:
 *   <slug>-720.mp4   desktop
 *   <slug>-480.mp4   phones and small tablets
 *   <slug>-poster.jpg  first frame, so the frame is filled before any video
 *                      byte arrives
 *
 * Three things do the heavy lifting:
 *   - `-an` drops the audio track. Every clip on this site is muted, and the
 *     sources carry a 128 kb/s AAC stream nobody will ever hear.
 *   - A dense GOP on the scrubbed clips. Seeking can only land on a keyframe,
 *     so the film section is only as smooth as the keyframe interval. Paired
 *     with a bitrate ceiling, or high-motion clips end up bigger than source.
 *   - `+faststart` puts the moov atom first, so playback and seeking can begin
 *     before the file has finished downloading.
 */
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdir, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import ffmpegPath from "ffmpeg-static";

const run = promisify(execFile);

const SRC_ROOT = "public/assets";
const OUT_ROOT = "public/media";

/**
 * Clips the film scrubs frame-by-frame. These get a much denser keyframe
 * interval, because a seek can only land on a keyframe — the film section is
 * exactly as smooth as the GOP allows.
 */
const SCRUBBED = /concept-1-from-farm-to-frozen-the-pea-journey/;

/**
 * `maxrate` matters as much as `crf` here. High-motion clips (peas tumbling
 * through water) are expensive to encode, and a dense GOP makes them more so —
 * without a ceiling those two effects together produce files *larger* than the
 * 1929 kb/s sources, which is the opposite of the point.
 */
const VARIANTS = [
  { name: "720", width: 1280, crf: 27, maxrate: "1600k", bufsize: "3200k" },
  { name: "480", width: 854, crf: 30, maxrate: "750k", bufsize: "1500k" },
];

/** `Green_pea_pod_opening_202608201207.mp4` -> `green-pea-pod-opening` */
function slugify(filename) {
  return filename
    .replace(/\.mp4$/i, "")
    .replace(/_\d{8,}$/, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

async function encode(input, output, { width, crf, maxrate, bufsize, scrubbed }) {
  // Keyframe every 12 frames (half a second at 24fps) on the scrubbed clips.
  // Tighter than this stopped paying for itself in smoothness and started
  // costing real bytes.
  const gop = scrubbed
    ? ["-g", "12", "-keyint_min", "12", "-sc_threshold", "0"]
    : ["-g", "48"];

  await run(
    ffmpegPath,
    [
      "-y",
      "-loglevel", "error",
      "-i", input,
      // -2 keeps the height even, which h264 requires.
      "-vf", `scale=${width}:-2:flags=lanczos`,
      "-c:v", "libx264",
      "-profile:v", "main",
      "-pix_fmt", "yuv420p",
      "-crf", String(crf),
      "-maxrate", maxrate,
      "-bufsize", bufsize,
      "-preset", "slower",
      ...gop,
      "-an",
      "-movflags", "+faststart",
      output,
    ],
    { maxBuffer: 1 << 26 },
  );
}

async function poster(input, output) {
  await run(
    ffmpegPath,
    [
      "-y",
      "-loglevel", "error",
      "-i", input,
      "-frames:v", "1",
      "-vf", "scale=854:-2:flags=lanczos",
      "-q:v", "6",
      output,
    ],
    { maxBuffer: 1 << 26 },
  );
}

const kb = (n) => `${(n / 1024).toFixed(0)}KB`;

async function main() {
  const folders = (await readdir(SRC_ROOT, { withFileTypes: true }))
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  await mkdir(OUT_ROOT, { recursive: true });

  const manifest = [];
  let srcTotal = 0;
  const outTotal = {};

  for (const folder of folders) {
    const dir = path.join(SRC_ROOT, folder);
    const files = (await readdir(dir)).filter((f) => f.endsWith(".mp4"));
    const scrubbed = SCRUBBED.test(folder);

    for (const file of files) {
      const input = path.join(dir, file);
      const slug = slugify(file);
      const srcSize = (await stat(input)).size;
      srcTotal += srcSize;

      const sizes = {};
      for (const v of VARIANTS) {
        const out = path.join(OUT_ROOT, `${slug}-${v.name}.mp4`);
        await encode(input, out, { ...v, scrubbed });
        const size = (await stat(out)).size;
        sizes[v.name] = size;
        outTotal[v.name] = (outTotal[v.name] ?? 0) + size;
      }

      const posterOut = path.join(OUT_ROOT, `${slug}-poster.jpg`);
      await poster(input, posterOut);
      const posterSize = (await stat(posterOut)).size;
      outTotal.poster = (outTotal.poster ?? 0) + posterSize;

      manifest.push({ folder, slug, source: file });
      console.log(
        `${slug.padEnd(36)} src ${kb(srcSize).padStart(7)} -> ` +
          VARIANTS.map((v) => `${v.name}p ${kb(sizes[v.name])}`).join("  ") +
          `  poster ${kb(posterSize)}${scrubbed ? "  [dense GOP]" : ""}`,
      );
    }
  }

  await writeFile(
    path.join(OUT_ROOT, "manifest.json"),
    JSON.stringify(manifest, null, 2) + "\n",
  );

  console.log(`\nsources        ${kb(srcTotal)}`);
  for (const v of VARIANTS) {
    console.log(
      `${v.name}p set${" ".repeat(8 - v.name.length)}${kb(outTotal[v.name])}` +
        `  (${((outTotal[v.name] / srcTotal) * 100).toFixed(0)}% of source)`,
    );
  }
  console.log(`posters        ${kb(outTotal.poster)}`);
}

main().catch((err) => {
  console.error(err.stderr?.toString() || err);
  process.exit(1);
});
