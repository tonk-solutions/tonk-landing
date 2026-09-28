import type { MetadataRoute } from "next";
import { SITE_URL } from "./constants";
import { routing } from "@/i18n/routing";
import { getServiceSlugs } from "./services/catalog";

function buildLanguageAlternates(path: string): Record<string, string> {
  return Object.fromEntries(
    routing.locales.map((locale) => [locale, `${SITE_URL}/${locale}${path}`])
  );
}

export default function sitemap(): MetadataRoute.Sitemap {
  const homeEntries: MetadataRoute.Sitemap = routing.locales.map((locale) => ({
    url: `${SITE_URL}/${locale}`,
    alternates: { languages: buildLanguageAlternates("") },
    changeFrequency: "monthly",
    priority: locale === routing.defaultLocale ? 1 : 0.9,
  }));

  const serviceSlugs = getServiceSlugs();
  const serviceEntries: MetadataRoute.Sitemap = routing.locales.flatMap((locale) =>
    serviceSlugs.map((slug) => ({
      url: `${SITE_URL}/${locale}/services/${slug}`,
      alternates: { languages: buildLanguageAlternates(`/services/${slug}`) },
      changeFrequency: "monthly",
      priority: 0.7,
    }))
  );

  return [...homeEntries, ...serviceEntries];
}
