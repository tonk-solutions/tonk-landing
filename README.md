# Tonk Solutions - Landing Page

## Descripción

Este es el sitio web oficial de Tonk Solutions, una empresa especializada en ingeniería de alta precisión para desafíos de escala. El sitio está construido con Next.js y utiliza Chakra UI para los componentes de interfaz de usuario.

## Características

- Diseño responsivo para todos los dispositivos
- Animaciones fluidas con Framer Motion
- Integración con redes sociales
- Formulario de contacto
- Secciones informativas sobre servicios y equipo

## Tecnologías utilizadas

- Next.js 14
- Chakra UI
- Framer Motion
- React Icons
- TypeScript

## Inicio rápido

Para ejecutar el proyecto localmente:

```bash
# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador para ver el resultado.

## Estructura del proyecto

```
/
├── docs/                  # Documentación de la empresa
├── public/                # Archivos estáticos
├── src/
│   └── app/               # Aplicación Next.js
│       ├── components/     # Componentes reutilizables
│       ├── theme.ts       # Configuración de tema para Chakra UI
│       ├── globals.css    # Estilos globales
│       ├── layout.tsx     # Layout principal de la aplicación
│       ├── page.tsx       # Página principal (landing page)
│       └── providers.tsx  # Providers de Chakra UI
└── package.json          # Dependencias y scripts
```

## SEO y LLMO

Todo lo que leen buscadores y modelos se genera en build desde `messages/*.json`,
`src/app/services/catalog.ts` y `src/app/constants.ts`: no hay copy duplicado ni
archivos mantenidos a mano.

| Superficie | Ruta | Código |
|---|---|---|
| Metadata por idioma (canonical, `hreflang` + `x-default`, Open Graph y Twitter) | todas | `src/app/[locale]/layout.tsx`, `src/app/seo/openGraph.ts`, `src/app/seo/alternates.ts` |
| Datos estructurados: Organization, WebSite, servicios y equipo | todas | `src/app/[locale]/layout.tsx` |
| `WebPage` de la home | `/{locale}` | `src/app/[locale]/page.tsx` |
| `WebPage` + `Service` + `BreadcrumbList` del detalle | `/{locale}/services/{slug}` | `src/app/[locale]/services/[slug]/page.tsx` |
| `robots.txt` con la política de crawlers de IA | `/robots.txt` | `src/app/robots.ts` |
| `sitemap.xml` con `lastmod` y `x-default` | `/sitemap.xml` | `src/app/sitemap.ts` |
| Índice curado para modelos | `/llms.txt` | `src/app/llms.txt/route.ts` |
| Contenido completo en Markdown (es y en) | `/llms-full.txt` | `src/app/llms-full.txt/route.ts` |
| Imagen social por idioma | `/{locale}/opengraph-image` | `src/app/[locale]/opengraph-image.tsx` |

El JSON-LD se emite siempre con `<StructuredData>`, el único componente que usa
`dangerouslySetInnerHTML` porque el payload es JSON propio y nunca entrada de
usuario.

Verificación:

```bash
npx vitest run        # generadores de llms.txt, llms-full.txt, JSON-LD y robots
npm run build         # prerenderiza llms.txt, robots.txt y sitemap.xml
npx playwright test   # head y artefactos realmente servidos (e2e/seo-llmo.spec.ts)
```

## Rendimiento e imágenes

El build usa el optimizador de `next/image` (Sharp) para avatares y assets locales. Si despliegas en un entorno sin runtime de Node para optimización (p. ej. export estático puro), puede ser necesario volver a `images: { unoptimized: true }` en `next.config.js` o servir tamaños fijos vía CDN.

## Contacto

Para más información, contactar a Tonk Solutions en:

- Email: contact@tonksolutions.com.ar
- LinkedIn: [linkedin.com/company/tonk-solutions](https://linkedin.com/company/tonk-solutions)
- Instagram: [@tonksolutions](https://instagram.com/tonksolutions)
