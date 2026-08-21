"use client";

import { useEffect, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { BAND_CLIP, pickSource } from "@/lib/media";
import { RevealWords } from "@/components/reveal";

/**
 * A full-bleed breath between the two dense sections — the loops footage at the
 * scale it deserves, rather than only as gallery thumbnails.
 */
export function ColdBand() {
  const rootRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let loaded = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!loaded) {
            loaded = true;
            video.poster = BAND_CLIP.media.poster;
            video.src = pickSource(BAND_CLIP.media);
            video.preload = "auto";
            video.load();
          }
          if (!reduced) video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: "300px 0px", threshold: 0.01 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // Slow vertical drift so the band feels like a window onto something
      // moving past, rather than a static block.
      gsap.fromTo(
        videoRef.current,
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      aria-labelledby="cold-band-heading"
      className="relative isolate flex h-[70svh] items-center overflow-hidden border-t rule sm:h-[80svh]"
    >
      {/* Oversized so the parallax drift never exposes an edge. */}
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="none"
        disablePictureInPicture
        aria-hidden="true"
        tabIndex={-1}
        className="absolute inset-x-0 top-[-8%] -z-10 h-[116%] w-full object-cover"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-ink/70 sm:bg-ink/60"
      />

      <div className="mx-auto w-full max-w-7xl px-6 text-center sm:px-10">
        <p className="eyebrow eyebrow-chip mb-6">Minus eighteen, held</p>
        <RevealWords
          as="h2"
          id="cold-band-heading"
          text="Cold is the only ingredient we add."
          className="mx-auto max-w-4xl font-display text-[length:var(--text-display)] font-semibold leading-[1.03] text-frost"
        />
        <p className="mx-auto mt-6 max-w-xl text-[length:var(--text-lead)] leading-relaxed text-frost">
          No brine, no preservative, no colouring. Frozen at −30°C to
          −40°C in 10–12 minutes, then held at −18°C or below until dispatch.
        </p>
      </div>

      <p className="sr-only">{BAND_CLIP.alt}</p>
    </section>
  );
}
