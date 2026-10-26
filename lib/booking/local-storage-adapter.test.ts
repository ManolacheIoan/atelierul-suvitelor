import { describe, expect, it } from "vitest";
import { schedule } from "@/config/site";
import { staff } from "@/data/staff";
import { staffSlots } from "@/lib/availability";
import { createLocalStorageAdapter, STORAGE_KEY } from "./local-storage-adapter";
import { SlotTakenError, type BookingRequest } from "./types";

function memoryStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return { getItem: (k: string) => data.get(k) ?? null, setItem: (k: string, v: string) => void data.set(k, v) };
}

const now = () => new Date("2026-11-02T06:00:00Z"); // luni, 08:00 la Galați
const DATE = "2026-11-04";
const radu = staff.find((m) => m.id === "radu")!;

async function firstFree(adapter: ReturnType<typeof createLocalStorageAdapter>, durationMin: number) {
  const bookings = await adapter.listTaken(DATE, DATE);
  return staffSlots(schedule, { date: DATE, durationMin, staff: radu, bookings, now: now() })[0];
}

function request(start: number): BookingRequest {
  return {
    serviceIds: ["b-tuns"],
    staffId: "radu",
    staffChoice: "radu",
    date: DATE,
    start,
    durationMin: 40,
    priceLei: 70,
    name: "Ana Pop",
    phone: "+40722123456",
  };
}

describe("adaptorul localStorage", () => {
  it("salvează, ocupă ora, refuză dublarea și eliberează la anulare", async () => {
    const adapter = createLocalStorageAdapter({ config: schedule, staff, storage: memoryStorage(), now });
    const start = await firstFree(adapter, 40);
    const saved = await adapter.create(request(start));
    expect(saved.end).toBe(start + 40);
    expect(await adapter.listMine()).toHaveLength(1);
    expect((await adapter.listTaken(DATE, DATE)).some((b) => b.staffId === "radu" && b.start === start)).toBe(true);

    await expect(adapter.create(request(start))).rejects.toBeInstanceOf(SlotTakenError);

    await adapter.cancel(saved.id);
    expect(await adapter.listMine()).toEqual([]);
    expect(await firstFree(adapter, 40)).toBe(start);
  });

  it("ignoră date corupte din stocare", async () => {
    const adapter = createLocalStorageAdapter({
      config: schedule,
      staff,
      storage: memoryStorage({ [STORAGE_KEY]: "{nu e json" }),
      now,
    });
    expect(await adapter.listMine()).toEqual([]);
  });

  it("funcționează și fără localStorage (în memorie)", async () => {
    const adapter = createLocalStorageAdapter({ config: schedule, staff, storage: null, now });
    const start = await firstFree(adapter, 40);
    await adapter.create(request(start));
    expect(await adapter.listMine()).toHaveLength(1);
  });

  it("refuză un specialist necunoscut", async () => {
    const adapter = createLocalStorageAdapter({ config: schedule, staff, storage: memoryStorage(), now });
    await expect(adapter.create({ ...request(600), staffId: "nimeni" })).rejects.toBeInstanceOf(SlotTakenError);
  });
});
