"use client";

import { useEffect, useState } from "react";
import styles from "./MobileStickyCta.module.css";

type MobileStickyCtaProps = {
  label: string;
  href: string;
};

/**
 * CTA fijo al pie en mobile. Aparece cuando el hero salió por arriba y se oculta
 * antes de Contacto y del footer, para no tapar contenido ni el cierre de página.
 */
export function MobileStickyCta({ label, href }: MobileStickyCtaProps) {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const hero = document.getElementById("s01");
    const contact = document.getElementById("s09");

    const update = () => {
      const heroPassed = hero ? hero.getBoundingClientRect().bottom <= 0 : window.scrollY > 400;
      const contactReached = contact ? contact.getBoundingClientRect().top <= window.innerHeight : false;
      setHidden(!heroPassed || contactReached);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className={`${styles.bar} ${hidden ? styles.hidden : ""}`} aria-hidden={hidden}>
      <a className={styles.cta} href={href} tabIndex={hidden ? -1 : undefined}>
        {label}
      </a>
    </div>
  );
}
