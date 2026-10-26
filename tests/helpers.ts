import { expect, type Page } from "@playwright/test";

export const pages = [
  "/",
  "/servicii/",
  "/echipa/",
  "/galerie/",
  "/programare/",
  "/contact/",
  "/intrebari-frecvente/",
  "/confidentialitate/",
];

/** Luni, 2 noiembrie 2026, 08:00 ora României: același calendar la fiecare rulare. */
export const FIXED_NOW = new Date("2026-11-02T08:00:00+02:00");

export async function freezeClock(page: Page) {
  await page.clock.setFixedTime(FIXED_NOW);
}

export const checkService = (page: Page, name: string) =>
  page.getByRole("checkbox", { name: new RegExp(`^${name}`) }).check();

export const next = (page: Page) => page.getByRole("button", { name: "Continuă" }).click();

/** Alege prima zi disponibilă și prima oră liberă; întoarce ora aleasă. */
export async function pickFirstSlot(page: Page): Promise<string> {
  await page.locator('.day[data-available="true"]').first().click();
  const slot = page.getByRole("radio").first();
  const time = (await slot.textContent())!.trim();
  await slot.click();
  await expect(slot).toHaveAttribute("aria-checked", "true");
  return time;
}

export async function fillContact(page: Page, name = "Ana Popescu", phone = "0722 123 456") {
  await page.getByLabel("Nume și prenume").fill(name);
  await page.getByLabel("Telefon", { exact: true }).fill(phone);
  await page.getByRole("checkbox", { name: /Sunt de acord/ }).check();
}
