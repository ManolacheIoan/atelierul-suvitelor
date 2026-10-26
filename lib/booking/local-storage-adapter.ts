/**
 * Adaptor DEMO: programările se salvează doar în localStorage-ul browserului.
 * Nimeni de la salon nu le vede. Peste ele se adaugă programările generate
 * din lib/demo-bookings.ts, ca agenda să pară reală.
 */
import type { ScheduleConfig } from "@/config/site";
import { addDays, isValidISODate, staffSlots, type ExistingBooking, type ISODate, type StaffSchedule } from "@/lib/availability";
import { demoBookings } from "@/lib/demo-bookings";
import { SlotTakenError, type BookingAdapter, type BookingRequest, type StoredBooking } from "./types";

export const STORAGE_KEY = "atelier-programari-v1";

/** Doar ce folosim din `Storage`, ca să putem testa cu un obiect simplu. */
export type KeyValueStorage = Pick<Storage, "getItem" | "setItem">;

export interface LocalAdapterOptions {
  config: ScheduleConfig;
  staff: readonly StaffSchedule[];
  storage: KeyValueStorage | null;
  now?: () => Date;
}

function isStoredBooking(x: unknown): x is StoredBooking {
  if (!x || typeof x !== "object") return false;
  const b = x as Record<string, unknown>;
  return (
    typeof b.id === "string" &&
    typeof b.staffId === "string" &&
    typeof b.date === "string" &&
    isValidISODate(b.date) &&
    typeof b.start === "number" &&
    typeof b.end === "number" &&
    Array.isArray(b.serviceIds) &&
    typeof b.name === "string" &&
    typeof b.phone === "string"
  );
}

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createLocalStorageAdapter({ config, staff, storage, now = () => new Date() }: LocalAdapterOptions): BookingAdapter {
  // Dacă localStorage e blocat (navigare privată strictă), păstrăm în memorie cât e deschisă pagina.
  let memory: StoredBooking[] = [];

  const read = (): StoredBooking[] => {
    if (!storage) return memory;
    try {
      const parsed: unknown = JSON.parse(storage.getItem(STORAGE_KEY) ?? "[]");
      return Array.isArray(parsed) ? parsed.filter(isStoredBooking) : [];
    } catch {
      return memory;
    }
  };

  const write = (list: StoredBooking[]) => {
    memory = list;
    try {
      storage?.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {
      // Spațiu plin sau stocare blocată: rămâne varianta din memorie.
    }
  };

  const taken = (from: ISODate, to: ISODate): ExistingBooking[] => {
    const days = Math.round((Date.parse(to) - Date.parse(from)) / 86_400_000) + 1;
    const demo = days > 0 ? demoBookings(config, staff, from, days) : [];
    const mine = read()
      .filter((b) => b.date >= from && b.date <= to)
      .map(({ staffId, date, start, end }) => ({ staffId, date, start, end }));
    return [...demo, ...mine];
  };

  return {
    kind: "local",

    async listTaken(from, to) {
      return taken(from, to);
    },

    async listMine() {
      return read().sort((a, b) => a.date.localeCompare(b.date) || a.start - b.start);
    },

    async create(request: BookingRequest) {
      const member = staff.find((s) => s.id === request.staffId);
      if (!member) throw new SlotTakenError();
      // Verificăm din nou, chiar înainte de salvare, că ora e încă liberă.
      const free = staffSlots(config, {
        date: request.date,
        durationMin: request.durationMin,
        staff: member,
        bookings: taken(request.date, request.date),
        now: now(),
      });
      if (!free.includes(request.start)) throw new SlotTakenError();

      const booking: StoredBooking = {
        ...request,
        id: newId(),
        end: request.start + request.durationMin,
        createdAt: now().toISOString(),
      };
      write([...read(), booking]);
      return booking;
    },

    async cancel(id) {
      write(read().filter((b) => b.id !== id));
    },
  };
}

/** Intervalul de date pe care îl acoperă fereastra de programare. */
export function windowRange(firstDay: ISODate, horizonDays: number): [ISODate, ISODate] {
  return [firstDay, addDays(firstDay, horizonDays - 1)];
}
