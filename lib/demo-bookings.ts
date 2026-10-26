/**
 * Programări „existente” pentru demonstrație, ca agenda să nu fie goală.
 * Sunt generate determinist din dată și specialist (aceeași zi → aceleași
 * programări la fiecare încărcare), fără Math.random și fără ceas.
 * Când conectezi un backend real, nu mai folosi acest fișier.
 */
import type { ScheduleConfig } from "@/config/site";
import {
  addDays,
  dayStatus,
  isValidISODate,
  parseHM,
  conflictsWithBooking,
  weekdayOf,
  overlaps,
  type ExistingBooking,
  type ISODate,
  type StaffSchedule,
} from "@/lib/availability";

/** Hash simplu și stabil (FNV-1a) → număr pe 32 de biți. */
function hash(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Generator pseudo-aleator determinist (mulberry32). */
function rng(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const DURATIONS = [30, 40, 45, 60, 75, 90];

/** Programările demo pentru `days` zile începând cu `from`. */
export function demoBookings(
  config: ScheduleConfig,
  staff: readonly StaffSchedule[],
  from: ISODate,
  days: number,
): ExistingBooking[] {
  if (!isValidISODate(from)) return [];
  const result: ExistingBooking[] = [];
  for (let i = 0; i < days; i++) {
    const date = addDays(from, i);
    if (!dayStatus(config, date).open) continue;
    const hours = config.weekly[weekdayOf(date)]!;
    const open = parseHM(hours.start);
    const close = parseHM(hours.end);
    const lunch = config.lunchBreak ? [parseHM(config.lunchBreak.start), parseHM(config.lunchBreak.end)] : null;

    for (const member of staff) {
      if (!member.workDays.includes(weekdayOf(date))) continue;
      const rand = rng(hash(`${date}|${member.id}`));
      const count = 2 + Math.floor(rand() * 3); // 2–4 programări pe zi
      const own: ExistingBooking[] = [];
      for (let tries = 0; own.length < count && tries < 20; tries++) {
        const duration = DURATIONS[Math.floor(rand() * DURATIONS.length)];
        const steps = Math.floor((close - duration - open) / config.slotStepMin);
        if (steps < 0) break;
        const start = open + Math.floor(rand() * (steps + 1)) * config.slotStepMin;
        const end = start + duration;
        if (lunch && overlaps(start, end, lunch[0], lunch[1])) continue;
        if (own.some((b) => conflictsWithBooking(start, end, b, config.bufferMin))) continue;
        own.push({ staffId: member.id, date, start, end });
      }
      result.push(...own.sort((a, b) => a.start - b.start));
    }
  }
  return result;
}
