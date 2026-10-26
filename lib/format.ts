/** Formatări de afișare în limba română (fără dependențe). */
import type { TimeRange } from "@/config/site";
import { weekdayOf, type ISODate } from "@/lib/availability";

const MONTHS = [
  "ianuarie",
  "februarie",
  "martie",
  "aprilie",
  "mai",
  "iunie",
  "iulie",
  "august",
  "septembrie",
  "octombrie",
  "noiembrie",
  "decembrie",
];
const WEEKDAYS_LONG = ["duminică", "luni", "marți", "miercuri", "joi", "vineri", "sâmbătă"];

export function monthName(monthIndex: number): string {
  return MONTHS[monthIndex];
}

/** „2026-11-04” → „miercuri, 4 noiembrie 2026”. */
export function formatLongDate(iso: ISODate, withYear = true): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${WEEKDAYS_LONG[weekdayOf(iso)]}, ${d} ${MONTHS[m - 1]}${withYear ? ` ${y}` : ""}`;
}

export function hoursLabel(range: TimeRange | null): string {
  return range ? `${range.start}–${range.end}` : "Închis";
}
