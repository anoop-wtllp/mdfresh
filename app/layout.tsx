import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.mdfreshveg.com"),
  title: {
    default:
      "M.D. Fresh Veg — Perfectly Preserved Freshness | Frozen Vegetables & Fruits",
    template: "%s · M.D. Fresh Veg",
  },
  description:
    "Premium frozen vegetables & fruits, flash-frozen at the peak of harvest with advanced IQF technology — nutrition, colour and taste, sealed and locked at −18°C. Processing, packaging and cold-storage since 2010 at Ram Nagar, Aligarh.",
  keywords: [
    "frozen vegetables",
    "IQF",
    "frozen green peas",
    "frozen sweet corn",
    "cold chain",
    "Aligarh",
    "HORECA supply",
    "frozen food exporter India",
  ],
  openGraph: {
    title: "M.D. Fresh Veg — Perfectly Preserved Freshness",
    description:
      "Premium frozen vegetables & fruits, flash-frozen at the peak of harvest with advanced IQF technology.",
    siteName: "M.D. Fresh Veg",
    locale: "en_IN",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#070b09",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable} h-full antialiased`}
    >
      <head>
        {/* Without JavaScript the entrance animations never run, so anything
            waiting to be revealed must be shown outright. */}
        <noscript>
          <style>{`.will-reveal{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
      </head>
      <body className="min-h-full flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[100] focus:rounded-full focus:bg-pea focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-ink"
        >
          Skip to content
        </a>
        {/* Chrome lives here, not in each page, so a client-side navigation
            leaves the header mounted: no re-render, no dropped scroll spring,
            no menu flash between routes. */}
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
