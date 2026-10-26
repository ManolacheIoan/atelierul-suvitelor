import { defineConfig, devices } from "@playwright/test";

/** Testele rulează pe build-ul static din out/ (rulează întâi `npm run build`). */
const PORT = 4174;

export default defineConfig({
  testDir: "tests",
  fullyParallel: true,
  reporter: [["list"]],
  use: { baseURL: `http://localhost:${PORT}`, timezoneId: "Europe/Bucharest", locale: "ro-RO" },
  projects: [
    { name: "telefon", use: { ...devices["Pixel 7"] } },
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    command: "npm run serve",
    url: `http://localhost:${PORT}`,
    env: { PORT: String(PORT) },
    reuseExistingServer: !process.env.CI,
  },
});
