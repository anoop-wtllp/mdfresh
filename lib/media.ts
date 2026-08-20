/**
 * Single source of truth for the site's footage.
 *
 * The files under `public/media` are built from `public/assets` by
 * `npm run media` (see scripts/optimize-media.mjs). Each clip has a phone-sized
 * and a desktop-sized encode plus a poster frame; nothing here points at the
 * originals, which stay untouched as the source of truth.
 *
 * Every clip is 8.00s. The journey clips are treated as one continuous film:
 * `CLIP_DURATION * JOURNEY.length` seconds that the scroll position scrubs.
 */

export const CLIP_DURATION = 8;

/** Below this width a phone gets the 854px encode instead of the 1280px one. */
export const DESKTOP_QUERY = "(min-width: 768px)";

export type Sources = {
  /** 854px wide, ~24% the weight of the source. */
  mobile: string;
  /** 1280px wide. */
  desktop: string;
  /** First frame, so the frame is filled before any video byte lands. */
  poster: string;
};

const sources = (slug: string): Sources => ({
  mobile: `/media/${slug}-480.mp4`,
  desktop: `/media/${slug}-720.mp4`,
  poster: `/media/${slug}-poster.jpg`,
});

/**
 * Pick the encode this device should download.
 *
 * Deliberately resolved in JS rather than with `<source media="...">`: browser
 * support for media queries on a `<video>`'s `<source>` children is unreliable,
 * and getting it wrong means shipping the 1280px encode to a phone.
 */
export function pickSource(media: Sources): string {
  if (typeof window === "undefined") return media.mobile;
  return window.matchMedia(DESKTOP_QUERY).matches
    ? media.desktop
    : media.mobile;
}

export type Chapter = {
  id: string;
  /** Ordinal shown in the UI, e.g. "01". */
  index: string;
  media: Sources;
  /** Short label for the progress rail. */
  label: string;
  title: string;
  body: string;
  /** Text alternative — the film is decorative, this carries the meaning. */
  alt: string;
};

/** The farm-to-frozen film, in narrative order. */
export const JOURNEY: Chapter[] = [
  {
    id: "field",
    index: "01",
    media: sources("aerial-camera-descending-over-peas"),
    label: "The field",
    title: "It starts in the ground, not a warehouse.",
    body: "We contract-grow with farms inside a four-hour radius of the freezer. The harvest window is measured in hours, and we plan the whole season backwards from it.",
    alt: "Aerial camera descending toward a green pea field at first light.",
  },
  {
    id: "pod",
    index: "02",
    media: sources("green-pea-pod-swaying"),
    label: "The pod",
    title: "Picked at the peak, never before it.",
    body: "Sugar turns to starch the moment a pea leaves the vine. We test brix in the field and only call the harvest when the crop is exactly where we want it.",
    alt: "A single green pea pod swaying on the vine in soft wind.",
  },
  {
    id: "shell",
    index: "03",
    media: sources("green-pea-pod-opening"),
    label: "The shell",
    title: "Opened, sorted, graded by size.",
    body: "Pods are shelled within the hour and optically graded. Anything bruised, pale or oversized leaves the line before it ever sees water.",
    alt: "A pea pod splitting open to reveal the row of peas inside.",
  },
  {
    id: "wash",
    index: "04",
    media: sources("green-peas-tumbling-in-water"),
    label: "The wash",
    title: "Washed cold, blanched fast.",
    body: "A cold-water tumble lifts the field heat, then seconds of steam lock the colour and stop the enzymes that would otherwise dull the flavour.",
    alt: "Green peas tumbling through clean running water.",
  },
  {
    id: "freeze",
    index: "05",
    media: sources("frost-crystals-blooming-on-peas"),
    label: "The freeze",
    title: "Minus eighteen, one pea at a time.",
    body: "Individually quick frozen in a blast tunnel. Small crystals, no clumping, no cell damage — which is why they pour loose and cook like fresh.",
    alt: "Frost crystals blooming across the surface of green peas.",
  },
  {
    id: "bowl",
    index: "06",
    media: sources("frozen-peas-pouring-into-bowl"),
    label: "The bowl",
    title: "Nine months later, still that morning.",
    body: "Sealed, cased and held at a stable minus eighteen all the way to your kitchen. Open a bag in February and you are eating the summer we picked.",
    alt: "Frozen peas pouring loose into a bowl.",
  },
];

export type Loop = {
  id: string;
  media: Sources;
  caption: string;
  alt: string;
  /** Grid emphasis: how many columns the tile claims. */
  span: "wide" | "normal";
};

/** Ambient texture clips used in the gallery, the hero and the band. */
export const LOOPS: Loop[] = [
  {
    id: "falling",
    media: sources("frozen-vegetables-falling"),
    caption: "Loose from the bag",
    alt: "Frozen mixed vegetables falling through frame.",
    span: "wide",
  },
  {
    id: "crystals",
    media: sources("ice-crystals-growing-on-pea"),
    caption: "Crystals under 40µm",
    alt: "Ice crystals growing across the skin of a single pea.",
    span: "normal",
  },
  {
    id: "bowl",
    media: sources("frozen-vegetables-in-wooden-bowl"),
    caption: "Mixed veg, no filler",
    alt: "Frozen mixed vegetables resting in a wooden bowl.",
    span: "normal",
  },
  {
    id: "fog",
    media: sources("fog-pours-over-frozen-vegetables"),
    caption: "Straight from the tunnel",
    alt: "Cold vapour pouring over a bed of frozen vegetables.",
    span: "wide",
  },
  {
    id: "cascade",
    media: sources("frozen-peas-cascading-in-motion"),
    caption: "Free-flowing, never clumped",
    alt: "Frozen peas cascading in slow motion.",
    span: "wide",
  },
  {
    id: "floating",
    media: sources("frozen-vegetables-floating-in-air"),
    caption: "Graded piece by piece",
    alt: "Frozen vegetable pieces suspended in mid-air.",
    span: "normal",
  },
];

/** The clip behind the hero. */
export const HERO_CLIP = LOOPS.find((l) => l.id === "floating")!;

/** The clip behind the full-bleed band between sections. */
export const BAND_CLIP = LOOPS.find((l) => l.id === "fog")!;

/**
 * Gallery tiles: whatever is not already carrying a section of its own. Every
 * clip in the folder gets exactly one home, so nothing repeats on the page.
 */
export const GALLERY = LOOPS.filter(
  (l) => l.id !== HERO_CLIP.id && l.id !== BAND_CLIP.id,
);
