import Image from "next/image";
import { DISTRIBUTION } from "@/lib/content";
import { Reveal, RevealWords } from "@/components/reveal";

/**
 * How the produce actually reaches a buyer: the cold chain, the roads it runs
 * on, and the packaging it arrives in.
 */
export function DistributionSection() {
  return (
    <section
      id="distribution"
      aria-labelledby="distribution-heading"
      className="border-t rule py-24 sm:py-32"
    >
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-6">
            <Reveal>
              <p className="eyebrow mb-5">Distribution</p>
            </Reveal>
            <RevealWords
              as="h2"
              id="distribution-heading"
              text="A cold chain you can rely on."
              className="font-display text-[length:var(--text-title)] font-semibold leading-[1.05] text-frost"
            />
            <Reveal delay={0.15}>
              <p className="mt-6 max-w-lg text-[length:var(--text-lead)] leading-relaxed text-frost-dim">
                With a robust cold-chain network and a customer-first approach,
                we ensure timely distribution of premium frozen produce — from
                farm to freezer to your kitchen, preserving freshness at every
                step.
              </p>
            </Reveal>

            <ul className="mt-9 border-t rule">
              {DISTRIBUTION.map((point, i) => (
                <Reveal key={point} delay={0.2 + i * 0.06} as="li">
                  <span className="flex gap-5 border-b rule py-4">
                    <span className="shrink-0 font-mono text-[10px] tracking-[0.2em] text-frost-mute">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[0.9375rem] leading-relaxed text-frost-dim">
                      {point}
                    </span>
                  </span>
                </Reveal>
              ))}
            </ul>
          </div>

          <Reveal delay={0.2} className="lg:col-span-6">
            <figure className="overflow-hidden rounded-2xl border rule">
              <Image
                src="/markets/trays.jpg"
                alt="Clear retail trays of frozen peas, carrot slices and sweetcorn arranged on a bright orange surface."
                width={1200}
                height={672}
                quality={90}
                sizes="(min-width: 1024px) 40rem, (min-width: 640px) 90vw, 92vw"
                className="h-auto w-full object-cover"
              />
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
