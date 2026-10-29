import type { ReactNode } from "react";
import styles from "./Section.module.css";

/**
 * La única superficie elevada de la página (sección de Diagnóstico). Se lee como
 * una hoja apoyada: fondo `--surface`, hairline y márgenes negativos, sin sombra.
 */
export function SurfaceBlock({ children }: { children: ReactNode }) {
  return <div className={styles.surfaceBlock}>{children}</div>;
}
