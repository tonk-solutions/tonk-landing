import { describe, expect, it } from "vitest";
import es from "../../../messages/es.json";
import en from "../../../messages/en.json";

const SKIP_WORD_KEYS = new Set(["meta", "whatsappText"]);

function words(value: unknown, key = ""): number {
  if (SKIP_WORD_KEYS.has(key)) return 0;
  if (typeof value === "string") return value.trim().split(/\s+/).filter(Boolean).length;
  if (Array.isArray(value)) return value.reduce((sum: number, item) => sum + words(item, key), 0);
  if (value && typeof value === "object") {
    return Object.entries(value).reduce(
      (sum, [childKey, child]) => sum + words(child, childKey),
      0,
    );
  }
  return 0;
}

function texts(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(texts);
  if (value && typeof value === "object") return Object.values(value).flatMap(texts);
  return [];
}

describe("landing de desarrollo de producto digital", () => {
  it.each([
    ["es", es],
    ["en", en],
  ] as const)("el cuerpo visible de %s supera las 500 palabras", (locale, messages) => {
    const total = words(messages.landing.digitalProductDevelopment);
    expect(total, locale).toBeGreaterThan(500);
  });

  it("el título y la meta description son únicos y distintos entre idiomas", () => {
    const esMeta = es.landing.digitalProductDevelopment.meta;
    const enMeta = en.landing.digitalProductDevelopment.meta;
    const esEnterprise = es.landing.enterpriseIntegrations.meta;
    const enEnterprise = en.landing.enterpriseIntegrations.meta;

    expect(esMeta.title).not.toBe(enMeta.title);
    expect(esMeta.description).not.toBe(enMeta.description);
    expect(esMeta.title).not.toBe(esEnterprise.title);
    expect(enMeta.title).not.toBe(enEnterprise.title);
    expect(esMeta.description).not.toBe(es.seo.description);
    expect(enMeta.description).not.toBe(en.seo.description);
    expect(esMeta.title.length).toBeGreaterThan(10);
    expect(enMeta.description.length).toBeGreaterThan(40);
  });

  it("no arrastra la referencia a la sección 04 ni placeholders", () => {
    const blob = [
      es.services.craft.services[1].description,
      en.services.craft.services[1].description,
      ...texts(es.landing.digitalProductDevelopment),
      ...texts(en.landing.digitalProductDevelopment),
    ].join("\n");

    expect(blob).not.toMatch(/secci[oó]n 04/i);
    expect(blob).not.toMatch(/section 04/i);
    expect(blob).not.toMatch(/lorem ipsum|\[TODO\]|\bTBD\b|placeholder/i);
  });

  it("la bajada corta del servicio nombra la idea abierta y cabe en la home", () => {
    const count = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

    expect(es.services.craft.services[1].description).toMatch(/idea/i);
    expect(en.services.craft.services[1].description).toMatch(/idea/i);
    expect(count(es.services.craft.services[1].description)).toBeLessThanOrEqual(22);
    expect(count(en.services.craft.services[1].description)).toBeLessThanOrEqual(22);
  });

  it("el CTA apunta al WhatsApp existente y no inventa precios ni plazos", () => {
    for (const landing of [
      es.landing.digitalProductDevelopment,
      en.landing.digitalProductDevelopment,
    ]) {
      const blob = texts(landing).join("\n");

      expect(landing.hero.cta.trim().length).toBeGreaterThan(0);
      expect(landing.cta.button.trim().length).toBeGreaterThan(0);
      expect(landing.hero.whatsappText.trim().length).toBeGreaterThan(0);
      expect(blob).not.toMatch(/\$|USD|ARS|€/);
      expect(blob).not.toMatch(/\b\d+\s*(semanas?|weeks?|d[ií]as|days|horas|hours)\b/i);
      expect(blob).not.toMatch(/garantizamos|we guarantee|money back/i);
    }
  });
});
