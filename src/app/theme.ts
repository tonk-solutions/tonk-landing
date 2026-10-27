import {
  createSystem,
  defaultConfig,
  defineConfig,
  defineRecipe,
} from "@chakra-ui/react";
import { brandTokens } from "./brandTokens";

const customConfig = defineConfig({
  theme: {
    recipes: {
      /**
       * `accent` is the mint plate the primary CTAs share (hero, WhatsApp).
       * `createSystem` deep-merges this config over `defaultConfig`, so the
       * button recipe keeps its base, its `size` scale, its default variants
       * (`solid`, `subtle`, `surface`, `outline`, `ghost`, `plain`) and its
       * `chakra-button` class name; only this extra variant is added.
       * Spacing (`px`, `py`, `size`) stays on each call site because the plates
       * differ in width.
       */
      button: defineRecipe({
        variants: {
          variant: {
            accent: {
              bg: "brand.accent",
              color: "brand.bg",
              borderWidth: "1px",
              borderStyle: "solid",
              borderColor: "brand.accent",
              borderRadius: "md",
              fontWeight: "semibold",
              letterSpacing: "wide",
              _hover: {
                bg: "accent.emphasized",
                borderColor: "accent.emphasized",
                transform: "translateY(-1px)",
              },
              transition: "background 0.3s ease, transform 0.3s ease",
            },
          },
        },
      }),
    },
    tokens: {
      /**
       * Geist via its own variables (defined on <html> by `layout.tsx`).
       * `--font-body` already starts with Geist; it stays as a second entry
       * only so the system stack keeps the same order. If a variable is
       * undefined the whole declaration is invalid and the font is inherited,
       * which is why the Geist classes must live on <html>, not on <body>.
       */
      fonts: {
        heading: {
          value: "var(--font-geist-sans), var(--font-body), Inter, system-ui, sans-serif",
        },
        body: {
          value: "var(--font-geist-sans), var(--font-body), Inter, system-ui, sans-serif",
        },
        mono: {
          value:
            "var(--font-geist-mono), var(--font-mono), ui-monospace, SFMono-Regular, Menlo, monospace",
        },
      },
      sizes: {
        container: {
          sm: { value: "640px" },
          md: { value: "768px" },
          lg: { value: "1024px" },
          xl: { value: "1280px" },
        },
      },
      colors: {
        brand: {
          bg: { value: brandTokens.bg },
          surface: { value: brandTokens.surface },
          muted: { value: brandTokens.muted },
          fg: { value: brandTokens.fg },
          accent: { value: brandTokens.accent },
          accentOnLight: { value: brandTokens.accentOnLight },
          // Accent hover lives on graphite: darker than `accent`, never `accentOnLight`.
          accentHover: { value: brandTokens.accentHover },
          // Translucent steps, composed once in brandTokens.ts.
          border: { value: brandTokens.border },
          borderStrong: { value: brandTokens.borderStrong },
          accentSubtle: { value: brandTokens.accentSubtle },
          accentHalo: { value: brandTokens.accentHalo },
          accentGlow: { value: brandTokens.accentGlow },
        },
      },
    },
    semanticTokens: {
      colors: {
        // Mint accent contract: solid fills, contrast text, focus rings.
        // `muted` is the light-surface mint; dark surfaces use `emphasized`.
        accent: {
          solid: { value: "{colors.brand.accent}" },
          contrast: { value: "{colors.brand.bg}" },
          fg: { value: "{colors.brand.accent}" },
          muted: { value: "{colors.brand.accentOnLight}" },
          subtle: { value: "{colors.brand.accentSubtle}" },
          emphasized: { value: "{colors.brand.accentHover}" },
          halo: { value: "{colors.brand.accentHalo}" },
          glow: { value: "{colors.brand.accentGlow}" },
          focusRing: { value: "{colors.brand.accent}" },
        },
        focusRing: { value: "{colors.brand.accent}" },
      },
    },
  },
});

const theme = createSystem(defaultConfig, customConfig);

export default theme;
