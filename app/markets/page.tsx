import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { MarketsSection } from "@/components/markets-section";
import { EnquiryCta } from "@/components/enquiry-cta";
import { loop } from "@/lib/media";

export const metadata: Metadata = {
  title: "Markets",
  description:
    "Supplying HORECA, food processors, retail and distribution, and export buyers with IQF frozen vegetables, fruits and pastes.",
};

const CLIP = loop("falling");

export default function MarketsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Markets"
        title="From our freezer to every industry."
        lead="Retail packs, HORECA supply, bulk industrial volumes or exports — the same cold chain and the same batch traceability behind all four."
        clip={CLIP.media}
        alt={CLIP.alt}
      />
      <MarketsSection />
      <EnquiryCta />
    </>
  );
}
