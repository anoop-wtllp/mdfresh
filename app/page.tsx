import { Hero } from "@/components/hero";
import { JourneyFilm } from "@/components/journey-film";
import { StrengthsSection } from "@/components/strengths-section";
import { ProductRail } from "@/components/product-rail";
import { EnquiryCta } from "@/components/enquiry-cta";

export default function Home() {
  return (
    <>
      <Hero />
      <JourneyFilm />
      <StrengthsSection tone="light" />
      <ProductRail />
      <EnquiryCta tone="light" />
    </>
  );
}
