"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useInView } from "framer-motion";
import { gsap, useGSAP } from "@/lib/gsap";
import { Reveal, RevealWords } from "@/components/reveal";

type Stat = {
  value: number;
  /** Rendered before/after the number. */
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
  note: string;
};

const STATS: Stat[] = [
  {
    value: 2010,
    label: "Established",
    note: "Processing, packaging and cold-storage of frozen vegetables and fruits, without a break since.",
  },
  {
    value: 150,
    suffix: "+",
    label: "Livelihoods supported",
    note: "Partner farmers, plant staff and cold-chain crew across the Aligarh agri-belt.",
  },
  {
    value: 400,
    suffix: " KVA",
    label: "Plant power",
    note: "Backed by ample borewell water and a skilled workforce — infrastructure built for scale.",
  },
  {
    value: 100,
    suffix: "%",
    label: "Farm-traceable",
    note: "Batch-level traceability all the way back to the field the raw material came from.",
  },
];

const POINTS = [
  "Located in a prime agri-belt with easy access to fresh raw material.",
  "Technically skilled workforce and food-technologist-led operations.",
];

/**
 * Counts from zero to `stat.value` the first time it scrolls into view.
 *
 * A year is a label, not a quantity — rolling 0 → 2010 reads as a bug, so
 * four-digit values are stamped in place instead of counted.
 */
function Counter({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });

  const format = (n: number) =>
    `${stat.prefix ?? ""}${n.toFixed(stat.decimals ?? 0)}${stat.suffix ?? ""}`;

  useGSAP(() => {
    const el = ref.current;
    if (!el || !inView) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduced || stat.value >= 1000) {
      el.textContent = format(stat.value);
      return;
    }

    const counter = { n: 0 };
    gsap.to(counter, {
      n: stat.value,
      duration: 1.6,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = format(counter.n);
      },
    });
  }, [inView]);

  return (
    <span
      ref={ref}
      // The animated digits are noise to a screen reader; the real value lives
      // in the sibling below and is announced instead.
      aria-hidden="true"
      // `--text-title`, not `--text-display`. These sit four to a row now, which
      // leaves ~235px of cell: "400 KVA" sets at 307px in the display size and
      // wrapped onto a second line. At title size it sets at 184px and every
      // value clears the cell at each breakpoint.
      className="block font-display text-[length:var(--text-title)] font-semibold leading-none tracking-[-0.04em] text-ink tabular-nums"
    >
      {stat.value >= 1000
        ? format(stat.value)
        : `${stat.prefix ?? ""}0${stat.suffix ?? ""}`}
    </span>
  );
}

export function AboutSection() {
  return (
    <section
      aria-labelledby="about-heading"
      // `on-light` retints the eyebrow and the focus ring, both tuned for
      // ink and washed out on this ground.
      className="on-light relative border-t rule-ink bg-frost py-28 sm:py-40"
    >
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-6">
            <Reveal>
              <p className="eyebrow mb-6">Who we are</p>
            </Reveal>
            <RevealWords
              as="h2"
              id="about-heading"
              text="End-to-end control, farm to freezer."
              className="font-display text-[length:var(--text-title)] font-semibold leading-[1.05] text-ink"
            />
            <Reveal delay={0.15}>
              <p className="mt-7 max-w-lg text-[length:var(--text-lead)] leading-relaxed text-ink-dim">
                M.D. Fresh Veg Private Limited specialises in the processing,
                packaging and cold-storage of frozen vegetables and fruits using
                cutting-edge Individual Quick Freezing (IQF) technology. With a
                strong agricultural foundation and direct farmer linkages, we
                deliver premium quality, longer shelf life and export-ready
                produce.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-5 max-w-lg text-[0.9375rem] leading-relaxed text-ink-dim">
                Our strength lies in end-to-end control of sourcing, processing
                and cold-chain distribution — enabling us to serve retail,
                HORECA, food processors, institutional buyers and exports.
              </p>
            </Reveal>

            <ul className="mt-9 space-y-4">
              {POINTS.map((point, i) => (
                <Reveal key={point} delay={0.26 + i * 0.08} as="li">
                  <span className="flex gap-4">
                    <span
                      aria-hidden="true"
                      className="mt-2.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-leaf"
                    />
                    <span className="text-[0.9375rem] leading-relaxed text-ink-dim">
                      {point}
                    </span>
                  </span>
                </Reveal>
              ))}
            </ul>

            <Reveal delay={0.42}>
              <Link
                href="/process"
                className="group mt-10 inline-flex items-center gap-3 rounded-full border rule-ink px-7 py-3.5 text-sm font-medium text-ink transition-colors duration-300 hover:border-leaf-deep hover:bg-leaf-deep hover:text-paper"
              >
                See how we do it
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
                >
                  &rarr;
                </span>
              </Link>
            </Reveal>
          </div>

          <Reveal delay={0.2} className="lg:col-span-6">
            <figure className="overflow-hidden rounded-2xl border rule-ink">
              <Image
                src="/about/farmer.jpg"
                alt="A farmer in a wide-brimmed hat holding a woven basket of freshly picked green produce in a misty field."
                width={1500}
                height={840}
                quality={90}
                sizes="(min-width: 1024px) 40rem, (min-width: 640px) 90vw, 92vw"
                className="h-auto w-full object-cover"
              />
            </figure>
          </Reveal>
        </div>

        <dl className="mt-16 grid gap-px overflow-hidden rounded-2xl border rule-ink bg-[color-mix(in_oklab,var(--color-ink)_12%,transparent)] sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <Reveal
              key={stat.label}
              delay={(i % 4) * 0.08}
              className="bg-paper p-8"
            >
              <Counter stat={stat} />
              <dt className="mt-5 text-sm font-medium text-ink">
                <span className="sr-only">
                  {stat.prefix ?? ""}
                  {stat.value}
                  {stat.suffix ?? ""} —{" "}
                </span>
                {stat.label}
              </dt>
              <dd className="mt-2 text-[0.9375rem] leading-relaxed text-ink-mute">
                {stat.note}
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
