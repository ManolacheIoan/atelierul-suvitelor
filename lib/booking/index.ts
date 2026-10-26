/**
 * SINGURUL loc în care se alege unde ajung programările.
 *
 * Acum: localStorage (demo). Pentru un backend real, înlocuiește corpul
 * funcției cu, de exemplu:
 *
 *   import { createHttpAdapter } from "./http-adapter";
 *   return createHttpAdapter("https://api.exemplu.ro", safeLocalStorage());
 *
 * Restul aplicației nu trebuie modificat.
 */
import { schedule } from "@/config/site";
import { staff } from "@/data/staff";
import { createLocalStorageAdapter } from "./local-storage-adapter";
import type { BookingAdapter } from "./types";

export type { BookingAdapter, BookingRequest, StoredBooking } from "./types";
export { SlotTakenError } from "./types";

function safeLocalStorage(): Storage | null {
  try {
    const s = window.localStorage;
    s.getItem("test");
    return s;
  } catch {
    return null;
  }
}

let instance: BookingAdapter | null = null;

/** Adaptorul folosit de interfață (creat o singură dată, doar în browser). */
export function getBookingAdapter(): BookingAdapter {
  instance ??= createLocalStorageAdapter({ config: schedule, staff, storage: safeLocalStorage() });
  return instance;
}
