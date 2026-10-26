"use client";

/**
 * Fluxul de programare în pași. Toată logica de disponibilitate vine din
 * lib/availability.ts; salvarea trece prin adaptorul din lib/booking.
 */
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Calendar } from "@/components/booking/Calendar";
import { CheckIcon, PhoneIcon, ToolIcon, UsersIcon } from "@/components/icons";
import { Portrait } from "@/components/illustrations/Portrait";
import { schedule, site } from "@/config/site";
import { categories, formatDuration, formatPrice, getService, servicesByCategory, totals } from "@/data/services";
import { getStaff, staffForServices } from "@/data/staff";
import {
  addDays,
  availableSlots,
  bookingWindow,
  chooseStaff,
  datesWithAvailability,
  formatHM,
  wallClock,
  type ExistingBooking,
  type ISODate,
  type Slot,
} from "@/lib/availability";
import { getBookingAdapter, SlotTakenError, type StoredBooking } from "@/lib/booking";
import { formatLongDate } from "@/lib/format";
import { formatRoPhone, validateName, validatePhone } from "@/lib/validation";

type Step = 1 | 2 | 3 | 4 | 5;
const STEPS = ["Servicii", "Specialist", "Data și ora", "Datele tale"] as const;
const ANY = "oricine";

interface FormErrors {
  name?: string;
  phone?: string;
  consent?: string;
}

export function BookingApp() {
  const params = useSearchParams();
  const adapter = useMemo(() => getBookingAdapter(), []);

  const [step, setStep] = useState<Step>(1);
  const [serviceIds, setServiceIds] = useState<string[]>(() => {
    const id = params.get("serviciu");
    return id && getService(id) ? [id] : [];
  });
  const [staffChoice, setStaffChoice] = useState<string>(() => {
    const id = params.get("specialist");
    return id && getStaff(id) ? id : ANY;
  });
  const [date, setDate] = useState<ISODate | null>(null);
  const [slot, setSlot] = useState<Slot | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [stepError, setStepError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [now, setNow] = useState<Date | null>(null);
  const [taken, setTaken] = useState<ExistingBooking[]>([]);
  const [mine, setMine] = useState<StoredBooking[]>([]);
  const [confirmed, setConfirmed] = useState<StoredBooking | null>(null);
  const [cancelAsk, setCancelAsk] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [announce, setAnnounce] = useState("");

  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  /** Citește orele ocupate și programările proprii din adaptor. */
  const load = useCallback(async () => {
    const current = new Date();
    const today = wallClock(current, schedule.timeZone).date;
    const [list, own] = await Promise.all([
      adapter.listTaken(today, addDays(today, schedule.horizonDays - 1)),
      adapter.listMine(),
    ]);
    return { current, list, own };
  }, [adapter]);

  const apply = (d: { current: Date; list: ExistingBooking[]; own: StoredBooking[] }) => {
    setNow(d.current);
    setTaken(d.list);
    setMine(d.own);
  };

  const refresh = async () => apply(await load());

  useEffect(() => {
    let alive = true;
    load().then((d) => {
      if (!alive) return;
      setNow(d.current);
      setTaken(d.list);
      setMine(d.own);
    });
    return () => {
      alive = false;
    };
  }, [load]);

  // La schimbarea pasului, focusul merge pe titlul noului pas (util pentru cititoare de ecran).
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step, cancelled]);

  const sum = totals(serviceIds);
  const capable = useMemo(() => staffForServices(serviceIds), [serviceIds]);
  const chosenStaff = useMemo(
    () => (staffChoice === ANY ? capable : capable.filter((m) => m.id === staffChoice)),
    [capable, staffChoice],
  );
  const today = now ? wallClock(now, schedule.timeZone).date : null;
  const days = useMemo(() => (now ? bookingWindow(schedule, now) : []), [now]);

  const availableDates = useMemo(() => {
    if (!now || sum.durationMin === 0 || chosenStaff.length === 0) return new Set<ISODate>();
    return datesWithAvailability(schedule, { durationMin: sum.durationMin, staff: chosenStaff, bookings: taken, now });
  }, [now, sum.durationMin, chosenStaff, taken]);

  const slots = useMemo(() => {
    if (!now || !date) return [];
    return availableSlots(schedule, { date, durationMin: sum.durationMin, staff: chosenStaff, bookings: taken, now });
  }, [now, date, sum.durationMin, chosenStaff, taken]);

  const upcomingMine = today ? mine.filter((b) => b.date >= today) : [];

  // ——— Navigare între pași ———

  const goTo = (next: Step) => {
    setStepError(null);
    setStep(next);
  };

  const next = () => {
    if (step === 1) {
      if (serviceIds.length === 0) return setStepError("Alege cel puțin un serviciu.");
      if (capable.length === 0) {
        return setStepError("Nu avem un singur specialist care să facă toate aceste servicii în aceeași programare. Fă două programări separate.");
      }
      if (staffChoice !== ANY && !capable.some((m) => m.id === staffChoice)) setStaffChoice(ANY);
      return goTo(2);
    }
    if (step === 2) return goTo(3);
    if (step === 3) {
      if (!date || !slot) return setStepError("Alege o zi și o oră.");
      return goTo(4);
    }
  };

  const back = () => goTo((step - 1) as Step);

  const toggleService = (id: string) => {
    setServiceIds((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]));
    setDate(null);
    setSlot(null);
    setStepError(null);
  };

  const pickStaff = (id: string) => {
    setStaffChoice(id);
    setDate(null);
    setSlot(null);
  };

  const pickDate = (d: ISODate) => {
    setDate(d);
    setSlot(null);
    setStepError(null);
    setAnnounce(`${formatLongDate(d)} aleasă. Alege acum ora.`);
  };

  // ——— Trimitere ———

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const n = validateName(name);
    const p = validatePhone(phone);
    const found: FormErrors = {
      name: n.ok ? undefined : n.error,
      phone: p.ok ? undefined : p.error,
      consent: consent ? undefined : "Bifează acordul ca să putem salva programarea.",
    };
    setErrors(found);
    const firstInvalid = (["name", "phone", "consent"] as const).find((k) => found[k]);
    if (firstInvalid) {
      document.getElementById(`camp-${firstInvalid}`)?.focus();
      return;
    }
    if (!slot || !date || !n.ok || !p.ok) return;

    const staffId = staffChoice === ANY ? chooseStaff(slot, date, taken) : staffChoice;
    if (!staffId) return;
    setBusy(true);
    try {
      const saved = await adapter.create({
        serviceIds,
        staffId,
        staffChoice,
        date,
        start: slot.start,
        durationMin: sum.durationMin,
        priceLei: sum.priceLei,
        name: n.value,
        phone: p.value,
        note: note.trim() || undefined,
      });
      setConfirmed(saved);
      setCancelAsk(false);
      setCancelled(false);
      await refresh();
      goTo(5);
    } catch (err) {
      if (err instanceof SlotTakenError) {
        await refresh();
        setSlot(null);
        setStep(3);
        setStepError(err.message);
      } else {
        setStepError("Nu am putut salva programarea. Te rugăm să ne suni.");
      }
    } finally {
      setBusy(false);
    }
  };

  const cancelBooking = async (id: string) => {
    await adapter.cancel(id);
    await refresh();
    if (confirmed?.id === id) {
      setCancelled(true);
      setCancelAsk(false);
    }
    setAnnounce("Programarea a fost anulată.");
  };

  const restart = () => {
    setServiceIds([]);
    setStaffChoice(ANY);
    setDate(null);
    setSlot(null);
    setName("");
    setPhone("");
    setNote("");
    setConsent(false);
    setErrors({});
    setConfirmed(null);
    setCancelled(false);
    goTo(1);
  };

  // ——— Afișare ———

  if (step === 5 && confirmed) {
    return (
      <Confirmation
        booking={confirmed}
        cancelled={cancelled}
        cancelAsk={cancelAsk}
        headingRef={headingRef}
        onAskCancel={() => setCancelAsk(true)}
        onKeep={() => setCancelAsk(false)}
        onCancel={() => cancelBooking(confirmed.id)}
        onRestart={restart}
        announce={announce}
      />
    );
  }

  return (
    <div className="booking">
      <div>
        <ol className="stepper" aria-label="Pașii programării">
          {STEPS.map((label, i) => (
            <li
              key={label}
              aria-current={step === i + 1 ? "step" : undefined}
              data-state={step > i + 1 ? "done" : undefined}
            >
              {label}
            </li>
          ))}
        </ol>

        <div className="panel panel--enter" key={step}>
          {stepError && (
            <p className="alert alert--error" role="alert">
              {stepError}
            </p>
          )}

          {step === 1 && (
            <>
              <h2 ref={headingRef} tabIndex={-1}>
                Ce îți facem?
              </h2>
              <p className="muted">Poți alege mai multe servicii; durata și prețul se adună automat.</p>
              {categories.map((c) => (
                <fieldset className="pick-group" key={c.id}>
                  <legend>
                    <ToolIcon name={c.icon} size={26} /> {c.label}
                  </legend>
                  <ul className="pick-list">
                    {servicesByCategory(c.id).map((s) => (
                      <li key={s.id}>
                        <label className="pick">
                          <input
                            type="checkbox"
                            checked={serviceIds.includes(s.id)}
                            onChange={() => toggleService(s.id)}
                          />
                          <span className="pick__name">{s.name}</span>
                          <span className="pick__meta">
                            {formatDuration(s.durationMin)}
                          </span>
                          <span className="pick__price">{formatPrice(s)}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </fieldset>
              ))}
            </>
          )}

          {step === 2 && (
            <>
              <h2 ref={headingRef} tabIndex={-1}>
                La cine vrei să vii?
              </h2>
              <p className="muted">Îți arătăm doar specialiștii care fac toate serviciile alese.</p>
              <fieldset className="pick-group">
                <legend className="visually-hidden">Specialist</legend>
                <ul className="pick-list">
                  <li>
                    <label className="pick pick--staff">
                      <input type="radio" name="specialist" checked={staffChoice === ANY} onChange={() => pickStaff(ANY)} />
                      <span className="pick__any" aria-hidden="true">
                        <UsersIcon />
                      </span>
                      <span className="pick__name">Oricine e liber</span>
                      <span className="pick__meta">Cele mai multe ore disponibile</span>
                    </label>
                  </li>
                  {capable.map((m) => (
                    <li key={m.id}>
                      <label className="pick pick--staff">
                        <input
                          type="radio"
                          name="specialist"
                          checked={staffChoice === m.id}
                          onChange={() => pickStaff(m.id)}
                        />
                        <Portrait spec={m.portrait} />
                        <span className="pick__name">{m.name}</span>
                        <span className="pick__meta">{m.role}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </fieldset>
            </>
          )}

          {step === 3 && (
            <>
              <h2 ref={headingRef} tabIndex={-1}>
                Când îți convine?
              </h2>
              {!now || !today ? (
                <p className="muted">Se încarcă orele libere…</p>
              ) : (
                <div className="date-time">
                  <Calendar days={days} available={availableDates} selected={date} today={today} onSelect={pickDate} />
                  <div>
                    <h3 id="ore-titlu">{date ? `Ore libere ${formatLongDate(date, false)}` : "Ore libere"}</h3>
                    {!date ? (
                      <p className="muted">Alege mai întâi o zi din calendar.</p>
                    ) : slots.length === 0 ? (
                      <p className="muted">Nu mai sunt ore libere în această zi. Încearcă altă zi.</p>
                    ) : (
                      <SlotPicker slots={slots} selected={slot} onSelect={setSlot} />
                    )}
                    <p className="muted" style={{ fontSize: "0.9rem", marginTop: "1rem" }}>
                      Durata programării: {formatDuration(sum.durationMin)}. Orele țin cont de pauza de prânz și de timpul de
                      pregătire dintre clienți.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {step === 4 && (
            <form noValidate onSubmit={submit} id="formular-programare">
              <h2 ref={headingRef} tabIndex={-1}>
                Ultimul pas: datele tale
              </h2>
              <div className="field">
                <label htmlFor="camp-name">Nume și prenume</label>
                <input
                  id="camp-name"
                  className="input"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "eroare-name" : undefined}
                  maxLength={80}
                />
                {errors.name && (
                  <p className="field-error" id="eroare-name">
                    {errors.name}
                  </p>
                )}
              </div>
              <div className="field">
                <label htmlFor="camp-phone">Telefon</label>
                <span className="hint" id="hint-phone">
                  Te sunăm doar dacă trebuie să schimbăm ceva. Ex.: 0722 123 456
                </span>
                <input
                  id="camp-phone"
                  className="input"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? "hint-phone eroare-phone" : "hint-phone"}
                  maxLength={20}
                />
                {errors.phone && (
                  <p className="field-error" id="eroare-phone">
                    {errors.phone}
                  </p>
                )}
              </div>
              <div className="field">
                <label htmlFor="camp-note">Mesaj (opțional)</label>
                <textarea
                  id="camp-note"
                  className="input"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  maxLength={300}
                  placeholder="Ex.: vreau să păstrez lungimea, am o poză de inspirație"
                />
              </div>
              <div className="field">
                <label className="checkbox" htmlFor="camp-consent">
                  <input
                    id="camp-consent"
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    aria-invalid={Boolean(errors.consent)}
                    aria-describedby={errors.consent ? "eroare-consent" : undefined}
                  />
                  <span>
                    Sunt de acord ca numele și telefonul să fie folosite doar pentru această programare (vezi{" "}
                    <Link href="/confidentialitate/">politica de confidențialitate</Link>).
                  </span>
                </label>
                {errors.consent && (
                  <p className="field-error" id="eroare-consent">
                    {errors.consent}
                  </p>
                )}
              </div>
            </form>
          )}

          <div className="step-actions">
            {step > 1 ? (
              <button type="button" className="btn btn--ghost" onClick={back}>
                Înapoi
              </button>
            ) : (
              <span />
            )}
            {step < 4 ? (
              <button type="button" className="btn btn--primary" onClick={next}>
                Continuă
              </button>
            ) : (
              <button type="submit" form="formular-programare" className="btn btn--primary" disabled={busy}>
                {busy ? "Se salvează…" : "Confirmă programarea"}
              </button>
            )}
          </div>
        </div>

        {step === 1 && upcomingMine.length > 0 && (
          <section className="my-bookings" aria-labelledby="ale-tale">
            <h2 id="ale-tale">Programările tale</h2>
            <ul>
              {upcomingMine.map((b) => (
                <li className="my-booking" key={b.id}>
                  <span>
                    <strong>{formatLongDate(b.date, false)}</strong>, ora {formatHM(b.start)} ·{" "}
                    {b.serviceIds.map((id) => getService(id)?.name).join(", ")} · {getStaff(b.staffId)?.name}
                  </span>
                  <button type="button" className="btn btn--sm" onClick={() => cancelBooking(b.id)}>
                    Anulează programarea
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <aside className="summary" aria-labelledby="rezumat">
        <h2 id="rezumat">Rezumat</h2>
        {serviceIds.length === 0 ? (
          <p className="muted">Niciun serviciu ales încă.</p>
        ) : (
          <ul className="summary__services">
            {serviceIds.map((id) => {
              const s = getService(id);
              return s ? (
                <li key={id}>
                  {s.name} — {formatPrice(s)}
                </li>
              ) : null;
            })}
          </ul>
        )}
        <dl>
          <dt>Durată</dt>
          <dd data-testid="total-durata">{sum.durationMin ? formatDuration(sum.durationMin) : "—"}</dd>
          <dt>Specialist</dt>
          <dd>{staffChoice === ANY ? "Oricine e liber" : getStaff(staffChoice)?.name}</dd>
          <dt>Când</dt>
          <dd>{date ? `${formatLongDate(date, false)}${slot ? `, ${formatHM(slot.start)}` : ""}` : "—"}</dd>
          <dt>Total</dt>
          <dd className="summary__total" data-testid="total-pret">
            {sum.hasFromPrice ? "de la " : ""}
            {sum.priceLei} lei
          </dd>
        </dl>
        <p className="summary__note">Plata se face la salon, cu cardul sau numerar.</p>
      </aside>

      <p className="visually-hidden" aria-live="polite">
        {announce}
      </p>
    </div>
  );
}

/** Orele libere: grup de butoane radio, navigabil cu săgețile. */
function SlotPicker({ slots, selected, onSelect }: { slots: Slot[]; selected: Slot | null; onSelect: (s: Slot) => void }) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const activeIndex = Math.max(
    0,
    slots.findIndex((s) => s.start === selected?.start),
  );

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    const delta = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    let target: number | undefined;
    if (delta) target = (i + delta + slots.length) % slots.length;
    if (e.key === "Home") target = 0;
    if (e.key === "End") target = slots.length - 1;
    if (target === undefined) return;
    e.preventDefault();
    onSelect(slots[target]);
    refs.current[target]?.focus();
  };

  return (
    <div className="slots" role="radiogroup" aria-labelledby="ore-titlu">
      {slots.map((s, i) => (
        <button
          key={s.start}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="button"
          role="radio"
          className="slot"
          aria-checked={selected?.start === s.start}
          tabIndex={i === activeIndex ? 0 : -1}
          onClick={() => onSelect(s)}
          onKeyDown={(e) => onKeyDown(e, i)}
        >
          {formatHM(s.start)}
        </button>
      ))}
    </div>
  );
}

function Confirmation({
  booking,
  cancelled,
  cancelAsk,
  headingRef,
  onAskCancel,
  onKeep,
  onCancel,
  onRestart,
  announce,
}: {
  booking: StoredBooking;
  cancelled: boolean;
  cancelAsk: boolean;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  onAskCancel: () => void;
  onKeep: () => void;
  onCancel: () => void;
  onRestart: () => void;
  announce: string;
}) {
  const staffName = getStaff(booking.staffId)?.name ?? "";
  const confirmRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (cancelAsk) confirmRef.current?.focus();
  }, [cancelAsk]);
  if (cancelled) {
    return (
      <div className="panel confirm panel--enter">
        <h2 ref={headingRef} tabIndex={-1}>
          Programarea a fost anulată
        </h2>
        <p className="muted">Ora a fost eliberată. Te așteptăm altă dată!</p>
        <div className="confirm__actions">
          <button type="button" className="btn btn--primary" onClick={onRestart}>
            Fă o programare nouă
          </button>
          <Link className="btn" href="/">
            Înapoi acasă
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="panel confirm panel--enter">
      <div className="confirm__badge" aria-hidden="true">
        <CheckIcon size={40} />
      </div>
      <h2 ref={headingRef} tabIndex={-1}>
        Programarea e înregistrată
      </h2>
      <p className="muted">
        Am salvat programarea pe acest dispozitiv. Nu trimitem SMS sau e-mail de confirmare, așa că notează-ți detaliile. Dacă
        trebuie să schimbăm ceva, te sunăm noi la {formatRoPhone(booking.phone)}.
      </p>
      <dl className="confirm__details">
        <dt>Când</dt>
        <dd>
          {formatLongDate(booking.date)}, ora {formatHM(booking.start)}
        </dd>
        <dt>Servicii</dt>
        <dd>{booking.serviceIds.map((id) => getService(id)?.name).join(", ")}</dd>
        <dt>Specialist</dt>
        <dd>{staffName}</dd>
        <dt>Durată</dt>
        <dd>
          {formatDuration(booking.durationMin)} (până la {formatHM(booking.end)})
        </dd>
        <dt>Preț estimat</dt>
        <dd>{booking.priceLei} lei</dd>
        <dt>Nume</dt>
        <dd>{booking.name}</dd>
      </dl>
      {cancelAsk ? (
        <div className="alert alert--info" role="group" aria-labelledby="intrebare-anulare">
          <p id="intrebare-anulare" style={{ fontWeight: 700 }}>
            Sigur vrei să anulezi programarea?
          </p>
          <div className="confirm__actions">
            <button ref={confirmRef} type="button" className="btn btn--primary" onClick={onCancel}>
              Da, anulează
            </button>
            <button type="button" className="btn" onClick={onKeep}>
              Nu, o păstrez
            </button>
          </div>
        </div>
      ) : (
        <div className="confirm__actions">
          <button type="button" className="btn" onClick={onAskCancel}>
            Anulează programarea
          </button>
          <a className="btn btn--ghost" href={`tel:${site.phoneHref}`}>
            <PhoneIcon /> Sună-ne
          </a>
          <Link className="btn btn--primary" href="/">
            Înapoi acasă
          </Link>
        </div>
      )}
      <p className="visually-hidden" aria-live="polite">
        {announce}
      </p>
    </div>
  );
}
