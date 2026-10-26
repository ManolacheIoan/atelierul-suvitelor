import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/CtaBand";
import { ToolIcon } from "@/components/icons";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { categories, formatDuration, formatPrice, servicesByCategory, type Service } from "@/data/services";

export const metadata: Metadata = {
  title: "Servicii și prețuri",
  description: "Tuns, coafat, vopsit, balayage, tratamente, coafuri de eveniment, barbă și tuns copii: durate și prețuri în lei.",
};

function groupBy(list: Service[]): [string, Service[]][] {
  const map = new Map<string, Service[]>();
  for (const s of list) map.set(s.group, [...(map.get(s.group) ?? []), s]);
  return [...map.entries()];
}

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Servicii și prețuri"
        title={
          <>
            Tot ce facem, <em>cu prețul la vedere</em>
          </>
        }
        intro="Durata include spălatul și uscatul. „De la” înseamnă că prețul depinde de lungimea părului; îl afli înainte să începem."
        icon="scissors"
      />

      <div className="container">
        <nav aria-label="Categorii de servicii">
          <ul className="category-nav">
            {categories.map((c) => (
              <li key={c.id}>
                <a className="btn btn--sm" href={`#${c.id}`}>
                  <ToolIcon name={c.icon} size={22} /> {c.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {categories.map((c) => (
          <Reveal as="section" className="price-section" key={c.id}>
            <div id={c.id} className="price-section__head">
              <span className="price-section__icon" aria-hidden="true">
                <ToolIcon name={c.icon} size={36} />
              </span>
              <div>
                <h2>{c.label}</h2>
                <p className="muted" style={{ margin: 0 }}>
                  {c.intro}
                </p>
              </div>
            </div>
            <div className="table-wrap">
              <table className="price-table">
                <caption className="visually-hidden">Prețuri {c.label.toLowerCase()}</caption>
                <thead>
                  <tr>
                    <th scope="col">Serviciu</th>
                    <th scope="col" className="num col-duration">
                      Durată
                    </th>
                    <th scope="col" className="num">
                      Preț
                    </th>
                    <th scope="col" className="num col-book">
                      <span className="visually-hidden">Programare</span>
                    </th>
                  </tr>
                </thead>
                {groupBy(servicesByCategory(c.id)).map(([group, list]) => (
                  <tbody key={group}>
                    <tr className="group-row">
                      <th scope="colgroup" colSpan={4}>
                        {group}
                      </th>
                    </tr>
                    {list.map((s) => (
                      <tr key={s.id}>
                        <th scope="row">
                          <span className="svc-name">{s.name}</span>
                          <span className="svc-desc">{s.description}</span>
                          <span className="svc-meta">
                            {formatDuration(s.durationMin)} ·{" "}
                            <Link href={`/programare/?serviciu=${s.id}`} aria-label={`Programează: ${s.name}`}>
                              Alege
                            </Link>
                          </span>
                        </th>
                        <td className="num col-duration">{formatDuration(s.durationMin)}</td>
                        <td className="num price">{formatPrice(s)}</td>
                        <td className="num col-book">
                          <Link className="link-arrow" href={`/programare/?serviciu=${s.id}`} aria-label={`Programează: ${s.name}`}>
                            Alege
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                ))}
              </table>
            </div>
          </Reveal>
        ))}
      </div>

      <CtaBand
        title={
          <>
            Ai ales? <em>Rezervă-ți ora</em>
          </>
        }
        text="Poți combina mai multe servicii; calculăm automat durata totală și prețul."
      />
    </>
  );
}
