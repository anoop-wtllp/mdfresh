import Image from "next/image";
import { MANAGEMENT } from "@/lib/content";
import { Reveal, RevealWords } from "@/components/reveal";

/**
 * The two people running the company.
 *
 * The portraits are studio headshots on a pale grey ground, which now sits with
 * the page rather than against it — they still take a hairline plate so that
 * grey does not bleed into the white card behind them.
 */
export function ManagementSection() {
  return (
    <section
      id="management"
      aria-labelledby="management-heading"
      className="on-light border-t rule-ink bg-frost py-24 sm:py-32"
    >
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-10">
        <div className="mb-14 max-w-2xl">
          <Reveal>
            <p className="eyebrow mb-5">Our management team</p>
          </Reveal>
          <RevealWords
            as="h2"
            id="management-heading"
            text="Led by food-science & industry expertise."
            className="font-display text-[length:var(--text-title)] font-semibold leading-[1.05] text-ink"
          />
        </div>

        <ul className="grid gap-4 sm:grid-cols-2">
          {MANAGEMENT.map((leader, i) => (
            <Reveal
              key={leader.name}
              delay={i * 0.08}
              as="li"
              className="group flex flex-col gap-6 rounded-2xl border rule-ink bg-paper p-6 transition-colors duration-500 hover:border-leaf/50 sm:flex-row sm:p-8"
            >
              <div className="shrink-0 overflow-hidden rounded-xl ring-1 ring-ink/10">
                <Image
                  src={leader.image}
                  alt={leader.name}
                  width={413}
                  height={531}
                  quality={90}
                  sizes="(min-width: 640px) 132px, 116px"
                  className="h-auto w-[7.25rem] object-cover sm:w-[8.25rem]"
                />
              </div>

              <div>
                <h3 className="font-display text-xl font-semibold text-ink">
                  {leader.name}
                </h3>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-leaf-deep">
                  {leader.role}
                </p>
                <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-dim">
                  {leader.bio}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
