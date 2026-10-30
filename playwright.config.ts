import { existsSync } from "node:fs";
import { defineConfig, devices } from "@playwright/test";

/**
 * e2e de la landing. Usa el Chromium del sistema (`/usr/bin/chromium`) si existe, para no
 * depender de la descarga de navegadores de Playwright; si no, el que instala Playwright.
 * Se puede forzar uno con `PLAYWRIGHT_CHROMIUM_PATH`.
 */
const systemChromium = "/usr/bin/chromium";
const chromiumPath =
  process.env.PLAYWRIGHT_CHROMIUM_PATH ?? (existsSync(systemChromium) ? systemChromium : undefined);

/**
 * `baseURL` y el `webServer` salen del mismo origen. Si divergen, Playwright
 * reutiliza un server (o levanta uno) y los tests pegan contra otro: con un
 * `next-server` ajeno escuchando en el puerto, la suite valida otra aplicación.
 *
 * - `PLAYWRIGHT_BASE_URL` apunta la suite a un origen ya existente.
 * - `PLAYWRIGHT_PORT` levanta este build en un puerto propio (útil cuando el
 *   3000 está ocupado por otro worktree).
 */
const baseURL =
  process.env.PLAYWRIGHT_BASE_URL ??
  `http://127.0.0.1:${process.env.PLAYWRIGHT_PORT ?? "3000"}`;
const port =
  baseURL.match(/:(\d+)\/?$/)?.[1] ?? process.env.PLAYWRIGHT_PORT ?? "3000";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list"]],
  use: {
    baseURL,
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
    command: `npm run build && npm run start -- -p ${port}`,
    url: `${baseURL}/es`,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
  },
});
