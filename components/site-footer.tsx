import Image from "next/image";
import { Reveal, RevealWords } from "@/components/reveal";

const COLUMNS = [
  {
    title: "Company",
    links: ["About G-Fresh", "Our farms", "Cold chain", "Careers"],
  },
  {
    title: "Trade",
    links: ["Foodservice", "Private label", "Bulk packs", "Specifications"],
  },
  {
    title: "Support",
    links: ["Stockists", "Storage advice", "Contact", "Quality reports"],
  },
];

export function SiteFooter() {
  return (
    <footer
      id="contact"
      className="border-t rule bg-ink-soft"
      aria-labelledby="footer-heading"
    >
      <div className="mx-auto w-full max-w-7xl px-6 py-24 sm:px-10 sm:py-32">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <RevealWords
              as="h2"
              id="footer-heading"
              text="Find G-Fresh in your freezer aisle."
              className="max-w-sm font-display text-[length:var(--text-title)] font-semibold leading-[1.05] text-frost"
            />
            <Reveal delay={0.15}>
              <a
                href="mailto:hello@g-fresh.example"
                className="group mt-8 inline-flex items-center gap-3 rounded-full bg-pea px-7 py-3.5 text-sm font-medium text-ink transition-colors duration-300 hover:bg-pea-bright"
              >
                hello@g-fresh.example
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  &rarr;
                </span>
              </a>
            </Reveal>
          </div>

          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-7">
            {COLUMNS.map((column, i) => (
              <Reveal key={column.title} delay={i * 0.08}>
                <h3 className="mb-5 font-mono text-[10px] uppercase tracking-[0.2em] text-frost-mute">
                  {column.title}
                </h3>
                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#contact"
                        className="-my-1.5 inline-flex min-h-11 items-center text-[0.9375rem] text-frost-dim transition-colors duration-300 hover:text-pea-bright"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-6 border-t rule pt-8 sm:flex-row sm:items-center sm:justify-between">
          <Image
            src="/assets/logo-gfresh-alpha.png"
            alt="G-Fresh"
            width={420}
            height={270}
            quality={90}
            className="h-11 w-auto"
          />
          <p className="text-[0.9375rem] text-frost-mute">
            &copy; {new Date().getFullYear()} G-Fresh. Frozen at the peak of
            fresh.
          </p>
        </div>
      </div>
    </footer>
  );
}
