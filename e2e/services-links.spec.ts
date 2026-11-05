import { expect, test } from "@playwright/test";
import { SERVICES_CATALOG } from "../src/app/services/catalog";

/**
 * TL-42: la home tiene que linkear a las 7 landings /[locale]/services/[slug].
 * Los links tienen que estar en el HTML del servidor (crawlables) aunque el
 * acordeón esté cerrado, y el footer linkea las dos landings principales.
 */

const LOCALES = ["es", "en"] as const;
const SERVICE_SLUGS = SERVICES_CATALOG.map((entry) => entry.slug);

const serviceHref = (locale: string, slug: string) => `/${locale}/services/${slug}`;

test.describe("links crawlables a las landings de servicio", () => {
  // Sin JavaScript no se puede abrir ningún panel: los links tienen que venir
  // igual en el documento que sirve el servidor.
  test.use({ javaScriptEnabled: false });

  for (const locale of LOCALES) {
    test(`/${locale} expone los 7 links dentro de #s03`, async ({ page }) => {
      await page.goto(`/${locale}`);

      const anchors = page.locator(`#s03 a[href^="/${locale}/services/"]`);
      await expect(anchors).toHaveCount(7);
      expect(SERVICE_SLUGS).toHaveLength(7);

      // 7 anchors para 7 slugs: cada slug aparece una sola vez y ninguno falta.
      for (const slug of SERVICE_SLUGS) {
        await expect(
          page.locator(`#s03 a[href="${serviceHref(locale, slug)}"]`),
          `${locale}: ${slug}`,
        ).toHaveCount(1);
      }
    });
  }
});

test.describe("link al detalle con el panel cerrado", () => {
  test("el servicio 2 mantiene su link en el DOM aunque el panel esté cerrado", async ({ page }) => {
    await page.goto("/es");

    const panel = page.locator("#service-panel-1");
    await expect(panel).toBeHidden();

    const link = panel.locator('a[href="/es/services/digital-product-development"]');
    await expect(link).toBeAttached();
    await expect(link).toBeHidden();
  });
});

test.describe("footer", () => {
  for (const locale of LOCALES) {
    test(`/${locale} linkea integraciones enterprise y producto greenfield`, async ({ page }) => {
      await page.goto(`/${locale}`);

      const footer = page.locator("#site-footer");
      await expect(
        footer.locator(`a[href="${serviceHref(locale, "enterprise-integrations")}"]`),
      ).toHaveCount(1);
      await expect(
        footer.locator(`a[href="${serviceHref(locale, "digital-product-development")}"]`),
      ).toHaveCount(1);
    });
  }
});
