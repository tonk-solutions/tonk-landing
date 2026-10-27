import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import en from "../../../messages/en.json";
import es from "../../../messages/es.json";
import {
  CLIENT_NAMESPACES,
  isClientNamespace,
  pickClientMessages,
} from "../clientMessages";

const LOCALES: Array<{ name: "es" | "en"; messages: Record<string, unknown> }> = [
  { name: "es", messages: es as Record<string, unknown> },
  { name: "en", messages: en as Record<string, unknown> },
];

const SRC_ROOT = resolve(process.cwd(), "src");

/** Namespaces only server components read; they must never reach the client bundle. */
const SERVER_ONLY_NAMESPACES = ["seo", "schema", "landing"];

/** Namespaces client components consume today, plus the reserved a11y block. */
const REQUIRED_CLIENT_NAMESPACES = [
  "a11y",
  "about",
  "contact",
  "footer",
  "nav",
  "services",
  "team",
  "ui",
];

const CLIENT_DIRECTIVE = /^\s*["']use client["'];?\s*$/m;
const USE_TRANSLATIONS = /useTranslations\(\s*["'`]([^"'`]+)["'`]\s*\)/g;

function listSourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      return entry.name === "node_modules" ? [] : listSourceFiles(fullPath);
    }
    return /\.tsx?$/.test(entry.name) ? [fullPath] : [];
  });
}

/** Every namespace requested from a `"use client"` module, keyed by source path. */
function scanClientNamespaces(): Map<string, Set<string>> {
  const found = new Map<string, Set<string>>();

  for (const file of listSourceFiles(SRC_ROOT)) {
    const source = readFileSync(file, "utf8");
    if (!CLIENT_DIRECTIVE.test(source)) continue;

    const namespaces = new Set<string>();
    for (const match of source.matchAll(USE_TRANSLATIONS)) {
      namespaces.add(match[1].split(".")[0]);
    }
    found.set(relative(SRC_ROOT, file), namespaces);
  }

  return found;
}

describe("CLIENT_NAMESPACES", () => {
  it("declares every namespace a client component needs, a11y included", () => {
    for (const namespace of REQUIRED_CLIENT_NAMESPACES) {
      expect(CLIENT_NAMESPACES).toContain(namespace);
    }
  });

  it("keeps the list free of duplicates", () => {
    expect(new Set(CLIENT_NAMESPACES).size).toBe(CLIENT_NAMESPACES.length);
  });

  it("classifies server-only namespaces as not client", () => {
    for (const namespace of SERVER_ONLY_NAMESPACES) {
      expect(isClientNamespace(namespace)).toBe(false);
      expect(CLIENT_NAMESPACES).not.toContain(namespace);
    }
    expect(isClientNamespace("nav")).toBe(true);
  });
});

describe.each(LOCALES)("pickClientMessages ($name)", ({ messages }) => {
  const picked = pickClientMessages(messages);

  it("keeps every namespace present in the dictionary", () => {
    const expected = Object.keys(messages).filter((key) =>
      (CLIENT_NAMESPACES as readonly string[]).includes(key)
    );

    expect(Object.keys(picked).sort()).toEqual(expected.sort());
    expect(expected.length).toBeGreaterThan(0);
  });

  it("drops server-only namespaces", () => {
    for (const namespace of SERVER_ONLY_NAMESPACES) {
      expect(picked).not.toHaveProperty(namespace);
    }
  });

  it("preserves the values of the namespaces it keeps", () => {
    expect(picked.nav).toEqual(messages.nav);
  });
});

describe("pickClientMessages tolerance", () => {
  it("skips namespaces that are missing from the dictionary", () => {
    const picked = pickClientMessages({ nav: { home: "Inicio" } });

    expect(picked).toEqual({ nav: { home: "Inicio" } });
    expect(picked).not.toHaveProperty("a11y");
  });

  it("returns an empty object for a dictionary without client namespaces", () => {
    expect(pickClientMessages({ seo: { title: "Tonk" } })).toEqual({});
  });

  it("does not mutate the source dictionary", () => {
    const source = { nav: { home: "Inicio" }, seo: { title: "Tonk" } };
    const keysBefore = Object.keys(source);

    pickClientMessages(source);

    expect(Object.keys(source)).toEqual(keysBefore);
    expect(source).toHaveProperty("seo");
  });
});

describe("client sources", () => {
  const clientNamespaces = scanClientNamespaces();

  it("finds the client components that call useTranslations", () => {
    expect(clientNamespaces.size).toBeGreaterThan(0);

    const scanned = new Set([...clientNamespaces.values()].flatMap((set) => [...set]));
    expect([...scanned].sort()).toEqual(
      ["a11y", "about", "contact", "footer", "nav", "services", "team", "ui"]
    );
  });

  it("only requests namespaces declared in CLIENT_NAMESPACES", () => {
    const offenders = [...clientNamespaces.entries()].flatMap(([file, namespaces]) =>
      [...namespaces]
        .filter((namespace) => !isClientNamespace(namespace))
        .map((namespace) => `${file}: useTranslations('${namespace}')`)
    );

    expect(offenders).toEqual([]);
  });
});
