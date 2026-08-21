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
      className="overflow-hidden border-y rule py-7 select-none"
    >
      <div
        data-track
        className="flex w-max items-center gap-8 will-change-transform"
      >
        {/* Doubled so the -50% slide never exposes an edge. */}
        {[...words, ...words].map((word, i) => (
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
        id="products"
        aria-labelledby="products-heading"
        className="pt-20 pb-28 sm:pt-24 sm:pb-40"
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
                className="group relative flex flex-col rounded-2xl border rule bg-ink-soft p-6 transition-colors duration-500 hover:border-pea/40 sm:p-7"
              >
                <div className="relative mx-auto w-full max-w-[13rem]">
                  {/* A wash of the product's own colour, behind the plate. */}
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute -inset-4 rounded-full bg-gradient-to-br ${product.tone} to-transparent opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-100 motion-reduce:transition-none`}
                  />
                  {/* Circular, because every shot is a cut-out on a white
                      ground: the crop takes the white corners off and leaves
                      the bowl, and 208px rendered from a 261px source means no
                      upscaling. */}
                  <Image
                    src={product.image}
                    // The photo illustrates the name printed right beneath it,
                    // so the name is the useful alt — and it gives the file
                    // something to be found by in image search.
                    alt={product.name}
                    width={261}
                    height={261}
                    quality={90}
                    sizes="208px"
                    className="relative aspect-square w-full rounded-full object-cover ring-1 ring-frost/10 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] motion-reduce:transition-none"
                  />
                </div>

                <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-pea">
                  {product.tag}
                </p>
                <h3 className="mt-2 font-display text-lg font-semibold text-frost">
                  {product.name}
                </h3>
                {/* Takes up the slack so every card's Enquire sits on one line
                    however long the description runs. */}
                <p className="mt-2 flex-1 text-[0.875rem] leading-relaxed text-frost-dim">
                  {product.detail}
                </p>

                {/* Stretched link: the `after` box covers the whole tile, so
                    the card is clickable while the accessible name stays
                    "Enquire about <product>" rather than swallowing every word
                    in the card. */}
                <Link
                  href="/contact"
                  aria-label={`Enquire about ${product.name}`}
                  className="mt-5 inline-flex items-center gap-2 text-sm text-frost-mute transition-colors duration-300 after:absolute after:inset-0 after:rounded-2xl group-hover:text-pea-bright"
                >
                  Enquire
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
                  >
                    &rarr;
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
