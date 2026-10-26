import { expect, test } from "@playwright/test";
import { checkService, fillContact, freezeClock, next, pages, pickFirstSlot } from "./helpers";

test("nicio cerere externă: toate paginile și o programare completă", async ({ page, baseURL }) => {
  const external: string[] = [];
  page.on("request", (r) => {
    const url = r.url();
    if (!url.startsWith(baseURL!) && !url.startsWith("data:") && !url.startsWith("blob:")) external.push(url);
  });
  for (const path of [...pages, "/pagina-inexistenta/"]) {
    await page.goto(path);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForLoadState("networkidle");
  }
  await freezeClock(page);
  await page.goto("/programare/");
  await checkService(page, "Barbă");
  await next(page);
  await next(page);
  await pickFirstSlot(page);
  await next(page);
  await fillContact(page);
  await page.getByRole("button", { name: "Confirmă programarea" }).click();
  await expect(page.getByRole("heading", { name: "Programarea e înregistrată" })).toBeVisible();
  await page.waitForLoadState("networkidle");
  expect(external).toEqual([]);
});

test("toate paginile: titlu, un singur h1, noindex, fără erori în consolă", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  for (const path of pages) {
    const res = await page.goto(path);
    expect(res?.status(), path).toBe(200);
    await expect(page.locator("h1"), path).toHaveCount(1);
    await expect(page).toHaveTitle(/Atelierul Șuvițelor/);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.locator("html")).toHaveAttribute("lang", "ro");
  }
  expect(errors).toEqual([]);
});

test("pagina 404 e jucăușă și are status 404", async ({ page }) => {
  const res = await page.goto("/nu-exista/");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("a fost tunsă");
  await expect(page.getByRole("link", { name: "Înapoi acasă" })).toBeVisible();
});

test("tastatura: „Sari la conținut” duce la conținut", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Sari la conținut" });
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#continut$/);
});

test("telefon: bara „Sună acum / Programează-te” și meniul cu tastatura", async ({ page, isMobile }) => {
  test.skip(!isMobile, "doar pe telefon");
  await page.goto("/");
  const bar = page.locator(".callbar");
  await expect(bar.getByRole("link", { name: "Sună acum" })).toHaveAttribute("href", /^tel:\+40/);
  await expect(bar.getByRole("link", { name: "Programează-te" })).toHaveAttribute("href", "/programare/");

  const toggle = page.getByRole("button", { name: "Meniu" });
  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("navigation", { name: "Principal" }).getByRole("link", { name: "Echipa" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(toggle).toBeFocused();
});

test("desktop: bara de jos e ascunsă, meniul e vizibil", async ({ page, isMobile }) => {
  test.skip(!!isMobile, "doar pe desktop");
  await page.goto("/");
  await expect(page.locator(".callbar")).toBeHidden();
  await expect(page.getByRole("navigation", { name: "Principal" }).getByRole("link", { name: "Galerie" })).toBeVisible();
});

test("navigarea marchează pagina curentă", async ({ page, isMobile }) => {
  await page.goto("/");
  if (isMobile) await page.getByRole("button", { name: "Meniu" }).click();
  await page.getByRole("navigation", { name: "Principal" }).getByRole("link", { name: "Echipa" }).click();
  await expect(page).toHaveURL(/\/echipa\/$/);
  if (isMobile) await page.getByRole("button", { name: "Meniu" }).click();
  await expect(page.getByRole("navigation", { name: "Principal" }).getByRole("link", { name: "Echipa" })).toHaveAttribute(
    "aria-current",
    "page",
  );
});

test("tema întunecată se păstrează după reîncărcare", async ({ page }) => {
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Temă întunecată" });
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await toggle.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.getByRole("button", { name: "Temă întunecată" })).toHaveAttribute("aria-pressed", "true");
});

test("galeria se filtrează pe categorii", async ({ page }) => {
  await page.goto("/galerie/");
  const cards = page.locator(".gallery-card");
  const all = await cards.count();
  await page.getByRole("button", { name: "Bărbați" }).click();
  await expect(page.getByRole("button", { name: "Bărbați" })).toHaveAttribute("aria-pressed", "true");
  const men = await cards.count();
  expect(men).toBeGreaterThan(0);
  expect(men).toBeLessThan(all);
  await expect(page.locator(".gallery-card .chip").first()).toHaveText("Bărbați");
  await page.getByRole("button", { name: "Toate" }).click();
  await expect(cards).toHaveCount(all);
});

test("studio de culoare: alegerea nuanței și comparația", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("radio", { name: "Vânătă" }).check();
  await expect(page.locator(".studio__note")).toContainText("Vânătă");
  const range = page.getByLabel("Compară înainte și după");
  await range.fill("20");
  await expect(page.locator(".studio__stage")).toHaveAttribute("style", /--split: ?20%/);
});

test("întrebările frecvente se deschid", async ({ page }) => {
  await page.goto("/intrebari-frecvente/");
  await page.getByText("Primesc SMS de confirmare?").click();
  await expect(page.getByText("Nu trimitem SMS automat.")).toBeVisible();
});

test.describe("mișcare redusă", () => {
  test.use({ reducedMotion: "reduce" });
  test("fără foarfecă animată, fără plutire, conținut vizibil imediat", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".cut__track")).toBeHidden();
    await expect(page.locator(".cut__paper")).toBeHidden();
    expect(await page.locator(".floater__bob").first().evaluate((el) => getComputedStyle(el).animationName)).toBe("none");
    const card = page.locator("[data-reveal]").last();
    expect(await card.evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
  });
});

test("cu animații: foarfeca taie titlul, apoi dispare; elementele apar la derulare", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  expect(await page.locator(".cut__paper").evaluate((el) => getComputedStyle(el).animationName)).toBe("paper-cut");
  expect(await page.locator(".floater__bob").first().evaluate((el) => getComputedStyle(el).animationName)).toBe("bob");
  await expect(page.locator(".cut__track")).toBeHidden({ timeout: 5000 });
  const last = page.locator("[data-reveal]").last();
  await last.scrollIntoViewIfNeeded();
  await expect(last).toHaveClass(/is-visible/);
});

test("fără deplasări de layout la încărcare (CLS)", async ({ page }) => {
  await page.goto("/");
  await page.waitForTimeout(2500);
  const cls = await page.evaluate(
    () =>
      new Promise<number>((resolve) => {
        let total = 0;
        new PerformanceObserver((list) => {
          for (const e of list.getEntries() as (PerformanceEntry & { value: number; hadRecentInput: boolean })[]) {
            if (!e.hadRecentInput) total += e.value;
          }
        }).observe({ type: "layout-shift", buffered: true });
        setTimeout(() => resolve(total), 300);
      }),
  );
  expect(cls).toBeLessThan(0.02);
});
