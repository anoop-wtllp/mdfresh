"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

const NAV = [
  { href: "#journey", label: "The journey" },
  { href: "#cold-chain", label: "Cold chain" },
  { href: "#texture", label: "Texture" },
  { href: "#range", label: "Range" },
];

export function SiteHeader() {
  const [solid, setSolid] = useState(false);

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

  return (
    <header
      className={
        solid
          ? "fixed inset-x-0 top-0 z-50 border-b rule bg-ink/85 backdrop-blur-md transition-colors duration-500"
          : "fixed inset-x-0 top-0 z-50 border-b border-transparent bg-transparent transition-colors duration-500"
      }
    >
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6 sm:px-10">
        <a
          href="#top"
          className="flex items-center gap-3"
          aria-label="G-Fresh, back to top"
        >
          <Image
            src="/assets/logo-gfresh-alpha.png"
            alt=""
            width={112}
            height={72}
            priority
            className="h-9 w-auto"
          />
        </a>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-9">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="group relative text-sm text-frost-dim transition-colors duration-300 hover:text-frost"
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-1.5 left-0 h-px w-0 bg-pea transition-all duration-300 group-hover:w-full"
                  />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a
          href="#contact"
          className="rounded-full border rule px-5 py-2.5 text-sm font-medium text-frost transition-colors duration-300 hover:border-pea hover:bg-pea hover:text-ink"
        >
          Stockists
        </a>
      </div>

      {/* Reading progress. Decorative — the scrollbar is the real affordance. */}
      <motion.div
        aria-hidden="true"
        style={{ scaleX: progress }}
        className="h-px origin-left bg-pea-bright"
      />
    </header>
  );
}
