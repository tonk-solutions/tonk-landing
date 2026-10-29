"use client";

import { useLocale } from "next-intl";
import { usePathname, Link } from "@/i18n/routing";
import styles from "./LanguageSwitcher.module.css";

const LANGUAGES = [
  { code: "es", label: "ES" },
  { code: "en", label: "EN" },
] as const;

/**
 * Chip ES / EN. El idioma activo se marca con aria-current="true";
 * el otro es un link que preserva la ruta actual.
 */
export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, "") || "/";

  return (
    <span className={styles.lang} role="group" aria-label="Idioma">
      {LANGUAGES.map((language, index) => {
        const isActive = locale === language.code;

        return (
          <span key={language.code} className={styles.item}>
            {isActive ? (
              <span aria-current="true">{language.label}</span>
            ) : (
              <Link
                className={styles.opt}
                href={pathWithoutLocale}
                locale={language.code}
                lang={language.code}
                hrefLang={language.code}
              >
                {language.label}
              </Link>
            )}
            {index === 0 && (
              <span className={styles.sep} aria-hidden="true">
                /
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}
