import { MARKETS } from "@/lib/content";
import { Reveal, RevealWords } from "@/components/reveal";

/**
 * The four segments we supply. Numbered rows rather than cards: the copy
 * lengths are uneven, and a row gives the long ones room without stretching
 * the short ones to match.
 */
export function MarketsSection() {
  return (
    <section
      id="markets"
      aria-labelledby="markets-heading"
      // `on-light` retints the eyebrow and focus ring, both tuned for ink.
      className="on-light border-t rule-ink bg-paper py-24 sm:py-32"
    >
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-10">
        {/* Visible again: the banner above says "From our freezer to every
            industry", so this heading is a second, different statement rather
            than an echo of it. */}
        <div className="mb-14 max-w-2xl">
          <Reveal>
            <p className="eyebrow mb-5">Who we supply</p>
          </Reveal>
          <RevealWords
            as="h2"
            id="markets-heading"
            text="Built for HORECA, industry, retail & exports."
            className="font-display text-[length:var(--text-title)] font-semibold leading-[1.05] text-ink"
          />
        </div>

        <ul className="border-t rule-ink">
          {MARKETS.map((market, i) => (
            <Reveal key={market.id} delay={i * 0.06} as="li">
              <div className="group grid gap-4 border-b rule-ink py-9 transition-colors duration-500 hover:bg-ink/[0.04] md:grid-cols-12 md:items-baseline md:gap-8">
                <span className="flex items-baseline gap-5 md:col-span-5">
                  <span className="font-mono text-[10px] tracking-[0.2em] text-ink-mute">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-2xl font-semibold text-ink transition-colors duration-500 group-hover:text-leaf-deep motion-reduce:transition-none sm:text-3xl">
                    {market.name}
                  </h3>
                </span>
                <p className="pl-10 text-[0.9375rem] leading-relaxed text-ink-dim md:col-span-7 md:pl-0">
                  {market.body}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
