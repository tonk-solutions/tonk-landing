/**
 * Configuración de idiomas, sin la capa de navegación de cliente.
 *
 * `routing.ts` agrega `Link`/`usePathname`/`useRouter`, que importan
 * `next/navigation`. Los módulos de servidor (`sitemap.ts`, `seo/alternates.ts`) y
 * los tests unitarios solo necesitan esta lista, así que la toman de acá y no
 * arrastran React.
 */
export const locales = ["es", "en"] as const;

export const defaultLocale = "es";
