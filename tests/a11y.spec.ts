import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { checkService, freezeClock, next, pages, pickFirstSlot } from "./helpers";

const tags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const audit = async (page: Page) =>
  (await new AxeBuilder({ page }).withTags(tags).analyze()).violations.map(
    (v) => `${v.id}: ${v.nodes.map((n) => n.target).join(", ")}`,
  );

test.use({ reducedMotion: "reduce" });

for (const theme of ["light", "dark"] as const) {
  for (const path of [...pages, "/pagina-inexistenta/"]) {
    test(`axe (${theme}): ${path}`, async ({ page }) => {
      if (theme === "dark") await page.addInitScript(() => localStorage.setItem("atelier-tema", "dark"));
      await page.goto(path);
      expect(await audit(page)).toEqual([]);
    });
  }
}

test("axe: fiecare pas al programării, erori și confirmare", async ({ page }) => {
  await freezeClock(page);
  await page.goto("/programare/");
  await next(page);
  await expect(page.locator(".alert--error")).toBeVisible();
  expect(await audit(page)).toEqual([]);

  await checkService(page, "Tuns bărbați");
  await next(page);
  expect(await audit(page)).toEqual([]);
  await next(page);
  await pickFirstSlot(page);
  expect(await audit(page)).toEqual([]);
  await next(page);
  await page.getByRole("button", { name: "Confirmă programarea" }).click();
  await expect(page.getByText("Scrie-ne numele tău.")).toBeVisible();
  expect(await audit(page)).toEqual([]);

  await page.getByLabel("Nume și prenume").fill("Ana Pop");
  await page.getByLabel("Telefon", { exact: true }).fill("0722123456");
  await page.getByRole("checkbox", { name: /Sunt de acord/ }).check();
  await page.getByRole("button", { name: "Confirmă programarea" }).click();
  await expect(page.getByRole("heading", { name: "Programarea e înregistrată" })).toBeVisible();
  expect(await audit(page)).toEqual([]);
  await page.getByRole("button", { name: "Anulează programarea" }).click();
  expect(await audit(page)).toEqual([]);
});

test("axe: meniul deschis pe telefon", async ({ page, isMobile }) => {
  test.skip(!isMobile, "doar pe telefon");
  await page.goto("/");
  await page.getByRole("button", { name: "Meniu" }).click();
  expect(await audit(page)).toEqual([]);
});
