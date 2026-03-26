# seo-and-metadata-generation — Cómo usarlo

## Cómo activar este skill

- **Claude Code / Antigravity:** `/seo-and-metadata-generation` o describir: "agregar metadata SEO", "OG image dinámica", "generateMetadata para blog posts"

## Ejemplos de uso

### Ejemplo 1 — Blog post con metadata y OG image

**Input:** "La página de blog post necesita título, descripción y una imagen OG personalizada con el título del post."

**Output esperado:**
- `generateMetadata` con `React.cache()` para deduplicar el fetch del post
- `opengraph-image.tsx` con `ImageResponse` usando flexbox para el diseño

### Ejemplo 2 — Template de título global

**Input:** "Quiero que todas las páginas tengan el formato 'Nombre de página | Mi App' en el título del browser tab."

**Output esperado:**
- `metadata.title.template` en `app/layout.tsx`
- Documentación de cómo páginas hijas sobreescriben el título
