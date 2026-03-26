# rsc-and-client-architecture — Cómo usarlo

## Cómo activar este skill

- **Claude Code / Antigravity:** `/rsc-and-client-architecture` o describir: "diseñar árbol de componentes", "hydration error", "prevenir que secrets lleguen al cliente", "configurar Context provider"

## Ejemplos de uso

### Ejemplo 1 — Modal con datos del servidor

**Input:** "Un modal de carrito que usa useState para toggle, pero el contenido del carrito viene de una DB."

**Output esperado:**
- `Modal` como Client Component que acepta `children`
- `Cart` como Server Component con fetch
- `page.tsx` que compone `<Modal><Cart /></Modal>` como Server Component padre

### Ejemplo 2 — Context global sin romper SSR

**Input:** "Agregar un ThemeProvider global que no bloquee la optimización de Server Components."

**Output esperado:**
- `ThemeProvider` Client Component con `<ThemeContext value={...}>` (React 19)
- Import en `layout.tsx` wrapeando solo `{children}`
