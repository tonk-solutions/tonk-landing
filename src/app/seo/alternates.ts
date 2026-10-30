import { SITE_URL } from "../constants";
import { defaultLocale, locales } from "@/i18n/locales";

/**
 * `hreflang` de una ruta: una entrada por idioma más `x-default`, que apunta al
 * idioma por defecto. Lo usan la metadata de cada página y el sitemap, para que
 * los dos no se puedan desincronizar.
 */
export function buildLanguageAlternates(path: string): Record<string, string> {
  const alternates: Record<string, string> = {};

  for (const locale of locales) {
    alternates[locale] = `${SITE_URL}/${locale}${path}`;
  }

  alternates["x-default"] = `${SITE_URL}/${defaultLocale}${path}`;

  return alternates;
}
