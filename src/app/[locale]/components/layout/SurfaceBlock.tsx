import type { ReactNode } from "react";
import styles from "./Section.module.css";

/**
 * La única superficie elevada de la página (sección de Diagnóstico). Se lee como
 * una hoja apoyada: fondo `--surface`, hairline y, por debajo de 1280px, márgenes
 * negativos; desde 1280px el gutter es del riel del índice y la hoja no lo invade.
 */
export function SurfaceBlock({ children }: { children: ReactNode }) {
  return <div className={styles.surfaceBlock}>{children}</div>;
}
