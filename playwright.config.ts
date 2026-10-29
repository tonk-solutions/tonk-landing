import { defineConfig, devices } from "@playwright/test";

/**
 * e2e de la landing. Usa el Chromium del sistema (`/usr/bin/chromium`) para no
 * depender de la descarga de navegadores de Playwright; se puede sobreescribir con
 * `PLAYWRIGHT_CHROMIUM_PATH`.
 */
const chromiumPath = process.env.PLAYWRIGHT_CHROMIUM_PATH ?? "/usr/bin/chromium";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list"]],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        channel: undefined,
        launchOptions: { executablePath: chromiumPath },
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: "mobile",
      use: {
        ...devices["Pixel 5"],
        launchOptions: { executablePath: chromiumPath },
      },
    },
  ],
  webServer: {
    command: "npm run build && npm run start",
    url: "http://127.0.0.1:3000/es",
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
  },
});
