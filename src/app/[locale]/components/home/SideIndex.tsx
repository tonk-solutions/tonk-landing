"use client";

import { useEffect, useState } from "react";
import styles from "./SideIndex.module.css";

type SideIndexProps = {
  /** Números visibles: 01 a 09. */
  numbers: string[];
};

/**
 * Índice lateral de secciones. Marca con `aria-current` la sección visible y
 * aparece solo desde 1280px, donde hay margen suficiente para el riel.
 */
export function SideIndex({ numbers }: SideIndexProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const sections = numbers
      .map((_, index) => document.getElementById(`s${String(index + 1).padStart(2, "0")}`))
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
  }, [numbers]);

  return (
    <nav className={styles.rail} aria-label="Índice de secciones">
      <ol className={styles.list}>
        {numbers.map((number, index) => (
          <li key={number}>
            <a
              className={styles.item}
              href={`#s${String(index + 1).padStart(2, "0")}`}
              aria-current={index === active ? "true" : undefined}
            >
              <span className="sr-only">Sección </span>
              {number}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
