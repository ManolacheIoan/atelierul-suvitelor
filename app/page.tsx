import Link from "next/link";
import { ColorStudio } from "@/components/ColorStudio";
import { CtaBand } from "@/components/CtaBand";
import { ArrowIcon, CalendarIcon, ClockIcon, LeafIcon, PinIcon, SparkleIcon, ToolIcon, UsersIcon } from "@/components/icons";
import { Divider, FloatingTools, SnipScissors } from "@/components/illustrations/Decor";
import { Portrait } from "@/components/illustrations/Portrait";
import { Reveal } from "@/components/Reveal";
import { BUSINESS_NAME, site } from "@/config/site";
import { categories, formatPrice, getService, servicesByCategory } from "@/data/services";
import { staff } from "@/data/staff";

const HIGHLIGHTS = ["f-tuns-lung", "f-balayage", "f-coafura-eveniment", "b-fade", "b-tuns-barba", "c-tuns-copii"];

const FEATURES = [
  {
    Icon: SparkleIcon,
    title: "Consultație sinceră, mereu gratuită",
    text: "Înainte de foarfecă, vorbim. Îți spunem ce se potrivește părului tău, chiar dacă e altceva decât poza.",
  },
  {
    Icon: ClockIcon,
    title: "Programări care se respectă",
    text: "Lăsăm timp între clienți, așa că nu aștepți pe canapea și nimeni nu se grăbește cu tine.",
  },
  {
    Icon: LeafIcon,
    title: "Produse blânde cu părul",
    text: "Vopsele fără amoniac pentru retușuri, tratamente profesionale și sfaturi pentru acasă, fără vânzare forțată.",
  },
  {
    Icon: UsersIcon,
    title: "Pentru toată familia",
    text: "Femei, bărbați, adolescenți și copii, în același atelier. Barbershop clasic, cu prosop cald și brici.",
  },
];

export default function HomePage() {
  const [lead, ...rest] = staff;
  return (
    <>
      <section className="hero">
        <div className="container hero__grid">
          <div>
            <p className="eyebrow">Salon de coafură și barbershop · {site.city}</p>
            <h1 className="hero__title">
              <span className="cut">
                Tunsori cu <em>caracter</em>, culori cu nuanță.
                <span className="cut__paper" aria-hidden="true" />
                <span className="cut__line" aria-hidden="true" />
                <span className="cut__track" aria-hidden="true">
                  <SnipScissors className="snip" />
                </span>
              </span>
            </h1>
            <p className="lead hero__lead">
              {BUSINESS_NAME} e atelierul în care femei, bărbați și adolescenți din {site.city} vin pentru o tunsoare bine gândită, o
              culoare care li se potrivește și o oră doar pentru ei.
            </p>
            <div className="hero__actions">
              <Link href="/programare/" className="btn btn--primary">
                <CalendarIcon /> Programează-te online
              </Link>
              <Link href="/servicii/" className="btn">
                Vezi serviciile și prețurile
              </Link>
            </div>
            <ul className="hero__meta">
              <li>
                <ClockIcon size={18} /> Luni–vineri 09–20, sâmbătă 09–16
              </li>
              <li>
                <PinIcon size={18} /> {site.area}
              </li>
            </ul>
          </div>

          <div className="hero__art" aria-hidden="true">
            <Portrait className="hero__portrait hero__portrait--a" spec={lead.portrait} backdrop="#F4E3DC" />
            <Portrait className="hero__portrait hero__portrait--b" spec={rest[0].portrait} backdrop="#EFE2D6" />
            <Portrait className="hero__portrait hero__portrait--c" spec={rest[2].portrait} backdrop="#E9E4DE" />
            <div className="hero__badge">
              <span>
                <strong>{staff.length}</strong>
                specialiști pasionați
              </span>
            </div>
            <FloatingTools />
          </div>
        </div>
      </section>

      <Divider />

      <section className="section" aria-labelledby="servicii-titlu">
        <div className="container">
          <Reveal className="section__head">
            <p className="eyebrow">Servicii</p>
            <h2 id="servicii-titlu">
              Un atelier, <em>trei lumi</em>
            </h2>
            <p className="lead">De la balayage pictat manual la un fade curat și prima tunsoare a celui mic.</p>
          </Reveal>
          <ul className="card-grid card-grid--3">
            {categories.map((c, i) => {
              const list = servicesByCategory(c.id);
              const min = Math.min(...list.map((s) => s.priceLei));
              return (
                <Reveal as="li" key={c.id} delay={i * 90}>
                  <article className="service-card">
                    <span className="service-card__icon" aria-hidden="true">
                      <ToolIcon name={c.icon} size={40} />
                    </span>
                    <h3>
                      <Link className="service-card__link" href={`/servicii/#${c.id}`}>
                        {c.label}
                      </Link>
                    </h3>
                    <p>{c.intro}</p>
                    <p>{list.map((s) => s.group).filter((g, idx, arr) => arr.indexOf(g) === idx).join(" · ")}</p>
                    <p className="service-card__from">de la {min} lei</p>
                  </article>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="section section--tint" aria-labelledby="nuante-titlu">
        <div className="container">
          <Reveal className="section__head">
            <p className="eyebrow">Studio de culoare</p>
            <h2 id="nuante-titlu">
              Găsește-ți <em>nuanța</em>
            </h2>
            <p className="lead">
              Alege o culoare și trage de linie ca să compari înainte și după. La salon, o probăm pe o șuviță înainte de orice.
            </p>
          </Reveal>
          <ColorStudio />
        </div>
      </section>

      <section className="section" aria-labelledby="de-ce-titlu">
        <div className="container">
          <Reveal className="section__head">
            <p className="eyebrow">De ce noi</p>
            <h2 id="de-ce-titlu">
              Grijă de atelier, <em>nu de bandă rulantă</em>
            </h2>
          </Reveal>
          <ul className="features">
            {FEATURES.map(({ Icon, title, text }, i) => (
              <Reveal as="li" className="feature" key={title} delay={i * 80}>
                <span className="feature__icon" aria-hidden="true">
                  <Icon />
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <Divider />

      <section className="section" aria-labelledby="echipa-titlu">
        <div className="container">
          <Reveal className="section__head">
            <p className="eyebrow">Echipa</p>
            <h2 id="echipa-titlu">
              Oameni care <em>ascultă</em> înainte să taie
            </h2>
          </Reveal>
          <ul className="team-strip">
            {staff.map((m, i) => (
              <Reveal as="li" key={m.id} delay={i * 70}>
                <Portrait spec={m.portrait} />
                <strong>{m.name}</strong>
                <span>{m.role}</span>
              </Reveal>
            ))}
          </ul>
          <Link href="/echipa/" className="link-arrow">
            Cunoaște echipa <ArrowIcon size={18} />
          </Link>
        </div>
      </section>

      <section className="section section--tint" aria-labelledby="preturi-titlu">
        <div className="container">
          <Reveal className="section__head">
            <p className="eyebrow">Prețuri</p>
            <h2 id="preturi-titlu">
              Clar, <em>fără surprize</em>
            </h2>
            <p className="lead">Câteva dintre cele mai cerute servicii. Prețul final îl afli înainte să începem.</p>
          </Reveal>
          <ul className="price-highlights">
            {HIGHLIGHTS.map((id) => getService(id))
              .filter((s) => s !== undefined)
              .map((s) => (
                <li key={s.id}>
                  <span className="name">{s.name}</span>
                  <span className="dots" aria-hidden="true" />
                  <span className="price">{formatPrice(s)}</span>
                </li>
              ))}
          </ul>
          <Link href="/servicii/" className="link-arrow">
            Toate serviciile și prețurile <ArrowIcon size={18} />
          </Link>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
