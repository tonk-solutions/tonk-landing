import styles from "./BrandLockup.module.css";

type IsotipoProps = {
  /** Alto en píxeles; el ancho se mantiene proporcional. */
  size?: number;
  className?: string;
  /** Cuando acompaña a un texto de marca ya accesible, se oculta a lectores. */
  decorative?: boolean;
};

/**
 * Isotipo de tres nodos: barra con un nodo en cada extremo, vástago central y nodo
 * inferior en menta. Es la marca de Tonk; no se deforma ni se recolorea.
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
      <g fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round">
        <path d="M6 9.5H26M16 9.5V20" />
      </g>
      <circle cx="5" cy="9.5" r="4.2" fill="currentColor" />
      <circle cx="27" cy="9.5" r="4.2" fill="currentColor" />
      <circle cx="16" cy="25.5" r="4.2" fill="var(--accent)" />
    </svg>
  );
}
