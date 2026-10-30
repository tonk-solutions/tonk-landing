import styles from "./BrandLockup.module.css";

type IsotipoProps = {
  /** Alto en píxeles; el ancho se mantiene proporcional. */
  size?: number;
  className?: string;
  /** Cuando acompaña a un texto de marca ya accesible, se oculta a lectores. */
  decorative?: boolean;
};

/**
 * Isotipo oficial del brand kit: una T de barra recta (`M5 9.5H27`, vástago hasta 20, trazo 5,
 * extremos rectos) con un único nodo menta debajo. Es la marca de Tonk; no se deforma ni se
 * recolorea. Geometría idéntica a `icono/B2-T-nodo-raiz-*.svg`.
 */
export function Isotipo({ size = 28, className, decorative = true }: IsotipoProps) {
  const classes = [styles.isotipo, className].filter(Boolean).join(" ");

  return (
    <svg
      className={classes}
      viewBox="0 0 32 32"
      width={size}
      height={size}
      role={decorative ? "presentation" : "img"}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : "Tonk"}
      focusable="false"
    >
      <path d="M5 9.5H27M16 9.5V20" fill="none" stroke="currentColor" strokeWidth="5" />
      <circle cx="16" cy="25.5" r="3.5" fill="var(--accent)" />
    </svg>
  );
}
