import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

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
  title: {
    default: "G-Fresh — Frozen at the peak of fresh",
    template: "%s · G-Fresh",
  },
  description:
    "Individually quick frozen vegetables, four hours from the field to minus eighteen. Follow one pea from the vine to the bowl.",
  openGraph: {
    title: "G-Fresh — Frozen at the peak of fresh",
    description:
      "Individually quick frozen vegetables, four hours from the field to minus eighteen.",
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
        {children}
      </body>
    </html>
  );
}
