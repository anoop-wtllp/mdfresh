import Image from "next/image";
import Link from "next/link";
import { COMPANY, CONTACT } from "@/lib/content";

const COLUMNS = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Our Process", href: "/process" },
      { label: "Core Strengths", href: "/about#strengths" },
      { label: "Markets", href: "/markets" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Products",
    links: [
      { label: "Frozen Green Peas", href: "/products" },
      { label: "Frozen Sweet Corn", href: "/products" },
      { label: "Frozen Mixed Vegetables", href: "/products" },
      { label: "Pastes & Fruits", href: "/products" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer
      className="border-t rule bg-ink-soft"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        {COMPANY.legalName}
      </h2>

      <div className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-10 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Link href="/" className="-m-2 inline-block p-2">
              <Image
                src="/assets/logo-gfresh-alpha.png"
                alt="M.D. Fresh Veg, home"
                width={420}
                height={270}
                quality={90}
                className="h-12 w-auto"
              />
            </Link>
            <p className="mt-6 font-display text-lg font-semibold text-frost">
              {COMPANY.legalName}
            </p>
            <p className="mt-3 max-w-sm text-[0.9375rem] leading-relaxed text-frost-dim">
              Processing, packaging &amp; cold-storage of frozen vegetables and
              fruits using advanced IQF technology since {COMPANY.established}.
            </p>
          </div>

          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-7">
            {COLUMNS.map((column) => (
              <div key={column.title}>
                <h3 className="mb-5 font-mono text-[10px] uppercase tracking-[0.2em] text-frost-mute">
                  {column.title}
                </h3>
                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="-my-1.5 inline-flex min-h-11 items-center text-[0.9375rem] text-frost-dim transition-colors duration-300 hover:text-pea-bright"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <h3 className="mb-5 font-mono text-[10px] uppercase tracking-[0.2em] text-frost-mute">
                Reach Us
              </h3>
              <address className="not-italic">
                <ul className="space-y-3">
                  <li>
                    <a
                      href={CONTACT.phoneHref}
                      className="-my-1.5 inline-flex min-h-11 items-center text-[0.9375rem] text-frost-dim transition-colors duration-300 hover:text-pea-bright"
                    >
                      {CONTACT.phoneLabel}
                    </a>
                  </li>
                  <li>
                    <a
                      href={CONTACT.emailHref}
                      className="-my-1.5 inline-flex min-h-11 items-center text-[0.9375rem] break-all text-frost-dim transition-colors duration-300 hover:text-pea-bright"
                    >
                      {CONTACT.email}
                    </a>
                  </li>
                  <li className="pt-1 text-[0.9375rem] leading-relaxed text-frost-dim">
                    {CONTACT.addressLines.join(", ")}
                  </li>
                </ul>
              </address>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t rule pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.9375rem] text-frost-mute">
            &copy; {new Date().getFullYear()} {COMPANY.legalName}. All rights
            reserved.
          </p>
          <p className="text-[0.9375rem] text-frost-mute">
            Design by{" "}
            <a
              href="https://www.webcitytechnologies.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-frost-dim transition-colors duration-300 hover:text-pea-bright"
            >
              Webcity Technologies LLP
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
