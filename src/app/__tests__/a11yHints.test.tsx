import fs from "node:fs";
import path from "node:path";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import es from "../../../messages/es.json";
import en from "../../../messages/en.json";
import { WHATSAPP_URL } from "../constants";
import { ContactSection } from "../[locale]/components/home/ContactSection";
import { DiagnosticSection } from "../[locale]/components/home/DiagnosticSection";

vi.mock("next-intl/server", async () => {
  const { default: messages } = await import("../../../messages/es.json");

  function resolve(root: unknown, key: string): unknown {
    return key.split(".").reduce<unknown>((acc, part) => {
      if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[part];
      return undefined;
    }, root);
  }

  return {
    getTranslations: async (namespace: string) => {
      const root = resolve(messages, namespace);
      return Object.assign((key: string) => resolve(root, key) as string, {
        raw: (key: string) => resolve(root, key),
      });
    },
  };
});

const HOME = path.resolve(__dirname, "../[locale]/page.tsx");
const SERVICE = path.resolve(__dirname, "../[locale]/services/[slug]/page.tsx");

function mainTags(file: string): string[] {
  return fs.readFileSync(file, "utf8").match(/<main\b[^>]*>/g) ?? [];
}

describe("destino del skip link", () => {
  it.each([
    ["home", HOME],
    ["detalle de servicio", SERVICE],
  ])("%s hace focusable el main sin sumarlo al tab order", (_label, file) => {
    const tags = mainTags(file);

    expect(tags.length).toBeGreaterThan(0);
    for (const tag of tags) {
      expect(tag).toContain('id="main"');
      expect(tag).toContain("tabIndex={-1}");
      expect(tag).not.toMatch(/\brole=/);
    }
  });
});

describe("links que abren otra pestaña", () => {
  it.each([
    ["es", es.a11y.newTabHint],
    ["en", en.a11y.newTabHint],
  ])("%s reutiliza el aviso que ya existe en el sitio", (locale, hint) => {
    expect(hint).toBe(locale === "es" ? "abre en una pestaña nueva" : "opens in a new tab");
  });

  it("el CTA de contacto nombra la pestaña nueva sin cambiar el texto visible", async () => {
    const { getByRole } = render(await ContactSection());
    const link = getByRole("link", { name: es.contact.cta });

    expect(link).toHaveAttribute("href", WHATSAPP_URL);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link).toHaveAccessibleName(es.contact.cta);
    expect(link).toHaveAccessibleDescription(es.a11y.newTabHint);
    expect(link).toHaveTextContent(es.contact.cta);
  });

  it("el CTA de diagnóstico nombra la pestaña nueva sin cambiar el texto visible", async () => {
    const { getByRole } = render(await DiagnosticSection());
    const link = getByRole("link", { name: es.diagnostic.cta });

    expect(link).toHaveAttribute("href", WHATSAPP_URL);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAccessibleName(es.diagnostic.cta);
    expect(link).toHaveAccessibleDescription(es.a11y.newTabHint);
  });
});
