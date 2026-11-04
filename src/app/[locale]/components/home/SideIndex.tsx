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
 * contenido. Marca con `aria-current` la sección que se está leyendo.
 *
 * La sección activa se calcula con la posición real de cada sección en cada
 * scroll. Un `IntersectionObserver` con ratios no sirve acá: las secciones son
 * más altas que su banda de observación, así que el cruce de umbrales se queda
 * con la sección anterior hasta que entra la siguiente y el riel se atrasa una
 * sección completa (spec S30).
 */
export function SideIndex({ items }: SideIndexProps) {
  const [active, setActive] = useState(0);
  const tA11y = useTranslations("a11y");

  useEffect(() => {
    const sections = items
      .map(({ href }) => document.getElementById(href.slice(1)))
      .filter((section): section is HTMLElement => section !== null);

    if (sections.length === 0) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      // La sección activa es la última cuyo inicio ya pasó la línea de lectura.
      const readingLine = window.innerHeight * 0.35;
      let index = 0;

      sections.forEach((section, position) => {
        if (section.getBoundingClientRect().top <= readingLine) index = position;
      });

      // Al pie de página la última sección puede no llegar nunca a la línea.
      const atBottom =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
      setActive(atBottom ? sections.length - 1 : index);
    };

    const schedule = () => {
      if (frame === 0) frame = window.requestAnimationFrame(update);
    };

    // Un cambio de layout sin scroll (acordeón, webfont, imagen) mueve las secciones
    // y tiene que reubicar el índice igual que un scroll (spec S30).
    const layoutObserver =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule);

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    layoutObserver?.observe(document.body);

    return () => {
      if (frame !== 0) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      layoutObserver?.disconnect();
    };
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
