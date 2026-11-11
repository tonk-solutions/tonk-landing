import { expect, test } from "@playwright/test";

/**
 * Residual de TL-23 sobre el DOM actual.
 *
 * La sección de servicios es `#s03` (acordeón), no `#servicios` con radiogroup.
 * `footer.socialLabel` («Síguenos» / «Seguinos») ya no existe: el voseo visible
 * se comprueba en el lede del hero. Las etiquetas de rama son las del rediseño
 * («Grupo A / Craft», «Grupo B / Talent»), no «Desarrollo de software» /
 * «Talento IT» ni un `panelTitle` «Nuestros Servicios» / «Our Services».
 */

const BANNED_TU_FORMS =
  /(?<!\p{L})(Síguenos|Hablas|Cuéntanos|Necesitas|Encuentras|Tienes|Puedes|Quieres|Escríbenos|Contáctanos)(?!\p{L})/iu;

test.describe("i18n de la home (TL-23)", () => {
  test("en /es la sección de servicios está en español y el voseo sigue visible", async ({
    page,
  }) => {
    await page.goto("/es");
    const services = page.locator("#s03");

    await expect(
      services.getByRole("heading", {
        level: 2,
        name: "Dos líneas de trabajo, un estándar técnico.",
      }),
    ).toBeVisible();
    await expect(services.getByText("Grupo A / Craft", { exact: true })).toBeVisible();
    await expect(services.getByText("Grupo B / Talent", { exact: true })).toBeVisible();
    await expect(services.getByRole("button", { name: /Integraciones y Sistemas Enterprise/ })).toBeVisible();
    await expect(page.locator("#s01")).toContainText("Hablás");

    const body = await page.locator("body").innerText();
    expect(body).not.toMatch(BANNED_TU_FORMS);
  });

  test("en /en no queda «Nuestros Servicios» ni las etiquetas en español", async ({ page }) => {
    await page.goto("/en");
    const services = page.locator("#s03");

    await expect(
      services.getByRole("heading", {
        level: 2,
        name: "Two lines of work, one technical standard.",
      }),
    ).toBeVisible();
    await expect(services.getByText("Group A / Craft", { exact: true })).toBeVisible();
    await expect(services.getByText("Group B / Talent", { exact: true })).toBeVisible();
    await expect(
      services.getByRole("button", { name: /Enterprise Integrations and Systems/ }),
    ).toBeVisible();

    await expect(page.getByText("Nuestros Servicios", { exact: true })).toHaveCount(0);
    await expect(services.getByText("Grupo A / Craft", { exact: true })).toHaveCount(0);
    await expect(services.getByText("Grupo B / Talent", { exact: true })).toHaveCount(0);
    await expect(services.getByText("Dos líneas de trabajo, un estándar técnico.")).toHaveCount(0);

    const html = await page.content();
    expect(html).not.toContain("Nuestros Servicios");
  });
});
