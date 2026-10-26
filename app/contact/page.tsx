import type { Metadata } from "next";
import Link from "next/link";
import { HoursTable } from "@/components/HoursTable";
import { CalendarIcon, ClockIcon, MailIcon, PhoneIcon, PinIcon } from "@/components/icons";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { BUSINESS_NAME, schedule, site } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact și program",
  description: "Telefon, adresă în Galați și programul salonului.",
};

/** Hartă stilizată, desenată de noi (fără hărți externe sau scripturi terțe). */
function MapArt() {
  return (
    <svg viewBox="0 0 600 380" role="img" aria-labelledby="harta-titlu">
      <title id="harta-titlu">Hartă stilizată: salonul se află în centrul Galațiului, aproape de Faleza Dunării</title>
      <rect width="600" height="380" style={{ fill: "var(--surface-2)" }} />
      {/* Dunărea */}
      <path d="M0 300c90-20 150 30 250 10s160-60 350-30v100H0Z" fill="#9FB7C0" opacity=".55" />
      <path d="M0 312c90-20 150 30 250 10s160-60 350-30" fill="none" stroke="#7E9AA5" strokeWidth="2" strokeDasharray="6 8" />
      {/* parc */}
      <ellipse cx="470" cy="120" rx="70" ry="44" fill="#B9C7A5" opacity=".6" />
      {/* străzi */}
      <g fill="none" style={{ stroke: "var(--surface)" }} strokeWidth="14" strokeLinecap="round">
        <path d="M40 60 560 40" />
        <path d="M20 180 580 150" />
        <path d="M120 0 170 290" />
        <path d="M330 0 300 280" />
        <path d="M60 250 560 230" />
      </g>
      <g fill="none" style={{ stroke: "var(--line-strong)" }} strokeWidth="1">
        <path d="M40 60 560 40M20 180 580 150M120 0l50 290M330 0l-30 280M60 250l500-20" />
      </g>
      <g style={{ fill: "var(--muted)", fontFamily: "var(--font-text)", fontSize: 15, fontWeight: 600 }}>
        <text x="40" y="350">Faleza Dunării</text>
        <text x="430" y="125">Grădina Publică</text>
        <text x="352" y="210">Centru</text>
      </g>
      {/* reper salon */}
      <g className="map-pin">
        <path d="M312 170c0-22 36-22 36 0 0 18-18 34-18 34s-18-16-18-34Z" fill="#3B1F3F" />
        <circle cx="330" cy="168" r="7" fill="#E2A07A" />
      </g>
    </svg>
  );
}

export default function ContactPage() {
  const sat = schedule.weekly[6];
  return (
    <>
      <PageHero
        eyebrow="Contact și program"
        title={
          <>
            Ne găsești <em>în centrul Galațiului</em>
          </>
        }
        intro={`La câțiva pași de Faleza Dunării. Sună-ne sau programează-te online, oricând.`}
        icon="comb"
      />
      <section className="container section" style={{ paddingTop: 0 }}>
        <div className="contact-grid">
          <Reveal>
            <ul className="contact-list">
              <li>
                <span className="icon-wrap" aria-hidden="true">
                  <PhoneIcon />
                </span>
                <strong>Telefon</strong>
                <a className="phone-big" href={`tel:${site.phoneHref}`}>
                  {site.phoneDisplay}
                </a>
              </li>
              <li>
                <span className="icon-wrap" aria-hidden="true">
                  <PinIcon />
                </span>
                <strong>Adresă</strong>
                <span>
                  {site.address} — {site.area}
                </span>
              </li>
              <li>
                <span className="icon-wrap" aria-hidden="true">
                  <MailIcon />
                </span>
                <strong>E-mail</strong>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </li>
              <li>
                <span className="icon-wrap" aria-hidden="true">
                  <ClockIcon />
                </span>
                <strong>Pauză de prânz</strong>
                <span>
                  {schedule.lunchBreak ? `${schedule.lunchBreak.start}–${schedule.lunchBreak.end}, în fiecare zi` : "Fără pauză"}
                  {sat ? `; sâmbăta închidem la ${sat.end}` : ""}
                </span>
              </li>
            </ul>
            <h2 style={{ fontSize: "1.6rem", marginTop: "0.5rem" }}>Program</h2>
            <HoursTable />
            <p className="muted" style={{ marginTop: "1rem" }}>
              În zilele de sărbătoare legală {BUSINESS_NAME} este închis.
            </p>
            <Link href="/programare/" className="btn btn--primary" style={{ marginTop: "0.5rem" }}>
              <CalendarIcon /> Programează-te online
            </Link>
          </Reveal>
          <Reveal delay={120}>
            <figure className="map-art" style={{ margin: 0 }}>
              <MapArt />
              <figcaption>
                Parcare publică pe străzile din jur. Intrarea e direct din stradă, fără trepte, potrivită și pentru cărucioare.
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>
    </>
  );
}
