/**
 * CONTRACTUL dintre interfața de programare și locul în care se salvează
 * programările. Interfața (components/booking/*) vorbește DOAR cu un
 * `BookingAdapter`; nu știe dacă în spate e localStorage, un API sau un e-mail.
 *
 * Implementări:
 * - local-storage-adapter.ts — folosită acum (demo, totul rămâne în browser);
 * - http-adapter.ts          — exemplu pentru un backend real (API REST);
 * Alegerea se face într-un singur loc: lib/booking/index.ts.
 */
import type { ExistingBooking, ISODate } from "@/lib/availability";

/** Ce trimite formularul când clientul confirmă. */
export interface BookingRequest {
  serviceIds: string[];
  /** Specialistul ales efectiv (pentru „oricine”, cel atribuit automat). */
  staffId: string;
  /** Ce a ales clientul: un id de specialist sau „oricine”. */
  staffChoice: string | "oricine";
  date: ISODate;
  /** Minute de la miezul nopții (ora salonului). */
  start: number;
  durationMin: number;
  priceLei: number;
  name: string;
  /** Telefon normalizat, format +40XXXXXXXXX. */
  phone: string;
  note?: string;
}

/** O programare salvată, așa cum o întoarce adaptorul. */
export interface StoredBooking extends BookingRequest {
  id: string;
  end: number;
  /** Momentul creării, ISO 8601. */
  createdAt: string;
}

/** Ora aleasă a fost ocupată între timp (de alt client sau din alt tab). */
export class SlotTakenError extends Error {
  constructor() {
    super("Ora aleasă tocmai a fost ocupată. Te rugăm să alegi alta.");
    this.name = "SlotTakenError";
  }
}

export interface BookingAdapter {
  /** „local” = demo în browser; „remote” = backend real. Doar pentru texte informative. */
  readonly kind: "local" | "remote";
  /** Toate intervalele ocupate (ale oricui) între două date, inclusiv. */
  listTaken(from: ISODate, to: ISODate): Promise<ExistingBooking[]>;
  /** Programările făcute de pe acest dispozitiv, ca să poată fi anulate. */
  listMine(): Promise<StoredBooking[]>;
  /** Salvează o programare. Aruncă `SlotTakenError` dacă ora nu mai e liberă. */
  create(request: BookingRequest): Promise<StoredBooking>;
  /** Anulează o programare după id. Nu aruncă eroare dacă nu mai există. */
  cancel(id: string): Promise<void>;
}
