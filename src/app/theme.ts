import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";
import { brandTokens } from "./brandTokens";

const customConfig = defineConfig({
  theme: {
    tokens: {
      fonts: {
        heading: { value: "var(--font-heading), Inter, system-ui, sans-serif" },
        body: { value: "var(--font-body), Inter, system-ui, sans-serif" },
        mono: { value: "var(--font-mono), ui-monospace, SFMono-Regular, Menlo, monospace" },
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
