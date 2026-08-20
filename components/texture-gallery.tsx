"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { GALLERY, type Loop } from "@/lib/media";
import { Reveal, RevealWords } from "@/components/reveal";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * A loop that only downloads and plays while it is on screen.
 *
 * Left to autoplay, every tile would decode simultaneously and pull ~10MB
 * whether or not anyone scrolls this far.
 */
function LoopTile({ loop, index }: { loop: Loop; index: number }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const video = videoRef.current;
    if (!wrap || !video) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!loadedRef.current) {
            loadedRef.current = true;
            video.preload = "auto";
            video.load();
          }
          // Reduced motion gets the first frame, held still.
          if (!reduced) video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: "200px 0px", threshold: 0.15 },
    );

    observer.observe(wrap);
    return () => observer.disconnect();
  }, []);

  const span =
    loop.span === "full"
      ? "sm:col-span-2 lg:col-span-3 aspect-16/10 sm:aspect-21/9"
      : loop.span === "wide"
        ? "sm:col-span-2 aspect-16/10 sm:aspect-21/9"
        : "aspect-4/5 sm:aspect-square";

  return (
    <motion.figure
      ref={wrapRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay: (index % 3) * 0.08, ease: EASE }}
      className={`group relative overflow-hidden rounded-2xl bg-ink-soft ${span}`}
    >
      <video
        ref={videoRef}
        src={loop.src}
        muted
        loop
        playsInline
        preload="none"
        disablePictureInPicture
        aria-hidden="true"
        tabIndex={-1}
        className="h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent"
      />

      <figcaption className="absolute inset-x-0 bottom-0 flex items-center gap-3 p-6">
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 shrink-0 rounded-full bg-pea-bright"
        />
        <span className="text-sm font-medium text-frost">{loop.caption}</span>
        <span className="sr-only"> — {loop.alt}</span>
      </figcaption>
    </motion.figure>
  );
}

export function TextureGallery() {
  return (
    <section
      id="texture"
      aria-labelledby="texture-heading"
      className="relative border-t rule py-28 sm:py-40"
    >
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-10">
        <div className="mb-16 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <Reveal>
              <p className="eyebrow mb-6">Texture study</p>
            </Reveal>
            <RevealWords
              as="h2"
              id="texture-heading"
              text="You can see it before you taste it."
              className="font-display text-[length:var(--text-title)] font-semibold leading-[1.05] text-frost"
            />
          </div>
          <Reveal delay={0.15}>
            <p className="max-w-sm text-[length:var(--text-lead)] leading-relaxed text-frost-dim">
              Loose, separate, evenly frosted. No block, no clumps, no freezer
              burn — the tells that something thawed and was frozen again.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GALLERY.map((loop, i) => (
            <LoopTile key={loop.id} loop={loop} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
