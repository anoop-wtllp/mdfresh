"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Reveal, RevealWords } from "@/components/reveal";
import { pickSource, type Sources } from "@/lib/media";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  lead: string;
  /** Background footage. Decorative — `alt` is what carries it to a reader. */
  clip: Sources;
  alt: string;
};

/**
 * The banner every inner page opens with.
 *
 * Sized in `svh` rather than a fixed height so the mobile URL bar collapsing
 * does not resize it mid-scroll, and padded past the fixed header — which is
 * taller on desktop, where it carries the contact strip.
 */
export function PageHeader({
  eyebrow,
  title,
  lead,
  clip,
  alt,
}: PageHeaderProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Chosen here, not in the markup, so a phone never starts fetching the
    // desktop encode. The poster fills the frame until the first bytes land.
    if (!video.src) {
      video.src = pickSource(clip);
      video.preload = "auto";
      video.load();
      video.play().catch(() => {});
    }

    // `canplay` can fire before React attaches its handler — on a warm cache it
    // reliably does — which would leave the placeholder up for good.
    if (video.readyState >= 3) setLoaded(true);

    // This banner scrolls away quickly; decoding it below the fold is wasted
    // battery.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.01 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [clip]);

  return (
    <section
      aria-labelledby="page-heading"
      className="relative isolate flex min-h-[64svh] items-end overflow-hidden bg-ink pb-16 pt-36 sm:min-h-[70svh] sm:pb-24 sm:pt-48"
    >
      <video
        ref={videoRef}
        poster={clip.poster}
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
            ? "absolute inset-0 -z-10 h-full w-full object-cover opacity-100 transition-opacity duration-1000"
            : "absolute inset-0 -z-10 h-full w-full object-cover opacity-0 transition-opacity duration-1000"
        }
      />

      {/* Holds the frame while the first bytes land. */}
      <div
        aria-hidden="true"
        className={
          loaded
            ? "pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-leaf-deep via-ink to-ink opacity-0 transition-opacity duration-1000"
            : "pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-leaf-deep via-ink to-ink opacity-100 transition-opacity duration-1000"
        }
      />

      <div className="pointer-events-none absolute inset-0 -z-10 scrim md:hidden" />
      <div className="pointer-events-none absolute inset-0 -z-10 hidden scrim-side md:block" />

      <div className="mx-auto w-full max-w-7xl px-6 sm:px-10">
        {/* A page one click from home still needs a way back that is not the
            browser button — especially on a phone, where the nav is behind a
            tap. */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-frost-mute">
            <li>
              <Link
                href="/"
                className="transition-colors duration-300 hover:text-pea-bright"
              >
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-frost-dim">
              {eyebrow}
            </li>
          </ol>
        </nav>

        <p className="eyebrow eyebrow-chip mb-5 text-pea-bright">{eyebrow}</p>

        <RevealWords
          as="h1"
          id="page-heading"
          text={title}
          className="max-w-4xl font-display text-[length:var(--text-display)] font-semibold leading-[1.02] tracking-[-0.04em] text-frost"
        />

        <Reveal delay={0.2}>
          <p className="mt-7 max-w-xl border-t rule pt-6 text-[length:var(--text-lead)] leading-relaxed text-frost">
            {lead}
          </p>
        </Reveal>
      </div>

      <p className="sr-only">{alt}</p>
    </section>
  );
}
