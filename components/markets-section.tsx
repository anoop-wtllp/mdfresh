import { MARKETS } from "@/lib/content";
import { Reveal } from "@/components/reveal";

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
      className="border-t rule bg-ink-soft py-20 sm:py-28"
    >
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-10">
        {/* Silent, for the same reason as the product list: the banner above
            already carries this headline. */}
        <h2 id="markets-heading" className="sr-only">
          Markets we serve
        </h2>

        <ul className="border-t rule">
          {MARKETS.map((market, i) => (
            <Reveal key={market.id} delay={i * 0.06} as="li">
              <div className="group grid gap-4 border-b rule py-9 transition-colors duration-500 hover:bg-frost/[0.03] md:grid-cols-12 md:items-baseline md:gap-8">
                <span className="flex items-baseline gap-5 md:col-span-5">
                  <span className="font-mono text-[10px] tracking-[0.2em] text-frost-mute">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-2xl font-semibold text-frost transition-colors duration-500 group-hover:text-pea-bright motion-reduce:transition-none sm:text-3xl">
                    {market.name}
                  </h3>
                </span>
                <p className="pl-10 text-[0.9375rem] leading-relaxed text-frost-dim md:col-span-7 md:pl-0">
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
