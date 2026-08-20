"use client";

import { motion, type Variants } from "framer-motion";
import type { ElementType, ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

type RevealProps = {
  children: ReactNode;
  /** Seconds of delay, for staggering siblings by hand. */
  delay?: number;
  /** Distance travelled, in px. */
  y?: number;
  as?: ElementType;
  className?: string;
};

/**
 * The workhorse entrance: fade + short rise, fired once when the element is
 * ~15% into view. Framer Motion reads `prefers-reduced-motion` itself and
 * drops the transform, so no manual branch is needed here.
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  as = "div",
  className,
}: RevealProps) {
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </MotionTag>
  );
}

const lineVariants: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.08 } },
};

const wordVariants: Variants = {
  hidden: { opacity: 0, y: "0.6em" },
  shown: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

/**
 * Splits a heading into words and rises them in sequence.
 *
 * Each word keeps its own `overflow-hidden` mask so the letters slide up from
 * behind a clean edge. The full string stays readable to assistive tech via
 * `aria-label`, with the animated spans hidden from the accessibility tree.
 */
export function RevealWords({
  text,
  className,
  delay = 0,
  as: Tag = "h2",
  id,
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: ElementType;
  /** Set when the heading is the target of an `aria-labelledby`. */
  id?: string;
}) {
  const words = text.split(" ");

  return (
    <Tag id={id} className={className} aria-label={text}>
      <motion.span
        aria-hidden="true"
        className="inline"
        variants={lineVariants}
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, amount: 0.4 }}
        transition={{ delayChildren: delay }}
      >
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="inline-block overflow-hidden align-bottom pb-[0.12em]"
          >
            <motion.span className="inline-block" variants={wordVariants}>
              {word}
              {i < words.length - 1 ? "\u00A0" : ""}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
