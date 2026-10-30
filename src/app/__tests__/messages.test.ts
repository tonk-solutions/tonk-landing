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

  it("no menciona DUCE: el producto se llama Konekta", () => {
    expect(esTexts).not.toMatch(/DUCE/i);
    expect(es.projects.items[0].name).toBe("Konekta");
    expect(en.projects.items[0].name).toBe("Konekta");
  });

  it("no tiene etiquetas de vocero ni sección de comentarios", () => {
    for (const text of [...texts(es), ...texts(en)]) {
      expect(text).not.toMatch(/vocero|spokesperson/i);
    }
    expect(Object.keys(es)).not.toContain("comments");
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

  it("la barra de integraciones declara 8 plataformas sin SAP", () => {
    expect(es.integrations.platforms).toHaveLength(8);
    expect(es.integrations.platforms).not.toContain("SAP");
  });
});
