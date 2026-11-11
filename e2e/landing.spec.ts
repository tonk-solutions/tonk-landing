import { expect, test } from "@playwright/test";

/** El riel del índice. Se nombra una sola vez: también se usa dentro de `page.evaluate`. */
const RAIL = 'nav[aria-label="Índice de secciones"]';

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

  test("los proyectos greenfield no publican fichas ni nombres comerciales", async ({ page }) => {
    await page.goto("/es");
    const projects = page.locator("#s04");

    await expect(projects).toContainText("Proyectos greenfield.");
    await expect(projects).toContainText("Arquitectura, backend, frontend y producción");
    await expect(projects.getByRole("heading", { level: 3 })).toHaveCount(0);
    await expect(projects).not.toContainText("Producto greenfield");
    await expect(projects).not.toContainText("DUCE");
    await expect(projects).not.toContainText("Konekta");
    await expect(projects).not.toContainText("Clank");
    await expect(page.locator("#s07")).not.toContainText("Experiencia previa, no clientes de Tonk");

    await page.goto("/en");
    const projectsEn = page.locator("#s04");
    await expect(projectsEn).toContainText("Greenfield projects.");
    await expect(projectsEn.getByRole("heading", { level: 3 })).toHaveCount(0);
    await expect(projectsEn).not.toContainText("Greenfield product");
    await expect(page.locator("#s07")).not.toContainText("Prior experience, not Tonk clients");
  });

  test("solo Rodrigo es vocero y los otros founders conservan nombre sin LinkedIn", async ({ page }) => {
    await page.goto("/es");
    const team = page.locator("#s08");

    await expect(team.getByRole("heading", { name: "Matías Castillo" })).toBeVisible();
    await expect(team.getByRole("heading", { name: "Nicolás Gómez" })).toBeVisible();
    await expect(team.getByRole("heading", { name: "Rodrigo Hernandez" })).toBeVisible();
    await expect(team.getByText("Vocero", { exact: true })).toHaveCount(1);
    await expect(team.locator('a[href*="linkedin.com"]')).toHaveCount(1);
    await expect(team.locator('a[href*="linkedin.com"]')).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/rodrigoenzohernandez/",
    );

    const html = await page.content();
    expect(html).not.toMatch(/linkedin\.com\/in\/matias|linkedin\.com\/in\/nicolas/i);
    expect(html).not.toMatch(/millones/i);
    expect(html).not.toMatch(/BBVA|Santander|\bICBC\b|Endava|Rootstrap|Konekta|\bClank\b|\bDUCE\b/i);
    expect(html).not.toMatch(/comentarios de clientes/i);

    await page.goto("/en");
    const teamEn = page.locator("#s08");
    await expect(teamEn.getByRole("heading", { name: "Matías Castillo" })).toBeVisible();
    await expect(teamEn.getByRole("heading", { name: "Nicolás Gómez" })).toBeVisible();
    await expect(teamEn.getByRole("heading", { name: "Rodrigo Hernandez" })).toBeVisible();
    await expect(teamEn.getByText("Spokesperson", { exact: true })).toHaveCount(1);
    await expect(teamEn.locator('a[href*="linkedin.com"]')).toHaveCount(1);
    expect(await page.content()).not.toMatch(/linkedin\.com\/in\/matias|linkedin\.com\/in\/nicolas/i);
    expect(await page.content()).not.toMatch(/BBVA|Santander|\bICBC\b|Endava|Rootstrap|Konekta|\bClank\b|\bDUCE\b/i);
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

test.describe("jerarquía de lectura", () => {
  test("las fuentes Geist resuelven: la página no cae a una serif del sistema", async ({ page }) => {
    await page.goto("/es");
    await page.evaluate(() => document.fonts.ready);

    const fonts = await page.evaluate(() => {
      const family = (selector: string) =>
        getComputedStyle(document.querySelector(selector)!).fontFamily.split(",")[0].trim();

      return { h1: family("h1"), monoLabel: family("#s02 h2 span:last-child") };
    });

    expect(fonts.h1).toContain("Geist");
    expect(fonts.monoLabel).toContain("Geist Mono");
  });

  test("la escalera tipográfica tiene escalón: h1 ≥ 1.6 × h2 y h2 ≥ 2 × body", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/es");

    const scale = await page.evaluate(() => {
      const size = (element: Element) => parseFloat(getComputedStyle(element).fontSize);

      return {
        h1: size(document.querySelector("h1")!),
        h2: size(document.querySelector("#s03 h2")!),
        body: size(document.querySelector("#s05 dd")!),
      };
    });

    expect(scale.h1 / scale.h2).toBeGreaterThanOrEqual(1.6);
    expect(scale.h2 / scale.body).toBeGreaterThanOrEqual(2);
  });

  test("los nueve números de sección miden 14px y no usan el acento", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/es");

    const numbers = await page.evaluate(() => {
      const accent = "rgb(61, 245, 200)";

      return ["01", "02", "03", "04", "05", "06", "07", "08", "09"].map((label, index) => {
        const section = document.getElementById(`s${String(index + 1).padStart(2, "0")}`)!;
        // Se busca por su texto: los nombres de clase están hasheados y el kicker
        // envuelve al número en dos spans. El primero en orden de documento es el
        // de la cabecera de la sección.
        const number = [...section.querySelectorAll("span")].find(
          (span) => span.textContent?.trim() === label,
        )!;
        const style = getComputedStyle(number);

        return { label, size: parseFloat(style.fontSize), accent: style.color === accent };
      });
    });

    for (const number of numbers) {
      expect(number.size, `sección ${number.label}`).toBe(14);
      expect(number.accent, `sección ${number.label}`).toBe(false);
    }
  });

  test("la home no tiene tamaños de texto fuera de la escalera", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/es");
    await page.evaluate(() => document.fonts.ready);

    const sizes = await page.evaluate(() => {
      const found = new Set<number>();
      for (const element of document.querySelectorAll("main *")) {
        if (!element.textContent?.trim()) continue;
        // Las etiquetas del diagrama son SVG: escalan con el viewBox y no son
        // texto de lectura.
        if (element.closest("svg")) continue;
        found.add(Math.round(parseFloat(getComputedStyle(element).fontSize) * 100) / 100);
      }
      // 15px es el tamaño de los controles (CTA y enlaces), no de un nivel de lectura.
      return [...found].filter((size) => size !== 15).sort((a, b) => a - b);
    });

    // micro, detalle, cuerpo, subtítulo, claim y titular.
    expect(sizes).toEqual([11, 14, 16, 21.6, 37.44, 68]);
  });

  test("cada claim de sección entra en dos líneas a 1440px", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/es");
    await page.evaluate(() => document.fonts.ready);

    const lines = await page.evaluate(() => {
      const result: Record<string, number> = {};
      for (const id of ["s03", "s04", "s05", "s06", "s07", "s08", "s09"]) {
        const heading = document.querySelector(`#${id} h2`)!;
        const range = document.createRange();
        range.selectNodeContents(heading);
        result[id] = range.getClientRects().length;
      }
      return result;
    });

    for (const [id, count] of Object.entries(lines)) expect(count, id).toBeLessThanOrEqual(2);
  });

  test("el índice lateral nombra las secciones y los nombres se leen sin hover", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/es");

    const index = page.getByRole("navigation", { name: "Índice de secciones" });

    await expect(index.locator("a").nth(2)).toContainText("Servicios");
    await expect(index.locator("a").nth(2)).toContainText("03");

    const rail = await page.evaluate(() => {
      const items = [...document.querySelectorAll('nav[aria-label="Índice de secciones"] a')];
      const label = (anchor: Element) => anchor.querySelector("span:last-child")!;
      const contentLeft = document.querySelector("main section h1, main section h2")!.getBoundingClientRect()
        .left;

      return {
        count: items.length,
        // Playwright considera visible a un elemento con opacity 0, así que la
        // opacidad se mide a mano.
        hidden: items.filter((anchor) => getComputedStyle(label(anchor)).opacity !== "1").length,
        empty: items.filter((anchor) => !label(anchor).textContent?.trim()).length,
        overlap: Math.max(...items.map((anchor) => anchor.getBoundingClientRect().right)) - contentLeft,
      };
    });

    expect(rail.count).toBe(9);
    expect(rail.hidden).toBe(0);
    expect(rail.empty).toBe(0);
    expect(rail.overlap).toBeLessThan(0);
  });
});

test.describe("marca", () => {
  test("el header muestra el lockup oficial (isotipo de un nodo y wordmark) sin SOLUTIONS", async ({ page }) => {
    await page.goto("/es");
    const header = page.locator("header").first();

    await expect(header.locator("svg circle")).toHaveCount(1);
    await expect(header.getByRole("img", { name: "Tonk" })).toBeVisible();
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

  test("el menú mobile mapea las nueve secciones", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/es");

    await page.locator('button[aria-controls="main-nav-mobile"]').click();
    await expect(page.locator("#main-nav-mobile a")).toHaveCount(9);
    await expect(page.locator("#main-nav-mobile a").nth(1)).toContainText("Plataformas");
  });

  test("el índice lateral se oculta en mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/es");

    await expect(page.getByRole("navigation", { name: "Índice de secciones" })).toBeHidden();
  });

  test("el índice marca la sección que se está leyendo, no la anterior", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    // Sin scroll suave: el índice tiene que resolverse en el mismo scroll.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/es");

    const current = () =>
      page.evaluate(
        (selector) =>
          document.querySelector(`${selector} a[aria-current="true"]`)?.getAttribute("href"),
        RAIL,
      );

    for (const id of ["s05", "s07", "s03"]) {
      await page.evaluate((sectionId) => {
        document.getElementById(sectionId)!.scrollIntoView({ block: "start" });
      }, id);

      await expect.poll(current, { timeout: 5_000 }).toBe(`#${id}`);
      await expect(page.locator(`${RAIL} a[aria-current="true"]`)).toHaveCount(1);
    }

    // Al pie de página la última sección puede no llegar nunca a la línea de lectura.
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await expect.poll(current, { timeout: 5_000 }).toBe("#s09");
  });

  // S28/S29: el riel tiene que leerse entero y no pisar la hoja del diagnóstico.
  // El ancho del riel sale del gutter de `.home-shell`, así que el test fija el valor
  // de cada corte: sin eso, volver al gutter de la r2 (116-124px) recorta los nombres
  // sin que la suite lo vea.
  for (const { width, gutter } of [
    { width: 1280, gutter: 160 },
    { width: 1440, gutter: 160 },
    { width: 1680, gutter: 176 },
  ]) {
    test(`el índice se lee entero y no pisa la hoja del diagnóstico a ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/es");

      const rail = page.getByRole("navigation", { name: "Índice de secciones" });
      await expect(rail).toBeVisible();
      await expect(rail.locator("a")).toHaveCount(9);

      const geometry = await page.evaluate((selector) => {
        const items = [...document.querySelectorAll(`${selector} a`)].map((anchor) => {
          const label = anchor.lastElementChild as HTMLElement;
          const style = getComputedStyle(anchor);

          return {
            fontSize: style.fontSize,
            minHeight: style.minHeight,
            truncated: label.scrollWidth > label.clientWidth + 1,
            right: anchor.getBoundingClientRect().right,
          };
        });

        // La hoja del diagnóstico es el `SurfaceBlock` que envuelve al `dl`.
        const sheet = document.querySelector("#s05 dl")!.parentElement!.getBoundingClientRect();

        return {
          items,
          sheetLeft: sheet.left,
          railWidth: document.querySelector(selector)!.getBoundingClientRect().width,
        };
      }, RAIL);

      expect(geometry.railWidth).toBe(gutter);
      expect(geometry.items).toHaveLength(9);

      for (const item of geometry.items) {
        expect(item.fontSize).toBe("14px");
        expect(item.minHeight).toBe("34px");
        expect(item.truncated).toBe(false);
      }

      // El riel no puede ser más ancho que el gutter ni meterse debajo de la hoja.
      expect(geometry.sheetLeft).toBeGreaterThan(Math.max(...geometry.items.map((item) => item.right)));
    });
  }

  test("el índice responde al hover también en la sección activa", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/es");
    await page.evaluate(() => document.getElementById("s05")!.scrollIntoView({ block: "start" }));

    const active = page.locator(`${RAIL} a[aria-current="true"]`);
    await expect(active).toHaveCount(1);

    const background = () => active.evaluate((element) => getComputedStyle(element).backgroundColor);
    const idle = await background();
    const box = await active.boundingBox();

    expect(box).not.toBeNull();
    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);

    await expect.poll(background, { timeout: 5_000 }).not.toBe(idle);
  });

  test("el CTA fijo mobile aparece después del hero y no tapa el contacto", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    // Sin scroll suave: el desplazamiento tiene que ser determinista para el test.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/es");

    const bar = page.locator('[aria-hidden="true"], [aria-hidden="false"]').filter({ hasText: /WhatsApp|Escribinos/ });
    await expect.poll(() => bar.first().getAttribute("aria-hidden"), { timeout: 10_000 }).toBe("true");

    await page.locator("#s03").scrollIntoViewIfNeeded();
    await expect.poll(() => bar.first().getAttribute("aria-hidden"), { timeout: 10_000 }).toBe("false");

    await page.locator("#s09").scrollIntoViewIfNeeded();
    await expect.poll(() => bar.first().getAttribute("aria-hidden"), { timeout: 10_000 }).toBe("true");
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

test.describe("chrome compartido fuera de la home", () => {
  const servicePath = "/es/services/enterprise-integrations";

  test("el selector de idioma conserva la ruta del detalle de servicio", async ({ page }) => {
    const response = await page.goto(servicePath);
    expect(response?.status()).toBe(200);

    await page.getByRole("link", { name: "EN", exact: true }).click();
    await page.waitForURL("**/en/services/enterprise-integrations");

    expect(new URL(page.url()).pathname).toBe("/en/services/enterprise-integrations");
    await expect(page.locator("main#main")).toBeVisible();
  });

  test("hay un solo skip link por página", async ({ page }) => {
    await page.goto("/es");
    await expect(page.locator("a.skip-link")).toHaveCount(1);

    await page.goto(servicePath);
    await expect(page.locator("a.skip-link")).toHaveCount(1);
  });

  test("el skip link apunta a un main existente en el detalle de servicio", async ({ page }) => {
    await page.goto(servicePath);

    await expect(page.locator("a.skip-link")).toHaveAttribute("href", "#main");
    await expect(page.locator("main#main")).toHaveCount(1);
  });

  test("el nav del header vuelve a la home y ancla la sección de servicios", async ({ page }) => {
    test.skip((page.viewportSize()?.width ?? 1440) < 1024, "el nav de escritorio está oculto en mobile");
    await page.goto(servicePath);

    await page.locator("header nav a", { hasText: "Servicios" }).first().click();
    await page.waitForURL("**/es#s03");

    // Lo que se arregló es el scroll: la sección tiene que quedar a la vista.
    await expect
      .poll(() => page.evaluate(() => Math.round(document.getElementById("s03")!.getBoundingClientRect().top)), {
        timeout: 10_000,
      })
      .toBeLessThan(200);
    await expect(page.locator("#s03")).toBeVisible();
  });

  test("el volver del detalle de servicio ancla la sección de servicios", async ({ page }) => {
    await page.goto(servicePath);

    const back = page.locator('main a[href$="#s03"]').first();
    await expect(back).toBeVisible();
    await expect(back).toHaveAttribute("href", /\/es#s03$/);
  });
});


test.describe("ancho en mobile", () => {
  // S1 de odd/tasks/landing-mejoras.md: en inglés la frase resaltada del hero
  // desbordaba el viewport entre 320px y 430px. El switch de CSS está en 768px,
  // así que la banda 431-767 y el borde 767/768 también entran en el guard.
  for (const width of [320, 360, 390, 430, 640, 767, 768]) {
    test(`sin desborde horizontal a ${width}px en los dos idiomas`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });

      for (const locale of ["es", "en"]) {
        await page.goto(`/${locale}`, { waitUntil: "networkidle" });

        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );

        expect(overflow, `/${locale} a ${width}px desborda ${overflow}px`).toBeLessThanOrEqual(0);
      }
    });
  }
});

test.describe("llms.txt", () => {
  test("responde 200 con texto plano, enlaces de servicio y los co-founders", async ({ request }) => {
    const response = await request.get("/llms.txt");
    const body = await response.text();

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toMatch(/text\/plain/);
    expect(body).toContain("Matías Castillo");
    expect(body).toContain("https://tonksolutions.com.ar/es/services/enterprise-integrations");
    expect(body).not.toMatch(/Ignacio|Sileo/i);
  });
});

test.describe("datos estructurados", () => {
  // Cierra el cableado real de layout.tsx: el unit test usa pickFounders, este
  // mira el JSON-LD tal como lo sirve el HTML.
  for (const locale of ["es", "en"]) {
    test(`el JSON-LD de /${locale} conserva los tres founders y solo el LinkedIn del vocero`, async ({ page }) => {
      await page.goto(`/${locale}`);

      const raw = await page.locator("script#structured-data").textContent();
      const graph = JSON.parse(raw ?? "{}") as {
        "@graph": { "@type": string; founder?: unknown[]; knowsAbout?: string[] }[];
      };
      const organization = graph["@graph"].find((node) => node["@type"] === "Organization") as {
        founder: { name: string; sameAs?: string[] }[];
        knowsAbout: string[];
      };

      expect(organization.founder.map((person) => person.name)).toEqual([
        "Matías Castillo",
        "Nicolás Gómez",
        "Rodrigo Hernandez",
      ]);
      const withProfile = organization.founder.filter((person) => person.sameAs);
      expect(withProfile.map((person) => person.name)).toEqual(["Rodrigo Hernandez"]);
      expect(withProfile[0]?.sameAs).toEqual([
        "https://www.linkedin.com/in/rodrigoenzohernandez/",
      ]);
      expect(raw).not.toMatch(/linkedin\.com\/in\/matias|linkedin\.com\/in\/nicolas/i);
      expect(organization.knowsAbout).toEqual(
        expect.arrayContaining(["AWS", "Google Cloud", "Firebase"]),
      );
      expect(raw).not.toMatch(/Ignacio|Sileo/i);
    });
  }
});

test.describe("menú mobile y consola limpia", () => {
  test("el menú mobile navega a la sección, cierra y scrollea", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/es");

    // El label del botón cambia a "Cerrar" al abrir: se ancla por aria-controls.
    const menuButton = page.locator('button[aria-controls="main-nav-mobile"]');
    await menuButton.click();
    await expect(menuButton).toHaveAttribute("aria-expanded", "true");

    await page.locator("#main-nav-mobile a", { hasText: "Servicios" }).click();
    await expect(menuButton).toHaveAttribute("aria-expanded", "false");
    await expect(page).toHaveURL(/\/es#s03$/);

    await expect
      .poll(() => page.evaluate(() => Math.round(document.getElementById("s03")!.getBoundingClientRect().top)), {
        timeout: 10_000,
      })
      .toBeLessThan(200);
  });

  test("ninguna ruta emite errores de hidratación ni excepciones", async ({ page }) => {
    const errors: string[] = [];
    // El ruido de red (fuentes, prefetch) no es un defecto de la página.
    const isHydrationOrCrash = (text: string) =>
      /hydrat|minified react error|418|423|did not match/i.test(text);

    page.on("console", (message) => {
      if (message.type() === "error" && isHydrationOrCrash(message.text())) errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));

    for (const path of ["/es", "/en", "/es/services/enterprise-integrations"]) {
      await page.goto(path, { waitUntil: "networkidle" });
      await page.waitForTimeout(150);
    }

    expect(errors).toEqual([]);
  });
});
