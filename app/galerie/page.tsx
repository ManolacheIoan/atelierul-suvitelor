import type { Metadata } from "next";
import { CtaBand } from "@/components/CtaBand";
import { GalleryGrid } from "@/components/GalleryGrid";
import { PageHero } from "@/components/PageHero";
import { gallery } from "@/data/gallery";

export const metadata: Metadata = {
  title: "Galerie",
  description: "Stiluri care ne plac: tunsori, culori și coafuri pentru femei, bărbați, copii și adolescenți.",
};

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Galerie"
        title={
          <>
            Stiluri care <em>ne inspiră</em>
          </>
        }
        intro="Câteva idei de tunsori și culori, desenate de noi. Adu-ne una ca punct de plecare și o adaptăm pentru tine."
        icon="swatches"
      />
      <section className="container" aria-label="Lucrări">
        <GalleryGrid items={gallery} />
      </section>
      <CtaBand
        title={
          <>
            Ți-a plăcut un stil? <em>Hai să-l facem al tău</em>
          </>
        }
      />
    </>
  );
}
