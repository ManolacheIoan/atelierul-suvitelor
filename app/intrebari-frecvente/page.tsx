import type { Metadata } from "next";
import { CtaBand } from "@/components/CtaBand";
import { ChevronIcon } from "@/components/icons";
import { PageHero } from "@/components/PageHero";
import { site } from "@/config/site";
import { faq } from "@/data/faq";

export const metadata: Metadata = {
  title: "Întrebări frecvente",
  description: "Programări, anulări, prețuri, copii, plată: răspunsuri scurte la ce ne întreabă clienții cel mai des.",
};

export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="Întrebări frecvente"
        title={
          <>
            Întrebări, <em>pe scurt</em>
          </>
        }
        intro={`Nu găsești răspunsul? Sună-ne la ${site.phoneDisplay}.`}
        icon="brush"
      />
      <section className="container" aria-label="Întrebări și răspunsuri">
        <div className="faq">
          {faq.map((item) => (
            <details className="faq-item" key={item.q}>
              <summary>
                {item.q}
                <ChevronIcon dir="down" />
              </summary>
              <p>{item.a.replaceAll("{phone}", site.phoneDisplay)}</p>
            </details>
          ))}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
