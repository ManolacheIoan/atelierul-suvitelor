import { describe, expect, it } from "vitest";
import { schedule as siteSchedule, type ScheduleConfig } from "@/config/site";
import { services } from "@/data/services";
import { staff as siteStaff } from "@/data/staff";
import {
  addDays,
  availableSlots,
  bookingWindow,
  chooseStaff,
  conflictsWithBooking,
  dayStatus,
  formatHM,
  isValidISODate,
  overlaps,
  parseHM,
  staffSlots,
  wallClock,
  weekdayOf,
  type ExistingBooking,
  type StaffSchedule,
} from "./availability";
import { demoBookings } from "./demo-bookings";

/** Configurație de test, independentă de datele reale ale salonului. */
const config: ScheduleConfig = {
  timeZone: "Europe/Bucharest",
  weekly: {
    0: null,
    1: { start: "09:00", end: "20:00" },
    2: { start: "09:00", end: "20:00" },
    3: { start: "09:00", end: "20:00" },
    4: { start: "09:00", end: "20:00" },
    5: { start: "09:00", end: "20:00" },
    6: { start: "09:00", end: "16:00" },
  },
  lunchBreak: { start: "13:00", end: "13:30" },
  bufferMin: 10,
  slotStepMin: 15,
  minLeadMin: 60,
  horizonDays: 30,
  holidays: [{ date: "2026-11-30", name: "Sfântul Andrei" }],
};

const ana: StaffSchedule = { id: "ana", workDays: [1, 2, 3, 4, 5, 6] };
const dan: StaffSchedule = { id: "dan", workDays: [1, 3, 5] };

const MONDAY = "2026-11-02";
const SATURDAY = "2026-11-07";
const SUNDAY = "2026-11-08";
/** Duminică, 1 noiembrie 2026, 10:00 ora României (UTC+2) — înainte de toate zilele testate. */
const NOW = new Date("2026-11-01T08:00:00Z");

const hm = (list: number[]) => list.map(formatHM);
const slots = (overrides: Partial<Parameters<typeof staffSlots>[1]> = {}, cfg = config) =>
  staffSlots(cfg, { date: MONDAY, durationMin: 60, staff: ana, bookings: [], now: NOW, ...overrides });

describe("ore și date", () => {
  it("convertește ore în minute și înapoi", () => {
    expect(parseHM("09:30")).toBe(570);
    expect(parseHM("0:00")).toBe(0);
    expect(parseHM("24:00")).toBe(1440);
    expect(formatHM(570)).toBe("09:30");
    expect(formatHM(parseHM("19:45"))).toBe("19:45");
  });

  it("respinge ore invalide", () => {
    expect(() => parseHM("9")).toThrow();
    expect(() => parseHM("25:00")).toThrow();
    expect(() => parseHM("10:75")).toThrow();
  });

  it("validează și adună date calendaristice", () => {
    expect(isValidISODate("2026-02-29")).toBe(false);
    expect(isValidISODate("2028-02-29")).toBe(true);
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
    expect(weekdayOf(MONDAY)).toBe(1);
    expect(weekdayOf(SUNDAY)).toBe(0);
  });
});

describe("suprapuneri", () => {
  it("intervalele care doar se ating nu se suprapun", () => {
    expect(overlaps(540, 600, 600, 660)).toBe(false);
    expect(overlaps(600, 660, 540, 600)).toBe(false);
  });

  it("detectează suprapuneri parțiale și incluse", () => {
    expect(overlaps(540, 610, 600, 660)).toBe(true);
    expect(overlaps(610, 620, 600, 660)).toBe(true);
    expect(overlaps(500, 700, 600, 660)).toBe(true);
  });

  it("pauza dintre programări contează ca suprapunere", () => {
    const b: ExistingBooking = { staffId: "ana", date: MONDAY, start: 600, end: 660 };
    expect(conflictsWithBooking(560, 595, b, 10)).toBe(true); // doar 5 min pauză
    expect(conflictsWithBooking(560, 590, b, 10)).toBe(false); // exact 10 min
    expect(conflictsWithBooking(670, 700, b, 10)).toBe(false);
    expect(conflictsWithBooking(665, 700, b, 10)).toBe(true);
  });
});

describe("sloturi pentru un specialist", () => {
  it("o zi liberă: de la deschidere până la închidere, fără pauza de prânz", () => {
    const result = slots();
    expect(result[0]).toBe(parseHM("09:00"));
    // Marginea zilei: ultima programare de 60 min începe la 19:00 și se termină fix la 20:00.
    expect(result.at(-1)).toBe(parseHM("19:00"));
    expect(hm(result)).not.toContain("12:15"); // ar intra în pauză (13:00–13:30)
    expect(hm(result)).toContain("12:00"); // se termină fix la 13:00
    expect(hm(result)).toContain("13:30"); // începe fix după pauză
    expect(result).toHaveLength(41 - 5);
  });

  it("durata contează: un serviciu de 3 ore încape doar înainte sau după pauză", () => {
    const result = hm(slots({ durationMin: 180 }));
    expect(result.filter((t) => t < "13:00")).toEqual(["09:00", "09:15", "09:30", "09:45", "10:00"]);
    expect(result.filter((t) => t > "13:00")[0]).toBe("13:30");
    expect(result.at(-1)).toBe("17:00");
  });

  it("serviciile mai lungi decât programul zilei nu au sloturi", () => {
    expect(slots({ durationMin: 12 * 60 })).toEqual([]);
    expect(slots({ durationMin: 0 })).toEqual([]);
  });

  it("păstrează pauza dintre programări de ambele părți", () => {
    const bookings: ExistingBooking[] = [{ staffId: "ana", date: MONDAY, start: 600, end: 660 }];
    const result = hm(slots({ durationMin: 30, bookings }));
    expect(result).toContain("09:15"); // 09:15–09:45, pauză 15 min
    expect(result).not.toContain("09:30"); // 09:30–10:00, fără pauză
    expect(result).not.toContain("10:30");
    expect(result).not.toContain("11:00"); // fix la final, fără pauză
    expect(result).toContain("11:15");
  });

  it("ignoră programările altor specialiști și din alte zile", () => {
    const bookings: ExistingBooking[] = [
      { staffId: "dan", date: MONDAY, start: 540, end: 1200 },
      { staffId: "ana", date: "2026-11-03", start: 540, end: 1200 },
    ];
    expect(slots({ bookings })).toEqual(slots());
  });

  it("sâmbăta se închide mai devreme", () => {
    const result = slots({ date: SATURDAY });
    expect(result.at(-1)).toBe(parseHM("15:00"));
  });

  it("zilele închise, sărbătorile și zilele libere ale specialistului nu au sloturi", () => {
    expect(slots({ date: SUNDAY })).toEqual([]);
    expect(dayStatus(config, SUNDAY)).toMatchObject({ open: false, reason: "inchis" });
    expect(slots({ date: "2026-11-30" })).toEqual([]);
    expect(dayStatus(config, "2026-11-30")).toMatchObject({ open: false, reason: "sarbatoare", holidayName: "Sfântul Andrei" });
    expect(slots({ date: "2026-11-03", staff: dan })).toEqual([]); // Dan nu lucrează marțea
    expect(slots({ staff: { ...ana, daysOff: [MONDAY] } })).toEqual([]);
  });

  it("nu oferă zile trecute sau dincolo de orizont", () => {
    expect(slots({ date: "2026-10-30" })).toEqual([]);
    expect(slots({ date: "2026-11-28" })).not.toEqual([]); // sâmbătă, în fereastra de 30 de zile
    expect(slots({ date: "2026-12-01" })).toEqual([]); // marți, dar a 31-a zi
  });

  it("azi: doar ore cu cel puțin o oră înainte, aliniate la pas", () => {
    const now = new Date("2026-11-02T08:07:00Z"); // 10:07 în București
    const result = hm(slots({ now }));
    expect(result[0]).toBe("11:15");
  });

  it("azi seara târziu: nimic disponibil", () => {
    const now = new Date("2026-11-02T17:30:00Z"); // 19:30 în București
    expect(slots({ now })).toEqual([]);
  });

  it("ignoră o dată invalidă", () => {
    expect(slots({ date: "2026-13-01" })).toEqual([]);
  });
});

describe("mai mulți specialiști („oricine”)", () => {
  it("unește sloturile și spune cine e liber", () => {
    const bookings: ExistingBooking[] = [{ staffId: "ana", date: MONDAY, start: 540, end: 720 }];
    const result = availableSlots(config, { date: MONDAY, durationMin: 60, staff: [ana, dan], bookings, now: NOW });
    expect(result[0]).toEqual({ start: 540, end: 600, staffIds: ["dan"] });
    const late = result.find((s) => s.start === parseHM("15:00"));
    expect(late?.staffIds).toEqual(["ana", "dan"]);
  });

  it("alege specialistul cu mai puține programări în ziua respectivă", () => {
    const bookings: ExistingBooking[] = [
      { staffId: "ana", date: MONDAY, start: 540, end: 600 },
      { staffId: "ana", date: MONDAY, start: 1000, end: 1060 },
      { staffId: "dan", date: MONDAY, start: 540, end: 600 },
    ];
    expect(chooseStaff({ start: 900, end: 960, staffIds: ["ana", "dan"] }, MONDAY, bookings)).toBe("dan");
    expect(chooseStaff({ start: 900, end: 960, staffIds: ["ana", "dan"] }, MONDAY, [])).toBe("ana");
    expect(chooseStaff({ start: 900, end: 960, staffIds: [] }, MONDAY, [])).toBeUndefined();
  });
});

describe("schimbarea orei (DST)", () => {
  const sundayOpen: ScheduleConfig = { ...config, weekly: { ...config.weekly, 0: { start: "09:00", end: "17:00" } } };
  const everyDay: StaffSchedule = { id: "ana", workDays: [0, 1, 2, 3, 4, 5, 6] };

  it("ora din salon e corectă înainte și după trecerea la ora de iarnă", () => {
    // 25 octombrie 2026, ora 04:00 (vară) devine 03:00 (iarnă).
    expect(wallClock(new Date("2026-10-25T00:30:00Z"), "Europe/Bucharest")).toEqual({ date: "2026-10-25", minutes: 210 });
    expect(wallClock(new Date("2026-10-25T01:30:00Z"), "Europe/Bucharest")).toEqual({ date: "2026-10-25", minutes: 210 });
    // După miezul nopții (UTC+2) data e deja următoarea zi.
    expect(wallClock(new Date("2026-10-25T22:30:00Z"), "Europe/Bucharest")).toEqual({ date: "2026-10-26", minutes: 30 });
    // 28 martie 2027: ora 03:00 devine 04:00 (UTC+3).
    expect(wallClock(new Date("2027-03-28T07:00:00Z"), "Europe/Bucharest")).toEqual({ date: "2027-03-28", minutes: 600 });
  });

  it("ziua schimbării orei are aceleași sloturi ca o zi obișnuită", () => {
    const before = new Date("2026-10-17T06:00:00Z");
    const normal = staffSlots(sundayOpen, { date: "2026-10-18", durationMin: 45, staff: everyDay, bookings: [], now: before });
    const dst = staffSlots(sundayOpen, { date: "2026-10-25", durationMin: 45, staff: everyDay, bookings: [], now: before });
    expect(dst).toEqual(normal);
    const spring = staffSlots(sundayOpen, {
      date: "2027-03-28",
      durationMin: 45,
      staff: everyDay,
      bookings: [],
      now: new Date("2027-03-27T06:00:00Z"),
    });
    expect(spring).toEqual(normal);
  });

  it("în ziua schimbării, avansul minim folosește ora locală corectă", () => {
    const now = new Date("2026-10-25T07:00:00Z"); // 09:00 ora de iarnă
    const result = staffSlots(sundayOpen, { date: "2026-10-25", durationMin: 30, staff: everyDay, bookings: [], now });
    expect(formatHM(result[0])).toBe("10:00");
    const spring = staffSlots(sundayOpen, {
      date: "2027-03-28",
      durationMin: 30,
      staff: everyDay,
      bookings: [],
      now: new Date("2027-03-28T06:00:00Z"), // 09:00 ora de vară
    });
    expect(formatHM(spring[0])).toBe("10:00");
  });

  it("fereastra de 30 de zile peste schimbarea orei nu sare și nu dublează zile", () => {
    const days = bookingWindow(config, new Date("2026-10-20T10:00:00Z")).map((d) => d.date);
    expect(days).toHaveLength(30);
    expect(new Set(days).size).toBe(30);
    expect(days[0]).toBe("2026-10-20");
    expect(days).toContain("2026-10-25");
    expect(days).toContain("2026-10-26");
    expect(days.at(-1)).toBe("2026-11-18");
  });
});

describe("programări demo", () => {
  const staffList: StaffSchedule[] = [ana, dan];
  const list = demoBookings(config, staffList, MONDAY, 14);

  it("sunt deterministe", () => {
    expect(demoBookings(config, staffList, MONDAY, 14)).toEqual(list);
  });

  it("nu se suprapun, respectă pauza, prânzul și programul", () => {
    for (const b of list) {
      const day = config.weekly[weekdayOf(b.date)]!;
      expect(b.start).toBeGreaterThanOrEqual(parseHM(day.start));
      expect(b.end).toBeLessThanOrEqual(parseHM(day.end));
      expect(overlaps(b.start, b.end, 780, 810)).toBe(false);
      const others = list.filter((o) => o !== b && o.staffId === b.staffId && o.date === b.date);
      for (const o of others) expect(conflictsWithBooking(b.start, b.end, o, config.bufferMin)).toBe(false);
    }
  });

  it("nu apar în zile închise sau în zilele libere ale specialistului", () => {
    expect(list.some((b) => b.date === SUNDAY)).toBe(false);
    expect(list.some((b) => b.staffId === "dan" && weekdayOf(b.date) === 2)).toBe(false);
  });
});

describe("datele reale ale salonului", () => {
  it("fiecare serviciu are cel puțin un specialist", () => {
    for (const s of services) expect(siteStaff.some((m) => m.serviceIds.includes(s.id)), s.id).toBe(true);
  });

  it("specialiștii fac doar servicii existente", () => {
    const ids = new Set(services.map((s) => s.id));
    for (const m of siteStaff) for (const id of m.serviceIds) expect(ids.has(id), `${m.id}: ${id}`).toBe(true);
  });

  it("programul și sărbătorile sunt valide", () => {
    for (const day of Object.values(siteSchedule.weekly)) {
      if (day) expect(parseHM(day.start)).toBeLessThan(parseHM(day.end));
    }
    for (const h of siteSchedule.holidays) expect(isValidISODate(h.date), h.date).toBe(true);
  });
});
