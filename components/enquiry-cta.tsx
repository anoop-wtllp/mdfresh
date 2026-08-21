import Link from "next/link";
import { CONTACT } from "@/lib/content";
import { Reveal, RevealWords } from "@/components/reveal";

/**
 * Per-ground class sets.
 *
 * The light buttons are leaf-deep rather than pea: pea is a pale green that all
 * but disappears against paper, and white on plain `leaf` measures 4.9:1 —
 * passing, but with no room to spare at 14px. leaf-deep clears 8:1 and only
 * lightens to leaf on hover, which still passes.
 */
const TONES = {
  dark: {
    // Frost is the page ground here, so the panel steps *down* to separate.
    section: "border-t rule bg-ink-soft",
    heading: "text-frost",
    body: "text-frost-dim",
    primary: "bg-pea text-ink hover:bg-pea-bright",
    secondary:
      "border rule text-frost hover:border-frost/40 hover:bg-frost/5",
  },
  light: {
    // Paper, not frost: on Home this follows the product rail, which is already
    // frost — without the step up the two would read as one undivided block.
    section: "on-light border-t rule-ink bg-paper",
    heading: "text-ink",
    body: "text-ink-dim",
    primary: "bg-leaf-deep text-paper hover:bg-leaf",
    secondary:
      "border rule-ink text-ink hover:border-leaf-deep hover:bg-leaf-deep hover:text-paper",
  },
} as const;

type EnquiryCtaProps = {
  /**
   * `light` flips the panel onto paper. Home closes on a light run — rail then
   * CTA — while the inner pages stay dark, where this follows a dark section.
   */
  tone?: keyof typeof TONES;
};

/**
 * The closing ask, repeated at the foot of every page except Contact itself —
 * where it would only send the reader to the page they are already on.
 */
export function EnquiryCta({ tone = "dark" }: EnquiryCtaProps) {
  const t = TONES[tone];

  return (
    <section
      aria-labelledby="cta-heading"
      className={`${t.section} py-24 sm:py-32`}
    >
      <div className="mx-auto w-full max-w-7xl px-6 text-center sm:px-10">
        <p className="eyebrow mb-6">Enquire now</p>
        <RevealWords
          as="h2"
          id="cta-heading"
          text="Ready to stock the freshest frozen produce?"
          className={`mx-auto max-w-3xl font-display text-[length:var(--text-title)] font-semibold leading-[1.05] ${t.heading}`}
        />
        <Reveal delay={0.15}>
          <p
            className={`mx-auto mt-6 max-w-xl text-[length:var(--text-lead)] leading-relaxed ${t.body}`}
          >
            Retail packs, HORECA supply, bulk industrial volumes or exports —
            tell us what you need and our team will respond within one business
            day.
          </p>
        </Reveal>

        <Reveal delay={0.25}>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/contact"
              className={`group inline-flex w-full items-center justify-center gap-3 rounded-full px-7 py-4 text-sm font-medium transition-colors duration-300 sm:w-auto sm:py-3.5 ${t.primary}`}
            >
              Request a Quote
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
              >
                &rarr;
              </span>
            </Link>
            <a
              href={CONTACT.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex w-full items-center justify-center rounded-full px-7 py-4 text-sm font-medium transition-colors duration-300 sm:w-auto sm:py-3.5 ${t.secondary}`}
            >
              WhatsApp Us
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
