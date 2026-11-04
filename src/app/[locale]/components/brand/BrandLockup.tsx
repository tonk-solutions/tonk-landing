import styles from "./BrandLockup.module.css";
import { WORDMARK_GLYPHS, WORDMARK_HEIGHT, WORDMARK_WIDTH } from "./wordmarkPaths";

type BrandLockupProps = {
  /** `horizontal` para el header, `stacked` para el footer. */
  variant?: "horizontal" | "stacked";
  /** Alto de la caja del isotipo en píxeles; el resto del lockup escala con él. */
  markSize?: number;
};

/** Grilla del isotipo: la misma de `viewBox="0 0 32 32"` en `Isotipo.tsx`. */
const MARK_GRID = 32;

/** Tinta del isotipo en su grilla: la barra de la T arranca en 7 y el nodo menta cierra en 29. */
const MARK_INK = { top: 7, bottom: 29 } as const;

/**
 * Caja del isotipo por defecto, en unidades del kit: 35 deja el lockup en 32px de alto,
 * el alto del header, con la marca a la altura del texto (spec S32).
 */
const DEFAULT_MARK_BOX = 35;

/** Discreción de la «o» del wordmark: el viewBox tiene que cerrar debajo de la línea de base. */
const BASELINE_OVERSCAN = 2;

type Layout = {
  /** Alto de la caja del isotipo en el sistema de coordenadas del lockup. */
  icon: number;
  /** Línea de mayúsculas del wordmark. */
  wordTop: number;
  /** Alto de la «k» del wordmark en ese mismo sistema. */
  wordHeight: number;
  /** Separación entre isotipo y wordmark. */
  gap: number;
};

/** Alto de la «k» del wordmark en el lockup horizontal. */
const HORIZONTAL_WORD_HEIGHT = 96;
/** La tinta del isotipo mide lo que la «k»: la marca no queda más baja que el texto (spec S32). */
const HORIZONTAL_ICON = (MARK_GRID * HORIZONTAL_WORD_HEIGHT) / (MARK_INK.bottom - MARK_INK.top);

const STACKED_ICON = 160;
const STACKED_GAP = 24;
const STACKED_WORD_HEIGHT = 72;

/**
 * Proporciones del lockup en unidades del kit. El horizontal alinea la tinta del isotipo al
 * texto; el apilado del footer conserva las del brand kit, con el wordmark debajo del isotipo.
 */
const LAYOUTS: Record<NonNullable<BrandLockupProps["variant"]>, Layout> = {
  horizontal: {
    icon: HORIZONTAL_ICON,
    // La tinta arranca en la línea de mayúsculas y cierra en la línea de base.
    wordTop: (MARK_INK.top / MARK_GRID) * HORIZONTAL_ICON,
    wordHeight: HORIZONTAL_WORD_HEIGHT,
    gap: 8,
  },
  stacked: {
    icon: STACKED_ICON,
    wordTop: STACKED_ICON + STACKED_GAP,
    wordHeight: STACKED_WORD_HEIGHT,
    gap: STACKED_GAP,
  },
};

/**
 * Lockup oficial del brand kit: isotipo + wordmark «tonk» (Geist 600 en trazos vectoriales).
 * Toma el color de texto actual (`currentColor`) y el nodo, `--accent`. En horizontal la
 * marca mide el alto del texto y queda pegada al wordmark (spec S32).
 */
export function BrandLockup({
  variant = "horizontal",
  markSize = DEFAULT_MARK_BOX,
}: BrandLockupProps) {
  const { icon, wordTop, wordHeight, gap } = LAYOUTS[variant];
  const stacked = variant === "stacked";
  const wordScale = wordHeight / WORDMARK_HEIGHT;
  const wordWidth = WORDMARK_WIDTH * wordScale;

  const width = stacked ? Math.max(icon, wordWidth) : icon + gap + wordWidth;
  const height = wordTop + wordHeight + BASELINE_OVERSCAN;
  const iconX = stacked ? (width - icon) / 2 : 0;
  const wordX = stacked ? (width - wordWidth) / 2 : icon + gap;
  const baseline = wordTop + wordHeight;
  const scale = markSize / icon;

  return (
    <svg
      className={styles.lockup}
      viewBox={`0 0 ${width.toFixed(2)} ${height.toFixed(2)}`}
      width={Math.round(width * scale)}
      height={Math.round(height * scale)}
      role="img"
      aria-label="Tonk"
    >
      <g transform={`translate(${iconX.toFixed(2)},0) scale(${icon / MARK_GRID})`}>
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
