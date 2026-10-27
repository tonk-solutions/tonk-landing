// @vitest-environment node
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { brandAlpha, brandTokens, withAlpha } from "../brandTokens";

const globalsCss = readFileSync(
  fileURLToPath(new URL("../globals.css", import.meta.url)),
  "utf8"
);

const CSS_COLOR = /^(#[0-9A-Fa-f]{6}|rgba\(\d{1,3}, \d{1,3}, \d{1,3}, [0-9.]+\))$/;

const CSS_VARIABLES = new Map<string, string>();
for (const line of globalsCss.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed.startsWith("--")) continue;
  const separator = trimmed.indexOf(":");
  if (separator === -1) continue;
  const name = trimmed.slice(0, separator).trim();
  const value = trimmed.slice(separator + 1).replace(";", "").trim();
  if (CSS_COLOR.test(value)) {
    CSS_VARIABLES.set(name, value);
  }
}

function readCssVariable(name: string): string | undefined {
  return CSS_VARIABLES.get(name);
}

describe("brandTokens", () => {
  it("exposes the exact Ingeniería sobria palette with its translucent steps", () => {
    expect(brandTokens).toEqual({
      bg: "#17191C",
      surface: "#24272C",
      muted: "#8A9099",
      fg: "#E8EAED",
      accent: "#3DF5C8",
      accentOnLight: "#10B98F",
      accentHover: "#2BE3BA",
      border: "rgba(232, 234, 237, 0.07)",
      borderStrong: "rgba(232, 234, 237, 0.18)",
      accentSubtle: "rgba(61, 245, 200, 0.12)",
      accentHalo: "rgba(61, 245, 200, 0.3)",
      accentGlow: "rgba(61, 245, 200, 0.45)",
    });
  });

  it("is the single source of truth for the globals.css custom properties", () => {
    expect(readCssVariable("--bg")).toBe(brandTokens.bg);
    expect(readCssVariable("--surface")).toBe(brandTokens.surface);
    expect(readCssVariable("--muted")).toBe(brandTokens.muted);
    expect(readCssVariable("--fg")).toBe(brandTokens.fg);
    expect(readCssVariable("--accent")).toBe(brandTokens.accent);
    expect(readCssVariable("--accent-on-light")).toBe(brandTokens.accentOnLight);
    expect(readCssVariable("--accent-hover")).toBe(brandTokens.accentHover);
    expect(readCssVariable("--border")).toBe(brandTokens.border);
    expect(readCssVariable("--border-strong")).toBe(brandTokens.borderStrong);
    expect(readCssVariable("--accent-subtle")).toBe(brandTokens.accentSubtle);
    expect(readCssVariable("--accent-halo")).toBe(brandTokens.accentHalo);
    expect(readCssVariable("--accent-glow")).toBe(brandTokens.accentGlow);
  });

  it("composes translucent variants from the palette instead of loose literals", () => {
    expect(withAlpha("#3DF5C8", 0.3)).toBe("rgba(61, 245, 200, 0.3)");
    expect(brandAlpha.fg(0.07)).toBe(brandTokens.border);
    expect(brandAlpha.fg(0.18)).toBe(brandTokens.borderStrong);
    expect(brandAlpha.accent(0.12)).toBe(brandTokens.accentSubtle);
    expect(brandAlpha.accent(0.3)).toBe(brandTokens.accentHalo);
    expect(brandAlpha.muted(0.1)).toBe("rgba(138, 144, 153, 0.1)");
    expect(brandAlpha.bg(0.92)).toBe("rgba(23, 25, 28, 0.92)");
  });

  it("declares every stylesheet color through a custom property", () => {
    const looseColors = globalsCss
      .split("\n")
      .map((line, index) => ({ text: line.trim(), line: index + 1 }))
      .filter(({ text }) => text && !text.startsWith("--") && !text.startsWith("/*") && !text.startsWith("*"))
      .filter(
        ({ text }) =>
          /#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?\b/.test(text) || /\brgba?\(/.test(text)
      );

    expect(looseColors).toEqual([]);
  });
});
