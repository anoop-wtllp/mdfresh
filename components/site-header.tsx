"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";

const NAV = [
  { href: "#journey", label: "The journey" },
  { href: "#cold-chain", label: "Cold chain" },
  { href: "#texture", label: "Texture" },
  { href: "#range", label: "Range" },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export function SiteHeader() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  // Page-wide read progress. Springing it keeps the bar from twitching on
  // trackpads that fire many small deltas.
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 40,
    restDelta: 0.001,
  });

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // While the sheet is open it owns the screen: Escape closes it, and the page
  // behind must not scroll away under it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Close on resize up to desktop, or the sheet lingers invisibly and keeps
  // the body scroll-locked.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  return (
    <header
      className={
        solid || open
          ? "fixed inset-x-0 top-0 z-50 border-b rule bg-ink/90 backdrop-blur-md transition-colors duration-500"
          : "fixed inset-x-0 top-0 z-50 border-b border-transparent bg-transparent transition-colors duration-500"
      }
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 sm:h-20 sm:px-10">
        <a
          href="#top"
          onClick={close}
          className="-m-2 flex items-center p-2"
          aria-label="G-Fresh, back to top"
        >
          <Image
            src="/assets/logo-gfresh-alpha.png"
            alt=""
            width={112}
            height={72}
            priority
            className="h-8 w-auto sm:h-9"
          />
        </a>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-8 lg:gap-9">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="group relative block px-1 py-3 text-sm text-frost-dim transition-colors duration-300 hover:text-frost"
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className="absolute bottom-1.5 left-1 h-px w-0 bg-pea transition-all duration-300 group-hover:w-[calc(100%-0.5rem)]"
                  />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="#contact"
            onClick={close}
            className="hidden items-center rounded-full border rule px-5 py-3 text-sm font-medium text-frost transition-colors duration-300 hover:border-pea hover:bg-pea hover:text-ink sm:inline-flex"
          >
            Stockists
          </a>

          {/* Phones get no room for the link row, so it moves into a sheet. */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="-mr-2 flex h-12 w-12 items-center justify-center rounded-full text-frost md:hidden"
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span aria-hidden="true" className="relative block h-4 w-6">
              <span
                className={
                  open
                    ? "absolute left-0 top-1/2 block h-0.5 w-6 -translate-y-1/2 rotate-45 bg-current transition-transform duration-300"
                    : "absolute left-0 top-0.5 block h-0.5 w-6 bg-current transition-transform duration-300"
                }
              />
              <span
                className={
                  open
                    ? "absolute left-0 top-1/2 block h-0.5 w-6 -translate-y-1/2 -rotate-45 bg-current transition-transform duration-300"
                    : "absolute bottom-0.5 left-0 block h-0.5 w-6 bg-current transition-transform duration-300"
                }
              />
            </span>
          </button>
        </div>
      </div>

      {/* Reading progress. Decorative — the scrollbar is the real affordance. */}
      <motion.div
        aria-hidden="true"
        style={{ scaleX: progress }}
        className="h-px origin-left bg-pea-bright"
      />

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: EASE }}
            className="border-t rule bg-ink md:hidden"
          >
            <nav aria-label="Primary" className="px-6 py-3">
              <ul className="flex flex-col">
                {NAV.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={close}
                      className="flex items-center justify-between border-b rule py-4 text-lg text-frost"
                    >
                      {item.label}
                      <span aria-hidden="true" className="text-pea">
                        &rarr;
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                onClick={close}
                className="mt-5 mb-2 flex items-center justify-center rounded-full bg-pea px-6 py-4 text-base font-medium text-ink"
              >
                Find stockists
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
