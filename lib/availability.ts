/**
 * Calculul disponibilității pentru programări. Modul PUR: nu citește ceasul,
 * nu citește localStorage și nu atinge DOM-ul; primește totul ca parametri.
 *
 * Convenții:
 * - O zi e un șir „AAAA-LL-ZZ” (ISODate), interpretat în fusul orar al salonului.
 * - O oră din zi e numărul de minute de la miezul nopții (ex. 09:30 → 570).
 *   Lucrând cu „ora de pe ceasul din salon” (nu cu timestamp-uri), schimbarea
 *   orei de vară/iarnă nu mută și nu dublează sloturile.
 * - Intervalele sunt semi-deschise: [start, end).
 */
import type { ScheduleConfig, Weekday } from "@/config/site";

export type ISODate = string;

/** O programare existentă (din demo sau salvată de client). */
export interface ExistingBooking {
  staffId: string;
  date: ISODate;
  /** Minute de la miezul nopții. */
  start: number;
  end: number;
}

/** Ce trebuie să știe calculul despre un specialist. */
export interface StaffSchedule {
  id: string;
  workDays: readonly Weekday[];
  /** Zile libere individuale (concediu). */
  daysOff?: readonly ISODate[];
}

/** Data și ora „de pe ceasul din salon” pentru un moment dat. */
export interface WallClock {
  date: ISODate;
  minutes: number;
}

export type ClosedReason = "inchis" | "sarbatoare";

export interface DayStatus {
  date: ISODate;
  open: boolean;
  reason?: ClosedReason;
  holidayName?: string;
}

export interface Slot {
  start: number;
  end: number;
  /** Specialiștii liberi la această oră (în ordinea din listă). */
  staffIds: string[];
}

// ——— Ore și date ———

/** „09:30” → 570. Aruncă eroare pentru format invalid. */
export function parseHM(hm: string): number {
  const m = /^(\d{1,2}):(\d{2})$/.exec(hm);
  if (!m) throw new Error(`Oră invalidă: ${hm}`);
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 24 || min > 59 || (h === 24 && min > 0)) throw new Error(`Oră invalidă: ${hm}`);
  return h * 60 + min;
}

/** 570 → „09:30”. */
export function formatHM(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

const ISO_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

function toUTCDate(iso: ISODate): Date {
  const m = ISO_RE.exec(iso);
  if (!m) throw new Error(`Dată invalidă: ${iso}`);
  return new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
}

function fromUTCDate(d: Date): ISODate {
  return d.toISOString().slice(0, 10);
}

export function isValidISODate(iso: string): boolean {
  if (!ISO_RE.test(iso)) return false;
  return fromUTCDate(toUTCDate(iso)) === iso;
}

/**
 * Adună zile calendaristice. Calculul se face în UTC (fără ore de vară),
 * deci o zi are mereu exact o zi, chiar și peste schimbarea orei.
 */
export function addDays(iso: ISODate, days: number): ISODate {
  const d = toUTCDate(iso);
  d.setUTCDate(d.getUTCDate() + days);
  return fromUTCDate(d);
}

export function weekdayOf(iso: ISODate): Weekday {
  return toUTCDate(iso).getUTCDay() as Weekday;
}

/** Data și ora locală a salonului pentru momentul `now`. */
export function wallClock(now: Date, timeZone: string): WallClock {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? "00";
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

// ——— Zile deschise ———

export function dayStatus(config: ScheduleConfig, date: ISODate): DayStatus {
  const holiday = config.holidays.find((h) => h.date === date);
  if (holiday) return { date, open: false, reason: "sarbatoare", holidayName: holiday.name };
  if (!config.weekly[weekdayOf(date)]) return { date, open: false, reason: "inchis" };
  return { date, open: true };
}

/** Zilele în care se poate programa: de azi, `horizonDays` zile (închise incluse, marcate). */
export function bookingWindow(config: ScheduleConfig, now: Date): DayStatus[] {
  const today = wallClock(now, config.timeZone).date;
  return Array.from({ length: config.horizonDays }, (_, i) => dayStatus(config, addDays(today, i)));
}

// ——— Suprapuneri și sloturi ———

/** Două intervale semi-deschise [aStart, aEnd) și [bStart, bEnd) se suprapun? */
export function overlaps(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
  return aStart < bEnd && bStart < aEnd;
}

/**
 * O programare nouă [start, end) intră în conflict cu una existentă dacă se
 * suprapun sau dacă între ele rămân mai puțin de `bufferMin` minute.
 */
export function conflictsWithBooking(start: number, end: number, booking: ExistingBooking, bufferMin: number): boolean {
  return overlaps(start - bufferMin, end + bufferMin, booking.start, booking.end);
}

export interface StaffSlotQuery {
  date: ISODate;
  durationMin: number;
  staff: StaffSchedule;
  bookings: readonly ExistingBooking[];
  now: Date;
}

/** Orele de început libere pentru un specialist, într-o zi, pentru o durată dată. */
export function staffSlots(config: ScheduleConfig, q: StaffSlotQuery): number[] {
  const { date, durationMin, staff, bookings, now } = q;
  if (!Number.isFinite(durationMin) || durationMin <= 0) return [];
  if (!isValidISODate(date) || !dayStatus(config, date).open) return [];

  const weekday = weekdayOf(date);
  if (!staff.workDays.includes(weekday) || staff.daysOff?.includes(date)) return [];

  const clock = wallClock(now, config.timeZone);
  const lastDay = addDays(clock.date, config.horizonDays - 1);
  if (date < clock.date || date > lastDay) return [];

  const hours = config.weekly[weekday]!;
  const open = parseHM(hours.start);
  const close = parseHM(hours.end);
  const earliest = date === clock.date ? clock.minutes + config.minLeadMin : -Infinity;
  const lunch = config.lunchBreak ? [parseHM(config.lunchBreak.start), parseHM(config.lunchBreak.end)] : null;
  const own = bookings.filter((b) => b.staffId === staff.id && b.date === date);

  const result: number[] = [];
  for (let start = open; start + durationMin <= close; start += config.slotStepMin) {
    const end = start + durationMin;
    if (start < earliest) continue;
    if (lunch && overlaps(start, end, lunch[0], lunch[1])) continue;
    if (own.some((b) => conflictsWithBooking(start, end, b, config.bufferMin))) continue;
    result.push(start);
  }
  return result;
}

export interface SlotQuery {
  date: ISODate;
  durationMin: number;
  /** Specialiștii luați în calcul (unul singur sau toți cei potriviți, pentru „oricine”). */
  staff: readonly StaffSchedule[];
  bookings: readonly ExistingBooking[];
  now: Date;
}

/** Sloturile libere pentru o listă de specialiști, unite și sortate. */
export function availableSlots(config: ScheduleConfig, q: SlotQuery): Slot[] {
  const byStart = new Map<number, string[]>();
  for (const member of q.staff) {
    for (const start of staffSlots(config, { ...q, staff: member })) {
      const list = byStart.get(start) ?? [];
      list.push(member.id);
      byStart.set(start, list);
    }
  }
  return [...byStart.entries()]
    .sort(([a], [b]) => a - b)
    .map(([start, staffIds]) => ({ start, end: start + q.durationMin, staffIds }));
}

/**
 * Pentru „oricine”: alege specialistul liber cu cele mai puține programări în
 * acea zi (încărcare echilibrată); la egalitate, primul din listă.
 */
export function chooseStaff(slot: Slot, date: ISODate, bookings: readonly ExistingBooking[]): string | undefined {
  let best: string | undefined;
  let bestCount = Infinity;
  for (const id of slot.staffIds) {
    const count = bookings.filter((b) => b.staffId === id && b.date === date).length;
    if (count < bestCount) {
      best = id;
      bestCount = count;
    }
  }
  return best;
}

/** Zilele din fereastră în care există cel puțin un slot (pentru calendar). */
export function datesWithAvailability(config: ScheduleConfig, q: Omit<SlotQuery, "date">): Set<ISODate> {
  const result = new Set<ISODate>();
  for (const day of bookingWindow(config, q.now)) {
    if (day.open && availableSlots(config, { ...q, date: day.date }).length > 0) result.add(day.date);
  }
  return result;
}
