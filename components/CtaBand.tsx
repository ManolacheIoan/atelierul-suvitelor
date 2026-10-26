import Link from "next/link";
import { CalendarIcon, PhoneIcon, ScissorsIcon } from "@/components/icons";
import { Reveal } from "@/components/Reveal";
import { site } from "@/config/site";

export function CtaBand({
  title = (
    <>
      Îți facem loc <em>chiar săptămâna asta</em>
    </>
  ),
  text = "Alegi serviciul, specialistul și ora în mai puțin de un minut. Vezi doar orele libere.",
}: {
  title?: React.ReactNode;
  text?: string;
}) {
  return (
    <section className="section" aria-labelledby="cta-titlu">
      <div className="container">
        <Reveal className="cta-band">
          <div>
            <h2 id="cta-titlu">{title}</h2>
            <p>{text}</p>
          </div>
          <div className="cta-band__actions">
            <Link className="btn btn--primary" href="/programare/">
              <CalendarIcon /> Programează-te online
            </Link>
            <a className="btn btn--ghost" href={`tel:${site.phoneHref}`}>
              <PhoneIcon /> {site.phoneDisplay}
            </a>
          </div>
          <ScissorsIcon className="cta-band__deco" size={180} />
        </Reveal>
      </div>
    </section>
  );
}
