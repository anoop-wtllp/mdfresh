import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT } from "@/lib/content";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

const ELSEWHERE = [
  { href: "/products", label: "Products", note: "Ten IQF lines, pastes and fruits" },
  { href: "/process", label: "Process", note: "Sourcing through to −18°C storage" },
  { href: "/about", label: "About", note: "The company, the plant, the team" },
  { href: "/markets", label: "Markets", note: "HORECA, processors, retail, exports" },
];

/**
 * A 404 that behaves like a page rather than a dead end: it names the four
 * places a lost visitor most likely wanted, and keeps the phone number in
 * reach, since a buyer who mistyped a URL should not have to hunt for it.
 */
export default function NotFound() {
  return (
    <section
      aria-labelledby="nf-heading"
      className="on-light flex min-h-[70svh] items-center bg-frost pb-24 pt-40 sm:pt-48"
    >
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-10">
        <p className="eyebrow mb-5">Error 404</p>
        <h1
          id="nf-heading"
          className="max-w-2xl font-display text-[length:var(--text-title)] font-semibold leading-[1.05] text-ink"
        >
          That page has gone cold.
        </h1>
        <p className="mt-6 max-w-lg text-[length:var(--text-lead)] leading-relaxed text-ink-dim">
          The link may be out of date, or the address slightly off. Everything
          on the site is one step away from here.
        </p>

        <ul className="mt-12 grid gap-px overflow-hidden rounded-2xl border rule-ink bg-[color-mix(in_oklab,var(--color-ink)_12%,transparent)] sm:grid-cols-2">
          {ELSEWHERE.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="group flex h-full flex-col bg-paper p-7 transition-colors duration-500 hover:bg-mint"
              >
                <span className="font-display text-xl font-semibold text-ink transition-colors duration-500 group-hover:text-leaf-deep motion-reduce:transition-none">
                  {item.label}
                </span>
                <span className="mt-2 text-[0.9375rem] leading-relaxed text-ink-dim">
                  {item.note}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <Link
            href="/"
            className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-leaf-deep px-7 py-4 text-sm font-medium text-paper transition-colors duration-300 hover:bg-leaf sm:w-auto sm:py-3.5"
          >
            Back to home
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
            >
              &rarr;
            </span>
          </Link>
          <a
            href={CONTACT.phoneHref}
            className="inline-flex w-full items-center justify-center rounded-full border rule-ink px-7 py-4 text-sm font-medium text-ink transition-colors duration-300 hover:border-leaf-deep hover:bg-leaf-deep hover:text-paper sm:w-auto sm:py-3.5"
          >
            Call {CONTACT.phoneLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
