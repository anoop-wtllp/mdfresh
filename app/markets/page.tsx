import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { MarketsSection } from "@/components/markets-section";
import { DistributionSection } from "@/components/distribution-section";
import { EnquiryCta } from "@/components/enquiry-cta";
import { loop } from "@/lib/media";

export const metadata: Metadata = {
  title: "Markets",
  description:
    "Supplying HORECA, food processors, retail and distribution, and export buyers with IQF frozen vegetables, fruits and pastes — backed by a cold chain with batch-level traceability and export-grade packaging.",
};

const CLIP = loop("falling");

export default function MarketsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Markets"
        title="From our freezer to every industry."
        lead="Consistent, ready-to-use frozen produce with batch traceability and a reliable cold chain — for every kind of buyer."
        clip={CLIP.media}
        alt={CLIP.alt}
      />
      <MarketsSection />
      <DistributionSection />
      <EnquiryCta />
    </>
  );
}
