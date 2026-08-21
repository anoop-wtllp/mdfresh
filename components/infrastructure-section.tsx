import Image from "next/image";
import { PLANT } from "@/lib/content";
import { Reveal, RevealWords } from "@/components/reveal";

/**
 * The plant itself: a photograph of the building, the address, and what the
 * site is already equipped for.
 */
export function InfrastructureSection() {
  return (
    <section
      id="infrastructure"
      aria-labelledby="infrastructure-heading"
      className="on-light border-t rule-ink bg-paper py-24 sm:py-32"
    >
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-6">
            <Reveal>
              <p className="eyebrow mb-5">Infrastructure & plant</p>
            </Reveal>
            <RevealWords
              as="h2"
              id="infrastructure-heading"
              text="Ready for scale."
              className="font-display text-[length:var(--text-title)] font-semibold leading-[1.05] text-ink"
            />
            <Reveal delay={0.15}>
              <p className="mt-6 max-w-lg text-[length:var(--text-lead)] leading-relaxed text-ink-dim">
                Our plant at {PLANT.address} is strategically located in a
                vegetable-producing zone, engineered for consistent, hygienic,
                high-volume processing.
              </p>
            </Reveal>

            <ul className="mt-9 border-t rule-ink">
              {PLANT.points.map((point, i) => (
                <Reveal key={point} delay={0.2 + i * 0.06} as="li">
                  <span className="flex gap-5 border-b rule-ink py-4">
                    <span className="shrink-0 font-mono text-[10px] tracking-[0.2em] text-ink-mute">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[0.9375rem] leading-relaxed text-ink-dim">
                      {point}
                    </span>
                  </span>
                </Reveal>
              ))}
            </ul>
          </div>

          <Reveal delay={0.2} className="lg:col-span-6">
            <figure className="overflow-hidden rounded-2xl border rule-ink">
              <Image
                src="/about/plant.jpg"
                alt="The M.D. Fresh Veg processing plant at Ram Nagar, a long blue-and-white clad building beside open fields."
                width={1300}
                height={864}
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
