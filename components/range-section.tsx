"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { Reveal, RevealWords } from "@/components/reveal";

const PRODUCTS = [
  {
    name: "Garden peas",
    detail: "Sweet, small-sieve, picked at brix 14",
    packs: "500g · 1kg · 2.5kg",
    tone: "from-pea/25",
  },
  {
    name: "Mixed vegetables",
    detail: "Peas, carrot dice, sweetcorn, green beans",
    packs: "500g · 1kg",
    tone: "from-brand/20",
  },
  {
    name: "Sweetcorn",
    detail: "Cut from the cob within the hour",
    packs: "500g · 1kg",
    tone: "from-ice/20",
  },
  {
    name: "Cut green beans",
    detail: "Snapped, not sliced, so the ends stay sealed",
    packs: "500g",
    tone: "from-leaf/30",
  },
];

/** A word band that slides as the page scrolls past it. */
function ScrollMarquee() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const track = ref.current?.querySelector("[data-track]");
      if (!track) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.to(track, {
        xPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      });
    },
    { scope: ref },
  );

  const words = ["Individually quick frozen", "Nothing added", "Field graded"];

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="overflow-hidden border-y rule py-7 select-none"
    >
      <div data-track className="flex w-max items-center gap-8 will-change-transform">
        {/* Doubled so the -50% slide never exposes an edge. */}
        {[...words, ...words, ...words, ...words].map((word, i) => (
          <span key={i} className="flex items-center gap-8">
            <span className="font-display text-2xl font-semibold whitespace-nowrap text-frost-mute sm:text-4xl">
              {word}
            </span>
            <span className="h-2 w-2 shrink-0 rotate-45 bg-pea" />
          </span>
        ))}
      </div>
    </div>
  );
}

export function RangeSection() {
  return (
    <>
      <ScrollMarquee />

      <section
        id="range"
        aria-labelledby="range-heading"
        className="py-28 sm:py-40"
      >
        <div className="mx-auto w-full max-w-7xl px-6 sm:px-10">
          <div className="mb-16 max-w-2xl">
            <Reveal>
              <p className="eyebrow mb-6">The range</p>
            </Reveal>
            <RevealWords
              as="h2"
              id="range-heading"
              text="Four things, done properly."
              className="font-display text-[length:var(--text-title)] font-semibold leading-[1.05] text-frost"
            />
          </div>

          <ul className="border-t rule">
            {PRODUCTS.map((product, i) => (
              <Reveal key={product.name} delay={i * 0.06} as="li">
                <a
                  href="#contact"
                  className="group relative flex flex-col gap-2 overflow-hidden border-b rule py-8 transition-colors duration-500 hover:bg-frost/[0.03] sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
                >
                  {/* Colour wash that sweeps in from the left on hover. */}
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute inset-y-0 left-0 w-full origin-left scale-x-0 bg-gradient-to-r ${product.tone} to-transparent transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 motion-reduce:transition-none`}
                  />

                  <span className="relative flex items-baseline gap-5">
                    <span className="font-mono text-[10px] tracking-[0.2em] text-frost-mute">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-2xl font-semibold text-frost transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2 motion-reduce:transition-none sm:text-3xl">
                      {product.name}
                    </span>
                  </span>

                  <span className="relative flex flex-1 items-baseline justify-between gap-8 pl-10 sm:pl-0">
                    <span className="text-sm text-frost-dim">
                      {product.detail}
                    </span>
                    <span className="whitespace-nowrap font-mono text-[11px] tracking-wider text-frost-mute">
                      {product.packs}
                    </span>
                  </span>
                </a>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
