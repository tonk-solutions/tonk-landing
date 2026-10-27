import { expect, test } from "@playwright/test";

const LOCALES = ["es", "en"] as const;
const FOUNDERS = ["Matías Castillo", "Nicolás Gómez", "Rodrigo Hernandez"];
const SPOKESPERSON_LABEL = { es: "Vocero", en: "Spokesperson" } as const;

for (const locale of LOCALES) {
  test.describe(`/${locale} redesign`, () => {
    test("renders the graphite page background", async ({ page }) => {
      await page.goto(`/${locale}`);

      const background = await page.evaluate(
        () => getComputedStyle(document.body).backgroundColor
      );
      expect(background).toBe("rgb(23, 25, 28)");
    });

    test("lists the three founders with exactly two spokesperson badges", async ({ page }) => {
      await page.goto(`/${locale}`);

      const team = page.locator("#equipo");
      await team.scrollIntoViewIfNeeded();

      await expect(team.locator('[data-testid="team-card"]')).toHaveCount(3);
      for (const founder of FOUNDERS) {
        await expect(team.getByText(founder, { exact: true })).toBeVisible();
      }

      const badges = team.locator('[data-testid="spokesperson-badge"]');
      await expect(badges).toHaveCount(2);
      await expect(
        team.locator('[data-testid="team-card"]:has([data-testid="spokesperson-badge"])')
      ).toHaveCount(2);

      for (let index = 0; index < 2; index += 1) {
        await expect(badges.nth(index)).toHaveText(SPOKESPERSON_LABEL[locale]);
      }
    });

    test("shows the Tonk Solutions lockup in the header", async ({ page }) => {
      await page.goto(`/${locale}`);

      await expect(page.locator('header img[alt="Tonk Solutions"]')).toBeVisible();
    });

    test("serves the declared favicon", async ({ page, request }) => {
      await page.goto(`/${locale}`);

      const iconLinks = page.locator('link[rel="icon"]');
      await expect(iconLinks).not.toHaveCount(0);

      const hrefs = await iconLinks.evaluateAll((links) =>
        links
          .map((link) => link.getAttribute("href"))
          .filter((href): href is string => Boolean(href))
      );
      // Every declared icon must come with an href: none may be filtered away.
      await expect(iconLinks).toHaveCount(hrefs.length);

      for (const href of hrefs) {
        const response = await request.get(href);
        expect(response.status(), `${href} must answer 200`).toBe(200);
      }
    });
  });
}
