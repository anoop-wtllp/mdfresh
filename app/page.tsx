import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { JourneyFilm } from "@/components/journey-film";
import { ColdChain } from "@/components/cold-chain";
import { TextureGallery } from "@/components/texture-gallery";
import { RangeSection } from "@/components/range-section";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <div id="top" />
        <Hero />
        <JourneyFilm />
        <ColdChain />
        <TextureGallery />
        <RangeSection />
      </main>
      <SiteFooter />
    </>
  );
}
