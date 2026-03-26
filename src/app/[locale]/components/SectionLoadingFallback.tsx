"use client";

import { useTranslations } from "next-intl";

/**
 * Lightweight placeholder for next/dynamic loading states (below-the-fold sections).
 */
export function SectionLoadingFallback() {
  const t = useTranslations("ui");

  return (
    <div
      className="section-loading-fallback"
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">{t("sectionLoading")}</span>
      <div className="section-loading-fallback__pulse" aria-hidden />
    </div>
  );
}
