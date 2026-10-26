import Link from "next/link";
import { MailIcon, PhoneIcon, PinIcon } from "@/components/icons";
import { Logo } from "@/components/Logo";
import { BUSINESS_NAME, nav, schedule, site, WEEK_ORDER, WEEKDAY_NAMES } from "@/config/site";
import { hoursLabel } from "@/lib/format";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Logo />
            <p>{site.shortDescription}</p>
          </div>
          <div>
            <h2>Pagini</h2>
            <ul className="footer-list">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
              <li>
                <Link href="/programare/">Programare online</Link>
              </li>
            </ul>
          </div>
          <div>
            <h2>Contact</h2>
            <ul className="footer-list">
              <li>
                <PhoneIcon size={18} />
                <a href={`tel:${site.phoneHref}`}>{site.phoneDisplay}</a>
              </li>
              <li>
                <MailIcon size={18} />
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </li>
              <li>
                <PinIcon size={18} />
                <span>
                  {site.address}
                  <br />
                  {site.area}
                </span>
              </li>
            </ul>
          </div>
          <div>
            <h2>Program</h2>
            <dl className="footer-hours">
              {WEEK_ORDER.map((d) => (
                <div key={d} style={{ display: "contents" }}>
                  <dt>{WEEKDAY_NAMES[d]}</dt>
                  <dd>{hoursLabel(schedule.weekly[d])}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <div className="footer-legal">
          <span>
            © {new Date().getFullYear()} {BUSINESS_NAME}, {site.city}
          </span>
          <span>
            <Link href="/confidentialitate/">Confidențialitate și cookie-uri</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
