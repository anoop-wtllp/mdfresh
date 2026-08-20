"use client";

import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { CLIP_DURATION, JOURNEY } from "@/lib/media";

/** Viewport heights of scrolling spent on each chapter. */
const SCROLL_PER_CHAPTER = 0.9;
/** Seconds of drift tolerated before we issue a new seek. */
const SEEK_EPSILON = 0.035;
/** Share of the remaining distance closed per 60Hz frame. */
const CHASE = 0.12;
/**
 * Deltas above this (in seconds of film) are treated as a jump rather than a
 * scroll — a chapter-rail click or a scrollbar drag — and land immediately
 * instead of easing in over a second.
 */
const SNAP_ABOVE = 3;

const TOTAL_TIME = JOURNEY.length * CLIP_DURATION;
const EASE = [0.22, 1, 0.36, 1] as const;

export function JourneyFilm() {
  const rootRef = useRef<HTMLElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const triggerRef = useRef<ScrollTrigger | null>(null);

  /** Scroll-derived target, and the smoothed value actually shown. */
  const targetTime = useRef(0);
  const shownTime = useRef(0);
  const activeRef = useRef(0);
  /** Clips whose download has already been kicked off. */
  const primed = useRef(new Set<number>());

  const [active, setActive] = useState(0);
  const [started, setStarted] = useState(false);

  useGSAP(
    () => {
      const section = rootRef.current;
      if (!section) return;

      const media = gsap.matchMedia();
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      /** Start buffering a clip, once. */
      const prime = (i: number) => {
        if (i < 0 || i >= JOURNEY.length || primed.current.has(i)) return;
        const v = videoRefs.current[i];
        if (!v) return;
        primed.current.add(i);
        v.preload = "auto";
        v.load();
      };

      /** Show clip `i`, hide the rest. CSS handles the dissolve. */
      const show = (i: number) => {
        videoRefs.current.forEach((v, n) => {
          if (v) v.style.opacity = n === i ? "1" : "0";
        });
      };

      /**
       * Reveal a clip only once it has a frame to show. Cutting to a video that
       * is still loading would flash the black element instead of the picture.
       */
      const showWhenReady = (i: number) => {
        const v = videoRefs.current[i];
        if (!v) return;
        if (v.readyState >= 2) {
          show(i);
          return;
        }
        v.addEventListener(
          "loadeddata",
          () => {
            // The viewer may have scrolled on again while this was loading.
            if (activeRef.current === i) show(i);
          },
          { once: true },
        );
      };

      const setChapter = (i: number) => {
        if (i === activeRef.current) return;
        activeRef.current = i;
        setActive(i);
        // Prime the clip we are about to show, not just the one after it.
        // Jumping straight to a chapter — a rail click, a scrollbar drag, a
        // reload part-way down — skips every clip in between, so the target
        // would otherwise still be preload="none" and never load at all.
        prime(i);
        prime(i + 1);
        showWhenReady(i);
      };

      prime(0);
      prime(1);
      show(0);

      // iOS will not decode or seek a video that has never been played, and
      // only allows the unlocking play() from inside a user gesture. One silent
      // play/pause pass on first interaction makes every clip seekable.
      const unlock = () => {
        videoRefs.current.forEach((v) => {
          if (!v) return;
          const p = v.play();
          if (p && typeof p.then === "function") {
            p.then(() => v.pause()).catch(() => {});
          }
        });
      };
      window.addEventListener("pointerdown", unlock, { once: true });
      window.addEventListener("touchstart", unlock, {
        once: true,
        passive: true,
      });

      if (reduced) {
        // No frame scrubbing. Land on whole chapters as they come up: changing
        // content on scroll is navigation, and what we drop is the continuous
        // motion, not the section itself.
        const stepped = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => {
            setChapter(
              Math.min(
                Math.floor(self.progress * JOURNEY.length),
                JOURNEY.length - 1,
              ),
            );
          },
        });
        triggerRef.current = stepped;
        setStarted(true);

        return () => {
          window.removeEventListener("pointerdown", unlock);
          window.removeEventListener("touchstart", unlock);
        };
      }

      const applyTime = (time: number) => {
        const index = Math.min(
          Math.floor(time / CLIP_DURATION),
          JOURNEY.length - 1,
        );
        const local = Math.min(
          time - index * CLIP_DURATION,
          CLIP_DURATION - 0.05,
        );

        setChapter(index);

        const v = videoRefs.current[index];
        // HAVE_CURRENT_DATA. Anything less and a seek would only stall.
        if (!v || v.readyState < 2) return;
        if (!v.paused) v.pause();
        // Bailing while a seek is in flight is what keeps this smooth. Queuing
        // seeks faster than the decoder retires them is what makes it stutter.
        if (v.seeking) return;
        if (Math.abs(v.currentTime - local) > SEEK_EPSILON) {
          v.currentTime = local;
        }
      };

      const st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          targetTime.current = self.progress * TOTAL_TIME;
          if (self.progress > 0.01) setStarted(true);
        },
      });
      triggerRef.current = st;

      // Chase the scroll target rather than tracking it exactly. Raw scroll
      // deltas produce seek storms; a lerp turns them into a steady ramp the
      // decoder can keep up with.
      const tick = () => {
        const delta = targetTime.current - shownTime.current;
        const distance = Math.abs(delta);

        if (distance < 0.001 || distance > SNAP_ABOVE) {
          // Either close enough to finish, or so far away that this was a jump
          // rather than a scroll — easing across it would just look like lag.
          shownTime.current = targetTime.current;
        } else {
          // Scale the step by how long the frame actually took, so a 120Hz
          // display doesn't chase twice as fast as a 60Hz one.
          const ratio = gsap.ticker.deltaRatio(60);
          shownTime.current += delta * (1 - Math.pow(1 - CHASE, ratio));
        }

        applyTime(shownTime.current);
      };
      gsap.ticker.add(tick);

      media.add("(min-width: 768px)", () => {
        // Desktop only: drift the copy gently against the scroll.
        const copy = section.querySelector<HTMLElement>("[data-parallax]");
        if (!copy) return;
        gsap.fromTo(
          copy,
          { y: 40 },
          {
            y: -40,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom bottom",
              scrub: true,
            },
          },
        );
      });

      return () => {
        gsap.ticker.remove(tick);
        media.revert();
        window.removeEventListener("pointerdown", unlock);
        window.removeEventListener("touchstart", unlock);
      };
    },
    { scope: rootRef },
  );

  /** Jump the page to the start of a chapter. */
  const goToChapter = useCallback((i: number) => {
    const st = triggerRef.current;
    if (!st) return;
    const y = st.start + (st.end - st.start) * (i / JOURNEY.length);
    window.scrollTo({
      top: y + 4,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }, []);

  const chapter = JOURNEY[active];
  const runwayHeight = `calc(100svh + ${JOURNEY.length * SCROLL_PER_CHAPTER} * 100svh)`;

  return (
    <section
      id="journey"
      ref={rootRef}
      aria-labelledby="journey-heading"
      className="relative"
      style={{ height: runwayHeight }}
    >
      <h2 id="journey-heading" className="sr-only">
        From field to freezer: the journey of a G-Fresh pea
      </h2>

      {/* The stage. Sticky rather than a GSAP pin: no pin-spacer, no layout
          jump on resize, and it survives the mobile URL bar collapsing. */}
      <div className="sticky top-0 h-dvh w-full overflow-hidden bg-ink">
        {JOURNEY.map((c, i) => (
          <video
            key={c.id}
            ref={(el) => {
              videoRefs.current[i] = el;
            }}
            src={c.src}
            muted
            playsInline
            preload={i < 2 ? "auto" : "none"}
            disablePictureInPicture
            aria-hidden="true"
            tabIndex={-1}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 motion-reduce:transition-none"
            style={{ opacity: i === 0 ? 1 : 0, willChange: "opacity" }}
          />
        ))}

        <div className="pointer-events-none absolute inset-0 scrim md:hidden" />
        <div className="pointer-events-none absolute inset-0 hidden scrim-side md:block" />

        {/* Copy. Only the active chapter is mounted, so assistive tech reads one
            coherent block instead of six stacked ones. */}
        <div
          data-parallax
          className="absolute inset-0 flex items-end pb-28 sm:items-center sm:pb-0"
        >
          <div className="mx-auto w-full max-w-7xl px-6 sm:px-10">
            <div className="max-w-xl">
              {/* Keyed, with no exit animation on purpose. An exit transition
                  has to finish before the next caption may start, so scrolling
                  across two chapters queues them and the words fall behind the
                  picture. Swapping on the key keeps caption and footage locked
                  together; the video's own 500ms dissolve carries the change. */}
              <motion.div
                key={chapter.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                  <p className="eyebrow eyebrow-chip mb-4 gap-3">
                    <span className="text-pea-bright">{chapter.index}</span>
                    <span
                      aria-hidden="true"
                      className="h-px w-10 bg-pea-bright/50"
                    />
                    <span className="text-frost">{chapter.label}</span>
                  </p>
                  <p className="font-display text-[length:var(--text-display)] font-semibold leading-[1.02] text-frost">
                    {chapter.title}
                  </p>
                  <p className="mt-6 max-w-md text-[length:var(--text-lead)] leading-relaxed text-frost">
                    {chapter.body}
                  </p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Chapter rail. Real buttons, because a scroll-driven section is a trap
            for keyboard and screen-reader users without a way to jump. */}
        {/* The rail sits over the released, bright side of the frame, so it
            carries its own plate rather than relying on the scrim. */}
        <nav
          aria-label="Film chapters"
          className="absolute right-5 top-1/2 hidden -translate-y-1/2 rounded-2xl bg-ink/85 px-3 py-2 ring-1 ring-frost/10 backdrop-blur-md lg:block"
        >
          <ol className="flex flex-col gap-1">
            {JOURNEY.map((c, i) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => goToChapter(i)}
                  aria-current={i === active ? "step" : undefined}
                  className="group flex w-full items-center justify-end gap-3 py-2 pl-4"
                >
                  <span
                    className={
                      i === active
                        ? "font-mono text-[10px] uppercase tracking-[0.18em] text-pea-bright transition-colors duration-300"
                        : "font-mono text-[10px] uppercase tracking-[0.18em] text-frost-dim transition-colors duration-300 group-hover:text-frost"
                    }
                  >
                    {c.label}
                  </span>
                  <span
                    aria-hidden="true"
                    className={
                      i === active
                        ? "block h-px w-9 bg-pea-bright transition-all duration-500"
                        : "block h-px w-4 bg-frost-mute transition-all duration-500 group-hover:w-6 group-hover:bg-frost-dim"
                    }
                  />
                </button>
              </li>
            ))}
          </ol>
        </nav>

        {/* Runtime readout: says this is a film being scrubbed, and how far in. */}
        <div className="absolute bottom-6 left-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-frost-mute sm:left-10">
          <span aria-hidden="true">
            {String(active + 1).padStart(2, "0")} / {JOURNEY.length}
          </span>
          <span aria-hidden="true" className="h-px w-8 bg-frost-mute/40" />
          <span
            className={
              started
                ? "opacity-0 transition-opacity duration-500"
                : "opacity-100 transition-opacity duration-500"
            }
          >
            Scroll to play
          </span>
        </div>
      </div>

      {/* The footage is decorative; this is the content it stands in for. */}
      <div className="sr-only">
        <ol>
          {JOURNEY.map((c) => (
            <li key={c.id}>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
              <p>{c.alt}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
