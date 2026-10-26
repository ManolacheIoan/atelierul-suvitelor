import { expect, test, type Page } from "@playwright/test";
import { checkService, freezeClock, next, pickFirstSlot } from "./helpers";

async function toContactStep(page: Page) {
  await freezeClock(page);
  await page.goto("/programare/");
  await checkService(page, "Tuns bărbați");
  await next(page);
  await next(page);
  await pickFirstSlot(page);
  await next(page);
}

const submit = (page: Page) => page.getByRole("button", { name: "Confirmă programarea" }).click();

test("pasul 1 cere cel puțin un serviciu", async ({ page }) => {
  await page.goto("/programare/");
  await next(page);
  await expect(page.locator(".alert--error")).toHaveText("Alege cel puțin un serviciu.");
});

test("pasul 3 cere zi și oră", async ({ page }) => {
  await freezeClock(page);
  await page.goto("/programare/");
  await checkService(page, "Barbă");
  await next(page);
  await next(page);
  await next(page);
  await expect(page.locator(".alert--error")).toHaveText("Alege o zi și o oră.");
});

test("formular gol: toate erorile, focus pe primul câmp", async ({ page }) => {
  await toContactStep(page);
  await submit(page);
  const name = page.getByLabel("Nume și prenume");
  await expect(name).toBeFocused();
  await expect(name).toHaveAttribute("aria-invalid", "true");
  await expect(page.getByText("Scrie-ne numele tău.")).toBeVisible();
  await expect(page.getByText("Scrie numărul de telefon")).toBeVisible();
  await expect(page.getByText("Bifează acordul")).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("atelier-programari-v1"))).toBeNull();
});

test("nume invalid și telefon invalid sunt respinse", async ({ page }) => {
  await toContactStep(page);
  await page.getByLabel("Nume și prenume").fill("A1");
  await page.getByLabel("Telefon", { exact: true }).fill("0812 345 678");
  await page.getByRole("checkbox", { name: /Sunt de acord/ }).check();
  await submit(page);
  await expect(page.getByText("Numele trebuie să aibă cel puțin două litere.")).toBeVisible();
  await page.getByLabel("Nume și prenume").fill("Ana123");
  await submit(page);
  await expect(page.getByText("Folosește doar litere")).toBeVisible();
  await page.getByLabel("Nume și prenume").fill("Ana-Maria Țurcanu");
  await submit(page);
  const phone = page.getByLabel("Telefon", { exact: true });
  await expect(phone).toBeFocused();
  await expect(page.getByText("Numărul nu pare românesc")).toBeVisible();
  await expect(phone).toHaveAttribute("aria-describedby", /eroare-phone/);
});

for (const phone of ["+40 722 123 456", "0040722123456", "0722.123.456", "(0236) 410 123"]) {
  test(`telefon acceptat: ${phone}`, async ({ page }) => {
    await toContactStep(page);
    await page.getByLabel("Nume și prenume").fill("Ion Pop");
    await page.getByLabel("Telefon", { exact: true }).fill(phone);
    await page.getByRole("checkbox", { name: /Sunt de acord/ }).check();
    await submit(page);
    await expect(page.getByRole("heading", { name: "Programarea e înregistrată" })).toBeVisible();
  });
}
