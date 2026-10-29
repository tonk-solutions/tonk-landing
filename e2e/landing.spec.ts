import { expect, test } from "@playwright/test";

/**
 * Cubre las specs del port (odd/tasks/landing-documento-ingenieria.md) sobre la
 * página renderizada. Cada bloque referencia la spec que protege.
 */
test.describe("estructura y contenido", () => {
  test("las nueve secciones están en orden y son las únicas anclas del índice", async ({ page }) => {
    await page.goto("/es");

    const ids = await page.locator("main section").evaluateAll((sections) =>
      sections.map((section) => section.id),
    );

    expect(ids).toEqual(["s01", "s02", "s03", "s04", "s05", "s06", "s07", "s08", "s09"]);
  });

  test("el titular tiene las dos líneas de la spec S2", async ({ page }) => {
    await page.goto("/es");
    const heading = page.getByRole("heading", { level: 1 });

    await expect(heading).toContainText("Integraciones enterprise complejas,");
    await expect(heading).toContainText("y producto desde cero.");
  });

  test("el sitio no menciona SAP en ningún texto visible", async ({ page }) => {
    await page.goto("/es");
    const body = await page.locator("body").innerText();

    expect(body).not.toMatch(/\bSAP\b/i);
  });

  test("los proyectos son Konekta y Clank, sin DUCE", async ({ page }) => {
    await page.goto("/es");
    const projects = page.locator("#s04");

    await expect(projects).toContainText("Konekta");
    await expect(projects).toContainText("Clank");
    await expect(projects).not.toContainText("DUCE");
  });

  test("no hay etiquetas de vocero ni sección de comentarios", async ({ page }) => {
    await page.goto("/es");
    const body = await page.locator("body").innerText();

    expect(body).not.toMatch(/vocero/i);
    expect(body).not.toMatch(/comentarios de clientes/i);
  });

  test("el diagnóstico respeta las seis filas", async ({ page }) => {
    await page.goto("/es");
    const labels = await page
      .locator("#s05 dt")
      .evaluateAll((items) => items.map((item) => item.textContent?.trim()));

    expect(labels).toEqual([
      "Alcance",
      "Duración",
      "Presupuesto",
      "Entregable",
      "Pruebas",
      "Plan de mantenimiento",
    ]);
  });

  test("contacto tiene un solo CTA de WhatsApp y ningún mailto", async ({ page }) => {
    await page.goto("/es");
    const contact = page.locator("#s09");

    await expect(contact.getByRole("link")).toHaveCount(1);
    await expect(contact.getByRole("link")).toHaveAttribute("href", /wa\.me/);
    await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
  });
});

test.describe("marca", () => {
  test("el header muestra el isotipo y el wordmark sin SOLUTIONS", async ({ page }) => {
    await page.goto("/es");
    const header = page.locator("header").first();

    await expect(header.locator("svg circle")).toHaveCount(3);
    await expect(header).toContainText("tonk");
    await expect(header).not.toContainText("SOLUTIONS");
  });
});

test.describe("navegación e interacción", () => {
  test("el acordeón abre y cierra con aria-expanded", async ({ page }) => {
    await page.goto("/es");
    const first = page.locator("#s03 button[aria-expanded]").first();

    await expect(first).toHaveAttribute("aria-expanded", "true");
    await first.click();
    await expect(first).toHaveAttribute("aria-expanded", "false");
  });

  test("el índice lateral aparece en desktop y marca la sección activa", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/es");

    const index = page.getByRole("navigation", { name: "Índice de secciones" });
    await expect(index).toBeVisible();
    await expect(index.locator("a")).toHaveCount(9);
    await expect(index.locator('a[aria-current="true"]')).toHaveCount(1);
  });

  test("el índice lateral se oculta en mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/es");

    await expect(page.getByRole("navigation", { name: "Índice de secciones" })).toBeHidden();
  });

  test("el CTA fijo mobile aparece después del hero y no tapa el contacto", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/es");

    const bar = page.locator('[aria-hidden="true"], [aria-hidden="false"]').filter({ hasText: /WhatsApp|Escribinos/ });
    await expect(bar.first()).toBeHidden();

    await page.locator("#s03").scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await expect(bar.first()).toBeVisible();

    await page.locator("#s09").scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await expect(bar.first()).toBeHidden();
  });
});

test.describe("bilingüismo", () => {
  test("la versión en inglés traduce el titular", async ({ page }) => {
    await page.goto("/en");
    const heading = page.getByRole("heading", { level: 1 });

    await expect(heading).toContainText("Complex enterprise integrations,");
    await expect(heading).toContainText("and products built from scratch.");
  });
});
