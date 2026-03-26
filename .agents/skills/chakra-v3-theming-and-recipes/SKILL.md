---
name: chakra-v3-theming-and-recipes
description: Configura el design system de Chakra UI v3 usando createSystem, design tokens con wrapper {value:...}, semantic tokens para dark mode automático, defineRecipe para componentes simples y defineSlotRecipe para componentes multipart. Usar cuando se crea o personaliza un tema en proyectos React/Next.js con Chakra UI v3.
allowed-tools: "Read, Write"
version: 1.0.0
---

# Chakra v3 — Theming y Recipes

## Cuándo usar este skill

- Crear o migrar la configuración del tema en un proyecto Chakra UI v3
- Definir design tokens (colores, tipografía, espaciado)
- Crear variantes de componentes reutilizables con `defineRecipe` o `defineSlotRecipe`
- Reemplazar `extendTheme` / `colorScheme` / `styleConfig` de v2

## Instrucciones

### 1. Inicializar el sistema con `createSystem`

Siempre usar `createSystem` + `defaultConfig`. Nunca usar `extendTheme` (v2, deprecated).
Crear archivo `theme.ts` en la raíz del proyecto:

```typescript
import { createSystem, defaultConfig } from "@chakra-ui/react"

export const system = createSystem(defaultConfig, {
  theme: {
    tokens: { /* design tokens aquí */ },
    semanticTokens: { /* semantic tokens aquí */ },
    recipes: { /* recipes de componentes aquí */ },
  },
})
```

Pasar el sistema al `Provider`:
```typescript
<Provider value={system}>
  {children}
</Provider>
```

### 2. Definir design tokens con `{ value: ... }`

**Obligatorio:** todo valor de token debe estar envuelto en `{ value: ... }`.
Omitir el wrapper rompe el engine de Panda CSS silenciosamente.

```typescript
theme: {
  tokens: {
    colors: {
      brand: {
        50:  { value: "#eff6ff" },
        500: { value: "#3b82f6" },
        900: { value: "#1e3a8a" },
      },
    },
    fonts: {
      heading: { value: "'Inter', sans-serif" },
    },
    spacing: {
      sm: { value: "0.5rem" },
    },
  },
}
```

### 3. Semantic tokens para dark mode automático

Los 7 semantic tokens de cada paleta (`solid`, `muted`, `subtle`, `emphasized`, `contrast`, `fg`, `focusRing`) adaptan el color automáticamente al color mode.
Definirlos para cada color custom que use `colorPalette`:

```typescript
semanticTokens: {
  colors: {
    brand: {
      solid:    { value: { _light: "{colors.brand.500}", _dark: "{colors.brand.200}" } },
      contrast: { value: { _light: "white", _dark: "{colors.gray.900}" } },
      muted:    { value: { _light: "{colors.brand.100}", _dark: "{colors.brand.800}" } },
      fg:       { value: { _light: "{colors.brand.700}", _dark: "{colors.brand.300}" } },
      focusRing:{ value: { _light: "{colors.brand.500}", _dark: "{colors.brand.300}" } },
    },
  },
},
```

### 4. Recetas para componentes simples (`defineRecipe`)

Reemplaza `styleConfig` de v2. Usar para componentes de una sola parte (Button, Badge, Tag).

```typescript
import { defineRecipe } from "@chakra-ui/react"

export const customButtonRecipe = defineRecipe({
  className: "btn",
  base: {
    fontWeight: "semibold",
    borderRadius: "md",
    cursor: "pointer",
  },
  variants: {
    variant: {
      solid:   { bg: "brand.solid", color: "brand.contrast" },
      outline: { borderWidth: "1px", borderColor: "brand.solid", color: "brand.fg" },
    },
    size: {
      sm: { px: "3", py: "1", fontSize: "sm" },
      lg: { px: "6", py: "3", fontSize: "lg" },
    },
  },
  defaultVariants: { variant: "solid", size: "sm" },
})
```

Registrar en `createSystem`:
```typescript
theme: {
  recipes: { Button: customButtonRecipe }
}
```

### 5. Recetas para componentes multipart (`defineSlotRecipe`)

Reemplaza `multiStyleConfig` de v2. Usar para componentes compuestos (Accordion, Tabs, Dialog).

```typescript
import { defineSlotRecipe } from "@chakra-ui/react"

export const customAccordionRecipe = defineSlotRecipe({
  className: "accordion",
  slots: ["root", "item", "trigger", "content"],
  base: {
    root:    { width: "full" },
    trigger: { px: "4", py: "3", _hover: { bg: "gray.50" } },
    content: { px: "4", pb: "4", fontSize: "sm" },
  },
  variants: {
    variant: {
      enclosed: {
        item: { borderWidth: "1px", rounded: "md", mb: "2" },
      },
    },
  },
  defaultVariants: { variant: "enclosed" },
})
```

### 6. `colorPalette` en lugar de `colorScheme`

`colorScheme` está deprecated. Usar `colorPalette` en cualquier componente:

```tsx
// ❌ v2
<Button colorScheme="blue">Guardar</Button>

// ✅ v3
<Button colorPalette="brand">Guardar</Button>
```

Para que un color custom funcione con `colorPalette`, debe tener definidos:
- `tokens.colors.<nombre>.50` → `tokens.colors.<nombre>.950` (escala completa)
- Los 7 `semanticTokens` del paso 3

## Restricciones

- Nunca usar `extendTheme` — siempre `createSystem`
- Nunca asignar valores raw a tokens: `primary: "#000"` rompe el engine. Siempre `{ value: "#000" }`
- Nunca usar `colorScheme` — siempre `colorPalette`
- Nunca usar `styleConfig` / `multiStyleConfig` — siempre `defineRecipe` / `defineSlotRecipe`
- Nunca importar `defaultSystem` en producción sin tree-shaking — carga recipes de todos los componentes
- Nunca definir funciones runtime dentro del objeto de tema — usar CSS variables o semantic tokens en su lugar
