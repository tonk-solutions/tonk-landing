import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

/**
 * Paleta de Chakra para el detalle de servicio (superficie clara). Sale del brand kit:
 * `primary.500` es el acento sobre claro (#10B98F), `primary.400` el menta del tema oscuro
 * (#3DF5C8) y `dark.*` los neutros de la marca (#17191C, #24272C, #8A9099, #E8EAED).
 * El texto sobre `primary.500` es siempre `dark.900`, nunca blanco (contraste).
 */
const customConfig = defineConfig({
  theme: {
    tokens: {
      fonts: {
        heading: { value: "var(--font-geist-sans), system-ui, sans-serif" },
        body: { value: "var(--font-geist-sans), system-ui, sans-serif" },
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
        primary: {
          50: { value: "#e7faf4" },
          100: { value: "#c4f3e6" },
          200: { value: "#9bebd6" },
          300: { value: "#6ee2c4" },
          400: { value: "#3df5c8" },
          500: { value: "#10b98f" },
          600: { value: "#0a7a60" },
          700: { value: "#075e4a" },
          800: { value: "#04483a" },
          900: { value: "#02261e" },
        },
        dark: {
          50: { value: "#f4f5f7" },
          100: { value: "#e8eaed" },
          200: { value: "#d3d6db" },
          300: { value: "#b3b8bf" },
          400: { value: "#8a9099" },
          500: { value: "#6b7280" },
          600: { value: "#4b525b" },
          700: { value: "#3a3f46" },
          800: { value: "#24272c" },
          900: { value: "#17191c" },
        },
      },
    },
    semanticTokens: {
      colors: {
        primary: {
          solid: { value: "{colors.primary.500}" },
          contrast: { value: "{colors.dark.900}" },
          fg: { value: "{colors.primary.600}" },
          muted: { value: "{colors.primary.100}" },
          subtle: { value: "{colors.primary.50}" },
          emphasized: { value: "{colors.primary.500}" },
          focusRing: { value: "{colors.primary.500}" },
        },
        dark: {
          solid: { value: "{colors.dark.800}" },
          contrast: { value: "white" },
          fg: { value: "{colors.dark.700}" },
          muted: { value: "{colors.dark.200}" },
          subtle: { value: "{colors.dark.50}" },
          emphasized: { value: "{colors.dark.800}" },
          focusRing: { value: "{colors.dark.700}" },
        },
      },
    },
  },
});

const theme = createSystem(defaultConfig, customConfig);

export default theme;
