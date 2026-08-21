import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { RangeSection } from "@/components/range-section";
import { EnquiryCta } from "@/components/enquiry-cta";
import { loop } from "@/lib/media";

export const metadata: Metadata = {
  title: "Products",
  description:
    "IQF frozen green peas, sweet corn, green beans, carrot and mixed vegetables, plus tomato, garlic and ginger pastes and frozen jamun and litchi.",
};

const CLIP = loop("cascade");

export default function ProductsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Products"
        title="Frozen at peak, fresh on your plate."
        lead="IQF frozen vegetables, fruits and pastes — retaining natural colour, texture and nutrition, ready to use with zero prep waste."
        clip={CLIP.media}
        alt={CLIP.alt}
      />
      <RangeSection />
      <EnquiryCta tone="light" />
    </>
  );
}
