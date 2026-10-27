import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const COMPONENTS_DIR = resolve(process.cwd(), "src/app/[locale]/components");

/** Every component source file, tests excluded: only shipped code is scanned. */
function componentSources(directory: string): Array<{ file: string; source: string }> {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === "__tests__") return [];
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return componentSources(path);
    if (!/\.(ts|tsx)$/.test(entry.name)) return [];
    return [{ file: path.slice(COMPONENTS_DIR.length), source: readFileSync(path, "utf8") }];
  });
}

const sources = componentSources(COMPONENTS_DIR);

/** Imports that pull the eager `motion` component instead of the lazy `m`. */
const eagerMotionImport =
  /import\s*(?:type\s*)?\{[^}]*\bmotion\b[^}]*\}\s*from\s*["']framer-motion["']/;
/** Rendered motion elements: `<motion.div>` and friends. */
const motionElement = /(?<![A-Za-z0-9_$])motion\./;

const ANIMATED_COMPONENTS = [
  "Header.tsx",
  "AboutSection.tsx",
  "ServicesSection.tsx",
  "TeamSection.tsx",
  "ContactSection.tsx",
];

describe("framer-motion usage in components", () => {
  it("never imports the eager `motion` component", () => {
    const offenders = sources
      .filter(({ source }) => eagerMotionImport.test(source))
      .map(({ file }) => file);

    expect(offenders).toEqual([]);
  });

  it("never renders a `motion.*` element", () => {
    const offenders = sources
      .filter(({ source }) => motionElement.test(source))
      .map(({ file }) => file);

    expect(offenders).toEqual([]);
  });

  it.each(ANIMATED_COMPONENTS)("%s animates with the lazy `m` component", (name) => {
    const source = sources.find(({ file }) => file.endsWith(`/${name}`))?.source;

    expect(source, `${name} must exist`).toBeDefined();
    expect(source).toMatch(/import\s*\{[^}]*\bm\b[^}]*\}\s*from\s*["']framer-motion["']/);
    expect(source).toMatch(/\bm[.(]/);
  });
});
