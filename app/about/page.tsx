import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { AboutSection } from "@/components/about-section";
import { StrengthsSection } from "@/components/strengths-section";
import { EnquiryCta } from "@/components/enquiry-cta";
import { loop } from "@/lib/media";

export const metadata: Metadata = {
  title: "About",
  description:
    "Established in 2010, M.D. Fresh Veg processes, packages and cold-stores frozen vegetables and fruits with cutting-edge IQF technology at Ram Nagar, Aligarh.",
};

const CLIP = loop("bowl");

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Revolutionising India's frozen-food sector."
        lead="Processing, packaging and cold-storage of frozen vegetables and fruits with cutting-edge IQF technology — from a plant sitting inside the agri-belt it buys from."
        clip={CLIP.media}
        alt={CLIP.alt}
      />
      <AboutSection />
      <StrengthsSection />
      <EnquiryCta />
    </>
  );
}
