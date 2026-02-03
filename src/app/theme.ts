import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        primary: {
          50: { value: "#e6fafc" },
          100: { value: "#c3f1f7" },
          200: { value: "#9de8f1" },
          300: { value: "#77dfeb" },
          400: { value: "#52d6e5" },
          500: { value: "#06b6d4" },
          600: { value: "#0891b2" },
          700: { value: "#066c85" },
          800: { value: "#034858" },
          900: { value: "#01232c" },
        },
        secondary: {
          50: { value: "#eef4ff" },
          100: { value: "#d6e2ff" },
          200: { value: "#bdcfff" },
          300: { value: "#a3bcff" },
          400: { value: "#8aa9ff" },
          500: { value: "#3b82f6" },
          600: { value: "#2563eb" },
          700: { value: "#1a4ab1" },
          800: { value: "#0f3177" },
          900: { value: "#07193c" },
        },
        dark: {
          50: { value: "#f8fafc" },
          100: { value: "#f1f5f9" },
          200: { value: "#e2e8f0" },
          300: { value: "#cbd5e1" },
          400: { value: "#94a3b8" },
          500: { value: "#64748b" },
          600: { value: "#475569" },
          700: { value: "#334155" },
          800: { value: "#1e293b" },
          900: { value: "#0f172a" },
        },
      },
    },
  },
});

const theme = createSystem(defaultConfig, customConfig);

export default theme;
