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

/**
 * Quita el prefijo de idioma de una ruta de request (`/en/services/x` →
 * `/services/x`). La home localizada queda en `""`, igual que `buildLanguageAlternates`.
 */
export function stripLocalePrefix(pathname: string): string {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const segments = normalized.split("/").filter(Boolean);

  if (segments.length > 0 && (locales as readonly string[]).includes(segments[0])) {
    const rest = segments.slice(1).join("/");
    return rest ? `/${rest}` : "";
  }

  return normalized === "/" ? "" : normalized.replace(/\/$/, "");
}

/**
 * Cabecera HTTP `Link` con los mismos destinos que el `hreflang` del HTML.
 *
 * next-intl anuncia `x-default` sobre la ruta sin prefijo (`/` o
 * `/services/...`). En las páginas de servicio esa URL responde 404. El destino
 * ya decidido en metadata y sitemap es el locale por defecto.
 */
export function buildAlternateLinkHeader(pathname: string): string {
  const alternates = buildLanguageAlternates(stripLocalePrefix(pathname));

  return Object.entries(alternates)
    .map(([hreflang, url]) => `<${url}>; rel="alternate"; hreflang="${hreflang}"`)
    .join(", ");
}
