/**
 * Single source of truth for the site's footage.
 *
 * Every clip is 1280x720, h264, exactly 8.00s. The journey clips are treated as
 * one continuous film: `CLIP_DURATION * JOURNEY.length` seconds of runtime that
 * the scroll position scrubs through.
 */

export const CLIP_DURATION = 8;

const JOURNEY_DIR = "/assets/concept-1-from-farm-to-frozen-the-pea-journey";
const LOOPS_DIR = "/assets/frozen-vegetable-loops";

export type Chapter = {
  id: string;
  /** Ordinal shown in the UI, e.g. "01". */
  index: string;
  src: string;
  /** Short label for the progress rail. */
  label: string;
  title: string;
  body: string;
  /** Text alternative — the film is decorative, this carries the meaning. */
  alt: string;
  /** Where the copy sits over the frame. */
  align: "left" | "right" | "center";
};

/** The farm-to-frozen film, in narrative order. */
export const JOURNEY: Chapter[] = [
  {
    id: "field",
    index: "01",
    src: `${JOURNEY_DIR}/Aerial_camera_descending_over_peas_202608201151.mp4`,
    label: "The field",
    title: "It starts in the ground, not a warehouse.",
    body: "We contract-grow with farms inside a four-hour radius of the freezer. The harvest window is measured in hours, and we plan the whole season backwards from it.",
    alt: "Aerial camera descending toward a green pea field at first light.",
    align: "left",
  },
  {
    id: "pod",
    index: "02",
    src: `${JOURNEY_DIR}/Green_pea_pod_swaying_202608201208.mp4`,
    label: "The pod",
    title: "Picked at the peak, never before it.",
    body: "Sugar turns to starch the moment a pea leaves the vine. We test brix in the field and only call the harvest when the crop is exactly where we want it.",
    alt: "A single green pea pod swaying on the vine in soft wind.",
    align: "right",
  },
  {
    id: "shell",
    index: "03",
    src: `${JOURNEY_DIR}/Green_pea_pod_opening_202608201207.mp4`,
    label: "The shell",
    title: "Opened, sorted, graded by size.",
    body: "Pods are shelled within the hour and optically graded. Anything bruised, pale or oversized leaves the line before it ever sees water.",
    alt: "A pea pod splitting open to reveal the row of peas inside.",
    align: "left",
  },
  {
    id: "wash",
    index: "04",
    src: `${JOURNEY_DIR}/Green_peas_tumbling_in_water_202608201213.mp4`,
    label: "The wash",
    title: "Washed cold, blanched fast.",
    body: "A cold-water tumble lifts the field heat, then seconds of steam lock the colour and stop the enzymes that would otherwise dull the flavour.",
    alt: "Green peas tumbling through clean running water.",
    align: "right",
  },
  {
    id: "freeze",
    index: "05",
    src: `${JOURNEY_DIR}/Frost_crystals_blooming_on_peas_202608201219.mp4`,
    label: "The freeze",
    title: "Minus eighteen, one pea at a time.",
    body: "Individually quick frozen in a blast tunnel. Small crystals, no clumping, no cell damage — which is why they pour loose and cook like fresh.",
    alt: "Frost crystals blooming across the surface of green peas.",
    align: "left",
  },
  {
    id: "bowl",
    index: "06",
    src: `${JOURNEY_DIR}/Frozen_peas_pouring_into_bowl_202608201221.mp4`,
    label: "The bowl",
    title: "Nine months later, still that morning.",
    body: "Sealed, cased and held at a stable minus eighteen all the way to your kitchen. Open a bag in February and you are eating the summer we picked.",
    alt: "Frozen peas pouring loose into a bowl.",
    align: "right",
  },
];

export type Loop = {
  id: string;
  src: string;
  caption: string;
  alt: string;
  /** Grid emphasis: how many columns the tile claims. */
  span: "wide" | "full" | "normal";
};

/** Ambient texture clips used in the gallery and hero. */
export const LOOPS: Loop[] = [
  {
    id: "falling",
    src: `${LOOPS_DIR}/Frozen_vegetables_falling_202608201231.mp4`,
    caption: "Loose from the bag",
    alt: "Frozen mixed vegetables falling through frame.",
    span: "wide",
  },
  {
    id: "crystals",
    src: `${LOOPS_DIR}/Ice_crystals_growing_on_pea_202608201229.mp4`,
    caption: "Crystals under 40µm",
    alt: "Ice crystals growing across the skin of a single pea.",
    span: "normal",
  },
  {
    id: "bowl",
    src: `${LOOPS_DIR}/Frozen_vegetables_in_wooden_bowl_202608201224.mp4`,
    caption: "Mixed veg, no filler",
    alt: "Frozen mixed vegetables resting in a wooden bowl.",
    span: "normal",
  },
  {
    id: "fog",
    src: `${LOOPS_DIR}/Fog_pours_over_frozen_vegetables_202608201233.mp4`,
    caption: "Straight from the tunnel",
    alt: "Cold vapour pouring over a bed of frozen vegetables.",
    span: "wide",
  },
  {
    id: "cascade",
    src: `${LOOPS_DIR}/Frozen_peas_cascading_in_motion_202608201226.mp4`,
    caption: "Free-flowing, never clumped",
    alt: "Frozen peas cascading in slow motion.",
    span: "wide",
  },
  {
    id: "floating",
    src: `${LOOPS_DIR}/Frozen_vegetables_floating_in_air_202608201237.mp4`,
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
