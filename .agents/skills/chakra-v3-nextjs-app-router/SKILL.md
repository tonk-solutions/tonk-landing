---
name: chakra-v3-nextjs-app-router
description: Integra Chakra UI v3 con Next.js App Router y React Server Components resolviendo hydration mismatches de Emotion/Turbopack, configurando el Provider cliente con next-themes, y optimizando el bundle. Usar al configurar Chakra UI v3 en proyectos Next.js 14/15 con App Router.
allowed-tools: "Read, Write"
version: 1.0.0
---

# Chakra v3 — Next.js App Router

## Cuándo usar este skill

- Setup inicial de Chakra UI v3 en Next.js App Router
- Resolver errores de hydration mismatch con Turbopack o next-themes
- Configurar color mode con `next-themes`
- Optimizar el bundle de Chakra en Next.js

## Instrucciones

### 1. Instalar dependencias

```bash
npm install @chakra-ui/react @emotion/react next-themes
```

### 2. Crear el Provider cliente

Crear `components/ui/provider.tsx` — **debe ser Client Component**:

```tsx
"use client"

import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import { ThemeProvider } from "next-themes"

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider value={defaultSystem}>
      <ThemeProvider
        attribute="class"
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </ChakraProvider>
  )
}
```

Si hay tema custom, reemplazar `defaultSystem` por el sistema exportado del `theme.ts`.

### 3. Configurar el layout raíz

En `app/layout.tsx`, dos cambios **obligatorios**:
- `suppressHydrationWarning` en la tag `<html>` (evita warning de next-themes)
- Envolver con el `Provider` cliente

```tsx
import { Provider } from "@/components/ui/provider"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  )
}
```

### 4. Deshabilitar Turbopack (fix hydration Emotion)

Emotion y Turbopack tienen un conflicto conocido de serialización de estilos globales que causa hydration mismatch persistente en Next.js 14/15. El workaround oficial es forzar webpack:

En `package.json`:
```json
{
  "scripts": {
    "dev":   "next dev --webpack",
    "build": "next build --webpack"
  }
}
```

> ⚠️ Este issue está abierto en el tracker de Next.js. Cuando lo resuelvan, se puede eliminar el flag.

### 5. Optimizar bundle con `optimizePackageImports`

En `next.config.mjs`:
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
}

export default nextConfig
```

### 6. Componentes Chakra en Server Components

Los componentes Chakra UI usan hooks internamente → son Client Components.
Wrapper mínimo para usar Chakra en Server Components:

```tsx
// app/page.tsx — Server Component
import { ClientCard } from "@/components/ClientCard"

export default function Page() {
  return <ClientCard />
}
```

```tsx
// components/ClientCard.tsx — Client Component
"use client"
import { Card } from "@chakra-ui/react"

export function ClientCard() {
  return <Card.Root>...</Card.Root>
}
```

### 7. Color mode toggle

```tsx
"use client"
import { useTheme } from "next-themes"
import { IconButton } from "@chakra-ui/react"

export function ColorModeButton() {
  const { theme, setTheme } = useTheme()
  return (
    <IconButton
      aria-label="Toggle color mode"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    />
  )
}
```

## Restricciones

- Nunca omitir `suppressHydrationWarning` en `<html>` — causa warning en consola
- Nunca usar `"use client"` en `app/layout.tsx` — el Provider lo provee
- Nunca correr Next.js con Turbopack (`--turbopack`) con Chakra — usar `--webpack`
- Nunca importar componentes Chakra directamente en Server Components — siempre envolver en Client Component
- Nunca omitir el flag `--webpack` en scripts de build si hay hydration errors
