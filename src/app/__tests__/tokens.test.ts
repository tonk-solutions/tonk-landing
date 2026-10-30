import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * La home toma sus colores de las custom properties declaradas en globals.css.
 * Este test fija los valores de la guía visual aprobada para que ningún cambio
 * accidental de paleta pase desapercibido (spec S11).
 */
const globalsPath = path.resolve(__dirname, "../globals.css");
const globals = fs.readFileSync(globalsPath, "utf8").replace(/\s+/g, " ");

const TOKENS: Record<string, string> = {
  "--bg": "#17191C",
  "--surface": "#24272C",
  "--muted": "#8A9099",
  "--fg": "#E8EAED",
  "--accent": "#3DF5C8",
};

describe("tokens de la home", () => {
  it.each(Object.entries(TOKENS))("declara %s con el valor de la guía", (token, value) => {
    expect(globals.toLowerCase()).toContain(`${token}: ${value};`.toLowerCase());
  });

  it("no conserva la paleta cian anterior", () => {
    expect(globals).not.toMatch(/#06b6d4/i);
    expect(globals).not.toMatch(/#0891b2/i);
  });

  it("engancha las variables de fuente de Geist que inyecta next/font", () => {
    expect(globals).toContain("--sans: var(--font-geist-sans)");
    expect(globals).toContain("--mono: var(--font-geist-mono)");
  });

  /**
   * Las fuentes viven en `:root` y `next/font` las inyecta en `<html>`. Si el layout
   * las aplica en `<body>`, la `var()` no resuelve, `font-family` queda inválida y el
   * navegador cae al serif del sistema en toda la página (spec S18).
   */
  it("aplica las variables de next/font en <html> y no en <body>", () => {
    const layout = fs
      .readFileSync(path.resolve(__dirname, "../[locale]/layout.tsx"), "utf8")
      .replace(/\s+/g, " ");

    expect(layout).toMatch(/<html[^>]*className=\{[^}]*geistSans\.variable/);
    expect(layout).toMatch(/<body(?! className=\{[^}]*geistSans)/);
  });
});

/**
 * La jerarquía de la página es una escalera de cinco niveles (spec S20). Si los
 * módulos vuelven a declarar tamaños propios, el escalón desaparece.
 */
describe("escala tipográfica", () => {
  const SCALE: Record<string, { max: number; expected: string }> = {
    "--t-claim": { max: 38, expected: "clamp(26px, 2.6vw, 38px)" },
    "--t-sub": { max: 22, expected: "clamp(18px, 1.5vw, 22px)" },
    "--t-body": { max: 16, expected: "16px" },
    "--t-detail": { max: 14, expected: "14px" },
    "--t-micro": { max: 11, expected: "11px" },
  };

  it.each(Object.entries(SCALE))("declara %s dentro de su techo", (token, { max, expected }) => {
    expect(globals).toContain(`${token}: ${expected};`);
    const px = Number(/(\d+)px/.exec(expected)?.[1]);
    expect(px).toBeLessThanOrEqual(max);
  });

  it("los títulos de sección toman el tamaño de la escala", () => {
    const header = fs
      .readFileSync(
        path.resolve(__dirname, "../[locale]/components/layout/SectionHeader.module.css"),
        "utf8",
      )
      .replace(/\s+/g, " ");

    expect(header).toMatch(/\.title \{[^}]*font-size: var\(--t-claim\)/);
    expect(header).not.toMatch(/\.title \{[^}]*font-size: clamp/);
  });
});
