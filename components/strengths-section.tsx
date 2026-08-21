import { STRENGTHS } from "@/lib/content";
import { Reveal, RevealWords } from "@/components/reveal";

/**
 * Per-ground class sets.
 *
 * `cell` is a pair rather than one class: the cards alternate grounds by index,
 * which lands as a checkerboard at three columns, stripes at two, and bands at
 * one — all of them read as a deliberate rhythm.
 */
const TONES = {
  dark: {
    section: "border-t rule",
    heading: "text-frost",
    frame:
      "border rule bg-[color-mix(in_oklab,var(--color-frost)_12%,transparent)]",
    cell: ["bg-ink", "bg-ink"] as const,
    cellHover: "hover:bg-ink-soft",
    numeral: "text-frost-mute",
    title: "text-frost",
    body: "text-frost-dim",
    edge: "bg-pea",
    titleHover: "",
  },
  light: {
    section: "on-light bg-frost",
    heading: "text-ink",
    frame:
      "border rule-ink bg-[color-mix(in_oklab,var(--color-ink)_12%,transparent)]",
    cell: ["bg-paper", "bg-paper-soft"] as const,
    cellHover: "hover:bg-mint",
    numeral: "text-ink-mute",
    title: "text-ink",
    body: "text-ink-dim",
    // Pea is milk on this ground; leaf holds its edge against both cards.
    edge: "bg-leaf",
    titleHover: "group-hover:text-leaf-deep",
  },
} as const;

type StrengthsSectionProps = {
  /**
   * `light` flips the section onto a paper ground. Home uses it as the one
   * bright band between the film and the gallery; About keeps the dark set,
   * where it follows an already-dark block.
   */
  tone?: keyof typeof TONES;
};

/**
 * "Why partners choose M.D. Fresh Veg" — the six core strengths, as a hairline
 * grid. Purely typographic on purpose: it sits between two video-heavy
 * sections and is the page's one moment of quiet.
 */
export function StrengthsSection({ tone = "dark" }: StrengthsSectionProps) {
  const t = TONES[tone];

  return (
    <section
      id="strengths"
      aria-labelledby="strengths-heading"
      className={`${t.section} py-28 sm:py-40`}
    >
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-10">
        <div className="mb-16 max-w-2xl">
          <Reveal>
            <p className="eyebrow mb-6">Core strengths</p>
          </Reveal>
          <RevealWords
            as="h2"
            id="strengths-heading"
            text="Why partners choose M.D. Fresh Veg."
            className={`font-display text-[length:var(--text-title)] font-semibold leading-[1.05] ${t.heading}`}
          />
        </div>

        {/* One-pixel gaps over a tinted ground: the cells look ruled without
            each one carrying its own border and doubling up on the seams. */}
        <ul
          className={`grid gap-px overflow-hidden rounded-2xl ${t.frame} sm:grid-cols-2 lg:grid-cols-3`}
        >
          {STRENGTHS.map((strength, i) => (
            <Reveal
              key={strength.title}
              delay={(i % 3) * 0.08}
              as="li"
              className={`group relative ${t.cell[i % 2]} ${t.cellHover} p-8 transition-colors duration-500 sm:p-10`}
            >
              <span
                className={`font-mono text-[10px] tracking-[0.2em] ${t.numeral}`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3
                className={`mt-5 font-display text-xl font-semibold ${t.title} ${t.titleHover} transition-colors duration-500 motion-reduce:transition-none`}
              >
                {strength.title}
              </h3>
              <p className={`mt-3 text-[0.9375rem] leading-relaxed ${t.body}`}>
                {strength.body}
              </p>
              {/* Lights along the top edge on hover, so the pointer has a
                  target without the card moving under it. */}
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 ${t.edge} transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 motion-reduce:transition-none`}
              />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
