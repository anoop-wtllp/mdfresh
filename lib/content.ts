/**
 * Site copy for M.D. Fresh Veg Private Limited.
 *
 * Everything a section renders as words lives here, so a copy change never
 * means touching an animated component. Footage stays in `lib/media.ts`.
 */

export const COMPANY = {
  name: "M.D. Fresh Veg",
  legalName: "M.D. Fresh Veg Private Limited",
  tagline: "Perfectly Preserved Freshness",
  established: 2010,
} as const;

export const CONTACT = {
  phoneLabel: "+91 98377 66000",
  /** E.164, for `tel:` and `wa.me` — never shown. */
  phoneHref: "tel:+919837766000",
  whatsapp: "https://wa.me/919837766000",
  email: "mdfvcp@mdfreshveg.com",
  emailHref: "mailto:mdfvcp@mdfreshveg.com",
  addressLines: ["Ram Nagar, Iglas", "Aligarh, UP 202002"],
} as const;

export type Strength = {
  title: string;
  body: string;
};

/** "Why partners choose M.D. Fresh Veg". */
export const STRENGTHS: Strength[] = [
  {
    title: "Prime Agri-Belt",
    body: "Located in a vegetable-producing zone with direct farmer partnerships and easy access to fresh raw material.",
  },
  {
    title: "Advanced IQF Line",
    body: "Individual Quick Freezing preserves nutrition, flavour, colour and texture with consistent standards.",
  },
  {
    title: "End-to-End Cold Chain",
    body: "Integrated farm-to-freezer supply chain with batch-level traceability and year-round availability.",
  },
  {
    title: "Food-Tech Led QC",
    body: "Qualified food technologists oversee operations for safe, hygienic, market-relevant products.",
  },
  {
    title: "Export-Ready",
    body: "Premium quality and export-grade packaging for institutional and overseas buyers.",
  },
  {
    title: "Ready Infrastructure",
    body: "400 KVA power, ample borewell water and a skilled workforce — built for scale.",
  },
];

export type Product = {
  name: string;
  detail: string;
  /** Freezing method, shown as the card's tag. */
  tag: "IQF" | "Frozen";
  /**
   * Square product shot under `public/products`.
   *
   * All ten are cut-outs on a white ground and only 261px square (mixed veg is
   * 420px), which is why the card masks them into a circle: the crop takes the
   * white corners off and keeps the rendered size under the source, so they
   * stay sharp instead of being upscaled.
   */
  image: string;
  /** Gradient start class for the hover glow behind the image. */
  tone: string;
};

export const PRODUCTS: Product[] = [
  {
    name: "Frozen Green Peas",
    image: "/products/prod-peas.jpg",
    detail: "Sweet, tender peas — IQF frozen at peak harvest.",
    tag: "IQF",
    tone: "from-pea/25",
  },
  {
    name: "Frozen Sweet Corn",
    image: "/products/prod-corn.jpg",
    detail: "Golden, juicy kernels, naturally sweet.",
    tag: "IQF",
    tone: "from-pea-bright/20",
  },
  {
    name: "Frozen Green Beans",
    image: "/products/prod-beans.jpg",
    detail: "Crisp cut beans, clean and consistent.",
    tag: "IQF",
    tone: "from-leaf/30",
  },
  {
    name: "Frozen Carrot",
    image: "/products/prod-carrot.jpg",
    detail: "Uniformly cut carrots, ready to cook.",
    tag: "IQF",
    tone: "from-brand/20",
  },
  {
    name: "Frozen Mixed Vegetables",
    image: "/products/prod-mixed.jpg",
    detail: "A balanced medley — perfect for HORECA prep.",
    tag: "IQF",
    tone: "from-ice/20",
  },
  {
    name: "Frozen Tomato Paste",
    image: "/products/prod-tomato.jpg",
    detail: "Rich, ready-to-use tomato paste.",
    tag: "Frozen",
    tone: "from-brand/25",
  },
  {
    name: "Frozen Garlic Paste",
    image: "/products/prod-garlic.jpg",
    detail: "Convenient, flavour-locked garlic paste.",
    tag: "Frozen",
    tone: "from-frost/15",
  },
  {
    name: "Frozen Ginger Paste",
    image: "/products/prod-ginger.jpg",
    detail: "Aromatic ginger paste, always fresh.",
    tag: "Frozen",
    tone: "from-pea/20",
  },
  {
    name: "Frozen Jamun (Black Plum)",
    image: "/products/prod-jamun.jpg",
    detail: "Deep-purple jamun, frozen whole at season peak.",
    tag: "IQF",
    tone: "from-leaf-deep/40",
  },
  {
    name: "Frozen Litchi",
    image: "/products/prod-litchi.jpg",
    detail: "Peeled, de-seeded litchi with its aroma intact.",
    tag: "IQF",
    tone: "from-ice/25",
  },
];

export type Market = {
  id: string;
  name: string;
  body: string;
};

export const MARKETS: Market[] = [
  {
    id: "horeca",
    name: "HORECA",
    body: "Ready-to-use frozen vegetables that cut prep time and guarantee year-round availability for hotels, restaurants & caterers.",
  },
  {
    id: "processors",
    name: "Food Processors",
    body: "Industrial-grade frozen produce with consistent quality, batch traceability and scalable supply.",
  },
  {
    id: "retail",
    name: "Retail & Distribution",
    body: "Attractive, hygienic retail packs backed by a reliable cold-chain distribution network.",
  },
  {
    id: "exports",
    name: "Exports",
    body: "Export-ready produce meeting international quality and packaging expectations.",
  },
];

export type Pillar = {
  title: string;
  body: string;
};

/** Vision, mission and the values under both. */
export const PILLARS: Pillar[] = [
  {
    title: "Vision",
    body: "To become a market leader in frozen fruits and vegetables by ensuring sustainability, innovation and quality in every pack.",
  },
  {
    title: "Mission",
    body: "To minimise post-harvest losses, empower local farmers through sourcing partnerships, and bring convenient, nutritious frozen food to every household.",
  },
  {
    title: "Values",
    body: "Quality, sustainability and integrity — empowering farmers, minimising waste and delivering reliable, innovative frozen-food solutions.",
  },
];

/** What the plant changes for the district around it. */
export const IMPACT: Pillar[] = [
  {
    title: "150+ Livelihoods",
    body: "Direct & indirect employment, empowering the rural workforce around Aligarh.",
  },
  {
    title: "Farmer Empowerment",
    body: "Buy-back arrangements and sourcing partnerships giving farmers stable demand.",
  },
  {
    title: "Less Food Wastage",
    body: "Modern agri-processing cuts post-harvest losses and promotes sustainable agriculture.",
  },
];

export type Leader = {
  name: string;
  role: string;
  bio: string;
  /** Portrait under `public/about`, 413x531. */
  image: string;
};

export const MANAGEMENT: Leader[] = [
  {
    name: "Dharmendra Kumar Varshney",
    role: "Strategic Leadership",
    bio: "Over two decades in the packaging industry, bringing deep expertise in operations, marketing and agri-produce. His visionary leadership steers the company toward innovation, sustainability and customer satisfaction.",
    image: "/about/mgmt-dharmendra.jpg",
  },
  {
    name: "Aniket Varshney",
    role: "Food Technologist & R&D",
    bio: "A Food Technologist by qualification and entrepreneur by passion, driving product development, quality control and innovation to keep the company ahead in a rapidly evolving food landscape.",
    image: "/about/mgmt-aniket.jpg",
  },
];

/** The Ram Nagar plant, and what it is already equipped for. */
export const PLANT = {
  address: "Plot No. 75, Village Ram Nagar, Tehsil Iglas, Aligarh",
  points: [
    "400 KVA power connection secured for current and future expansion.",
    "Abundant borewell water for hygienic industrial use.",
    "Skilled & semi-skilled local workforce with food technologists on board.",
    "Advanced IQF line with integrated cold storage.",
  ],
} as const;

/** How the produce actually reaches a buyer. */
export const DISTRIBUTION = [
  "Well-connected via state highways to major business centres.",
  "Batch-level traceability and scalable supply for large buyers.",
  "Export-grade packaging for overseas and institutional markets.",
];
