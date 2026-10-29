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
