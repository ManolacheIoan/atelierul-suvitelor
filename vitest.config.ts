import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./", import.meta.url)) } },
  test: {
    include: ["lib/**/*.test.ts"],
    // Fus orar fix, ca testele de schimbare a orei (DST) să fie reproductibile.
    env: { TZ: "Europe/Bucharest" },
  },
});
