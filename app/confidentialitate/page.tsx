import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { BUSINESS_NAME, site } from "@/config/site";

export const metadata: Metadata = {
  title: "Politica de confidențialitate și cookie-uri",
  description: "Ce date folosim pentru programări, unde sunt păstrate și ce drepturi ai.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Confidențialitate"
        title={
          <>
            Datele tale, <em>pe înțeles</em>
          </>
        }
        intro="Cerem cât mai puține date și le folosim doar pentru programarea ta."
        icon="mirror"
      />
      <section className="container section" style={{ paddingTop: 0 }}>
        <div className="prose">
          <p className="muted">Ultima actualizare: octombrie 2026.</p>

          <h2>Cine suntem</h2>
          <p>
            {BUSINESS_NAME} ({site.address}) este operatorul datelor personale descrise aici. Ne poți scrie la{" "}
            <a href={`mailto:${site.email}`}>{site.email}</a> sau ne poți suna la{" "}
            <a href={`tel:${site.phoneHref}`}>{site.phoneDisplay}</a>.
          </p>

          <h2>Ce date folosim</h2>
          <ul>
            <li>
              <strong>Pentru programare:</strong> numele, numărul de telefon, serviciile alese, ziua și ora, specialistul și,
              opțional, mesajul tău.
            </li>
            <li>
              <strong>Preferința de temă</strong> (luminoasă sau întunecată), dacă o schimbi.
            </li>
          </ul>
          <p>Nu cerem CNP, adresă sau date de plată online.</p>

          <h2>Unde sunt păstrate</h2>
          <p>
            Programările făcute pe site și preferința de temă sunt salvate în memoria locală a browserului tău (localStorage), pe
            dispozitivul de pe care le-ai făcut. Le poți șterge oricând anulând programarea sau ștergând datele site-ului din
            setările browserului.
          </p>

          <h2>De ce le folosim</h2>
          <p>
            Pentru a-ți rezerva ora și, dacă trebuie să schimbăm ceva, pentru a te suna. Temeiul este acordul tău și demersurile
            făcute la cererea ta înaintea prestării serviciului (art. 6 alin. 1 lit. a și b din Regulamentul (UE) 2016/679 –
            GDPR).
          </p>

          <h2>Cât timp le păstrăm</h2>
          <p>Până la data programării și cel mult 30 de zile după aceea, apoi le ștergem.</p>

          <h2>Cookie-uri și urmărire</h2>
          <p>
            Site-ul nu folosește cookie-uri de marketing sau de analiză, nu încarcă scripturi de la terți, hărți externe, fonturi
            externe sau butoane de rețele sociale. De aceea nu îți afișăm un banner de cookie-uri.
          </p>

          <h2>Drepturile tale</h2>
          <ul>
            <li>să afli ce date avem despre tine și să primești o copie;</li>
            <li>să le corectezi sau să ceri ștergerea lor;</li>
            <li>să îți retragi acordul oricând, fără să afecteze ce s-a întâmplat înainte;</li>
            <li>să restricționezi prelucrarea sau să te opui ei;</li>
            <li>
              să depui o plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP).
            </li>
          </ul>

          <h2>Schimbări</h2>
          <p>Dacă modificăm această politică, actualizăm data de mai sus.</p>
        </div>
      </section>
    </>
  );
}
