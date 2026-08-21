"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { PRODUCTS } from "@/lib/content";
import { ProductCard } from "@/components/product-card";
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
  const reducedRef = useRef(false);

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
   * Depth across the rail: each card turns away from the stage centre and
   * recedes toward the edges, so the row reads as a curve rather than a flat
   * strip. Driven from rAF rather than the ScrollTrigger, because it has to
   * work in both modes — the desktop track is GSAP-translated while the mobile
   * one is natively scrolled, and `getBoundingClientRect` reflects either.
   */
  useEffect(() => {
    const stage = stageRef.current;
    const track = trackRef.current;
    if (!stage || !track) return;

    reducedRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedRef.current) return;

    const cards = Array.from(
      track.querySelectorAll<HTMLElement>("[data-depth]"),
    );
    let raf = 0;

    const frame = () => {
      const s = stage.getBoundingClientRect();
      const mid = s.left + s.width / 2;
      const half = s.width / 2 || 1;

      // Every read first, then every write. Interleaving them would force a
      // layout per card, ten times a frame.
      const offsets = cards.map((c) => {
        const r = c.getBoundingClientRect();
        return (r.left + r.width / 2 - mid) / half;
      });

      cards.forEach((card, i) => {
        const t = Math.max(-1.25, Math.min(1.25, offsets[i]));
        const away = Math.abs(t);
        card.style.transform =
          `perspective(1200px) rotateY(${(-t * 15).toFixed(2)}deg)` +
          ` translateZ(${(-away * 80).toFixed(1)}px)` +
          ` scale(${(1 - away * 0.05).toFixed(3)})`;
        card.style.opacity = (1 - away * 0.25).toFixed(3);
      });

      raf = requestAnimationFrame(frame);
    };

    // Only while the rail is on screen — this would otherwise run a frame loop
    // for the whole page.
    const io = new IntersectionObserver(
      ([entry]) => {
        cancelAnimationFrame(raf);
        if (entry.isIntersecting) raf = requestAnimationFrame(frame);
        else
          cards.forEach((c) => {
            c.style.transform = "";
            c.style.opacity = "";
          });
      },
      { threshold: 0.01 },
    );
    io.observe(stage);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  /** Tilt the card under the pointer. Nested inside the depth wrapper so the
   *  two transforms compose instead of overwriting each other. */
  const tilt = useCallback((e: React.PointerEvent<HTMLLIElement>) => {
    if (reducedRef.current || e.pointerType === "touch") return;
    const card = e.currentTarget.querySelector<HTMLElement>("[data-tilt]");
    if (!card) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    // No transition while tracking, or the card lags a frame behind the cursor.
    card.style.transition = "box-shadow 300ms, border-color 300ms";
    card.style.transform =
      `perspective(900px) rotateY(${(x * 12).toFixed(2)}deg)` +
      ` rotateX(${(-y * 12).toFixed(2)}deg) translateY(-6px)`;
  }, []);

  /** Spring back on the way out — this one does want an ease. */
  const untilt = useCallback((e: React.PointerEvent<HTMLLIElement>) => {
    const card = e.currentTarget.querySelector<HTMLElement>("[data-tilt]");
    if (!card) return;
    card.style.transition =
      "transform 600ms cubic-bezier(0.22,1,0.36,1), box-shadow 300ms, border-color 300ms";
    card.style.transform = "";
  }, []);

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
                onPointerMove={tilt}
                onPointerLeave={untilt}
                className="group w-[78vw] max-w-[18rem] shrink-0 snap-start sm:w-[18rem]"
              >
                <div data-depth className="h-full will-change-transform">
                  <ProductCard
                    product={product}
                    index={i}
                  />
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
