import styles from "./BrandLockup.module.css";
import { WORDMARK_GLYPHS, WORDMARK_HEIGHT, WORDMARK_WIDTH } from "./wordmarkPaths";

type BrandLockupProps = {
  /** `horizontal` para el header, `stacked` para el footer. */
  variant?: "horizontal" | "stacked";
  /** Alto del isotipo en píxeles; el resto del lockup escala con él. */
  markSize?: number;
};

type Layout = {
  /** Alto del isotipo en el sistema de coordenadas del kit. */
  icon: number;
  /** Alto de la «k» del wordmark en ese mismo sistema. */
  wordHeight: number;
  /** Separación entre isotipo y wordmark. */
  gap: number;
};

/** Proporciones de `gen_kit.py` del brand kit, sin el área de respeto. */
const LAYOUTS: Record<NonNullable<BrandLockupProps["variant"]>, Layout> = {
  horizontal: { icon: 128, wordHeight: 96, gap: 28 },
  stacked: { icon: 160, wordHeight: 72, gap: 24 },
};

/**
 * Lockup oficial del brand kit: isotipo + wordmark «tonk» (Geist 600 en trazos vectoriales).
 * Toma el color de texto actual (`currentColor`) y el nodo, `--accent`.
 */
export function BrandLockup({ variant = "horizontal", markSize = 32 }: BrandLockupProps) {
  const { icon, wordHeight, gap } = LAYOUTS[variant];
  const wordScale = wordHeight / WORDMARK_HEIGHT;
  const wordWidth = WORDMARK_WIDTH * wordScale;
  const stacked = variant === "stacked";

  const width = stacked ? Math.max(icon, wordWidth) : icon + gap + wordWidth;
  const height = stacked ? icon + gap + wordHeight : icon;
  const iconX = stacked ? (width - icon) / 2 : 0;
  const wordX = stacked ? (width - wordWidth) / 2 : icon + gap;
  // Línea de base: en horizontal la «k» queda a 0.81 del alto del isotipo (gen_kit.py).
  const baseline = stacked ? height : icon * 0.81;
  const scale = markSize / icon;

  return (
    <svg
      className={styles.lockup}
      viewBox={`0 0 ${width.toFixed(2)} ${height}`}
      width={Math.round(width * scale)}
      height={Math.round(height * scale)}
      role="img"
      aria-label="Tonk"
    >
      <g transform={`translate(${iconX.toFixed(2)},0) scale(${icon / 32})`}>
        <path d="M5 9.5H27M16 9.5V20" fill="none" stroke="currentColor" strokeWidth="5" />
        <circle cx="16" cy="25.5" r="3.5" fill="var(--accent)" />
      </g>
      <g fill="currentColor" transform={`translate(${wordX.toFixed(2)},${baseline.toFixed(2)}) scale(${wordScale},${-wordScale})`}>
        {WORDMARK_GLYPHS.map((glyph) => (
          <path key={glyph.x} transform={`translate(${glyph.x},0)`} d={glyph.d} />
        ))}
      </g>
    </svg>
  );
}
