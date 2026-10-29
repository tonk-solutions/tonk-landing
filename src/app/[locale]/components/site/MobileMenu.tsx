"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import styles from "./MobileMenu.module.css";

type MobileMenuProps = {
  items: { href: string; label: string }[];
};

/**
 * Menú desplegable para viewports < 1024px.
 * Cierra con Escape, al hacer click en un link y devuelve el foco al botón.
 */
export default function MobileMenu({ items }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("nav");
  const buttonRef = useRef<HTMLButtonElement>(null);

  const closeAndFocus = useCallback(() => {
    setOpen(false);
    buttonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeAndFocus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, closeAndFocus]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={styles.menuBtn}
        aria-expanded={open}
        aria-controls="main-nav-mobile"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? t("menuClose") : t("menu")}
        <span className={styles.bars} aria-hidden="true" />
      </button>

      {open && (
        <nav
          id="main-nav-mobile"
          className={styles.panel}
          aria-label="Principal"
        >
          <ul>
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={(event) => {
                    event.stopPropagation();
                    closeAndFocus();
                  }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  );
}
