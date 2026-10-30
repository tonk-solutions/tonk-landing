"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import styles from "./SideIndex.module.css";

type SideIndexItem = {
  number: string;
  label: string;
};

type SideIndexProps = {
  /** Número y nombre visible de cada sección, en orden. */
  items: SideIndexItem[];
};

/**
 * Índice lateral de secciones. Marca con `aria-current` la sección visible y
 * aparece solo desde 1280px, donde hay margen suficiente para el riel.
 */
export function SideIndex({ items }: SideIndexProps) {
  const [active, setActive] = useState(0);
  const tA11y = useTranslations("a11y");

  useEffect(() => {
    const sections = items
      .map(({ number }) => document.getElementById(`s${number}`))
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
        {items.map(({ number, label }, index) => (
          <li key={number}>
            <a
              className={styles.item}
              href={`#s${number}`}
              aria-current={index === active ? "true" : undefined}
            >
              <span className="sr-only">{tA11y("sectionPrefix")}</span>
              {number}
              <span className={styles.label}>{label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
