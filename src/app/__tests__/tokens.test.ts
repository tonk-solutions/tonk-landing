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
});
