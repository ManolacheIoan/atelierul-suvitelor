import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/CtaBand";
import { CheckIcon } from "@/components/icons";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { StaffMedia } from "@/components/StaffMedia";
import { WEEK_ORDER, WEEKDAY_NAMES } from "@/config/site";
import { categories, servicesByCategory } from "@/data/services";
import { staff, type StaffMember } from "@/data/staff";

export const metadata: Metadata = {
  title: "Echipa",
  description: "Stiliști, coloriști și barberi: cine sunt, ce îi pasionează și ce servicii face fiecare.",
};

function workDaysLabel(m: StaffMember) {
  return WEEK_ORDER.filter((d) => m.workDays.includes(d))
    .map((d) => WEEKDAY_NAMES[d].toLowerCase())
    .join(", ");
}

export default function TeamPage() {
  return (
    <>
      <PageHero
        eyebrow="Echipa"
        title={
          <>
            Mâini sigure, <em>ochi atenți</em>
          </>
        }
        intro="Fiecare are specialitatea lui. La programare poți alege pe cineva anume sau „oricine e liber”."
        icon="mirror"
      />

      <section className="container" aria-label="Membrii echipei">
        <ul className="member-grid">
          {staff.map((m, i) => (
            <Reveal as="li" key={m.id} delay={(i % 2) * 90}>
              <article className="member" aria-labelledby={`m-${m.id}`}>
                <div className="member__media">
                  <StaffMedia member={m} />
                </div>
                <div>
                  <h2 id={`m-${m.id}`}>{m.name}</h2>
                  <p className="member__role">{m.role}</p>
                  <p className="member__bio">{m.bio}</p>
                  <h3>Specialități</h3>
                  <ul className="chips">
                    {m.specialties.map((s) => (
                      <li key={s} className="chip chip--accent">
                        {s}
                      </li>
                    ))}
                  </ul>
                  <p className="member__days">
                    <strong>Lucrează:</strong> {workDaysLabel(m)}
                  </p>
                  <Link className="btn btn--sm" href={`/programare/?specialist=${m.id}`}>
                    Programează-te la {m.name.split(" ")[0]}
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="section" aria-labelledby="cine-ce-face">
        <div className="container">
          <div className="section__head">
            <p className="eyebrow">Pe scurt</p>
            <h2 id="cine-ce-face">Cine ce face</h2>
            <p className="lead">Tabelul se poate derula orizontal pe telefon.</p>
          </div>
          <div className="matrix-wrap" tabIndex={0} role="region" aria-labelledby="cine-ce-face">
            <table className="matrix">
              <thead>
                <tr>
                  <th scope="col">Serviciu</th>
                  {staff.map((m) => (
                    <th scope="col" key={m.id}>
                      {m.name.split(" ")[0]}
                    </th>
                  ))}
                </tr>
              </thead>
              {categories.map((c) => (
                <tbody key={c.id}>
                  <tr>
                    <th scope="colgroup" colSpan={staff.length + 1} className="muted" style={{ textAlign: "left" }}>
                      {c.label}
                    </th>
                  </tr>
                  {servicesByCategory(c.id).map((s) => (
                    <tr key={s.id}>
                      <th scope="row">{s.name}</th>
                      {staff.map((m) => (
                        <td key={m.id}>
                          {m.serviceIds.includes(s.id) ? (
                            <span className="yes">
                              <CheckIcon size={20} className="inline-check" />
                              <span className="visually-hidden">da</span>
                            </span>
                          ) : (
                            <span className="no">
                              <span aria-hidden="true">–</span>
                              <span className="visually-hidden">nu</span>
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
