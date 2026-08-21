"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { CONTACT } from "@/lib/content";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/products", label: "Products" },
  { href: "/process", label: "Process" },
  { href: "/markets", label: "Markets" },
  { href: "/contact", label: "Contact" },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export function SiteHeader() {
  const [solid, setSolid] = useState(false);
  const pathname = usePathname();

  // The sheet stores the route it was opened on rather than a bare boolean, so
  // arriving anywhere else closes it by definition — no effect syncing state to
  // a prop, and browser back/forward is covered the same as a link tap.
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn === pathname;

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
      if (e.key === "Escape") setOpenedOn(null);
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
  // the body scroll-locked. Six links need `lg`, not `md`.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && setOpenedOn(null);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const close = useCallback(() => setOpenedOn(null), []);

  return (
    <header
      // `on-light` swaps the focus ring to leaf-deep; pea-bright on glass this
      // pale is invisible. The glass itself is white at both scroll states —
      // only how much of it, and whether it carries an edge, changes.
      className={
        solid || open
          ? "on-light fixed inset-x-0 top-0 z-50 border-b rule-ink bg-paper/90 backdrop-blur-xl backdrop-saturate-150 transition-colors duration-500"
          : "on-light fixed inset-x-0 top-0 z-50 border-b border-transparent bg-paper/80 backdrop-blur-xl backdrop-saturate-150 transition-colors duration-500"
      }
    >
      {/* Contact strip. Desktop only — on a phone the same two lines sit one
          tap away inside the sheet, and the height is better spent elsewhere. */}
      {/* Brand green, and opaque, so it reads as its own bar rather than a
          tinted slice of the glass below it. No bottom rule: the colour change
          is the divider. */}
      <div className="on-deep hidden bg-leaf-deep lg:block">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-end gap-6 px-6 py-2 sm:px-10">
          <a
            href={CONTACT.phoneHref}
            className="-my-1.5 inline-flex items-center py-1.5 font-mono text-[11px] tracking-wider text-frost-dim transition-colors duration-300 hover:text-pea-bright"
          >
            {CONTACT.phoneLabel}
          </a>
          <span aria-hidden="true" className="h-3 w-px bg-frost/25" />
          <a
            href={CONTACT.emailHref}
            className="-my-1.5 inline-flex items-center py-1.5 font-mono text-[11px] tracking-wider text-frost-dim transition-colors duration-300 hover:text-pea-bright"
          >
            {CONTACT.email}
          </a>
        </div>
      </div>

      {/* The bar grew with the mark: a 64px logo needs more than an 80px bar
          to sit in without crowding it. */}
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6 sm:h-24 sm:px-10">
        <Link
          href="/"
          onClick={close}
          className="-m-2 flex items-center gap-3 p-2"
          aria-label="M.D. Fresh Veg, home"
        >
          <Image
            src="/assets/logo-gfresh-alpha.png"
            alt=""
            width={420}
            height={270}
            priority
            quality={90}
            // 80px bar on a phone, 96px from `sm` — about 12px and 16px of
            // clearance either side.
            sizes="112px"
            className="h-14 w-auto sm:h-16"
          />
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="font-display text-sm font-semibold tracking-tight text-ink">
              M.D. Fresh Veg
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink-dim">
              Perfectly Preserved Freshness
            </span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-7 xl:gap-9">
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={
                      active
                        ? "group relative block px-1 py-3 text-sm font-medium text-ink transition-colors duration-300"
                        : "group relative block px-1 py-3 text-sm text-ink-dim transition-colors duration-300 hover:text-ink"
                    }
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className={
                        active
                          ? "absolute bottom-1.5 left-1 h-px w-[calc(100%-0.5rem)] bg-leaf transition-all duration-300"
                          : "absolute bottom-1.5 left-1 h-px w-0 bg-leaf transition-all duration-300 group-hover:w-[calc(100%-0.5rem)]"
                      }
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/contact"
            onClick={close}
            className="hidden items-center rounded-full bg-leaf-deep px-5 py-3 text-sm font-medium text-paper transition-colors duration-300 hover:bg-leaf sm:inline-flex"
          >
            Enquire Now
          </Link>

          {/* Below lg six links have nowhere to sit, so they move into a sheet. */}
          <button
            type="button"
            onClick={() => setOpenedOn((v) => (v === null ? pathname : null))}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="-mr-2 flex h-12 w-12 items-center justify-center rounded-full text-ink lg:hidden"
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
        className="h-px origin-left bg-leaf"
      />

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: EASE }}
            className="max-h-[calc(100dvh-5rem)] overflow-y-auto border-t rule-ink bg-paper/95 backdrop-blur-xl lg:hidden"
          >
            <nav aria-label="Primary" className="px-6 py-3">
              <ul className="flex flex-col">
                {NAV.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={close}
                        aria-current={active ? "page" : undefined}
                        className={
                          active
                            ? "flex items-center justify-between border-b rule-ink py-4 text-lg font-medium text-leaf-deep"
                            : "flex items-center justify-between border-b rule-ink py-4 text-lg text-ink"
                        }
                      >
                        {item.label}
                        <span aria-hidden="true" className="text-leaf">
                          &rarr;
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <Link
                href="/contact"
                onClick={close}
                className="mt-5 flex items-center justify-center rounded-full bg-leaf-deep px-6 py-4 text-base font-medium text-paper"
              >
                Enquire Now
              </Link>

              <div className="mt-4 mb-2 flex flex-col border-t rule-ink pt-3">
                <a
                  href={CONTACT.phoneHref}
                  className="py-2 font-mono text-xs tracking-wider text-ink-dim"
                >
                  {CONTACT.phoneLabel}
                </a>
                <a
                  href={CONTACT.emailHref}
                  className="py-2 font-mono text-xs tracking-wider text-ink-dim"
                >
                  {CONTACT.email}
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
