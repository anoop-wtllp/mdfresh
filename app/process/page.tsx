import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { JourneyFilm } from "@/components/journey-film";
import { ColdBand } from "@/components/cold-band";
import { ProcessSteps } from "@/components/process-steps";
import { EnquiryCta } from "@/components/enquiry-cta";
import { loop } from "@/lib/media";

export const metadata: Metadata = {
  title: "Process",
  description:
    "Six stages from sourcing to storage: sorting and grading, washing and cutting, blanching, IQF freezing at -30C to -40C in 10-12 minutes, then cold-chain storage at -18C.",
};

const CLIP = loop("crystals");

export default function ProcessPage() {
  return (
    <>
      <PageHeader
        eyebrow="Process"
        title="The farm-to-freezer journey."
        lead="Every pack passes through an integrated, hygienic process engineered to lock in freshness at every step. Scroll the film to follow one crop through all six."
        clip={CLIP.media}
        alt={CLIP.alt}
      />
      <JourneyFilm recap={false} />
      <ColdBand />
      <ProcessSteps />
      <EnquiryCta />
    </>
  );
}
