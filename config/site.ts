/**
 * Datele generale ale salonului. Numele afacerii apare DOAR aici:
 * schimbă BUSINESS_NAME și tot site-ul (titluri, meniu, subsol, texte) se actualizează.
 */
export const BUSINESS_NAME = "Atelierul Șuvițelor";

/** Ziua săptămânii: 0 = duminică, 1 = luni, ... 6 = sâmbătă (ca în JavaScript). */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** Interval orar „HH:MM”–„HH:MM”. */
export interface TimeRange {
  start: string;
  end: string;
}

export interface Holiday {
  /** Data în format AAAA-LL-ZZ. */
  date: string;
  name: string;
}

export interface ScheduleConfig {
  /** Fusul orar al salonului; toate calculele de ore se fac în el. */
  timeZone: string;
  /** Programul pe zile; `null` = închis. */
  weekly: Record<Weekday, TimeRange | null>;
  /** Pauza de prânz (aceeași în fiecare zi deschisă); `null` = fără pauză. */
  lunchBreak: TimeRange | null;
  /** Minute libere între două programări (curățenie, pregătire). */
  bufferMin: number;
  /** Din câte în câte minute pot începe programările. */
  slotStepMin: number;
  /** Cu cât timp înainte trebuie făcută o programare (minute). */
  minLeadMin: number;
  /** Câte zile în avans se poate programa (inclusiv azi). */
  horizonDays: number;
  /** Sărbători legale și zile închise speciale. */
  holidays: Holiday[];
}

export const site = {
  name: BUSINESS_NAME,
  tagline: "salon de coafură și barbershop în Galați",
  shortDescription:
    "Tunsori, culoare, coafuri de eveniment și bărbierit clasic, pentru femei, bărbați și adolescenți, într-un atelier cald din Galați.",
  city: "Galați",
  area: "zona Centru, aproape de Faleza Dunării",
  address: "Str. Șuvițelor nr. 7, Galați",
  /** Număr afișat și număr pentru linkul tel: (format internațional). */
  phoneDisplay: "0236 000 700",
  phoneHref: "+40236000700",
  email: "salut@atelierulsuvitelor.ro",
  socials: [
    { label: "Instagram", handle: "@atelierulsuvitelor" },
    { label: "Facebook", handle: "Atelierul Suvitelor Galati" },
  ],
} as const;

export const schedule: ScheduleConfig = {
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
  holidays: [
    { date: "2026-11-30", name: "Sfântul Andrei" },
    { date: "2026-12-01", name: "Ziua Națională" },
    { date: "2026-12-24", name: "Ajunul Crăciunului (închis)" },
    { date: "2026-12-25", name: "Crăciunul" },
    { date: "2026-12-26", name: "A doua zi de Crăciun" },
    { date: "2027-01-01", name: "Anul Nou" },
    { date: "2027-01-02", name: "Anul Nou" },
    { date: "2027-01-06", name: "Boboteaza" },
    { date: "2027-01-07", name: "Sfântul Ioan" },
    { date: "2027-01-24", name: "Unirea Principatelor" },
    { date: "2027-04-30", name: "Vinerea Mare" },
    { date: "2027-05-01", name: "Ziua Muncii" },
    { date: "2027-05-03", name: "A doua zi de Paște" },
    { date: "2027-06-01", name: "Ziua Copilului" },
    { date: "2027-06-21", name: "A doua zi de Rusalii" },
    { date: "2027-08-15", name: "Adormirea Maicii Domnului" },
  ],
};

export const WEEKDAY_NAMES: Record<Weekday, string> = {
  0: "Duminică",
  1: "Luni",
  2: "Marți",
  3: "Miercuri",
  4: "Joi",
  5: "Vineri",
  6: "Sâmbătă",
};

/** Ordinea afișării în tabelul de program (luni prima). */
export const WEEK_ORDER: Weekday[] = [1, 2, 3, 4, 5, 6, 0];

export const nav = [
  { href: "/", label: "Acasă" },
  { href: "/servicii/", label: "Servicii și prețuri" },
  { href: "/echipa/", label: "Echipa" },
  { href: "/galerie/", label: "Galerie" },
  { href: "/contact/", label: "Contact" },
  { href: "/intrebari-frecvente/", label: "Întrebări" },
] as const;
