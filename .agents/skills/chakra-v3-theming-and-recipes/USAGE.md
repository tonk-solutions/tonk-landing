# chakra-v3-theming-and-recipes — Cómo usarlo

## Cómo activar este skill

- **Claude Code / Antigravity:** `/chakra-v3-theming-and-recipes` o triggers en lenguaje libre como "crea el tema de Chakra", "define un recipe para el Button", "agrega un color custom al sistema"
- **Cursor / VS Code:** se activa automáticamente al trabajar con archivos `theme.ts`, `*.recipe.ts` o cuando el contexto menciona `createSystem`, `defineRecipe`, `colorPalette`

## Ejemplos de uso

### Ejemplo 1 — Crear un tema custom desde cero

**Input:**
> "Creame un `theme.ts` con el color brand en azul, fuente Inter y un recipe para Button con variantes solid y outline"

**Output esperado:**
- Archivo `theme.ts` con `createSystem` + `defaultConfig`
- Token `brand` con escala 50-900, todos con `{ value: ... }`
- Semantic tokens: `solid`, `contrast`, `fg`, `muted`, `focusRing`
- `customButtonRecipe` con `defineRecipe`, variantes `solid` / `outline`, tamaños `sm` / `lg`
- Export del `system` listo para pasar al `<Provider>`

### Ejemplo 2 — Migrar `extendTheme` de v2

**Input:**
> "Tengo este tema v2 con `extendTheme`, pasalo a v3"

**Output esperado:**
- Reemplazo de `extendTheme` por `createSystem(defaultConfig, { theme: { ... } })`
- Todos los colores y tokens re-envueltos en `{ value: ... }`
- `colorScheme` → `colorPalette` en todas las referencias
- `styleConfig` → `defineRecipe`, `multiStyleConfig` → `defineSlotRecipe`

### Ejemplo 3 — Agregar dark mode a color custom

**Input:**
> "El color `brand.500` no adapta al dark mode, ¿cómo lo arreglo?"

**Output esperado:**
- Definición completa de los 7 semantic tokens para `brand` con `_light` / `_dark`
- Ejemplo de uso con `colorPalette="brand"` en componentes

## Paths de entrega

```
skills/chakra-v3-theming-and-recipes/SKILL.md
skills/chakra-v3-theming-and-recipes/USAGE.md
```
