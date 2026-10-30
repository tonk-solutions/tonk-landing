import type { MetadataRoute } from "next";
import { SITE_URL } from "./constants";
import { routing } from "@/i18n/routing";
import { getServiceSlugs } from "./services/catalog";
import { buildLanguageAlternates } from "./seo/alternates";

/**
 * `lastModified` es la fecha del build: el sitio se genera estático y no guarda
 * historial de cambios por ruta, así que no hay una fecha de contenido más
 * precisa que esta.
 */
const BUILD_DATE = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  const homeEntries: MetadataRoute.Sitemap = routing.locales.map((locale) => ({
    url: `${SITE_URL}/${locale}`,
    lastModified: BUILD_DATE,
    alternates: { languages: buildLanguageAlternates("") },
    changeFrequency: "monthly",
    priority: locale === routing.defaultLocale ? 1 : 0.9,
  }));

  const serviceSlugs = getServiceSlugs();
  const serviceEntries: MetadataRoute.Sitemap = routing.locales.flatMap((locale) =>
    serviceSlugs.map((slug) => ({
      url: `${SITE_URL}/${locale}/services/${slug}`,
      lastModified: BUILD_DATE,
      alternates: { languages: buildLanguageAlternates(`/services/${slug}`) },
      changeFrequency: "monthly",
      priority: 0.7,
    }))
  );

  return [...homeEntries, ...serviceEntries];
}
