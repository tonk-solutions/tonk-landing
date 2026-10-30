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
La ubicación y el teléfono de la cabecera salen de `contact.rows` (se reconocen por valor: la fila con
`@` es el correo, la que coincide con los dígitos de `CONTACT_PHONE` es el WhatsApp y la restante es la
ubicación), no de `footer.location` ni de `CONTACT_PHONE` formateado, que publican otro texto. La fila
de WhatsApp se emite una sola vez y con la URL de `wa.me`, así que `## Contacto` tiene exactamente tres
viñetas con labels distintos.

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
`meta-externalagent`, `CCBot`, `cohere-ai`, `YouBot`, `Diffbot`. Ningún grupo puede bloquear una ruta. El
archivo no publica la directiva `Host`: espera un hostname desnudo y no aporta nada sobre `sitemap`.

**S4 — Datos estructurados por página.** El `@graph` del layout (Organization + WebSite + ItemList de
servicios) suma: `email` en la Organization, y un nodo `Person` por miembro del equipo con `name`, `jobTitle`,
`url` (LinkedIn de `team.members[i].linkedin`) y `worksFor` por `@id` a la Organization. `founder` solo
referencia a quienes declaran `founder: true` en `messages` (hoy los tres co-founders), para no publicar un
socio falso cuando la sección Equipo sume otro rol.
La home agrega su propio `WebPage` (`@id` = `${SITE_URL}/${locale}#webpage`) con `name`, `description`,
`url`, `inLanguage`, `isPartOf` al WebSite y `about` a la Organization.
El detalle de servicio agrega `WebPage` + `Service` + `BreadcrumbList` sitio → servicios → servicio,
enlazados por `@id` (`mainEntity`, `breadcrumb`). El `Service` del detalle y el del `ItemList` del layout
comparten `@id` (`${SITE_URL}/{locale}/services/{slug}#service`) y el mismo `name`/`description` del
catálogo, así que cada servicio es una sola entidad y no dos contradictorias; el `WebPage` sí usa el título
y la descripción SEO de la página. Ambos salen de funciones que también alimentan la metadata, así que no se
pueden desincronizar.
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

**S7 — Checks.** Vitest cubre los generadores puros (`llmsTxt`, `llms-full.txt`, grafos JSON-LD por página),
`robots`, `openGraph`, `alternates` y `sitemap`. Playwright (`e2e/seo-llmo.spec.ts`) cubre lo servido:
`canonical` y `hreflang` con `x-default`, la imagen social pedida con ruta relativa (para que la resuelva
`use.baseURL` y no producción) y respondiendo 200, JSON-LD parseable con los `@type` y la cantidad de `Person`
esperados, la metadata social del detalle (`og:locale`, `og:site_name`, `og:image`, `og:image:alt`,
`twitter:card`, `twitter:image`), y `/llms.txt`, `/llms-full.txt`, `/robots.txt` y `/sitemap.xml`. El
`webServer` de Playwright deriva de la misma base que `use.baseURL` para que la suite no pueda correr contra
otra aplicación. `npm run build`, `npm run typecheck` y `npm run lint` en verde.

## Tasks

| ID | Specs | Ruta | Tarea | Commit |
|---|---|---|---|---|
| T1 | S1,S2,S3,S7 | inline | Generadores `llmsTxt`, rutas `/llms.txt` y `/llms-full.txt`, robots con crawlers de IA y tests unitarios | `a20b340` `feat(seo): llms.txt, llms-full.txt y política de crawlers` |
| T2 | S4,S7 | inline | Datos estructurados por página: `Person` del equipo, `WebPage`, `Service` y `BreadcrumbList`, con tests unitarios | `5f06f7b` `feat(seo): datos estructurados por página y por servicio` |
| T3 | S5,S6,S7 | inline | Cabecera (`x-default`, imágenes sociales con `alt` localizado), sitemap con `lastModified`, e2e y README | `c6cdec6` `feat(seo): cabecera, imágenes sociales y sitemap` |

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

**L6** (slice 1 — `a20b340` `feat(seo): llms.txt, llms-full.txt y política de crawlers`):
`src/app/seo/llmsTxt.ts` (módulo puro: adapta los mensajes crudos con `pickServiceContent` y renderiza los dos
documentos), las dos rutas estáticas y `robots.ts` con 16 crawlers nombrados. El harness marcó el slice en 647
líneas autoradas; queda registrado acá como límite. Verificación del slice: `npx vitest run` 26/26 en los dos
archivos nuevos, `typecheck` y `lint` en 0.

**L7** (slice 2 — `5f06f7b` `feat(seo): datos estructurados por página y por servicio`):
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

**L11** (cierre — `c6cdec6` `feat(seo): cabecera, imágenes sociales y sitemap`): verificación final del árbol
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

**L12** (ronda 1 de review y QA, nueve hallazgos aplicados — commit `fix(seo): hallazgos de review`):
1. **Contacto duplicado en `/llms.txt` y `/llms-full.txt`.** Se emitían las tres filas de `contact.rows` y
   además una viñeta de WhatsApp agregada a mano, así que el mismo label aparecía dos veces con valores
   distintos. Ahora `resolveContact` reconoce las filas por valor (la del `@` es el correo, la que coincide en
   dígitos con `CONTACT_PHONE` es WhatsApp, la restante es ubicación) y emite la de WhatsApp con `WHATSAPP_URL`:
   tres viñetas, labels únicos.
2. **Cabecera fuera de formato.** Salía de `footer.location` («Buenos Aires, AR») y de `CONTACT_PHONE`
   («+54-9-11-2390-8349»). Ahora sale de las mismas filas de contacto, así que publica exactamente
   `Buenos Aires, Argentina · ES / EN · contact@tonksolutions.com.ar · +54 9 11 2390-8349`.
3. **`Host` inválido en `robots.txt`.** Emitía `Host: https://tonksolutions.com.ar`; la directiva espera un
   hostname desnudo y S3 no la pide. Se eliminó.
4. **Dos entidades `Service` contradictorias por página.** El `Service` del ItemList no tenía `@id` y el de la
   página sí, y en `enterprise-integrations` además decían nombres distintos. Ahora los dos comparten
   `@id` (`{url}#service`) y el mismo `name`/`description` del catálogo; el `WebPage` y el breadcrumb siguen
   usando el título SEO de la página.
5. **Playwright podía correr contra otra app.** `webServer.url` estaba fijo en `:3000` mientras `baseURL` salía
   de `PLAYWRIGHT_BASE_URL`: con un `next-server` ajeno escuchando, reutilizaba ese y los tests iban a otro
   lado. Ahora el `webServer` deriva del mismo origen que `baseURL` (`PLAYWRIGHT_PORT` para aislar el puerto).
6. **El e2e de `og:image` validaba producción.** Pedía la URL absoluta, que Playwright resuelve sin mirar
   `baseURL`. Ahora pide `pathname + search` contra el server bajo test y verifica aparte que la URL publicada
   sea absoluta sobre `SITE_URL`.
7. **`founder` declaraba a todo el equipo.** Se agregó `founder: true` a los co-founders en `messages` y la
   Organization solo los referencia a ellos; el test cubre el caso de un miembro que no es socio.
8. **La evidencia apuntaba a un commit huérfano.** El doc registraba `8a70ae0`, que quedó fuera de la rama
   después del amend; ahora registra `c6cdec6`.
9. **Checks faltantes.** `arrayContaining(["Person", "Person", "Person"])` colapsaba duplicados; ahora se
   cuentan con `filter`. Se agregaron `openGraph.test.ts` (openGraph, twitter, alternates y sitemap) y el e2e
   "el detalle no pierde la metadata social del layout" (`og:locale`, `og:site_name`, `og:image`,
   `og:image:alt`, `twitter:card`, `twitter:image`).

Para que `sitemap.ts` y `seo/alternates.ts` se puedan testear sin arrastrar React, la lista de idiomas se
movió a `src/i18n/locales.ts`; `routing.ts` la consume y agrega la navegación de cliente.

Evidencia servida (no solo en memoria): `/llms.txt` con la cabecera exacta y tres viñetas de contacto,
`/robots.txt` sin `Host` y con los 16 grupos, y en `es/services/enterprise-integrations.html` un único
`…/enterprise-integrations#service` con un solo `name` de servicio. Checks: `typecheck` 0 · `lint` 0 ·
`vitest` **50/50** · `build` 0 desde `.next` limpio (dos veces seguidas) · `playwright` **57 pasan, 1 salteado**
con `PLAYWRIGHT_PORT=3100`. `Risk: none`.
