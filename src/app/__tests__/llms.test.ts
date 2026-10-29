import { describe, expect, it } from "vitest";
import { buildLlmsTxt } from "../seo/llms";
import messages from "../../../messages/es.json";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  SITE_NAME,
  SITE_URL,
  WHATSAPP_URL,
} from "../constants";

describe("buildLlmsTxt", () => {
  const text = buildLlmsTxt({
    siteName: SITE_NAME,
    siteUrl: SITE_URL,
    contactEmail: CONTACT_EMAIL,
    contactPhone: CONTACT_PHONE,
    whatsappUrl: WHATSAPP_URL,
    seoDescription: messages.seo.description,
    location: messages.footer.location,
    copy: messages.llms,
    founders: messages.team.members,
    services: [
      ...messages.services.craft.services,
      ...messages.services.talent.services,
    ],
    projects: messages.projects.items,
    integrations: messages.integrations.platforms,
  });

  it("arranca con el título H1", () => {
    expect(text.startsWith("# Tonk Solutions")).toBe(true);
  });

  it("incluye el blockquote de resumen", () => {
    expect(text).toMatch(
      /^> .*Tonk Solutions es una consultora boutique/m,
    );
  });

  it("lista a los tres co-founders", () => {
    expect(text).toContain("Matías Castillo");
    expect(text).toContain("Nicolás Gómez");
    expect(text).toContain("Rodrigo Hernandez");
  });

  it("menciona AWS, Google Cloud y Firebase", () => {
    expect(text).toContain("AWS");
    expect(text).toContain("Google Cloud");
    expect(text).toContain("Firebase");
  });

  it("menciona ARCA y el email de contacto", () => {
    expect(text).toContain("ARCA");
    expect(text).toContain("contact@tonksolutions.com.ar");
  });

  it("no contiene Ignacio ni Sileo", () => {
    expect(text).not.toMatch(/Ignacio|Sileo/i);
  });

  it("tiene secciones H2", () => {
    expect(text).toMatch(/## /);
    expect(text).toContain("## Equipo fundador");
    expect(text).toContain("## Stack y plataformas");
    expect(text).toContain("## Servicios");
    expect(text).toContain("## Proyectos");
    expect(text).toContain("## Contacto");
    expect(text).toContain("## Enlaces");
  });
});
