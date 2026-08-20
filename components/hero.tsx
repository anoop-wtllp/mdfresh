"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { HERO_CLIP, pickSource } from "@/lib/media";

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Source is chosen here rather than in the markup so a phone never starts
    // fetching the desktop encode. The poster fills the frame meanwhile, so
    // the hero paints immediately either way.
    if (!video.src) {
      video.src = pickSource(HERO_CLIP.media);
      video.preload = "auto";
      video.load();
      video.play().catch(() => {});
    }

    // `canplay` can fire before React attaches its handler — on a warm cache it
    // reliably does — which would leave the placeholder covering the footage
    // for good. Check the state we may have already missed.
    if (video.readyState >= 3) setLoaded(true);

    // Decoding a 1080p loop nobody can see costs real battery on the sections
    // further down the page.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.01 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  useGSAP(
    () => {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduced) {
        gsap.set("[data-hero-line] > span, [data-hero-fade]", {
          opacity: 1,
          y: 0,
        });
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 0.15,
      });

      tl.fromTo(
        "[data-hero-line] > span",
        { yPercent: 108 },
        { yPercent: 0, duration: 1.1, stagger: 0.08 },
      )
        .fromTo(
          "[data-hero-fade]",
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.12 },
          "-=0.6",
        )
        .fromTo(
          videoRef.current,
          { scale: 1.12 },
          { scale: 1, duration: 2.4, ease: "power2.out" },
          0,
        );

      // The hero recedes as the page scrolls past it, so the film section
      // arrives on a clean stage rather than sliding over a busy one.
      gsap.to("[data-hero-content]", {
        yPercent: -18,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(videoRef.current, {
        scale: 1.15,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      aria-labelledby="hero-heading"
      className="relative h-dvh w-full overflow-hidden bg-ink"
    >
      <video
        ref={videoRef}
        poster={HERO_CLIP.media.poster}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        disablePictureInPicture
        aria-hidden="true"
        tabIndex={-1}
        onCanPlay={() => setLoaded(true)}
        className={
          loaded
            ? "absolute inset-0 h-full w-full object-cover opacity-100 transition-opacity duration-1000"
            : "absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-1000"
        }
        style={{ willChange: "transform" }}
      />

      {/* Holds the frame while the first bytes land, so there is no flash of
          bare background before the footage paints. */}
      <div
        aria-hidden="true"
        className={
          loaded
            ? "pointer-events-none absolute inset-0 bg-gradient-to-br from-leaf-deep via-ink to-ink opacity-0 transition-opacity duration-1000"
            : "pointer-events-none absolute inset-0 bg-gradient-to-br from-leaf-deep via-ink to-ink opacity-100 transition-opacity duration-1000"
        }
      />

      <div className="pointer-events-none absolute inset-0 scrim md:hidden" />
      <div className="pointer-events-none absolute inset-0 hidden scrim-side md:block" />

      <div
        data-hero-content
        className="relative flex h-full flex-col justify-end pb-[calc(3rem+env(safe-area-inset-bottom))] sm:pb-20"
      >
        <div className="mx-auto w-full max-w-7xl px-6 sm:px-10">
          <p data-hero-fade className="eyebrow eyebrow-chip mb-5 text-pea-bright will-reveal sm:mb-6">
            Individually quick frozen
          </p>

          <h1
            id="hero-heading"
            className="font-display text-[length:var(--text-hero)] font-semibold leading-[0.92] tracking-[-0.04em]"
          >
            {/* Each line is a mask; the span inside slides up from behind it. */}
            <span data-hero-line className="block overflow-hidden pb-[0.06em]">
              <span className="block">Frozen at the</span>
            </span>
            <span data-hero-line className="block overflow-hidden pb-[0.06em]">
              <span className="block">
                peak of <em className="not-italic text-pea">fresh</em>
              </span>
            </span>
          </h1>

          <div className="mt-7 flex flex-col gap-6 border-t rule pt-6 sm:mt-10 sm:gap-8 sm:pt-8 md:flex-row md:items-end md:justify-between">
            <p
              data-hero-fade
              className="max-w-md text-[length:var(--text-lead)] leading-relaxed text-frost will-reveal"
            >
              Four hours from the field to minus eighteen. Nothing added,
              nothing waiting around — just the crop, stopped exactly where we
              found it.
            </p>

            <div
              data-hero-fade
              className="flex w-full flex-col gap-3 will-reveal sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
            >
              <a
                href="#journey"
                className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-frost px-7 py-4 text-sm font-medium text-ink transition-colors duration-300 hover:bg-pea-bright sm:w-auto sm:py-3.5"
              >
                Watch the journey
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-y-0.5"
                >
                  &darr;
                </span>
              </a>
              <a
                href="#range"
                className="inline-flex w-full items-center justify-center rounded-full border rule px-7 py-4 text-sm font-medium text-frost transition-colors duration-300 hover:border-frost/40 hover:bg-frost/5 sm:w-auto sm:py-3.5"
              >
                See the range
              </a>
            </div>
          </div>
        </div>
      </div>

      <p className="sr-only">{HERO_CLIP.alt}</p>
    </section>
  );
}
