import en from "../../messages/en.json";
import es from "../../messages/es.json";

export const MESSAGES = { es, en } as const;
export type TestLocale = keyof typeof MESSAGES;

type TranslationsArg = string | { locale?: string; namespace?: string } | undefined;

function resolve(root: unknown, key: string): unknown {
  return key.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[part];
    return undefined;
  }, root);
}

/**
 * Stand-in for `getTranslations` from `next-intl/server`. Serves the real
 * message files for the locale passed in the call, or for `getLocale()` when the
 * call (like `getTranslations("contact")`) carries none.
 */
export function createGetTranslations(getLocale: () => TestLocale) {
  return async (arg?: TranslationsArg) => {
    const namespace = typeof arg === "string" ? arg : arg?.namespace;
    const requested = typeof arg === "object" ? arg?.locale : undefined;
    const locale = requested === "en" || requested === "es" ? requested : getLocale();
    const root = namespace ? resolve(MESSAGES[locale], namespace) : MESSAGES[locale];

    return Object.assign((key: string) => resolve(root, key) as string, {
      raw: (key: string) => resolve(root, key),
    });
  };
}
