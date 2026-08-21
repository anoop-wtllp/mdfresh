import { CONTACT } from "@/lib/content";
import { EnquiryForm } from "@/components/enquiry-form";
import { Reveal, RevealWords } from "@/components/reveal";

const DETAILS = [
  { label: "Call", value: CONTACT.phoneLabel, href: CONTACT.phoneHref },
  { label: "Email", value: CONTACT.email, href: CONTACT.emailHref },
] as const;

/**
 * The Contact page body: the form on the left, the ways to reach us without
 * one on the right. Someone who wants to phone should not have to scroll past
 * six fields to find the number.
 */
export function ContactSection() {
  return (
    <section
      aria-labelledby="contact-heading"
      className="border-t rule py-24 sm:py-32"
    >
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-10">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow mb-6">Send an enquiry</p>
            </Reveal>
            <RevealWords
              as="h2"
              id="contact-heading"
              text="Tell us what you need."
              className="font-display text-[length:var(--text-title)] font-semibold leading-[1.05] text-frost"
            />
            <Reveal delay={0.15}>
              <div className="mt-10">
                <EnquiryForm />
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-5 lg:pl-8">
            <Reveal>
              <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-frost-mute">
                Reach us directly
              </h2>
            </Reveal>

            <address className="not-italic">
              <ul className="mt-6 border-t rule">
                {DETAILS.map((detail, i) => (
                  <Reveal key={detail.label} delay={i * 0.08} as="li">
                    <a
                      href={detail.href}
                      className="group flex items-baseline justify-between gap-6 border-b rule py-6"
                    >
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-frost-mute">
                        {detail.label}
                      </span>
                      <span className="text-right text-[0.9375rem] break-all text-frost transition-colors duration-300 group-hover:text-pea-bright">
                        {detail.value}
                      </span>
                    </a>
                  </Reveal>
                ))}
                <Reveal delay={0.16} as="li">
                  <div className="flex items-baseline justify-between gap-6 border-b rule py-6">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-frost-mute">
                      Plant
                    </span>
                    <span className="text-right text-[0.9375rem] leading-relaxed text-frost">
                      {CONTACT.addressLines.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </span>
                  </div>
                </Reveal>
              </ul>
            </address>

            <Reveal delay={0.24}>
              <a
                href={CONTACT.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex w-full items-center justify-center rounded-full border rule px-7 py-4 text-sm font-medium text-frost transition-colors duration-300 hover:border-pea hover:bg-pea hover:text-ink sm:w-auto sm:py-3.5"
              >
                WhatsApp Us
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </Reveal>

            <Reveal delay={0.32}>
              <p className="mt-10 border-t rule pt-6 text-sm leading-relaxed text-frost-mute">
                Trusted by HORECA, food processors, retailers &amp; exporters
                across India.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
