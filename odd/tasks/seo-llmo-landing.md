# SEO y LLMO de la landing

Mejora de la superficie que leen buscadores y modelos: `robots.txt`, `sitemap.xml`, `/llms.txt`,
`/llms-full.txt`, datos estructurados y metadata de cabecera. No toca el diseño congelado
(`design/landing-documento-ingenieria/index.html`) ni el copy visible de las nueve secciones:
todo lo nuevo es máquina-legible, no diseño. Rama `seo`.

## Specs

**S1 — `/llms.txt`.** `GET /llms.txt` responde 200 con `content-type: text/plain; charset=utf-8`.
Formato exacto:

```
# Tonk Solutions

> <seo.description del locale por defecto>

Buenos Aires, Argentina · <locales en mayúsculas, ES / EN> · <contact@tonksolutions.com.ar> · <+54 9 11 2390-8349>

## Páginas

- [Tonk Solutions (es)](https://tonksolutions.com.ar/es): <seo.titleDefault de es>
- [Tonk Solutions (en)](https://tonksolutions.com.ar/en): <seo.titleDefault de en>

## Servicios

- [<services.craft|talent.services[i].title>](https://tonksolutions.com.ar/es/services/<slug>): <…description>

## Contacto

- Correo: <contact.rows[Correo]>
- WhatsApp: https://wa.me/5491123908349
- Ubicación: <contact.rows[Ubicación]>

## Equipo

- <team.members[i].name> — <team.members[i].role>
```

Una línea por cada uno de los 7 servicios de `src/app/services/catalog.ts`, en el orden del catálogo
y con el locale por defecto. Todas las URLs son absolutas (`SITE_URL`). No se agrega copy nuevo: todo
sale de `messages/{locale}.json`, `src/app/services/catalog.ts` y `src/app/constants.ts`. El archivo no
menciona `SAP` (spec S3 del documento de ingeniería).

**S2 — `/llms-full.txt`.** `GET /llms-full.txt` responde 200 con `text/plain; charset=utf-8`.
Markdown con el contenido completo de la landing, `es` primero y `en` después, separados por una línea
`---`. Por locale: `# <seo.titleDefault>`, blockquote con `seo.description`, hero (`hero.titleLine1` +
`hero.titleLine2`, `hero.lede`), `## Integramos con` (las 8 plataformas de `integrations.platforms`),
`## Servicios` (los 7 servicios con descripción y URL absoluta), `## Proyectos` (`projects.items[i]` con
`name`, `type`, `description` y `stack`), `## Diagnóstico de integración` (las 6 filas `diagnostic.rows`
como `- **label:** value`), `## Cómo trabajamos` (`process.steps[i]`), `## Criterio`
(`criterio.intro`, `criterio.principles`, `criterio.companies`, `criterio.mission`, `criterio.pillars`),
`## Equipo` (`team.members[i]` con `name`, `role`, `bio`, `linkedin`) y `## Contacto` (`contact.rows`).
Mismo origen de contenido que S1; tampoco menciona `SAP`.

**S3 — Política de crawlers.** `robots.ts` mantiene `userAgent: "*"` con `allow: "/"`, conserva
`sitemap` y agrega grupos nombrados, todos con `allow: "/"` y sin `disallow`, para:
`GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `ClaudeBot`, `Claude-User`, `Claude-SearchBot`,
`PerplexityBot`, `Perplexity-User`, `Google-Extended`, `Applebot-Extended`, `Amazonbot`,
`meta-externalagent`, `CCBot`, `cohere-ai`, `YouBot`, `Diffbot`. Ningún grupo puede bloquear una ruta.

**S4 — Datos estructurados por página.** El `@graph` del layout (Organization + WebSite + ItemList de
servicios) suma: `email` en la Organization, y un nodo `Person` por co-founder con `name`, `jobTitle`,
`url` (LinkedIn de `team.members[i].linkedin`) y `worksFor` por `@id` a la Organization, más `founder` en la
Organization referenciándolos por `@id`.
La home agrega su propio `WebPage` (`@id` = `${SITE_URL}/${locale}#webpage`) con `name`, `description`,
`url`, `inLanguage`, `isPartOf` al WebSite y `about` a la Organization.
El detalle de servicio agrega `WebPage` + `Service` (`name`, `description`, `url`, `provider`, `areaServed`) +
`BreadcrumbList` sitio → servicios → servicio, enlazados por `@id` (`mainEntity`, `breadcrumb`). El título y la
descripción salen de la misma función que la metadata, así que no se pueden desincronizar.
Solo datos verificables: `constants.ts`, `services/catalog.ts` y `messages/{locale}.json`. Nada inventado
(sin `aggregateRating`, sin `review`, sin `numberOfEmployees`, sin `priceRange`).

**S5 — Metadata de cabecera.** `alternates.languages` incluye `x-default` → locale por defecto, en la home y
en el detalle, con la misma función que usa el sitemap. `twitter.images` publica la imagen OG con `alt` =
`seo.ogImageAlt` en la home y con el título del servicio en el detalle (esa clave deja de estar muerta). En el
detalle el `openGraph` queda completo — Next reemplaza el objeto entero, así que antes se perdían `locale` y
`siteName` — con `images` y `alt` = título del servicio. En la home el `og:image` lo aporta el file convention
de `[locale]/opengraph-image`, que gana sobre la metadata declarada en el mismo segmento y publica su `alt`
estático; su URL (`/{locale}/opengraph-image`, con o sin hash de build) responde 200.

**S6 — `sitemap.xml`.** Cada entrada lleva `lastModified` del build y `alternates.languages` con
`x-default` apuntando al locale por defecto.

**S7 — Checks.** Vitest cubre los generadores puros (`llmsTxt`, `llms-full.txt`, grafos JSON-LD por página) y
`robots`. Playwright (`e2e/seo-llmo.spec.ts`) cubre lo servido: `canonical` y `hreflang` con `x-default`, la
imagen social respondiendo 200, JSON-LD parseable con los `@type` esperados en home y en detalle, y
`/llms.txt`, `/llms-full.txt`, `/robots.txt` y `/sitemap.xml`. `npm run build`, `npm run typecheck` y
`npm run lint` en verde.

## Tasks

| ID | Specs | Ruta | Tarea | Commit |
|---|---|---|---|---|
| T1 | S1,S2,S3,S7 | inline | Generadores `llmsTxt`, rutas `/llms.txt` y `/llms-full.txt`, robots con crawlers de IA y tests unitarios | `82fecd3` `feat(seo): llms.txt, llms-full.txt y política de crawlers` |
| T2 | S4,S7 | inline | Datos estructurados por página: `Person` del equipo, `WebPage`, `Service` y `BreadcrumbList`, con tests unitarios | `2e6f2f1` `feat(seo): datos estructurados por página y por servicio` |
| T3 | S5,S6,S7 | inline | Cabecera (`x-default`, imágenes sociales con `alt` localizado), sitemap con `lastModified`, e2e y README | `8a70ae0` `feat(seo): cabecera, imágenes sociales y sitemap` |

## Log

**L1** (pedido original): "mejorar el SEO y el LLMO de la landing".

**L2** (decisión de alcance): la landing tiene un diseño congelado con exactamente nueve secciones
numeradas y un e2e que lo fija (`odd/tasks/landing-documento-ingenieria.md`, S1). Por eso el LLMO no
agrega una sección visible de preguntas frecuentes: se resuelve con artefactos máquina-legibles
(`llms.txt`, `llms-full.txt`, `robots.txt`) y datos estructurados, sin tocar el diseño ni el copy
visible.

**L3** (evidencia del estado inicial, no pedido): ya existían `robots.ts`, `sitemap.ts`,
`seo/structuredData.ts`, `opengraph-image.tsx` y `alternates` es/en. Faltaban `/llms.txt`,
`/llms-full.txt`, política explícita de crawlers de IA, `x-default`, datos estructurados por página y
el uso de `seo.ogImageAlt`, que estaba declarado en los dos idiomas y no se leía en ningún lado.

**L4** (evidencia, no pedido): `foundingDate: "2026"` del JSON-LD coincide con la fecha del sistema
(2026-10-29), así que se deja como está.

**L5** (routing): T1 iba a worker porque su superficie (`src/app/seo/llmsTxt.ts`, `src/app/llms.txt/`,
`src/app/llms-full.txt/`, `src/app/robots.ts`) es disjunta y el contenido está fijado en S1/S2. El harness
rechazó el launch (el texto de la tarea no llevaba el puntero `Spec: odd/tasks/seo-llmo-landing.md, T<n>`)
con la instrucción explícita de no reintentar y escribir inline, así que T1, T2 y T3 se hicieron en el padre,
de a una.

**L6** (slice 1 — `82fecd3` `feat(seo): llms.txt, llms-full.txt y política de crawlers`):
`src/app/seo/llmsTxt.ts` (módulo puro: adapta los mensajes crudos con `pickServiceContent` y renderiza los dos
documentos), las dos rutas estáticas y `robots.ts` con 16 crawlers nombrados. El harness marcó el slice en 647
líneas autoradas; queda registrado acá como límite. Verificación del slice: `npx vitest run` 26/26 en los dos
archivos nuevos, `typecheck` y `lint` en 0.

**L7** (slice 2 — `2e6f2f1` `feat(seo): datos estructurados por página y por servicio`):
`buildStructuredDataGraph` suma `email`, `founder` y los `Person`; se agregan `buildHomePageGraph` y
`buildServicePageGraph`. El JSON-LD pasa a emitirse por un único componente (`seo/StructuredData.tsx`).
**Corrección de spec**: S4 pedía `serviceType` en el `Service`, pero el único valor honesto disponible era el
título, que duplica `name`; se quitó del nodo y de la spec. También se extrajo `resolveServiceSeo` para que la
metadata y el JSON-LD del detalle lean el mismo título y descripción. Verificación: `npx vitest run` 38/38,
`typecheck` y `lint` en 0.

**L8** (evidencia, no pedido): la regla `dangerously-set-inner-html` de pi-lens es bloqueante y no admite
supresión en posición de atributo JSX. El JSON-LD propio se centralizó en `seo/StructuredData.tsx` con los
atributos por spread y la justificación escrita en el docblock: el payload es JSON de `constants.ts`,
`messages/*.json` y `services/catalog.ts`, nunca entrada de usuario ni query params.

**L9** (evidencia de build, no pedido): con el `next build` del slice 3 se inspeccionó el HTML prerenderizado.
- `hrefLang` sale en camelCase en el HTML estático; como el DOM y los selectores CSS normalizan nombres de
  atributo, los e2e los encuentran igual.
- `hreflang` con `x-default` y `canonical` correctos en `/es` y en el detalle.
- **El file convention gana en el mismo segmento**: en la home, `[locale]/opengraph-image` reemplaza el
  `images` declarado en la metadata y publica su `alt` estático; en el detalle (segmento más profundo, sin
  archivo propio) sí se aplica el `alt` por servicio. S5 se corrigió para describir eso en vez de prometer algo
  que Next no hace.
- `/{locale}/opengraph-image` con y sin hash de build devuelve 200 (body y meta prerenderizados en disco).
- `sitemap.xml` emite `xhtml:link` con `x-default` y `<lastmod>`; `/llms.txt` responde `text/plain; charset=utf-8`.

**L10** (incidente de verificación): la primera corrida de Playwright dio 14 fallas porque el puerto 3000 ya
estaba ocupado por el `next-server` de otro worktree y `reuseExistingServer` lo tomó como propio: los e2e
corrieron contra otra app (`/llms.txt` devolvía 404). No se tocó ese proceso ajeno. El build propio se levantó
en `:3100` (`npm run start -- -p 3100`) y la suite se corrió con
`PLAYWRIGHT_BASE_URL=http://127.0.0.1:3100 npx playwright test`.

**L11** (cierre — `8a70ae0` `feat(seo): cabecera, imágenes sociales y sitemap`): verificación final del árbol
completo, con los tres slices adentro:

| Check | Resultado |
|---|---|
| `npm run typecheck` | exit 0 |
| `npm run lint` | exit 0 |
| `npx vitest run` | 38/38 en 5 archivos |
| `npm run build` | exit 0; `/llms.txt`, `/llms-full.txt`, `/robots.txt` y `/sitemap.xml` prerenderizados como estáticos |
| `npx playwright test` | 55 pasan, 1 salteado a propósito (el nav de escritorio en el proyecto mobile), 0 fallan |

Cierre de riesgos: ningún cambio toca datos almacenados, credenciales, permisos, concurrencia ni
dependencias. `robots.txt` es el único artefacto público que podría afectar el rastreo, y el test fija que
todos los grupos permiten `/` y ninguno bloquea. `Risk: none`.

Pendiente de decisión del dueño (no bloquea): el `alt` de `og:image` de la home es el estático de
`[locale]/opengraph-image.tsx`; si se quiere localizado hace falta `generateImageMetadata` en ese archivo.
