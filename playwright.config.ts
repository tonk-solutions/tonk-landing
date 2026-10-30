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
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3111",
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
  // El e2e corre siempre contra un build propio en un puerto propio: con
  // `reuseExistingServer` contra :3000 el resultado dependía de qué hubiera
  // escuchando ahí (un server viejo podía dar verde o rojo sin relación con el
  // código). Para correr contra un server ya levantado, PLAYWRIGHT_BASE_URL.
  webServer: {
    command: "npm run build && npx next start -p 3111",
    url: "http://127.0.0.1:3111/es",
    reuseExistingServer: false,
    timeout: 240_000,
  },
});
