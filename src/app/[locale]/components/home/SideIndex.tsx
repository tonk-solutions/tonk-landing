"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import styles from "./SideIndex.module.css";

type SideIndexItem = {
  /** Número de dos dígitos, tomado de `messages.*.number`. */
  number: string;
  /** Nombre corto de la sección para el riel (`messages.*.indexLabel`). */
  label: string;
  /** Ancla de la sección, con el `#`. */
  href: string;
};

type SideIndexProps = {
  items: SideIndexItem[];
};

/**
 * Índice lateral: el nombre de cada sección se lee en reposo, no hace falta
 * pasar el mouse. Desde 1280px la home reserva un gutter más ancho
 * (`.home-shell` en globals.css) para que el riel no se superponga al
 * contenido. Marca con `aria-current` la sección visible.
 */
export function SideIndex({ items }: SideIndexProps) {
  const [active, setActive] = useState(0);
  const tA11y = useTranslations("a11y");

  useEffect(() => {
    const sections = items
      .map(({ href }) => document.getElementById(href.slice(1)))
      .filter((section): section is HTMLElement => section !== null);

    if (sections.length === 0 || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;
        const index = sections.indexOf(visible.target as HTMLElement);
        if (index >= 0) setActive(index);
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav className={styles.rail} aria-label={tA11y("sideIndex")}>
      <ol className={styles.list}>
        {items.map((item, index) => (
          <li key={item.href}>
            <a
              className={styles.item}
              href={item.href}
              aria-current={index === active ? "true" : undefined}
            >
              <span className="sr-only">{tA11y("sectionPrefix")}</span>
              <span className={styles.num}>{item.number}</span>
              <span className={styles.label}>{item.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
