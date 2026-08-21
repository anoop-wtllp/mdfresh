"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { PRODUCTS } from "@/lib/content";
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
                className="group relative flex flex-col overflow-hidden rounded-2xl border rule-ink bg-paper transition-colors duration-500 hover:border-leaf/50"
              >
                {/* Square and full-bleed, not the circular plate this card used
                    to carry. The mask existed to crop white corners off a dark
                    card; on a white one the corners already match, so the crop
                    would only remove product for nothing. */}
                <div className="aspect-square w-full overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={261}
                    height={261}
                    quality={90}
                    sizes="(min-width: 1280px) 288px, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                    className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05] motion-reduce:transition-none"
                  />
                </div>

                <div className="flex flex-1 flex-col border-t rule-ink p-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-leaf-deep">
                    {product.tag}
                  </p>
                  <h3 className="mt-2 font-display text-lg font-semibold text-ink transition-colors duration-500 group-hover:text-leaf-deep motion-reduce:transition-none">
                    {product.name}
                  </h3>
                  {/* Takes the slack so every card's Enquire sits on one line. */}
                  <p className="mt-2 flex-1 text-[0.875rem] leading-relaxed text-ink-dim">
                    {product.detail}
                  </p>

                  {/* Stretched link: the `after` box covers the tile, so the
                      whole card is clickable while the accessible name stays
                      "Enquire about <product>". */}
                  <Link
                    href="/contact"
                    aria-label={`Enquire about ${product.name}`}
                    className="mt-4 inline-flex items-center gap-2 text-sm text-ink-mute transition-colors duration-300 after:absolute after:inset-0 group-hover:text-leaf-deep"
                  >
                    Enquire
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
                    >
                      &rarr;
                    </span>
                  </Link>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
