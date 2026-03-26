# chakra-v3-nextjs-app-router — Cómo usarlo

## Cómo activar este skill

- **Claude Code / Antigravity:** `/chakra-v3-nextjs-app-router` o triggers como "setup Chakra en Next.js", "hydration error Chakra", "configurar Provider App Router", "Turbopack Chakra error"
- **Cursor / VS Code:** se activa en archivos `app/layout.tsx`, `next.config.mjs`, `components/ui/provider.tsx`

## Ejemplos de uso

### Ejemplo 1 — Setup inicial completo

**Input:**
> "Instalame Chakra UI v3 en mi proyecto Next.js 15 con App Router"

**Output esperado:**
- `npm install @chakra-ui/react @emotion/react next-themes`
- `components/ui/provider.tsx` con `"use client"`, `ChakraProvider` + `ThemeProvider`
- `app/layout.tsx` con `suppressHydrationWarning` y `<Provider>`
- `next.config.mjs` con `optimizePackageImports`
- `package.json` scripts con `--webpack`

### Ejemplo 2 — Resolver hydration mismatch

**Input:**
> "Tengo este error: `Hydration failed because the initial server rendered HTML did not match the client`"

**Output esperado:**
- Diagnóstico: Turbopack + Emotion conflict
- Fix: agregar `--webpack` a scripts en `package.json`
- Fix secundario: verificar `suppressHydrationWarning` en `<html>`
- Fix color mode: verificar configuración de `ThemeProvider`

### Ejemplo 3 — Agregar color mode toggle

**Input:**
> "Agrega un botón para cambiar entre dark y light mode"

**Output esperado:**
- Componente `ColorModeButton` con `"use client"` y `useTheme` de next-themes
- `IconButton` con `aria-label` correctamente asignado
- Instrucción de dónde colocarlo en el layout

## Paths de entrega

```
skills/chakra-v3-nextjs-app-router/SKILL.md
skills/chakra-v3-nextjs-app-router/USAGE.md
```
