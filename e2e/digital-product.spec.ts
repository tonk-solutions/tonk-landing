import { expect, test } from "@playwright/test";

/**
 * TL-32: la landing de producto digital se lee en el HTML inicial, en los dos
 * idiomas, sin ejecutar JavaScript y sin mandar el CTA.
 */

const SITE_URL = "https://tonksolutions.com.ar";

const PAGES = [
  {
    locale: "es",
    path: "/es/services/digital-product-development",
    title: /Producto digital desde una idea abierta/,
    heading: "Tenés una idea y no sabés cómo llevarla a cabo",
    cta: "Escribir sobre tu idea de producto",
    audience: "Para quién es el desarrollo de producto digital",
  },
  {
    locale: "en",
    path: "/en/services/digital-product-development",
    title: /Digital product from an open idea/,
    heading: "You have an idea and don't know how to carry it out",
    cta: "Write about your product idea",
    audience: "Who digital product development is for",
  },
] as const;

function words(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

test.describe("producto digital, HTML inicial", () => {
  test.use({ javaScriptEnabled: false });

  for (const pageCase of PAGES) {
    test(`${pageCase.locale}: copy, CTA y metadatos sin JavaScript`, async ({ page }) => {
      const response = await page.goto(pageCase.path);
      expect(response?.status()).toBe(200);

      const main = page.locator("main");
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(pageCase.heading);
      await expect(main.getByRole("heading", { level: 2, name: pageCase.audience })).toBeVisible();
      await expect(main.getByRole("link", { name: pageCase.cta })).toHaveAttribute(
        "href",
        /^https:\/\/wa\.me\/5491123908349\?text=/,
      );

      const body = await main.innerText();
      expect(words(body)).toBeGreaterThan(500);
      expect(body).not.toMatch(/secci[oó]n 04|section 04/i);
      expect(body).not.toMatch(/\$|USD|ARS/);

      await expect(page).toHaveTitle(pageCase.title);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute(
        "content",
        /MVP|mvp|especificación|specification/,
      );
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        `${SITE_URL}${pageCase.path}`,
      );
      await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute(
        "href",
        `${SITE_URL}/es/services/digital-product-development`,
      );

      const serviceGraph = await page.locator("script#structured-data-service").textContent();
      expect(serviceGraph).toContain("BreadcrumbList");
      expect(serviceGraph).not.toMatch(/secci[oó]n 04|section 04/i);
    });
  }
});
