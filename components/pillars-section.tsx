import type { Pillar } from "@/lib/content";
import { Reveal, RevealWords } from "@/components/reveal";

type PillarsSectionProps = {
  id: string;
  eyebrow: string;
  heading: string;
  items: Pillar[];
  /**
   * Alternates the ground so consecutive sections separate. The cards always
   * take the opposite one, or they would vanish into the section behind them.
   */
  ground?: "frost" | "paper";
};

/**
 * A titled three-up of short statements.
 *
 * Vision/Mission/Values and the social-impact figures are the same shape — a
 * label and a sentence — so they share one section rather than two files that
 * would drift apart on the next copy change.
 */
export function PillarsSection({
  id,
  eyebrow,
  heading,
  items,
  ground = "frost",
}: PillarsSectionProps) {
  const headingId = `${id}-heading`;
  const onFrost = ground === "frost";

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      // `on-light` is not decoration: it retints the eyebrow off pea, which
      // sits at 2.2:1 here, and swaps the focus ring for one that is visible.
      className={`on-light border-t rule-ink py-24 sm:py-32 ${
        onFrost ? "bg-frost" : "bg-paper"
      }`}
    >
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-10">
        <div className="mb-14 max-w-2xl">
          <Reveal>
            <p className="eyebrow mb-5">{eyebrow}</p>
          </Reveal>
          <RevealWords
            as="h2"
            id={headingId}
            text={heading}
            className="font-display text-[length:var(--text-title)] font-semibold leading-[1.05] text-ink"
          />
        </div>

        {/* One-pixel gaps over a tinted ground: the cells look ruled without
            each one carrying its own border and doubling up on the seams. */}
        <ul className="grid gap-px overflow-hidden rounded-2xl border rule-ink bg-[color-mix(in_oklab,var(--color-ink)_12%,transparent)] sm:grid-cols-3">
          {items.map((item, i) => (
            <Reveal
              key={item.title}
              delay={i * 0.08}
              as="li"
              className={`group relative p-8 transition-colors duration-500 hover:bg-mint sm:p-10 ${
                onFrost ? "bg-paper" : "bg-frost"
              }`}
            >
              <span className="font-mono text-[10px] tracking-[0.2em] text-ink-mute">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-5 font-display text-xl font-semibold text-ink transition-colors duration-500 group-hover:text-leaf-deep motion-reduce:transition-none">
                {item.title}
              </h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-dim">
                {item.body}
              </p>
              {/* Leaf, not pea: pea is milk against a light ground. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-leaf transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 motion-reduce:transition-none"
              />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
