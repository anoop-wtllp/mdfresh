import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { AboutSection } from "@/components/about-section";
import { PillarsSection } from "@/components/pillars-section";
import { ManagementSection } from "@/components/management-section";
import { InfrastructureSection } from "@/components/infrastructure-section";
import { EnquiryCta } from "@/components/enquiry-cta";
import { IMPACT, PILLARS } from "@/lib/content";
import { loop } from "@/lib/media";

export const metadata: Metadata = {
  title: "About",
  description:
    "M.D. Fresh Veg Private Limited: IQF processing, packaging and cold-storage since 2010, from a plant at Ram Nagar, Iglas, Aligarh. Our vision, management team, infrastructure and social impact.",
};

const CLIP = loop("bowl");

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Perfectly Preserved Freshness, since 2010."
        lead="A forward-looking frozen-food company revolutionising India's cold-chain sector with IQF technology and a farm-to-freezer promise."
        clip={CLIP.media}
        alt={CLIP.alt}
      />
      <AboutSection />
      {/* The body runs light from here to the footer, alternating frost and
          paper so consecutive sections separate without extra rules. */}
      <PillarsSection
        id="values"
        eyebrow="Vision, mission & values"
        heading="What drives us."
        items={PILLARS}
        ground="paper"
      />
      <ManagementSection />
      <InfrastructureSection />
      <PillarsSection
        id="impact"
        eyebrow="Social impact"
        heading="Growing responsibly."
        items={IMPACT}
      />
      <EnquiryCta tone="light" />
    </>
  );
}
