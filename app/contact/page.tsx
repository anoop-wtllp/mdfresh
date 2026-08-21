import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { ContactSection } from "@/components/contact-section";
import { loop } from "@/lib/media";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Enquire about retail packs, HORECA supply, bulk industrial volumes or exports. Call +91 98377 66000 or write to mdfvcp@mdfreshveg.com.",
};

const CLIP = loop("fog");

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Ready to stock the freshest frozen produce?"
        lead="Retail packs, HORECA supply, bulk industrial volumes or exports — tell us what you need and our team will respond within one business day."
        clip={CLIP.media}
        alt={CLIP.alt}
      />
      <ContactSection />
    </>
  );
}
