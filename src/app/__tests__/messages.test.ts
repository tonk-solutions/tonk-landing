import { describe, expect, it } from "vitest";
import es from "../../../messages/es.json";
import en from "../../../messages/en.json";

type Json = Record<string, unknown>;

function paths(value: unknown, prefix = ""): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => paths(item, `${prefix}[${index}]`));
  }
  if (value && typeof value === "object") {
    return Object.entries(value as Json).flatMap(([key, child]) =>
      paths(child, prefix ? `${prefix}.${key}` : key),
    );
  }
  return [prefix];
}

function texts(value: unknown): string[] {
  if (Array.isArray(value)) return value.flatMap(texts);
  if (value && typeof value === "object") return Object.values(value as Json).flatMap(texts);
  return typeof value === "string" ? [value] : [];
}

describe("paridad de mensajes es/en", () => {
  it("declara exactamente las mismas claves en los dos idiomas", () => {
    expect(paths(en).sort()).toEqual(paths(es).sort());
  });

  it("no deja textos vacíos", () => {
    for (const message of [...texts(es), ...texts(en)]) {
      expect(message.trim().length).toBeGreaterThan(0);
    }
  });
});

describe("contenido del rediseño", () => {
  const esTexts = texts(es).join(" \n ");
  const enTexts = texts(en).join(" \n ");

  it("no menciona SAP en ningún idioma", () => {
    expect(esTexts).not.toMatch(/\bSAP\b/i);
    expect(enTexts).not.toMatch(/\bSAP\b/i);
  });

  it("no publica DUCE ni fichas de caso sin contenido útil", () => {
    expect(esTexts).not.toMatch(/\bDUCE\b/i);
    expect(enTexts).not.toMatch(/\bDUCE\b/i);
    expect(es.projects.items).toEqual([]);
    expect(en.projects.items).toEqual([]);
    expect(es.projects.intro.trim().length).toBeGreaterThan(0);
    expect(en.projects.intro.trim().length).toBeGreaterThan(0);
    const projects = [...texts(es.projects), ...texts(en.projects)].join("\n");
    expect(projects).not.toMatch(/Producto greenfield|Greenfield product|no se publican|not published|Stack no publicado|Stack not published/i);
  });

  it("solo Rodrigo es vocero y no hay sección de comentarios", () => {
    for (const messages of [es, en]) {
      const spokespersons = messages.team.members.filter((member) => member.spokesperson === true);

      expect(spokespersons.map((member) => member.name)).toEqual(["Rodrigo Hernandez"]);
      expect("linkedin" in spokespersons[0]).toBe(true);
    }

    expect(es.team.spokespersonLabel).toBe("Vocero");
    expect(en.team.spokespersonLabel).toBe("Spokesperson");
    expect(Object.keys(es)).not.toContain("comments");
  });

  it("separa la experiencia previa de los clientes de Tonk y no publica perfiles ajenos", () => {
    for (const messages of [es, en]) {
      const [matias, nicolas, rodrigo] = messages.team.members;

      expect(matias.name).toBe("Matías Castillo");
      expect(nicolas.name).toBe("Nicolás Gómez");
      expect(rodrigo.name).toBe("Rodrigo Hernandez");
      expect(matias).not.toHaveProperty("linkedin");
      expect(nicolas).not.toHaveProperty("linkedin");
      expect(matias.bio).toMatch(/previa|Prior/);
      expect(nicolas.bio).toMatch(/previa|Prior/);
      expect(matias.bio).toMatch(/No es un cliente de Tonk|Not a Tonk client/);
      expect(nicolas.bio).toMatch(/No es un cliente de Tonk|Not a Tonk client/);
    }

    const blob = [...texts(es.team), ...texts(en.team)].join("\n");
    expect(blob).not.toMatch(/millones|millions/i);
    expect(blob).not.toMatch(/linkedin\.com\/in\/matias|linkedin\.com\/in\/nicolas/i);
  });

  it("home, greenfield y criterio no nombran identificadores sin autorización", () => {
    const identifiers = /BBVA|Santander|\bICBC\b|Endava|Rootstrap|Konekta|\bClank\b|\bDUCE\b/i;

    for (const messages of [es, en]) {
      const blob = texts({
        team: messages.team,
        projects: messages.projects,
        criterio: messages.criterio,
        llms: messages.llms,
      }).join("\n");

      expect(blob).not.toMatch(identifiers);
    }
  });
});

/**
 * El feedback que originó esta pasada fue "tiene mucho texto" (spec S22). El presupuesto
 * es el que evita que el copy vuelva a crecer bloque por bloque.
 */
describe("presupuesto de prosa de la home", () => {
  const PROSE_KEYS = new Set([
    "lede",
    "intro",
    "subtitle",
    "description",
    "bio",
    "value",
    "mission",
    "principles",
    "closing",
  ]);
  const HOME = ["hero", "projects", "diagnostic", "process", "criterio", "team", "contact"];

  function collect(value: unknown, key: string, out: string[]) {
    if (Array.isArray(value)) {
      value.forEach((item) => collect(item, key, out));
      return out;
    }
    if (value && typeof value === "object") {
      for (const [childKey, child] of Object.entries(value as Json)) {
        collect(child, childKey, out);
      }
      return out;
    }
    if (typeof value === "string" && PROSE_KEYS.has(key)) out.push(value);
    return out;
  }

  function homeProse(messages: typeof es) {
    const prose: string[] = [];
    for (const namespace of HOME) collect((messages as unknown as Json)[namespace], namespace, prose);
    // Del acordeón se cuentan solo los dos grupos de la home, no el detalle de servicio.
    collect(messages.services.craft, "craft", prose);
    collect(messages.services.talent, "talent", prose);
    return prose;
  }

  const words = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

  it.each([
    ["es", es],
    ["en", en as typeof es],
  ] as const)("no pasa de 450 palabras de prosa en %s", (_locale, messages) => {
    const total = homeProse(messages).reduce((sum, text) => sum + words(text), 0);
    expect(total).toBeLessThanOrEqual(450);
  });

  it.each([
    ["es", es],
    ["en", en as typeof es],
  ] as const)("ningún bloque de prosa pasa de 22 palabras en %s", (_locale, messages) => {
    const long = homeProse(messages).filter((text) => words(text) > 22);
    expect(long).toEqual([]);
  });

  it("cada sección tiene un claim de 7 palabras o menos", () => {
    const titles = [
      es.services.title,
      es.projects.title,
      es.diagnostic.title,
      es.process.title,
      es.criterio.title,
      es.team.title,
      es.contact.title,
      en.services.title,
      en.projects.title,
      en.diagnostic.title,
      en.process.title,
      en.criterio.title,
      en.team.title,
      en.contact.title,
    ];

    for (const title of titles) expect(words(title)).toBeLessThanOrEqual(7);
  });

  it("la bajada del hero no pasa de 18 palabras", () => {
    expect(words(es.hero.lede)).toBeLessThanOrEqual(18);
    expect(words(en.hero.lede)).toBeLessThanOrEqual(18);
  });
});

describe("specs del titular y del diagnóstico", () => {
  it("el titular tiene las dos líneas exactas", () => {
    expect(es.hero.titleLine1).toBe("Integraciones enterprise complejas,");
    expect(es.hero.titleLine2).toBe("y producto desde cero.");
  });

  it("el diagnóstico respeta el orden de las seis filas", () => {
    expect(es.diagnostic.rows.map((row) => row.label)).toEqual([
      "Alcance",
      "Duración",
      "Presupuesto",
      "Entregable",
      "Pruebas",
      "Plan de mantenimiento",
    ]);
  });

  it("la barra de integraciones declara 11 plataformas, incluidas las cloud, sin SAP", () => {
    expect(es.integrations.platforms).toHaveLength(11);
    expect(en.integrations.platforms).toHaveLength(11);
    // La última entrada está traducida (APIs propias / Own APIs); el resto es igual.
    expect(es.integrations.platforms.slice(0, -1)).toEqual(en.integrations.platforms.slice(0, -1));
    expect(es.integrations.platforms).toEqual(
      expect.arrayContaining(["AWS", "Google Cloud", "Firebase"]),
    );
    expect(es.integrations.platforms).not.toContain("SAP");
    expect(es.integrations.meta).toBe("11 plataformas");
    expect(en.integrations.meta).toBe("11 platforms");
  });
});

describe("mejoras de la landing (odd/tasks/landing-mejoras.md)", () => {
  const esTexts = texts(es).join(" \n ");
  const enTexts = texts(en).join(" \n ");

  it("S2: no menciona Accenture en ningún idioma", () => {
    expect(esTexts).not.toMatch(/Accenture/i);
    expect(enTexts).not.toMatch(/Accenture/i);
    expect(es.criterio.companies).toEqual([]);
    expect(en.criterio.companies).toEqual([]);
  });

  it("S3: AWS, Google Cloud y Firebase están en las dos descripciones del stack", () => {
    const cloudNames = ["AWS", "Google Cloud", "Firebase"];

    for (const cloud of cloudNames) {
      expect(es.llms.cloud).toContain(cloud);
      expect(en.llms.cloud).toContain(cloud);
      expect(es.seo.keywords).toContain(cloud);
      expect(en.seo.keywords).toContain(cloud);
    }

    // Por path: revertir cualquiera de las dos descripciones tiene que hacer caer el test.
    expect(es.services.craft.services[2].title).toBe("Arquitectura y Sistemas Distribuidos");
    expect(es.criterio.pillars[0].title).toBe("Cloud Native");
    expect(en.services.craft.services[2].title).toBe("Architecture and Distributed Systems");
    expect(en.criterio.pillars[0].title).toBe("Cloud Native");

    const descriptions = [
      es.services.craft.services[2].description,
      es.criterio.pillars[0].description,
      en.services.craft.services[2].description,
      en.criterio.pillars[0].description,
    ];

    for (const description of descriptions) {
      for (const cloud of cloudNames) expect(description).toContain(cloud);
    }
  });

  it("S4: no menciona a Ignacio Sileo en ningún idioma", () => {
    expect(esTexts).not.toMatch(/Ignacio|Sileo/i);
    expect(enTexts).not.toMatch(/Ignacio|Sileo/i);
  });

  it("S4: el equipo fundador son tres personas y el archivo canónico no afirma nada de nóminas previas", () => {
    expect(es.team.members).toHaveLength(3);
    expect(es.team.members.map((member) => member.name)).toEqual([
      "Matías Castillo",
      "Nicolás Gómez",
      "Rodrigo Hernandez",
    ]);
    expect(es.llms).not.toHaveProperty("foundersNote");
    expect(en.llms).not.toHaveProperty("foundersNote");
  });
});

/**
 * Residual de TL-23. La paridad de claves es/en ya la cubre
 * «paridad de mensajes es/en». Acá queda lo que ese PR todavía no tenía en main:
 * formas de tú prohibidas, y que «Nuestros Servicios» no entre al catálogo inglés.
 *
 * Decisión de etiquetas: el rediseño ya traduce la rama con `craft.label` y
 * `talent.label` («Grupo A / Craft» / «Group A / Craft», «Grupo B / Talent» /
 * «Group B / Talent»). `services.panelTitle` no existe y el título hardcodeado
 * del panel viejo tampoco. No se vuelven a «Desarrollo de software» / «Talento IT».
 */
describe("voseo y servicios (TL-23)", () => {
  const BANNED_TU_FORMS = [
    "Síguenos",
    "Hablas",
    "Cuéntanos",
    "Necesitas",
    "Encuentras",
    "Tienes",
    "Puedes",
    "Quieres",
    "Escríbenos",
    "Contáctanos",
  ];

  it("no deja formas verbales de tú en es.json", () => {
    const violations = texts(es).flatMap((text) =>
      BANNED_TU_FORMS.filter((word) =>
        new RegExp(`(?<!\\p{L})${word}(?!\\p{L})`, "iu").test(text),
      ).map((word) => `"${word}" in: ${text}`),
    );

    expect(violations).toEqual([]);
  });

  it("no filtra «Nuestros Servicios» al catálogo en inglés", () => {
    expect(JSON.stringify(en)).not.toContain("Nuestros Servicios");
  });

  it("conserva las etiquetas de rama del rediseño, traducidas, sin panelTitle", () => {
    expect(es.services.craft.label).toBe("Grupo A / Craft");
    expect(es.services.talent.label).toBe("Grupo B / Talent");
    expect(en.services.craft.label).toBe("Group A / Craft");
    expect(en.services.talent.label).toBe("Group B / Talent");
    expect(es.services.label).toBe("Servicios");
    expect(en.services.label).toBe("Services");
    expect(es.services).not.toHaveProperty("panelTitle");
    expect(en.services).not.toHaveProperty("panelTitle");
  });
});
