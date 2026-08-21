"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { PRODUCTS } from "@/lib/content";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";

/** A band of product names that slides as the page scrolls past it. */
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

  const words = PRODUCTS.map((p) => p.name);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="on-light overflow-hidden border-y rule-ink bg-paper py-7 select-none"
    >
      <div
        data-track
        className="flex w-max items-center gap-8 will-change-transform"
      >
        {/* Doubled so the -50% slide never exposes an edge. */}
        {[...words, ...words].map((word, i) => (
          <span key={i} className="flex items-center gap-8">
            <span className="font-display text-2xl font-semibold whitespace-nowrap text-ink-mute sm:text-4xl">
              {word}
            </span>
            <span className="h-2 w-2 shrink-0 rotate-45 bg-leaf" />
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
        aria-labelledby="products-heading"
        className="on-light bg-frost pt-20 pb-28 sm:pt-24 sm:pb-40"
      >
        <div className="mx-auto w-full max-w-7xl px-6 sm:px-10">
          {/* No visible heading: the page banner above states the same thing,
              and repeating it would only push the grid further down. The
              landmark still needs a name, so it gets a silent one. */}
          <h2 id="products-heading" className="sr-only">
            Product range
          </h2>

          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {PRODUCTS.map((product, i) => (
              <Reveal
                key={product.name}
                delay={(i % 4) * 0.06}
                as="li"
                className="group"
              >
                <ProductCard
                  product={product}
                  index={i}
                />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
