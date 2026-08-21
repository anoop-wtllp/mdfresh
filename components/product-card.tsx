import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/content";

type ProductCardProps = {
  product: Product;
  /** Zero-based; shown as the card's ordinal. */
  index: number;
};

/**
 * One product, shared by the home rail and the Products grid.
 *
 * Built around what the photography actually is: every shot is a subject cut
 * out on white. Rather than bleed that to the card edge — where it dissolves
 * into a white card — the product sits on a round white plate over a tinted
 * band, so the white ground becomes a deliberate serving surface instead of an
 * accident. The plate is sized as a share of the card, so it scales with
 * whatever width the surface gives it and never renders above the 261px the
 * source actually holds.
 *
 * The surface is `relative` on purpose: the Enquire pill stretches an `::after`
 * across it, so the whole tile is clickable while the link's accessible name
 * stays "Enquire about <product>". Nothing between the pill and this element
 * may be positioned, or the hit area silently shrinks to that ancestor.
 */
export function ProductCard({ product, index }: ProductCardProps) {
  return (
    <article
      data-tilt
      className="relative flex h-full flex-col overflow-hidden rounded-2xl border rule-ink bg-paper transition-[box-shadow,border-color] duration-300 will-change-transform group-hover:border-leaf/40 group-hover:shadow-[0_22px_50px_-22px_rgba(7,11,9,0.45)]"
    >
      <div className="relative flex items-center justify-center bg-paper-soft px-6 py-7">
        {/* A wash in the product's own colour — the only place `tone` shows. */}
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${product.tone} to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 motion-reduce:transition-none`}
        />

        {/* The plate. A share of the card rather than a fixed size, so it
            tracks the card's width at every breakpoint, and capped so the
            261px source is always scaled down rather than up. */}
        <div className="relative aspect-square w-[64%] max-w-[11rem] overflow-hidden rounded-full bg-paper shadow-[0_12px_28px_-14px_rgba(7,11,9,0.5)] ring-1 ring-ink/10 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05] motion-reduce:transition-none">
          <Image
            src={product.image}
            alt={product.name}
            fill
            quality={90}
            sizes="176px"
            className="object-cover"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col border-t rule-ink p-5">
        <div className="flex items-center justify-between gap-3">
          {/* IQF is the company's differentiator, so the method reads as a
              badge rather than a line of small print. */}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-leaf/30 bg-leaf/[0.06] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-leaf-deep">
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-leaf" />
            {product.tag}
          </span>
          <span
            aria-hidden="true"
            className="font-mono text-[10px] tracking-[0.2em] text-ink-mute"
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <h3 className="mt-3 font-display text-xl font-semibold leading-tight text-ink transition-colors duration-300 group-hover:text-leaf-deep motion-reduce:transition-none">
          {product.name}
        </h3>
        {/* Takes the slack so Enquire lands on the same line in every card. */}
        <p className="mt-2 flex-1 text-[0.875rem] leading-relaxed text-ink-dim">
          {product.detail}
        </p>

        <Link
          href="/contact"
          aria-label={`Enquire about ${product.name}`}
          className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border rule-ink px-5 text-sm font-medium text-ink transition-colors duration-300 after:absolute after:inset-0 after:rounded-2xl group-hover:border-leaf-deep group-hover:bg-leaf-deep group-hover:text-paper"
        >
          Enquire
          <span
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
          >
            &rarr;
          </span>
        </Link>
      </div>
    </article>
  );
}
