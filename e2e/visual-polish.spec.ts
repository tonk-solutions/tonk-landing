import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, test } from "@playwright/test";

/**
 * Visual polish checks for TL-40.
 *
 * They pin the four things a screenshot review cannot catch on its own: the
 * body really resolves to the Geist stack, the English locale exposes no
 * Spanish accessible names, the hero call to action is a real anchor to the
 * contact section, and the mobile sticky call to action shows up on a phone.
 */

/** Spanish words that must never reach an accessible name on `/en`. */
const SPANISH_ACCESSIBLE_NAMES = /Navegación|Abrir|Cerrar|Redes/;

const HERO = (
  JSON.parse(
    readFileSync(resolve(process.cwd(), "messages/es.json"), "utf8")
  ) as { hero: { cta: string } }
).hero;

test("the body resolves to the Geist stack on /es", async ({ page }) => {
  await page.goto("/es");

  const fontFamily = await page.evaluate(
    () => getComputedStyle(document.body).fontFamily
  );

  // `geist/font` generates a hashed family name (e.g. `__GeistSans_1a2b3c`), so
  // the check matches the name, not a literal "GeistSans".
  expect(fontFamily).toMatch(/geist/i);
  // The first family wins: the chain must not fall through to Inter/system-ui.
  expect(fontFamily.split(",")[0]).toMatch(/geist/i);
});

test("/en exposes no Spanish accessible names in header, footer or hero", async ({
  page,
}) => {
  await page.goto("/en");

  const names = await page.evaluate(() => {
    const roots = ["header", "footer", "#hero"]
      .map((selector) => document.querySelector(selector))
      .filter((root): root is Element => root !== null);

    return roots.flatMap((root) =>
      Array.from(root.querySelectorAll("[aria-label], img[alt]")).flatMap(
        (element) => {
          const values = [
            element.getAttribute("aria-label"),
            element.getAttribute("alt"),
          ];
          return values.filter((value): value is string => Boolean(value));
        }
      )
    );
  });

  // Sanity check: the three regions do carry accessible names to inspect.
  expect(names.length).toBeGreaterThan(0);

  for (const name of names) {
    expect(name, `"${name}" must not be Spanish on /en`).not.toMatch(
      SPANISH_ACCESSIBLE_NAMES
    );
  }
});

test("the hero call to action is an anchor to the contact section", async ({
  page,
}) => {
  await page.goto("/es");

  const cta = page.locator('#hero a[href="#contacto"]');

  await expect(cta).toHaveCount(1);
  await expect(cta).toBeVisible();
  await expect(cta).toHaveText(HERO.cta);
});

test("the sticky mobile call to action is visible on a 390x844 viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/es");

  const sticky = page.getByTestId("mobile-sticky-cta");
  await expect(sticky).toBeVisible();

  const cta = sticky.getByRole("link", { name: HERO.cta });
  await expect(cta).toBeVisible();

  const box = await sticky.boundingBox();
  expect(box).not.toBeNull();
  if (box) {
    // Fixed to the bottom edge: fully inside the phone viewport.
    expect(box.y).toBeGreaterThan(0);
    expect(box.y + box.height).toBeLessThanOrEqual(845);
    expect(box.x + box.width).toBeLessThanOrEqual(391);
  }
});
