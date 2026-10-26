import type { Metadata } from "next";
import Link from "next/link";
import { CalendarIcon } from "@/components/icons";
import { LostStrandScene } from "@/components/illustrations/Decor";

export const metadata: Metadata = {
  title: "Pagina nu există",
};

export default function NotFound() {
  return (
    <section className="container not-found">
      <LostStrandScene />
      <p className="eyebrow" style={{ justifyContent: "center" }}>
        Eroare 404
      </p>
      <h1>
        Ups! Pagina asta <em>a fost tunsă</em>.
      </h1>
      <p className="lead">
        Am căutat-o în toate sertarele, chiar și printre pieptăni. Probabil linkul e greșit sau pagina s-a mutat.
      </p>
      <div className="not-found__actions">
        <Link href="/" className="btn btn--primary">
          Înapoi acasă
        </Link>
        <Link href="/programare/" className="btn">
          <CalendarIcon /> Fă o programare
        </Link>
      </div>
    </section>
  );
}
