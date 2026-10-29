import type { ElementType, ReactNode } from "react";
import styles from "./Container.module.css";

type ContainerProps = {
  children: ReactNode;
  /** Si el contenedor además expone la retícula de 12 columnas. */
  grid?: boolean;
  /** `false` omite el ancho máximo y el gutter: solo retícula, para anidar. */
  padded?: boolean;
  className?: string;
  as?: ElementType;
};

/**
 * Ancho máximo y márgenes laterales de la página. El gutter y los márgenes viven
 * en las custom properties `--m` y `--g` de globals.css.
 */
export function Container({ children, grid = false, padded = true, className, as }: ContainerProps) {
  const Tag = (as ?? "div") as ElementType;
  const classes = [padded ? styles.wrap : null, grid ? styles.grid : null, className]
    .filter(Boolean)
    .join(" ");

  return <Tag className={classes}>{children}</Tag>;
}
