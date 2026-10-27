import { readdirSync, readFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const COMPONENTS_DIR = resolve(process.cwd(), "src/app/[locale]/components");

/** Every shipped component source file, tests excluded. */
function componentSources(directory: string): Array<{ file: string; source: string }> {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === "__tests__") return [];
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return componentSources(path);
    if (!/\.(ts|tsx)$/.test(entry.name)) return [];
    return [{ file: relative(COMPONENTS_DIR, path), source: readFileSync(path, "utf8") }];
  });
}

/** An `aria-label` or `alt` written as a literal string instead of a message. */
const literalAccessibilityText = /\b(?:aria-label|alt)=["']([^"']*)["']/g;

/**
 * Brand names are not copy: the logo alt stays as shipped.
 */
const BRAND_LITERALS = new Set(["Tonk Solutions"]);

describe("accessibility copy", () => {
  const sources = componentSources(COMPONENTS_DIR);

  it("scans the shipped components", () => {
    expect(sources.length).toBeGreaterThan(5);
  });

  it("never hardcodes Spanish aria-label or alt text", () => {
    const offenders = sources.flatMap(({ file, source }) =>
      Array.from(source.matchAll(literalAccessibilityText))
        .map((match) => match[1])
        .filter((text) => !BRAND_LITERALS.has(text))
        .map((text) => `${file}: ${text}`)
    );

    // Everything else must come from the `a11y` namespace through `t('...')`.
    expect(offenders).toEqual([]);
  });
});
