"use client";

/**
 * Calendar accesibil, fără biblioteci externe (modelul „grid” din WAI-ARIA APG).
 * Tastatură: săgeți = zi/săptămână, Home/End = început/sfârșit de săptămână,
 * PageUp/PageDown = luna anterioară/următoare, Enter/Spațiu = alege ziua.
 * Zilele închise rămân focusabile (ca să poți naviga peste ele), dar nu pot fi alese.
 */
import { useEffect, useId, useRef, useState } from "react";
import { ChevronIcon } from "@/components/icons";
import { addDays, weekdayOf, type DayStatus, type ISODate } from "@/lib/availability";
import { formatLongDate, monthName } from "@/lib/format";

const WEEK_HEAD = [
  ["L", "luni"],
  ["Ma", "marți"],
  ["Mi", "miercuri"],
  ["J", "joi"],
  ["V", "vineri"],
  ["S", "sâmbătă"],
  ["D", "duminică"],
] as const;

/** Poziția în săptămână cu luni = 0. */
const mondayIndex = (iso: ISODate) => (weekdayOf(iso) + 6) % 7;

function daysInMonth(year: number, month1: number) {
  return new Date(Date.UTC(year, month1, 0)).getUTCDate();
}

function addMonths(iso: ISODate, delta: number): ISODate {
  const [y, m, d] = iso.split("-").map(Number);
  const total = y * 12 + (m - 1) + delta;
  const ny = Math.floor(total / 12);
  const nm = (total % 12) + 1;
  const nd = Math.min(d, daysInMonth(ny, nm));
  return `${ny}-${String(nm).padStart(2, "0")}-${String(nd).padStart(2, "0")}`;
}

function describe(day: DayStatus | undefined, available: boolean): string {
  if (!day) return "în afara perioadei de programare";
  if (day.reason === "sarbatoare") return `închis, ${day.holidayName}`;
  if (day.reason === "inchis") return "închis";
  return available ? "are ore libere" : "nicio oră liberă";
}

export function Calendar({
  days,
  available,
  selected,
  today,
  onSelect,
}: {
  days: DayStatus[];
  available: ReadonlySet<ISODate>;
  selected: ISODate | null;
  today: ISODate;
  onSelect: (date: ISODate) => void;
}) {
  const first = days[0].date;
  const last = days[days.length - 1].date;
  const byDate = new Map(days.map((d) => [d.date, d]));
  const titleId = useId();

  const [focused, setFocused] = useState<ISODate>(() => selected ?? days.find((d) => available.has(d.date))?.date ?? first);
  const buttons = useRef(new Map<ISODate, HTMLButtonElement>());
  const moveFocus = useRef(false);

  useEffect(() => {
    if (moveFocus.current) {
      buttons.current.get(focused)?.focus();
      moveFocus.current = false;
    }
  }, [focused]);

  const clamp = (d: ISODate) => (d < first ? first : d > last ? last : d);
  const go = (d: ISODate) => {
    moveFocus.current = true;
    setFocused(clamp(d));
  };

  const onKeyDown = (e: React.KeyboardEvent, date: ISODate) => {
    const keys: Record<string, () => ISODate> = {
      ArrowLeft: () => addDays(date, -1),
      ArrowRight: () => addDays(date, 1),
      ArrowUp: () => addDays(date, -7),
      ArrowDown: () => addDays(date, 7),
      Home: () => addDays(date, -mondayIndex(date)),
      End: () => addDays(date, 6 - mondayIndex(date)),
      PageUp: () => addMonths(date, -1),
      PageDown: () => addMonths(date, 1),
    };
    const fn = keys[e.key];
    if (fn) {
      e.preventDefault();
      go(fn());
    }
  };

  const [year, month] = focused.split("-").map(Number);
  const monthStart = `${year}-${String(month).padStart(2, "0")}-01`;
  const offset = mondayIndex(monthStart);
  const count = daysInMonth(year, month);
  const cells: (ISODate | null)[] = [
    ...Array.from({ length: offset }, () => null),
    ...Array.from({ length: count }, (_, i) => addDays(monthStart, i)),
  ];
  while (cells.length % 7) cells.push(null);
  const weeks = Array.from({ length: cells.length / 7 }, (_, i) => cells.slice(i * 7, i * 7 + 7));

  const prevMonth = addMonths(monthStart, -1);
  const nextMonthStart = addMonths(monthStart, 1);
  const canPrev = monthStart > first;
  const canNext = nextMonthStart <= last;

  return (
    <div className="calendar">
      <div className="calendar__head">
        <button
          type="button"
          className="icon-btn"
          onClick={() => canPrev && setFocused(clamp(prevMonth))}
          disabled={!canPrev}
          aria-label="Luna anterioară"
        >
          <ChevronIcon dir="left" />
        </button>
        <h3 className="calendar__title" id={titleId} aria-live="polite">
          {monthName(month - 1)} {year}
        </h3>
        <button
          type="button"
          className="icon-btn"
          onClick={() => canNext && setFocused(clamp(nextMonthStart))}
          disabled={!canNext}
          aria-label="Luna următoare"
        >
          <ChevronIcon dir="right" />
        </button>
      </div>
      <table role="grid" aria-labelledby={titleId}>
        <thead>
          <tr>
            {WEEK_HEAD.map(([short, long]) => (
              <th key={short} scope="col" abbr={long}>
                {short}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, wi) => (
            <tr key={wi}>
              {week.map((date, di) => {
                if (!date) return <td key={di} />;
                const inWindow = date >= first && date <= last;
                const day = byDate.get(date);
                const isAvailable = inWindow && available.has(date);
                const isSelected = date === selected;
                return (
                  <td key={date} role="gridcell" aria-selected={isSelected}>
                    <button
                      ref={(el) => {
                        if (el) buttons.current.set(date, el);
                        else buttons.current.delete(date);
                      }}
                      type="button"
                      className="day"
                      tabIndex={date === focused ? 0 : -1}
                      aria-disabled={!isAvailable}
                      aria-label={`${formatLongDate(date)}, ${describe(day, isAvailable)}`}
                      data-available={isAvailable}
                      data-selected={isSelected}
                      data-today={date === today}
                      data-date={date}
                      onClick={() => {
                        setFocused(date);
                        if (isAvailable) onSelect(date);
                      }}
                      onKeyDown={(e) => onKeyDown(e, date)}
                    >
                      {Number(date.slice(8))}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <ul className="calendar__legend" aria-hidden="true">
        <li>● azi</li>
        <li>
          <s>12</s> închis sau plin
        </li>
      </ul>
      <p className="calendar__help">Folosește săgețile pentru zile, PageUp/PageDown pentru luni, Enter pentru a alege.</p>
    </div>
  );
}
