import { describe, expect, it } from "vitest";
import { buildLlmsFullTxt, buildLlmsInput, buildLlmsTxt } from "../seo/llms";
import messages from "../../../messages/es.json";

/**
 * El texto se arma con `buildLlmsInput(messages)` —el mismo cableado que usa la
 * ruta `/llms.txt`— para que un campo mal pasado en la ruta también falle acá.
 */
describe("buildLlmsTxt", () => {
  const text = buildLlmsTxt(buildLlmsInput(messages));

  it("arranca con el título H1", () => {
    expect(text.startsWith("# Tonk Solutions")).toBe(true);
  });

  it("el resumen es una sola frase con ciudad, huso y foco, sin duplicar la descripción SEO", () => {
    const summaryLines = text.split("\n").filter((line) => line.startsWith("> "));

    expect(summaryLines).toHaveLength(1);
    expect(summaryLines[0]).toContain("Buenos Aires");
    expect(summaryLines[0]).toContain("GMT−3");
    expect(summaryLines[0]).toContain("integraciones enterprise y producto desde cero");
    expect(text.match(/consultora boutique/gi)).toHaveLength(1);
  });

  it("lista a los tres co-founders sin afirmar nada sobre nóminas anteriores", () => {
    expect(text).toContain("Matías Castillo");
    expect(text).toContain("Nicolás Gómez");
    expect(text).toContain("Rodrigo Hernandez");
    expect(text).not.toMatch(/nómina|fuentes desactualizadas|outdated sources/i);
  });

  it("enlaza las siete páginas de servicio con su URL canónica", () => {
    const serviceLinks = text.match(/^- \[[^\]]+\]\(https:\/\/tonksolutions\.com\.ar\/es\/services\/[a-z-]+\)/gm);

    expect(serviceLinks).toHaveLength(7);
    expect(text).toContain(
      "- [Integraciones y Sistemas Enterprise](https://tonksolutions.com.ar/es/services/enterprise-integrations):",
    );
  });

  it("lista los proyectos", () => {
    expect(text).toContain("Konekta");
    expect(text).toContain("Clank");
  });

  it("menciona AWS, Google Cloud, Firebase y ARCA", () => {
    expect(text).toContain("AWS");
    expect(text).toContain("Google Cloud");
    expect(text).toContain("Firebase");
    expect(text).toContain("ARCA");
  });

  it("toma los datos de contacto de contact.rows, no de footer.location ni CONTACT_PHONE", () => {
    expect(text).toContain("- Email: contact@tonksolutions.com.ar");
    expect(text).toContain(
      "- WhatsApp: +54 9 11 2390-8349 (https://wa.me/5491123908349)",
    );
    expect(text).toContain("- Ubicación: Buenos Aires, Argentina");
    // Las otras dos fuentes del mismo dato tienen otro formato: si alguna vuelve
    // a colarse, el archivo publica dos versiones del mismo hecho.
    expect(text).not.toContain("Buenos Aires, AR");
    expect(text).not.toContain("+54-9-11-2390-8349");
    expect(text).toContain("https://tonksolutions.com.ar/en");
    expect(text).not.toContain("{url}");
  });

  it("publica exactamente tres líneas de contacto con labels distintos", () => {
    const block = text.split(`## ${messages.llms.contactHeading}`)[1].split("\n## ")[0];
    const lines = block.split("\n").filter((line) => line.startsWith("- "));
    const labels = lines.map((line) => line.replace(/^- ([^:]+):.*$/, "$1"));

    expect(lines).toHaveLength(3);
    expect(new Set(labels).size).toBe(3);
  });

  it("no contiene Ignacio ni Sileo", () => {
    expect(text).not.toMatch(/Ignacio|Sileo/i);
  });

  it("tiene secciones H2", () => {
    expect(text).toContain("## Equipo fundador");
    expect(text).toContain("## Stack y plataformas");
    expect(text).toContain("## Servicios");
    expect(text).toContain("## Proyectos");
    expect(text).toContain("## Contacto");
    expect(text).toContain("## Enlaces");
  });
});

/**
 * `/llms-full.txt` sale del mismo `buildLlmsInput`, así que hereda el contacto de
 * `contact.rows` y no puede publicar un dato distinto al de `/llms.txt`.
 */
describe("buildLlmsFullTxt", () => {
  const full = buildLlmsFullTxt(buildLlmsInput(messages));
  const branches = [...messages.services.craft.services, ...messages.services.talent.services];

  it("arranca con el título, el resumen y el hero", () => {
    expect(full.startsWith("# Tonk Solutions")).toBe(true);
    expect(full).toContain(`> ${messages.llms.intro}`);
    expect(full).toContain(`${messages.hero.titleLine1} ${messages.hero.titleLine2}`);
    expect(full).toContain(messages.hero.lede);
  });

  it("publica todas las secciones de la landing", () => {
    for (const heading of [
      messages.llms.stackHeading,
      messages.llms.servicesHeading,
      messages.llms.projectsHeading,
      messages.diagnostic.label,
      messages.process.label,
      messages.criterio.label,
      messages.team.label,
      messages.llms.contactHeading,
      messages.llms.linksHeading,
    ]) {
      expect(full).toContain(`## ${heading}`);
    }
  });

  it("incluye cada servicio, proyecto, etapa y fila del diagnóstico", () => {
    for (const service of branches) {
      expect(full).toContain(`### ${service.title}`);
      expect(full).toContain(service.description);
    }

    for (const project of messages.projects.items) {
      expect(full).toContain(`### ${project.name}`);
      expect(full).toContain(project.stack);
    }

    messages.process.steps.forEach((step, index) => {
      expect(full).toContain(`${index + 1}. **${step.title}** — ${step.description}`);
    });

    for (const row of messages.diagnostic.rows) {
      expect(full).toContain(`- **${row.label}:** ${row.value}`);
    }
  });

  it("publica a los founders con su bio y su LinkedIn", () => {
    for (const member of messages.team.members) {
      expect(full).toContain(`### ${member.name}`);
      expect(full).toContain(member.bio);
      expect(full).toContain(member.linkedin);
    }
  });

  it("hereda el contacto de contact.rows y no deja placeholders", () => {
    expect(full).toContain("- **Ubicación:** Buenos Aires, Argentina");
    expect(full).toContain("- **WhatsApp:** https://wa.me/5491123908349");
    expect(full).not.toContain("Buenos Aires, AR");
    expect(full).not.toContain("{url}");
    expect(full).not.toMatch(/\bSAP\b/i);
  });
});
