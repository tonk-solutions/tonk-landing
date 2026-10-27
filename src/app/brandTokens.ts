/**
 * Single source of truth for the "Ingeniería sobria" brand palette.
 *
 * `src/app/theme.ts` derives the Chakra color and semantic tokens from this
 * object, and `src/app/globals.css` exposes the same values as CSS custom
 * properties (--bg, --surface, --muted, --fg, --accent, --accent-on-light and
 * the translucent --border/--accent-* steps).
 * `src/app/__tests__/brandTokens.test.ts` keeps both declarations in sync.
 */

/** Composes a translucent variant of an opaque `#RRGGBB` brand color. */
export function withAlpha(hex: string, alpha: number): string {
  const match = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!match) {
    throw new Error(`withAlpha expects a #RRGGBB color, received "${hex}"`);
  }
  const channels = Number.parseInt(match[1], 16);
  const r = (channels >> 16) & 0xff;
  const g = (channels >> 8) & 0xff;
  const b = channels & 0xff;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const palette = {
  /** Page background: graphite. */
  bg: "#17191C",
  /** Raised surfaces: cards, panels, scrolled header. */
  surface: "#24272C",
  /** Secondary text, labels and metadata: gray. */
  muted: "#8A9099",
  /** Primary text on dark backgrounds. */
  fg: "#E8EAED",
  /** Mint accent. Minimal use: primary buttons, links/focus, small details. */
  accent: "#3DF5C8",
  /** Contrast-safe mint for light backgrounds. */
  accentOnLight: "#10B98F",
} as const;

export const brandTokens = {
  ...palette,
  /** Accent hover fill on graphite: one step deeper so graphite text keeps its contrast. */
  accentHover: "#2BE3BA",
  /** Hairline borders, dividers and card outlines on graphite (fg 7%). */
  border: withAlpha(palette.fg, 0.07),
  /** Active or hovered hairline; also the faintest readable frame (fg 18%). */
  borderStrong: withAlpha(palette.fg, 0.18),
  /** Tinted fill for chips, icon plates and selected rows (accent 12%). */
  accentSubtle: withAlpha(palette.accent, 0.12),
  /** Accent border or halo around an active element (accent 30%). */
  accentHalo: withAlpha(palette.accent, 0.3),
  /** Bright accent edge: solid hover boundaries and shimmer cores (accent 45%). */
  accentGlow: withAlpha(palette.accent, 0.45),
};

export type BrandTokenName = keyof typeof brandTokens;

/**
 * Palette-derived translucent colors for decorative one-offs (dot grids,
 * ambient gradients, SVG strokes) that need an opacity outside the named
 * `brandTokens` steps.
 */
export const brandAlpha = {
  bg: (alpha: number) => withAlpha(palette.bg, alpha),
  fg: (alpha: number) => withAlpha(palette.fg, alpha),
  muted: (alpha: number) => withAlpha(palette.muted, alpha),
  accent: (alpha: number) => withAlpha(palette.accent, alpha),
} as const;
