import Link from "next/link";
import { CalendarIcon, PhoneIcon } from "@/components/icons";
import { site } from "@/config/site";

/** Bara fixă de jos, doar pe telefon (ascunsă din CSS pe ecrane mari). */
export function MobileCallBar() {
  return (
    <div className="callbar">
      <a className="btn" href={`tel:${site.phoneHref}`}>
        <PhoneIcon /> Sună acum
      </a>
      <Link className="btn btn--primary" href="/programare/">
        <CalendarIcon /> Programează-te
      </Link>
    </div>
  );
}
