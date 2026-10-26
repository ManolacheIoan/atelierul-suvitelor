/**
 * EXEMPLU de adaptor pentru un backend real. NU este folosit acum.
 * Pentru a-l activa, vezi lib/booking/index.ts și secțiunea „Backend real” din README.
 *
 * Contractul HTTP așteptat (îl poți implementa în orice limbaj):
 *   GET    {baseUrl}/taken?from=AAAA-LL-ZZ&to=AAAA-LL-ZZ   → ExistingBooking[]
 *   POST   {baseUrl}/bookings   (corp: BookingRequest)       → StoredBooking (201)
 *                                                           → 409 dacă ora e ocupată
 *   DELETE {baseUrl}/bookings/{id}                           → 204
 *
 * Serverul TREBUIE să verifice din nou disponibilitatea (poate folosi chiar
 * lib/availability.ts) — validarea din browser nu e suficientă.
 * Id-urile programărilor făcute de pe acest dispozitiv se țin local, ca
 * clientul să le poată anula; un backend real ar trimite și un link de anulare.
 */
import type { ExistingBooking } from "@/lib/availability";
import { SlotTakenError, type BookingAdapter, type BookingRequest, type StoredBooking } from "./types";

const MINE_KEY = "atelier-programarile-mele-v1";

export function createHttpAdapter(baseUrl: string, storage: Pick<Storage, "getItem" | "setItem"> | null): BookingAdapter {
  const readMine = (): StoredBooking[] => {
    try {
      return JSON.parse(storage?.getItem(MINE_KEY) ?? "[]") as StoredBooking[];
    } catch {
      return [];
    }
  };
  const writeMine = (list: StoredBooking[]) => {
    try {
      storage?.setItem(MINE_KEY, JSON.stringify(list));
    } catch {
      /* stocare indisponibilă */
    }
  };

  return {
    kind: "remote",

    async listTaken(from, to) {
      const res = await fetch(`${baseUrl}/taken?from=${from}&to=${to}`);
      if (!res.ok) throw new Error("Nu am putut încărca orele libere.");
      return (await res.json()) as ExistingBooking[];
    },

    async listMine() {
      return readMine();
    },

    async create(request: BookingRequest) {
      const res = await fetch(`${baseUrl}/bookings`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(request),
      });
      if (res.status === 409) throw new SlotTakenError();
      if (!res.ok) throw new Error("Programarea nu a putut fi trimisă. Te rugăm să ne suni.");
      const booking = (await res.json()) as StoredBooking;
      writeMine([...readMine(), booking]);
      return booking;
    },

    async cancel(id) {
      const res = await fetch(`${baseUrl}/bookings/${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!res.ok && res.status !== 404) throw new Error("Anularea nu a reușit. Te rugăm să ne suni.");
      writeMine(readMine().filter((b) => b.id !== id));
    },
  };
}
