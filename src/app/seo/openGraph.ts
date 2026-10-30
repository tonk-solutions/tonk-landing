import { SITE_NAME, SITE_URL } from "../constants";

/**
 * Metadata social de la home y del detalle de servicio.
 *
 * En Next la metadata se reemplaza por nivel, no se fusiona: si una página hija
 * declara `openGraph`, pierde el `locale`, el `siteName` y las imágenes del
 * layout. Por eso los dos arman su bloque con estas funciones y no a mano.
 */

export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;

const LOCALE_BY_LANGUAGE: Record<string, string> = {
  es: "es_AR",
  en: "en_US",
};

/** `opengraph-image.tsx` vive en `app/[locale]`, así que la imagen es por idioma. */
export function ogImageUrl(locale: string): string {
  return `${SITE_URL}/${locale}/opengraph-image`;
}

export function ogLocale(locale: string): string {
  return LOCALE_BY_LANGUAGE[locale] ?? LOCALE_BY_LANGUAGE.es;
}

interface OpenGraphInput {
  locale: string;
  url: string;
  title: string;
  description: string;
  imageAlt: string;
}

export function buildOpenGraph(input: OpenGraphInput) {
  return {
    type: "website" as const,
    locale: ogLocale(input.locale),
    url: input.url,
    siteName: SITE_NAME,
    title: input.title,
    description: input.description,
    images: [
      {
        url: ogImageUrl(input.locale),
        ...OG_IMAGE_SIZE,
        alt: input.imageAlt,
        type: "image/png",
      },
    ],
  };
}

export function buildTwitter(
  input: Pick<OpenGraphInput, "locale" | "title" | "description" | "imageAlt">
) {
  return {
    card: "summary_large_image" as const,
    title: input.title,
    description: input.description,
    images: [{ url: ogImageUrl(input.locale), alt: input.imageAlt }],
  };
}
