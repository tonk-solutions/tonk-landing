import { expect, test } from "@playwright/test";

/**
 * Hero tagline checks for TL-41.
 *
 * The tagline is the first promise the visitor reads, so it must be on the
 * first screen without scrolling: Spanish and English, on the reference
 * desktop and on the phones we support, with its box fully inside the initial
 * viewport.
 */

type EmulatedDevice = {
  name: string;
  viewport: { width: number; height: number };
  /** Phones emulate touch and a 3x pixel ratio; the desktop box does not. */
  phone?: boolean;
};

const LOCALES = ["es", "en"] as const;

/** Copy the hero must show, verbatim, per locale. */
const TAGLINE = {
  es: "Integramos lo que tenés. Construimos lo que falta",
  en: "We integrate what you have. We build what's missing",
} as const;

const DEVICES: EmulatedDevice[] = [
  { name: "desktop", viewport: { width: 1280, height: 720 } },
  { name: "phone 390x844", viewport: { width: 390, height: 844 }, phone: true },
  { name: "phone 360x640", viewport: { width: 360, height: 640 }, phone: true },
];

for (const locale of LOCALES) {
  for (const device of DEVICES) {
    test.describe(`/${locale} hero tagline on ${device.name}`, () => {
      test.use(
        device.phone
          ? { viewport: device.viewport, isMobile: true, hasTouch: true, deviceScaleFactor: 3 }
          : { viewport: device.viewport }
      );

      test("sits fully inside the initial viewport, no scroll", async ({ page }) => {
        await page.goto(`/${locale}`);

        const tagline = page.getByTestId("hero-tagline");
        await expect(tagline).toBeVisible();
        await expect(tagline).toHaveText(TAGLINE[locale]);

        // The block fades in with a transform, so the box is only final once
        // every animation on it has finished.
        await tagline.evaluate((el) =>
          Promise.all(
            (el.closest(".hero-fade-block-1") ?? el).getAnimations().map((animation) => animation.finished)
          )
        );

        // Nothing has scrolled yet, so the box is measured against the viewport.
        expect(await page.evaluate(() => window.scrollY)).toBe(0);

        const box = await tagline.boundingBox();
        if (!box) throw new Error("the hero tagline has no bounding box");

        expect(box.y).toBeGreaterThanOrEqual(0);
        expect(box.y + box.height).toBeLessThanOrEqual(device.viewport.height);
      });
    });
  }
}
