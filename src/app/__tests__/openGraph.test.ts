import { describe, expect, it } from "vitest";
import { SITE_NAME, SITE_URL } from "../constants";
import { defaultLocale, locales } from "@/i18n/locales";
import { SERVICES_CATALOG } from "../services/catalog";
import { buildLanguageAlternates } from "../seo/alternates";
import { buildOpenGraph, buildTwitter, ogImageUrl, ogLocale } from "../seo/openGraph";
import sitemap from "../sitemap";

/**
 * Contrato de la metadata social y del sitemap (specs S5 y S6). Existe porque
 * Next reemplaza el objeto `openGraph` entero por nivel: si una página vuelve a
 * declararlo a mano, pierde `locale`, `siteName` e imágenes sin que nada falle.
 */
const pageUrl = `${SITE_URL}/es/services/applied-ai`;
const openGraph = buildOpenGraph({
  locale: "es",
  url: pageUrl,
  title: "Applied AI",
  description: "Descripción del servicio",
  imageAlt: "Applied AI",
});

describe("openGraph y twitter (S5)", () => {
  it("conserva locale, siteName y url cuando la página declara su bloque", () => {
    expect(openGraph.locale).toBe("es_AR");
    expect(openGraph.siteName).toBe(SITE_NAME);
    expect(openGraph.url).toBe(pageUrl);
    expect(openGraph.title).toBe("Applied AI");
  });

  it("publica la imagen del idioma con su alt", () => {
    expect(openGraph.images).toEqual([
      {
        url: `${SITE_URL}/es/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Applied AI",
        type: "image/png",
      },
    ]);
  });

  it("mapea el idioma a og:locale y cae en es_AR", () => {
    expect(ogLocale("es")).toBe("es_AR");
    expect(ogLocale("en")).toBe("en_US");
    expect(ogLocale("fr")).toBe("es_AR");
    expect(ogImageUrl("en")).toBe(`${SITE_URL}/en/opengraph-image`);
  });

  it("twitter lleva card e imagen con alt", () => {
    const twitter = buildTwitter({
      locale: "es",
      title: "Applied AI",
      description: "Descripción del servicio",
      imageAlt: "Applied AI",
    });

    expect(twitter.card).toBe("summary_large_image");
    expect(twitter.images).toEqual([
      { url: `${SITE_URL}/es/opengraph-image`, alt: "Applied AI" },
    ]);
  });
});

describe("alternates (S5, S6)", () => {
  it("publica un hreflang por idioma más x-default al idioma por defecto", () => {
    expect(buildLanguageAlternates("")).toEqual({
      es: `${SITE_URL}/es`,
      en: `${SITE_URL}/en`,
      "x-default": `${SITE_URL}/${defaultLocale}`,
    });
  });

  it("respeta la ruta que recibe", () => {
    expect(buildLanguageAlternates("/services/applied-ai")).toEqual({
      es: `${SITE_URL}/es/services/applied-ai`,
      en: `${SITE_URL}/en/services/applied-ai`,
      "x-default": `${SITE_URL}/es/services/applied-ai`,
    });
  });
});

describe("sitemap (S6)", () => {
  const entries = sitemap();

  it("cubre la home y los servicios en cada idioma", () => {
    expect(entries).toHaveLength(locales.length * (1 + SERVICES_CATALOG.length));

    for (const locale of locales) {
      expect(entries.map((entry) => entry.url)).toContain(`${SITE_URL}/${locale}`);
    }
    for (const entry of SERVICES_CATALOG) {
      expect(entries.map((item) => item.url)).toContain(
        `${SITE_URL}/es/services/${entry.slug}`
      );
    }
  });

  it("publica lastModified y x-default en cada entrada", () => {
    for (const entry of entries) {
      const languages = entry.alternates?.languages as Record<string, string> | undefined;

      expect(entry.lastModified).toBeInstanceOf(Date);
      // `x-default` es, por definición, la misma URL que el idioma por defecto.
      expect(languages?.["x-default"]).toBe(languages?.[defaultLocale]);
      expect(Object.keys(languages ?? {})).toEqual([...locales, "x-default"]);
    }
  });
});
