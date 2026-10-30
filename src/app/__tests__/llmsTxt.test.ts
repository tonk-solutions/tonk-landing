import { describe, expect, it } from "vitest";
import es from "../../../messages/es.json";
import en from "../../../messages/en.json";
import { SERVICES_CATALOG } from "../services/catalog";
import { CONTACT_EMAIL, CONTACT_PHONE, SITE_NAME, SITE_URL, WHATSAPP_URL } from "../constants";
import {
  buildLlmsFullTxt,
  buildLlmsLocaleContent,
  buildLlmsTxt,
  type LlmsMessages,
} from "../seo/llmsTxt";

/**
 * Contrato de los dos artefactos LLMO: `/llms.txt` (índice curado) y
 * `/llms-full.txt` (documento completo). Se construyen con los mensajes reales
 * de los dos idiomas, así que un copy que se rompa también rompe acá.
 */
const MESSAGES_BY_LOCALE: Record<string, LlmsMessages> = { es, en };
const contents = ["es", "en"].map((locale) =>
  buildLlmsLocaleContent(locale, MESSAGES_BY_LOCALE[locale])
);

const llmsTxt = buildLlmsTxt(contents, "es");
const llmsFullTxt = buildLlmsFullTxt(contents);

function linksIn(body: string): string[] {
  return [...body.matchAll(/\]\(([^)]+)\)/g)].map((match) => match[1]);
}

describe("llms.txt (S1)", () => {
  it("abre con el nombre del sitio y el resumen del locale por defecto", () => {
    const lines = llmsTxt.split("\n");

    expect(lines[0]).toBe(`# ${SITE_NAME}`);
    expect(lines[2]).toBe(`> ${es.seo.description}`);
  });

  it("declara las cuatro secciones del índice, en orden", () => {
    const headings = llmsTxt
      .split("\n")
      .filter((line) => line.startsWith("## "))
      .map((line) => line.replace("## ", ""));

    expect(headings).toEqual([
      "Páginas",
      es.services.label,
      es.contact.label,
      es.team.label,
    ]);
  });

  it("lista una página por idioma y un servicio por entrada del catálogo", () => {
    for (const locale of ["es", "en"]) {
      expect(llmsTxt).toContain(`(${SITE_URL}/${locale})`);
    }

    const serviceLines = llmsTxt
      .split("\n")
      .filter((line) => line.includes(`/${"es"}/services/`));

    expect(serviceLines).toHaveLength(SERVICES_CATALOG.length);
    expect(serviceLines.map((line) => line.match(/services\/([a-z-]+)\)/)?.[1])).toEqual(
      SERVICES_CATALOG.map((entry) => entry.slug)
    );
  });

  it("publica los datos de contacto del locale por defecto", () => {
    for (const row of es.contact.rows) {
      expect(llmsTxt).toContain(`- **${row.label}:** ${row.value}`);
    }

    expect(llmsTxt).toContain(CONTACT_EMAIL);
    expect(llmsTxt).toContain(CONTACT_PHONE);
    expect(llmsTxt).toContain(WHATSAPP_URL);
  });

  it("lista al equipo con nombre y rol", () => {
    for (const member of es.team.members) {
      expect(llmsTxt).toContain(`- ${member.name} — ${member.role}`);
    }
  });

  it("no usa links relativos ni menciona SAP", () => {
    for (const link of linksIn(llmsTxt)) {
      expect(link.startsWith(SITE_URL)).toBe(true);
    }

    expect(llmsTxt).not.toMatch(/\bSAP\b/i);
  });
});

describe("llms-full.txt (S2)", () => {
  it("publica el locale por defecto primero y separa los bloques con una regla", () => {
    const blocks = llmsFullTxt.split("\n---\n");

    expect(blocks).toHaveLength(2);
    expect(blocks[0].startsWith(`# ${es.seo.titleDefault}`)).toBe(true);
    expect(blocks[1].trimStart().startsWith(`# ${en.seo.titleDefault}`)).toBe(true);
  });

  it("cubre todas las secciones de la landing en cada idioma", () => {
    for (const content of contents) {
      for (const heading of [
        content.sections.integrations,
        content.sections.services,
        content.sections.projects,
        content.sections.diagnostic,
        content.sections.process,
        content.sections.criterio,
        content.sections.team,
        content.sections.contact,
      ]) {
        expect(llmsFullTxt).toContain(`## ${heading}`);
      }
    }
  });

  it("publica cada servicio, proyecto, etapa, fila del diagnóstico y persona", () => {
    for (const content of contents) {
      for (const service of content.services) {
        expect(llmsFullTxt).toContain(`### ${service.title}`);
        expect(llmsFullTxt).toContain(`${SITE_URL}/${content.locale}/services/${service.slug}`);
      }

      for (const project of content.projects) {
        expect(llmsFullTxt).toContain(`### ${project.name}`);
        expect(llmsFullTxt).toContain(`- **Stack:** ${project.stack}`);
      }

      content.process.forEach((step, index) => {
        expect(llmsFullTxt).toContain(`${index + 1}. **${step.title}** — ${step.description}`);
      });

      for (const row of content.diagnostic) {
        expect(llmsFullTxt).toContain(`- **${row.label}:** ${row.value}`);
      }

      for (const member of content.team) {
        expect(llmsFullTxt).toContain(`### ${member.name}`);
        expect(llmsFullTxt).toContain(member.linkedin);
      }
    }
  });

  it("no menciona SAP", () => {
    expect(llmsFullTxt).not.toMatch(/\bSAP\b/i);
  });
});

describe("contenido compartido (S1, S2)", () => {
  it("resuelve los servicios en el orden del catálogo y con el copy del locale", () => {
    const [esContent, enContent] = contents;

    expect(esContent.services.map((service) => service.slug)).toEqual(
      SERVICES_CATALOG.map((entry) => entry.slug)
    );
    expect(esContent.services[0].title).toBe(es.services.craft.services[0].title);
    expect(enContent.services[0].title).toBe(en.services.craft.services[0].title);
  });

  it("falla si no recibe ningún locale en lugar de emitir un archivo vacío", () => {
    expect(() => buildLlmsTxt([], "es")).toThrow();
  });
});
