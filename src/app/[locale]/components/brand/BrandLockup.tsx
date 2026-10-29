import { Isotipo } from "./Isotipo";
import styles from "./BrandLockup.module.css";

type BrandLockupProps = {
  /** `horizontal` para el header, `stacked` para el footer. */
  variant?: "horizontal" | "stacked";
  size?: "sm" | "md" | "lg";
  /** Alto del isotipo en píxeles. */
  markSize?: number;
};

/**
 * Lockup de marca: isotipo de tres nodos + la palabra `tonk` en minúsculas.
 * El texto de marca reemplaza al viejo "TONK / SOLUTIONS".
 */
export function BrandLockup({ variant = "horizontal", size = "md", markSize = 28 }: BrandLockupProps) {
  const classes = [styles.lockup, styles[size], variant === "stacked" ? styles.stacked : null]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes}>
      <Isotipo size={markSize} />
      <span className={styles.word}>tonk</span>
    </span>
  );
}
