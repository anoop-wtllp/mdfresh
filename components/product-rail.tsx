"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { PRODUCTS } from "@/lib/content";
import { Reveal, RevealWords } from "@/components/reveal";

/**
 * The range, as a rail that runs sideways while the page scrolls down.
 *
 * Two modes, chosen by `matchMedia` rather than by a breakpoint class, because
 * they are different mechanisms and not just different sizes:
 *
 *  - From `md` up, with motion allowed: the stage sticks and the track is
 *    translated, so vertical scroll spends itself horizontally.
 *  - Below that, and for anyone who asked for reduced motion: the track is a
 *    plain overflow-x container with snap points. That is the native idiom on
 *    a touch screen, it needs no JavaScript, and it cannot strand focus.
 */
export function ProductRail() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const stage = stageRef.current;
      const track = trackRef.current;
      if (!root || !stage || !track) return;

      const media = gsap.matchMedia();

      media.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          /** How far the track has to travel to show its last card. */
          const distance = () =>
            Math.max(0, track.scrollWidth - stage.clientWidth);

          // The section's own height is the runway: one screen to pin against,
          // plus a pixel of scroll for every pixel the track has to move.
          const sizeRunway = () => {
            root.style.height = `${window.innerHeight + distance()}px`;
          };
          sizeRunway();

          const tween = gsap.to(track, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.6,
              invalidateOnRefresh: true,
              // Resize the runway before ScrollTrigger measures, not after, or
              // a window resize leaves it sized for the previous card widths.
              onRefreshInit: sizeRunway,
              onUpdate: (self) => {
                const bar = progressRef.current;
                // `scale`, not `transform`: Tailwind v4 compiles `scale-x-0`
                // to the standalone `scale` property, and the two compose —
                // an inline `transform: scaleX(p)` would be multiplied by the
                // class's 0 and the bar would never leave zero width.
                if (bar) bar.style.scale = `${self.progress} 1`;
              },
            },
          });

          triggerRef.current = tween.scrollTrigger ?? null;

          return () => {
            triggerRef.current = null;
            root.style.height = "";
            gsap.set(track, { x: 0 });
            if (progressRef.current) progressRef.current.style.scale = "";
          };
        },
      );

      return () => media.revert();
    },
    { scope: rootRef },
  );

  /**
   * Bring a card into the stage when something inside it takes focus.
   *
   * While the track is translated the stage is `overflow-hidden`, so the
   * browser cannot scroll a focused card into view by itself — tabbing would
   * otherwise move focus to a card nobody can see. Mapping the card's offset
   * back onto the trigger's scroll range puts the page where that card is
   * visible. In the overflow-x mode `triggerRef` is null and the browser
   * already does the right thing.
   */
  const revealOnFocus = useCallback((index: number) => {
    const st = triggerRef.current;
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!st || !track || !stage) return;

    const card = track.children[index] as HTMLElement | undefined;
    if (!card) return;

    const distance = track.scrollWidth - stage.clientWidth;
    if (distance <= 0) return;

    const progress = Math.min(
      1,
      Math.max(0, (card.offsetLeft - 24) / distance),
    );
    window.scrollTo({
      top: st.start + (st.end - st.start) * progress,
      behavior: "auto",
    });
  }, []);

  return (
    <section
      ref={rootRef}
      aria-labelledby="rail-heading"
      className="on-light bg-frost"
    >
      <div
        ref={stageRef}
        className="overflow-hidden py-20 sm:py-24 md:sticky md:top-0 md:flex md:h-dvh md:flex-col md:justify-center md:py-0"
      >
        <div className="mx-auto w-full max-w-7xl px-6 sm:px-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <Reveal>
                <p className="eyebrow mb-5">Our products</p>
              </Reveal>
              <RevealWords
                as="h2"
                id="rail-heading"
                text="Ten lines, one cold chain."
                className="font-display text-[length:var(--text-title)] font-semibold leading-[1.05] text-ink"
              />
            </div>

            <Reveal delay={0.15}>
              <Link
                href="/products"
                className="group inline-flex items-center gap-3 rounded-full border rule-ink px-6 py-3 text-sm font-medium text-ink transition-colors duration-300 hover:border-leaf-deep hover:bg-leaf-deep hover:text-paper"
              >
                View all products
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
                >
                  &rarr;
                </span>
              </Link>
            </Reveal>
          </div>
        </div>

        {/* Below `md` this is the scroller itself; from `md` up it gets out of
            the way and the stage does the clipping instead. */}
        <div className="mt-10 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mt-12 md:overflow-visible md:pb-0">
          <ul
            ref={trackRef}
            className="flex w-max snap-x snap-mandatory gap-4 px-6 sm:px-10 md:snap-none"
          >
            {PRODUCTS.map((product, i) => (
              <li
                key={product.name}
                onFocusCapture={() => revealOnFocus(i)}
                className="group relative flex w-[78vw] max-w-[18rem] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border rule-ink bg-paper transition-colors duration-500 hover:border-leaf/50 sm:w-[18rem]"
              >
                {/* The shots are cut-outs on white, so on a white card they
                    need no mask — the ground already matches. A square box
                    from a square source means the crop is a no-op and the
                    image only ever scales with the card. */}
                <div className="aspect-square w-full overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={261}
                    height={261}
                    quality={90}
                    sizes="(min-width: 640px) 288px, 78vw"
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
                  {/* Takes the slack so Enquire lands on the same line in
                      every card, whatever the description runs to. */}
                  <p className="mt-2 flex-1 text-[0.875rem] leading-relaxed text-ink-dim">
                    {product.detail}
                  </p>

                  {/* Stretched link: the `after` box covers the card, so the
                      whole tile is clickable while the accessible name stays
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
              </li>
            ))}
          </ul>
        </div>

        {/* Only meaningful while the rail is scrubbed; the overflow-x mode has
            a real scrollbar gesture of its own. */}
        <div
          aria-hidden="true"
          className="mx-auto hidden w-full max-w-7xl px-6 pt-10 sm:px-10 md:block"
        >
          <span className="block h-px w-full bg-[color-mix(in_oklab,var(--color-ink)_14%,transparent)]">
            <span
              ref={progressRef}
              className="block h-px origin-left scale-x-0 bg-leaf"
            />
          </span>
        </div>
      </div>
    </section>
  );
}
