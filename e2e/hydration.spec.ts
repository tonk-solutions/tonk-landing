import { expect, test } from "@playwright/test";

for (const locale of ["es", "en"]) {
  test(`/${locale} hydrates without errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error" && /hydrat/i.test(msg.text())) errors.push(msg.text());
    });
    page.on("pageerror", (err) => {
      if (/hydrat/i.test(err.message)) errors.push(err.message);
    });

    const response = await page.goto(`/${locale}`);
    expect(response?.status()).toBe(200);
    await page.waitForLoadState("networkidle");

    // SSR must not place Emotion <style> tags in <body> before the Home root div.
    const html = (await response?.text()) ?? "";
    const bodyStart = html.indexOf("<body");
    const homeStart = html.indexOf("min-height:100vh", bodyStart);
    expect(bodyStart).toBeGreaterThan(-1);
    expect(homeStart).toBeGreaterThan(bodyStart);
    expect(html.slice(bodyStart, homeStart)).not.toMatch(/<style[^>]*data-emotion/);

    expect(errors).toEqual([]);
  });
}
