"use client";

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

const LINKS = [
  {
    title: "Backward linkages",
    body: "with local farmers for consistent, traceable raw material.",
  },
  {
    title: "Integrated cold chain",
    body: "— from farm to freezer to your kitchen.",
  },
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
      className="block font-display text-[length:var(--text-display)] font-semibold leading-none tracking-[-0.04em] text-frost tabular-nums"
    >
      {stat.value >= 1000 ? format(stat.value) : `${stat.prefix ?? ""}0${stat.suffix ?? ""}`}
    </span>
  );
}

export function AboutSection() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative border-t rule bg-ink-soft py-28 sm:py-40"
    >
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-10">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="eyebrow mb-6">About M.D. Fresh Veg</p>
            </Reveal>
            <RevealWords
              as="h2"
              id="about-heading"
              text="Processing, packaging and cold-storage, under one roof."
              className="font-display text-[length:var(--text-title)] font-semibold leading-[1.05] text-frost"
            />
            <Reveal delay={0.15}>
              <p className="mt-7 max-w-md text-[length:var(--text-lead)] leading-relaxed text-frost-dim">
                Established in 2010, we specialise in the processing, packaging
                and cold-storage of frozen vegetables and fruits using
                cutting-edge Individual Quick Freezing (IQF) technology at our
                plant in Ram Nagar, Aligarh.
              </p>
            </Reveal>

            <ul className="mt-9 space-y-4">
              {LINKS.map((link, i) => (
                <Reveal key={link.title} delay={0.22 + i * 0.08} as="li">
                  <span className="flex gap-4">
                    <span
                      aria-hidden="true"
                      className="mt-2.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-pea"
                    />
                    <span className="text-[0.9375rem] leading-relaxed text-frost-dim">
                      <strong className="font-medium text-frost">
                        {link.title}
                      </strong>{" "}
                      {link.body}
                    </span>
                  </span>
                </Reveal>
              ))}
            </ul>

            <Reveal delay={0.38}>
              <Link
                href="/process"
                className="group mt-10 inline-flex items-center gap-3 rounded-full border rule px-7 py-3.5 text-sm font-medium text-frost transition-colors duration-300 hover:border-pea hover:bg-pea hover:text-ink"
              >
                See how we do it
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  &rarr;
                </span>
              </Link>
            </Reveal>
          </div>

          <dl className="grid gap-px overflow-hidden rounded-2xl border rule bg-[color-mix(in_oklab,var(--color-frost)_12%,transparent)] sm:grid-cols-2 lg:col-span-7">
            {STATS.map((stat, i) => (
              <Reveal
                key={stat.label}
                delay={i * 0.08}
                className="bg-ink-soft p-8"
              >
                <Counter stat={stat} />
                <dt className="mt-5 text-sm font-medium text-frost">
                  <span className="sr-only">
                    {stat.prefix ?? ""}
                    {stat.value}
                    {stat.suffix ?? ""} —{" "}
                  </span>
                  {stat.label}
                </dt>
                <dd className="mt-2 text-[0.9375rem] leading-relaxed text-frost-mute">
                  {stat.note}
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
