# nextjs15-data-fetching — Cómo usarlo

## Cómo activar este skill

- **Claude Code / Antigravity:** `/nextjs15-data-fetching` o describir: "fetch datos en un Server Component", "page que necesita params y cookies", "mostrar partes de la página mientras carga"
- **Cursor / VS Code:** se activa automáticamente según el frontmatter

## Ejemplos de uso

### Ejemplo 1 — Page con params asincrónicos

**Input:** "Crear la página de detalle de un producto en `/products/[id]`. Necesita el ID del producto y la cookie de preferencia de moneda."

**Output esperado:**
- `app/products/[id]/page.tsx` con `await params` y `await cookies()` correctamente
- Tipado con `PageProps` global

### Ejemplo 2 — Dashboard con streaming

**Input:** "Dashboard con 3 widgets independientes: ventas, usuarios activos y últimas órdenes. Mostrar el esqueleto de cada uno mientras carga."

**Output esperado:**
- 3 componentes async con sus propios fetches
- `Suspense` boundaries individuales con skeleton fallbacks
- `Promise.all` donde corresponda si hay fetches relacionados

**Paths de entrega:**
```
skills/nextjs15-data-fetching/SKILL.md
skills/nextjs15-data-fetching/USAGE.md
```
