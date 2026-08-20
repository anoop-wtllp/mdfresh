"use client";

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
    value: -18,
    suffix: "°C",
    label: "Held, never drifting",
    note: "One stable temperature from the blast tunnel to the freezer aisle. Every pallet is logged.",
  },
  {
    value: 4,
    suffix: " hrs",
    label: "Field to frozen",
    note: "The window between the harvester and the tunnel. Short enough that the sugars never turn.",
  },
  {
    value: 0,
    label: "Preservatives",
    note: "Cold is the only preservative in the bag. No brine, no additives, no colouring.",
  },
  {
    value: 98,
    suffix: "%",
    label: "Nutrient retention",
    note: "Measured against fresh at harvest. A week-old fresh pea does not come close.",
  },
];

/** Counts from zero to `stat.value` the first time it scrolls into view. */
function Counter({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });

  useGSAP(() => {
    const el = ref.current;
    if (!el || !inView) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const format = (n: number) =>
      `${stat.prefix ?? ""}${n.toFixed(stat.decimals ?? 0)}${stat.suffix ?? ""}`;

    if (reduced) {
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
      {stat.prefix ?? ""}0{stat.suffix ?? ""}
    </span>
  );
}

export function ColdChain() {
  return (
    <section
      id="cold-chain"
      aria-labelledby="cold-chain-heading"
      className="relative border-t rule bg-ink-soft py-28 sm:py-40"
    >
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-10">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="eyebrow mb-6">The cold chain</p>
            </Reveal>
            <RevealWords
              as="h2"
              id="cold-chain-heading"
              text="Freezing is not storage. It is a method."
              className="font-display text-[length:var(--text-title)] font-semibold leading-[1.05] text-frost"
            />
            <Reveal delay={0.15}>
              <p className="mt-7 max-w-md text-[length:var(--text-lead)] leading-relaxed text-frost-dim">
                Done slowly, ice tears the cell walls and you get mush. Done in
                minutes, the crystals stay small enough to leave the structure
                intact — which is the whole reason a G-Fresh pea still snaps.
              </p>
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
