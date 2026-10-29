import { describe, expect, it } from "vitest";
import { buildLlmsInput, buildLlmsTxt } from "../seo/llms";
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

  it("etiqueta el contacto con las cadenas de los mensajes y resuelve la URL del sitio", () => {
    expect(text).toContain("- Email: contact@tonksolutions.com.ar");
    expect(text).toContain("- WhatsApp: +54-9-11-2390-8349");
    expect(text).toContain("- Ubicación: Buenos Aires, AR");
    expect(text).toContain("https://tonksolutions.com.ar/en");
    expect(text).not.toContain("{url}");
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
