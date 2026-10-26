import { expect, test } from "@playwright/test";
import { checkService, fillContact, freezeClock, next, pickFirstSlot } from "./helpers";

test.beforeEach(async ({ page }) => {
  await freezeClock(page);
});

test("flux complet: mai multe servicii, specialist ales, zi, oră, date, confirmare", async ({ page }) => {
  await page.goto("/programare/");
  await checkService(page, "Tuns bărbați");
  await checkService(page, "Barbă");
  await expect(page.getByTestId("total-durata")).toHaveText("1 h 10 min");
  await expect(page.getByTestId("total-pret")).toHaveText("120 lei");
  await next(page);

  // Doar specialiștii care fac ambele servicii.
  await expect(page.getByRole("radio", { name: /Radu Ciobanu/ })).toBeVisible();
  await expect(page.getByRole("radio", { name: /Ioana Mareș/ })).toHaveCount(0);
  await page.getByRole("radio", { name: /Radu Ciobanu/ }).check();
  await next(page);

  // Duminica și zilele închise nu pot fi alese.
  await expect(page.locator('.day[data-date="2026-11-08"]')).toHaveAttribute("aria-disabled", "true");
  await expect(page.locator('.day[data-date="2026-11-08"]')).toHaveAttribute("aria-label", /închis/);
  const time = await pickFirstSlot(page);
  // Cu ora fixată la 08:00 și o oră avans minim, nimic înainte de 09:00.
  expect(time >= "09:00").toBe(true);
  await next(page);

  await fillContact(page);
  await page.getByRole("button", { name: "Confirmă programarea" }).click();

  await expect(page.getByRole("heading", { name: "Programarea e înregistrată" })).toBeFocused();
  await expect(page.getByText("Nu trimitem SMS sau e-mail de confirmare")).toBeVisible();
  const details = page.locator(".confirm__details");
  await expect(details).toContainText("Radu Ciobanu");
  await expect(details).toContainText(`ora ${time}`);
  await expect(details).toContainText("Tuns bărbați, Barbă");
  await expect(details).toContainText("120 lei");

  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem("atelier-programari-v1") ?? "[]"));
  expect(stored).toHaveLength(1);
  expect(stored[0]).toMatchObject({ staffId: "radu", phone: "+40722123456", name: "Ana Popescu", durationMin: 70 });
});

test("ora rezervată dispare din lista de ore libere", async ({ page }) => {
  await page.goto("/programare/?specialist=radu");
  await checkService(page, "Tuns bărbați");
  await next(page);
  await next(page);
  const time = await pickFirstSlot(page);
  const day = await page.locator('.day[data-selected="true"]').getAttribute("data-date");
  await next(page);
  await fillContact(page);
  await page.getByRole("button", { name: "Confirmă programarea" }).click();
  await expect(page.getByRole("heading", { name: "Programarea e înregistrată" })).toBeVisible();

  await page.goto("/programare/?specialist=radu");
  await checkService(page, "Tuns bărbați");
  await next(page);
  await next(page);
  await page.locator(`.day[data-date="${day}"]`).click();
  await expect(page.getByRole("radio").first()).toBeVisible();
  await expect(page.getByRole("radio", { name: time, exact: true })).toHaveCount(0);
});

test("anularea din ecranul de confirmare eliberează ora", async ({ page }) => {
  await page.goto("/programare/?specialist=elena");
  await checkService(page, "Tuns copii");
  await next(page);
  await next(page);
  const time = await pickFirstSlot(page);
  const day = await page.locator('.day[data-selected="true"]').getAttribute("data-date");
  await next(page);
  await fillContact(page, "Mihai Ionescu", "+40 744 000 111");
  await page.getByRole("button", { name: "Confirmă programarea" }).click();

  await page.getByRole("button", { name: "Anulează programarea" }).click();
  await expect(page.getByRole("button", { name: "Da, anulează" })).toBeFocused();
  await page.getByRole("button", { name: "Da, anulează" }).click();
  await expect(page.getByRole("heading", { name: "Programarea a fost anulată" })).toBeFocused();
  expect(await page.evaluate(() => localStorage.getItem("atelier-programari-v1"))).toBe("[]");

  await page.getByRole("button", { name: "Fă o programare nouă" }).click();
  await page.goto("/programare/?specialist=elena");
  await checkService(page, "Tuns copii");
  await next(page);
  await next(page);
  await page.locator(`.day[data-date="${day}"]`).click();
  await expect(page.getByRole("radio", { name: time, exact: true })).toBeVisible();
});

test("„Nu, o păstrez” nu anulează; programarea apare în lista proprie și se poate anula de acolo", async ({ page }) => {
  await page.goto("/programare/");
  await checkService(page, "Aranjat");
  await next(page);
  await next(page);
  await pickFirstSlot(page);
  await next(page);
  await fillContact(page);
  await page.getByRole("button", { name: "Confirmă programarea" }).click();
  await page.getByRole("button", { name: "Anulează programarea" }).click();
  await page.getByRole("button", { name: "Nu, o păstrez" }).click();
  await expect(page.getByRole("heading", { name: "Programarea e înregistrată" })).toBeVisible();

  await page.goto("/programare/");
  const list = page.getByRole("region", { name: "Programările tale" });
  await expect(list.getByRole("listitem")).toHaveCount(1);
  await list.getByRole("button", { name: "Anulează programarea" }).click();
  await expect(page.getByRole("region", { name: "Programările tale" })).toHaveCount(0);
});

test("„oricine”: programarea primește automat un specialist liber", async ({ page }) => {
  await page.goto("/programare/");
  await checkService(page, "Tuns păr scurt");
  await next(page);
  await expect(page.getByRole("radio", { name: /Oricine e liber/ })).toBeChecked();
  await next(page);
  await pickFirstSlot(page);
  await next(page);
  await fillContact(page);
  await page.getByRole("button", { name: "Confirmă programarea" }).click();
  await expect(page.locator(".confirm__details")).toContainText(/Ioana Mareș|Elena Pavel/);
});

test("tastatura: calendarul și orele se folosesc doar cu tastatura", async ({ page }) => {
  await page.goto("/programare/");
  await checkService(page, "Tuns bărbați");
  await next(page);
  await next(page);

  const focusable = page.locator('.day[tabindex="0"]');
  await focusable.focus();
  const start = await focusable.getAttribute("data-date");
  expect(start).toBe("2026-11-02");

  await page.keyboard.press("ArrowRight");
  await expect(page.locator('.day[data-date="2026-11-03"]')).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(page.locator('.day[data-date="2026-11-10"]')).toBeFocused();
  await page.keyboard.press("End");
  await expect(page.locator('.day[data-date="2026-11-15"]')).toBeFocused(); // duminică
  await page.keyboard.press("Enter"); // închis: nu se poate alege
  await expect(page.getByText("Alege mai întâi o zi din calendar.")).toBeVisible();
  await page.keyboard.press("Home");
  await expect(page.locator('.day[data-date="2026-11-09"]')).toBeFocused();
  await page.keyboard.press("PageDown");
  await expect(page.getByRole("heading", { name: /decembrie 2026/i })).toBeVisible();
  await expect(page.locator('.day[data-date="2026-12-01"]')).toBeFocused(); // limitat la ultima zi din fereastră
  await page.keyboard.press("PageUp");
  await expect(page.locator('.day[data-date="2026-11-01"]')).toHaveCount(1);
  await page.locator('.day[data-date="2026-11-04"]').focus();
  await page.keyboard.press("Enter");
  await expect(page.locator('.day[data-date="2026-11-04"]')).toHaveAttribute("data-selected", "true");

  // Orele: Tab intră în grup, săgețile aleg.
  await page.keyboard.press("Tab");
  const radios = page.getByRole("radio");
  await expect(radios.first()).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect(radios.nth(1)).toBeFocused();
  await expect(radios.nth(1)).toHaveAttribute("aria-checked", "true");
  await page.keyboard.press("End");
  await expect(radios.last()).toHaveAttribute("aria-checked", "true");
});

test("serviciul din pagina de prețuri vine deja bifat", async ({ page }) => {
  await page.goto("/servicii/");
  await page.getByRole("link", { name: "Alege Balayage" }).first().click();
  await expect(page).toHaveURL(/serviciu=f-balayage/);
  await expect(page.getByRole("checkbox", { name: /^Balayage/ })).toBeChecked();
  await expect(page.getByTestId("total-pret")).toHaveText("de la 520 lei");
});

test("servicii fără specialist comun: mesaj clar", async ({ page }) => {
  await page.goto("/programare/");
  await checkService(page, "Balayage");
  await checkService(page, "Barbă");
  await next(page);
  await expect(page.locator(".alert--error")).toContainText("Fă două programări separate");
});
