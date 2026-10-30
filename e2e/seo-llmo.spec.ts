import { expect, test, type Page } from "@playwright/test";

/**
 * Superficies SEO/LLMO servidas (spec S7 de `odd/tasks/seo-llmo-landing.md`): se
 * verifica el HTML y los archivos que recibe un crawler o un modelo, no lo que
 * arma el componente en memoria.
 */
const SITE_URL = "https://tonksolutions.com.ar";

interface JsonLdNode {
  "@type": string;
  "@id"?: string;
  [key: string]: unknown;
}

async function readGraph(page: Page, id: string) {
  const raw = await page.locator(`script#${id}`).textContent();
  expect(raw).toBeTruthy();

  return JSON.parse(raw as string) as { "@graph": JsonLdNode[] };
}

function typesOf(graph: { "@graph": JsonLdNode[] }): string[] {
  return graph["@graph"].map((node) => node["@type"]);
}

test.describe("head y datos estructurados", () => {
  test("la home publica canonical y hreflang con x-default", async ({ page }) => {
    await page.goto("/es");

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `${SITE_URL}/es`
    );

    for (const [hreflang, path] of [
      ["es", "/es"],
      ["en", "/en"],
      ["x-default", "/es"],
    ]) {
      await expect(
        page.locator(`link[rel="alternate"][hreflang="${hreflang}"]`)
      ).toHaveAttribute("href", `${SITE_URL}${path}`);
    }
  });

  test("la imagen social declarada existe y responde 200", async ({ page }) => {
    await page.goto("/es");

    const ogImage = await page.locator('meta[property="og:image"]').getAttribute("content");
    expect(ogImage).toBeTruthy();
    await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute(
      "content",
      /Tonk Solutions/i
    );

    const response = await page.request.get(ogImage as string);
    expect(response.status()).toBe(200);
  });

  test("la home publica Organization, WebSite, servicios y equipo", async ({ page }) => {
    await page.goto("/es");

    const types = typesOf(await readGraph(page, "structured-data"));
    expect(types).toContain("Organization");
    expect(types).toContain("WebSite");
    expect(types).toContain("ItemList");
    expect(types).toEqual(expect.arrayContaining(["Person", "Person", "Person"]));

    const homePage = typesOf(await readGraph(page, "structured-data-home"));
    expect(homePage).toContain("WebPage");
  });

  test("el detalle de servicio publica Service y breadcrumb", async ({ page }) => {
    await page.goto("/es/services/enterprise-integrations");

    const types = typesOf(await readGraph(page, "structured-data-service"));
    expect(types).toEqual(expect.arrayContaining(["WebPage", "Service", "BreadcrumbList"]));

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `${SITE_URL}/es/services/enterprise-integrations`
    );
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute(
      "href",
      `${SITE_URL}/es/services/enterprise-integrations`
    );
  });
});

test.describe("artefactos para modelos y crawlers", () => {
  test("llms.txt se sirve como texto plano con el índice curado", async ({ request }) => {
    const response = await request.get("/llms.txt");

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("text/plain");

    const body = await response.text();
    expect(body.startsWith("# Tonk Solutions")).toBe(true);
    expect(body).toContain("## Servicios");
    expect(body).toContain(`${SITE_URL}/es/services/enterprise-integrations`);
  });

  test("llms-full.txt se sirve como texto plano con el contenido completo", async ({
    request,
  }) => {
    const response = await request.get("/llms-full.txt");

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("text/plain");

    const body = await response.text();
    expect(body).toContain("## Equipo");
    expect(body).toContain("## Contacto");
  });

  test("robots.txt declara a los crawlers de IA sin bloquear rutas", async ({ request }) => {
    const response = await request.get("/robots.txt");

    expect(response.status()).toBe(200);

    const body = await response.text();
    for (const crawler of ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended"]) {
      expect(body).toContain(`User-Agent: ${crawler}`);
    }

    expect(body).not.toContain("Disallow: /");
    expect(body).toContain("Sitemap:");
  });

  test("sitemap.xml declara x-default en cada entrada", async ({ request }) => {
    const response = await request.get("/sitemap.xml");

    expect(response.status()).toBe(200);

    const body = await response.text();
    expect(body).toContain('hreflang="x-default"');
    expect(body).toContain("<lastmod>");
  });
});
