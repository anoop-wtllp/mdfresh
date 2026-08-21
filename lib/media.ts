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

/**
 * The farm-to-freezer film: the six manufacturing stages, in plant order.
 *
 * The footage is representative, not documentary — the `alt` on each step
 * describes the clip that actually plays, while `title`/`body` carry the stage.
 */
export const JOURNEY: Chapter[] = [
  {
    id: "sourcing",
    index: "01",
    media: sources("aerial-camera-descending-over-peas"),
    label: "Sourcing",
    title: "Raw material sourcing.",
    body: "Farm-fresh produce from partner farmers in the agri-belt around Ram Nagar. Backward linkages keep the raw material consistent and traceable to the field it came from.",
    alt: "Aerial camera descending toward a green pea field at first light.",
  },
  {
    id: "sorting",
    index: "02",
    media: sources("green-pea-pod-opening"),
    label: "Sorting",
    title: "Sorting & grading.",
    body: "Careful sorting and grading for consistent quality. Anything bruised, pale or off-size leaves the line before it ever reaches the wash.",
    alt: "A pea pod splitting open to reveal the row of peas inside.",
  },
  {
    id: "washing",
    index: "03",
    media: sources("green-peas-tumbling-in-water"),
    label: "Washing",
    title: "Washing, peeling & cutting.",
    body: "Multi-stage cleaning, peeling and precise cutting, so every piece in the pack is the same size and cooks at the same rate.",
    alt: "Green peas tumbling through clean running water.",
  },
  {
    id: "blanching",
    index: "04",
    media: sources("green-pea-pod-swaying"),
    label: "Blanching",
    title: "Blanching in hot water.",
    body: "Precise blanching to lock in colour and nutrition. Seconds of heat stop the enzymes that would otherwise dull the flavour in storage.",
    alt: "A single green pea pod swaying on the vine in soft wind.",
  },
  {
    id: "freezing",
    index: "05",
    media: sources("frost-crystals-blooming-on-peas"),
    label: "IQF freezing",
    title: "Individual Quick Freezing.",
    body: "Frozen at −30°C to −40°C in 10–12 minutes, piece by piece. Small crystals, no clumping, no cell damage — which is why they pour loose and cook like fresh.",
    alt: "Frost crystals blooming across the surface of green peas.",
  },
  {
    id: "storage",
    index: "06",
    media: sources("frozen-peas-pouring-into-bowl"),
    label: "Storage",
    title: "Frozen storage at −18°C.",
    body: "Cold-chain storage at −18°C or below until dispatch, then held there all the way to your kitchen. Open a pack in February and you are cooking the season we picked.",
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

/**
 * Look up a loop by id — used by the inner-page banners to pick a backdrop.
 *
 * Throws rather than returning undefined: a typo here would otherwise surface
 * as a banner with no footage and no error, at build time on every page.
 */
export function loop(id: string): Loop {
  const found = LOOPS.find((l) => l.id === id);
  if (!found) throw new Error(`Unknown loop id: ${id}`);
  return found;
}

/** The clip behind the hero. */
export const HERO_CLIP = LOOPS.find((l) => l.id === "floating")!;

/** The clip behind the full-bleed band between sections. */
export const BAND_CLIP = LOOPS.find((l) => l.id === "fog")!;
