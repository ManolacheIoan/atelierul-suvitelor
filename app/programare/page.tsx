import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingApp } from "@/components/booking/BookingApp";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Programare online",
  description: "Alege serviciul, specialistul, ziua și ora. Vezi doar orele libere, cu durata și prețul calculate automat.",
};

export default function BookingPage() {
  return (
    <>
      <PageHero
        eyebrow="Programare online"
        title={
          <>
            Rezervă-ți <em>ora ta</em>
          </>
        }
        intro="Patru pași scurți. Îți arătăm doar orele în care specialistul chiar e liber."
        icon="dryer"
      />
      <section className="container section" style={{ paddingTop: 0 }} aria-label="Programare">
        <Suspense fallback={<p className="muted">Se încarcă programarea…</p>}>
          <BookingApp />
        </Suspense>
      </section>
    </>
  );
}
