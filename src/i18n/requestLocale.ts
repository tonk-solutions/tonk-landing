import { hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from './routing';

export type AppLocale = (typeof routing.locales)[number];

/**
 * Server-only helper: validates the `[locale]` route segment and registers it
 * for next-intl's server APIs. Calling `setRequestLocale` lets routes with
 * `generateStaticParams` render statically instead of reading request headers.
 * Triggers a 404 for unsupported locales.
 */
export function resolveRequestLocale(locale: string): AppLocale {
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  return locale;
}
