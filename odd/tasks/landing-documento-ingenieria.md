# Landing "documento de ingeniería" — port a Next

Reemplaza el rediseño de los PR #31/#32 por el prototipo aprobado en OpenDesign
(`design/landing-documento-ingenieria/index.html`, referencia visual congelada).
Rama `feature/landing-documento-ingenieria` desde `main`. #31 y #32 se cierran como superseded.

## Specs

**S1 — Secciones y orden.** La home tiene exactamente 9 secciones numeradas, en este orden:
`01 Hero` · `02 Integramos con` · `03 Servicios` · `04 Proyectos` · `05 Diagnóstico de integración` ·
`06 Cómo trabajamos` · `07 Criterio` · `08 Equipo` · `09 Contacto` (+ header fijo y footer).
El header del hero dice `HOJA 01 / 09` y el índice lateral tiene 9 items.

**S2 — Titular del hero.** Texto exacto en dos partes: `Integraciones enterprise complejas,` /
`y producto desde cero.` La segunda parte lleva una regla menta de 2px **continua** (un solo trazo,
nunca dos segmentos). A 1440px de ancho el h1 ocupa como máximo 4 líneas y a 1440×900 el CTA
primario y la fila meta `Buenos Aires, AR · Senior only · ES / EN` quedan visibles sin scrollear.

**S3 — SAP.** El sitio no menciona SAP en ningún lado: ni copy, ni nodos del diagrama, ni barras de
integración, ni `alt`, ni `aria-label`, ni comentarios, ni metadata. El nodo que ocupaba ese lugar es
`E-COMMERCE` y la ruta del pulso es `E-COMMERCE → TONK → ARCA`. La barra de integraciones tiene 8
plataformas y su contador dice `8 plataformas`.

**S4 — Nombres de proyectos.** Proyecto 01 = `Konekta` (ningún texto dice "DUCE").
Proyecto 02 = `Clank`. Ambos con su tipo, descripción, stack y `PRODUCTO COMPLETO`.
El dato del header de sección dice `2 productos · greenfield`.

**S5 — Sin material visual de producto ni personas.** No hay fotos en Equipo (monogramas `MC`, `NG`,
`RH`) ni capturas de producto en Proyectos. No se reintroducen sin pedido explícito.

**S6 — Sin comentarios de clientes.** No existe la sección de Comentarios, ni citas, ni atribuciones.

**S7 — Sin etiquetas de vocero.** Ninguna ficha del equipo lleva la etiqueta "Vocero", y el header de
la sección no cuenta voceros: dice `3 co-founders`.

**S8 — Diagnóstico de integración.** Seis filas en este orden exacto: `Alcance`, `Duración`,
`Presupuesto`, `Entregable`, `Pruebas`, `Plan de mantenimiento`. Un único CTA `Pedir diagnóstico` que
abre WhatsApp, y al lado el dato `RESPUESTA EN 24 H`. Es la única superficie elevada (`--surface`).

**S9 — Contacto.** Un único CTA: `Escribinos por WhatsApp`. El correo aparece solo como fila de dato,
sin `mailto:` ni botón. No hay formulario.

**S10 — Marca.** Isotipo de tres nodos: barra horizontal con un nodo en cada extremo (color `--fg`),
vástago central y nodo inferior en `--accent`. Lockup horizontal en el header (isotipo + `tonk`
minúsculas), apilado en el footer, e isotipo solo como favicon. Ningún texto dice "SOLUTIONS".

**S11 — Sistema visual.** Paleta exacta `--bg #17191C`, `--surface #24272C`, `--muted #8A9099`,
`--fg #E8EAED`, `--accent #3DF5C8`. Prohibido: gradientes, `box-shadow`, radios mayores a 4px y
retícula vertical de fondo. La jerarquía se construye con tipografía y hairlines de 1px.

**S12 — Índice lateral.** Visible desde 1280px, con los números `01`–`09` y `aria-current="true"` en
la sección activa; oculto por debajo de 1280px.

**S13 — CTA mobile.** Fijo al pie, aparece después de pasar el hero y se oculta antes de Contacto y
footer, con `padding-bottom: env(safe-area-inset-bottom)`. Nunca tapa contenido.

**S14 — i18n.** Español con voseo y paridad de claves con inglés. Los roles del equipo van en español.

**S15 — Estilos.** CSS Modules por componente con tokens en CSS. La home no usa Chakra; Chakra queda
solo en `/services/[slug]` hasta una segunda pasada.

**S16 — Server Components por defecto.** `"use client"` solo donde hay interacción real: acordeón,
menú mobile, índice lateral y CTA mobile.

**S17 — A11y.** `header`/`nav`/`main`/`section` con `aria-labelledby`, skip link, `:focus-visible` de
2px menta con offset, acordeón con `<button aria-expanded aria-controls>`, `prefers-reduced-motion`.

## Tasks

| ID | Specs | Ruta | Tarea | Commit |
|---|---|---|---|---|
| T1 | S11,S15 | inline | Tokens, fuentes Geist, `globals.css`, assets de marca de 3 nodos, favicon y base de Vitest/Playwright | `feat(landing): tokens, tipografía y marca del rediseño` |
| T2 | S1,S2,S3,S10 | worker | Header fijo, menú mobile, selector de idioma, footer y hero con topología + barra de integraciones | `feat(landing): shell y hero documento de ingeniería` |
| T3 | S1,S8,S11 | worker | Servicios (acordeón client) + Proyectos + Diagnóstico sobre superficie | `feat(landing): servicios, proyectos y diagnóstico` |
| T4 | S1,S11,S14 | worker | Cómo trabajamos (flujo), Criterio (tira de empresas + misión + pilares), Equipo y Contacto | `feat(landing): proceso, criterio, equipo y contacto` |
| T5 | S1,S12,S13,S16 | inline | Composición de la página, índice lateral, CTA mobile y limpieza de Chakra en la home | `feat(landing): composición, índice lateral y CTA mobile` |
| T6 | S14,S4,S6,S7,S9 | inline | `messages/es.json` y `en.json` completos y con paridad; limpieza de SAP y textos viejos | `feat(i18n): copy del rediseño en es y en` |
| T7 | S17 | inline | Tests unitarios y e2e de las specs + a11y | `test(landing): cubrir las specs del rediseño` |

## Log

**L1** (pedido original): "en los PR : https://github.com/tonk-solutions/tonk-landing/pull/31 y
https://github.com/tonk-solutions/tonk-landing/pull/32 se trabajo sobre un redise;o de la landing.
Pero es muy similar a lo que tenemos hoy en dia y no me gusta. Lo que es color e iconos esta bien.
Pero el dise;o de la landing es similar a lo que tenemos hoy en dia -> https://tonksolutions.com.ar/
Quiero que generes un prototipo redise;ando y mejorando la landing al completo. Usa el daemon de
open-design" → dirección elegida: "documento de ingeniería".

**L2**: "me gusto bastante, lo que no me gusto ahora son las lineas de fondo. Me generan mucho ruido"
→ fuera la retícula vertical global.

**L3**: "otra cosa, la iconografia es esta" + board `B1-T-nodos` → isotipo de 3 nodos, wordmark `tonk`.

**L4**: "sacar los voceros." → S7.

**L5**: "1. Diagnostico de integracion. Alcance -> Duracion -> Presupuesto -> Entregable -> Pruebas ->
Plan de mantenimiento. 2. Genera comentarios anonimizados 3. Solo WPP" → S8, S9.

**L6**: "otra cosa que no esta en la pagina. Es que tambien hacemos proyectos greenfield. Como son
Desarrollo/Tonk/Clientes/Duce y Desarrollo/Tonk/Clientes/Clank" → sección Proyectos y greenfield en
hero, servicios y criterio.

**L7**: "Cambiar DUCE Propiedades -> Konekta" y "Sacar todo lo referente a SAP." y opción "2. A"
(titular) → S3, S4, S2.

**L8**: "otra cosa de la nueva landing, no es muy minimalista?" → plan B de densidad visual.

**L9**: "en el repo del proyecto deberian estar las fotos. ir por B" → fotos del equipo y evidencia.

**L10**: "las fotos tienen un dise;o horrible. Eliminar Comentarios de clientes. Arrancar con las
capturas de clank" → S5, S6.

**L11**: "exceseliminar las capturas de clank, no me gustaron" → S5 definitivo.

**L12**: "si, arranca con el port" + decisiones: estilos con CSS Modules saliendo de Chakra en la
home; rama desde `main` y cerrar #31 y #32 como superseded → S15, S16.

**L13** (evidencia, no pedido): del repo real de Clank se verificó que el producto se llama
"Plataforma de Gestión de Créditos" y del de Konekta que la marca de la app es `Konekta`.

**L14** (evidencia de avance, slices):
- Slice 1 — `1852359` `feat(landing): tokens, tipografía y marca del rediseño`. Incluye el prototipo
  congelado en `design/landing-documento-ingenieria/index.html` como referencia, que no es código
  escrito: el código real del slice son ~300 líneas (tokens, fuentes, assets, Vitest).
- Slice 2 — `8edf4b2` `feat(i18n): copy del rediseño en es y en`. Copy de los dos idiomas con paridad,
  primitivas de layout y marca, índice lateral, CTA mobile y armado de los e2e.
- Verificación de esos slices: `npx vitest run` 15/15 y `npm run build` OK.
- Bloqueo operativo: el detector de solapamiento del harness lee el segmento `[locale]` de las rutas
  como glob y rechaza writers hermanos, así que las tandas de secciones se ejecutan de a una.

**L15** (slices 3 y 4):
- Slice 3 — `8bbae3c` `feat(landing): shell y hero documento de ingeniería`. Header, menú mobile,
  selector de idioma, footer, hero y topología SVG. `tsc`, `lint` y `vitest` (15/15) en verde.
  Decisión aceptada del worker: el nodo `E-COMMERCE` del diagrama se ensanchó a 165px para que la
  etiqueta entre. Corrección del padre: el link "Criterio" del footer pasó de texto hardcodeado a
  `criterio.label` de i18n.
- Bloqueo operativo confirmado: las tres tandas de secciones van de a una porque el detector de
  solapamiento del harness expande `[locale]` como glob.

**L16** (slice 5):
- Slice 5 — `6267fcb` `feat(landing): servicios, proyectos y diagnóstico`. Acordeón de siete filas en dos
  grupos, proyectos Konekta/Clank y diagnóstico con `dl/dt/dd` sobre `SurfaceBlock`.
- Corrección del padre: se eliminó `ServicesSection.module.css`, que había quedado vacío y sin import.

**L17** (slices 6 y 7, cierre del port):
- Slice 6 — `9d2c71e` `feat(landing): composición, índice lateral y CTA mobile`. `page.tsx` compone las
  nueve secciones, `services/[slug]` reapuntado a `components/site/`, y se borraron los diez componentes
  viejos con Chakra (`Header`, `Footer`, `HeroSection`, `ServicesSection`, `AboutSection`, `TeamSection`,
  `ContactSection`, `LanguageSwitcher`, `TonkLogo`, `SectionLoadingFallback`). Neto: −2021 / +862.
- Slice 7 — `8b87047` `chore: ignorar artefactos de Playwright`.
- **Defecto encontrado por el e2e y corregido**: el acordeón de servicios no cerraba al segundo click
  (`setOpenIndex(globalIndex)` en vez de toggle). El prototipo sí togglea. Ahora `setOpenIndex(isOpen ? -1 : globalIndex)`.
- Verificación final: `npx tsc --noEmit` 0 · `npm run lint` 0 · `npx vitest run` 15/15 ·
  `npm run build` 23 rutas · `npx playwright test` **26/26** (desktop y mobile).
- Desvíos conocidos respecto del prototipo, pendientes de decisión: el h2 de Contacto lo renderiza
  `SectionHeader` a todo el ancho en vez de dentro de la columna izquierda del grid; los conectores del
  flujo de "Cómo trabajamos" tienen un codo que baja antes de entrar al nodo siguiente. `/[locale]/services/[slug]`
  sigue con Chakra (segunda pasada). La imagen OG todavía no usa el diseño nuevo.

**L18** (ronda 1 de review, cinco hallazgos aplicados):
- `LanguageSwitcher`: se eliminó el `replace(/^\/[a-z]{2}/, "")`. `usePathname` de next-intl ya devuelve
  la ruta sin locale; la limpieza mutilaba el primer segmento (`/es/services/...` → `rvices/...`). El chip
  EN ahora resuelve bien fuera de la home y hay e2e que lo cubre.
- Skip link duplicado: quedó solo el del `Header` (compartido); se quitó el de `page.tsx`.
- `services/[slug]`: las dos `<main>` tienen `id="main"`, así el skip link funciona en esa ruta.
- Ancla vieja `/#servicios` → `/#s03` en el detalle y en `EnterpriseIntegrationsLanding`.
- Chrome compartido: nav del header, menú mobile, CTA, lockups y sitemap del footer pasaron de anclas
  locales (`#s03`) a `Link` de next-intl con `/#s03`, que resuelve desde cualquier ruta y agrega el locale.
- e2e: 35 pasan y 1 se saltea a propósito (el nav de escritorio en el proyecto mobile). El test del CTA
  mobile se volvió determinista con `emulateMedia({ reducedMotion: "reduce" })`.

**L19** (ronda 2 de review, seis hallazgos aplicados):
- **Hidratación**: `ChakraProvider` salió del layout raíz y quedó en un `layout.tsx` anidado de
  `services/[slug]`. Eso arregló `/es` y `/en`; el detalle seguía con error 418, así que se agregó
  `emotion-registry.tsx` (patrón `useServerInsertedHTML` + `CacheProvider`) y `@emotion/cache` como
  dependencia directa. Verificado en `next dev` y en build: **cero errores de consola y cero pageerror**
  en `/es`, `/en`, `/es/services/...` y `/en/services/...`.
- **A11Y**: el acordeón ya no pisa el nombre accesible con `aria-label="Abrir"`; el nombre sale del
  título visible y el estado va en `aria-expanded`. Se retiraron `openLabel`/`closeLabel` de los mensajes.
- **I18N**: las nueve cadenas en español hardcodeadas pasaron a un namespace `a11y` (`homeLink`,
  `homeLinkFooter`, `primaryNav`, `language`, `sideIndex`, `sectionPrefix`, `heroMeta`) y el pie del
  diagrama usa `hero.diagramCaption`. Ya no se filtran a `/en`.
- **LAYOUT**: `Container` acepta `padded={false}`; los contenedores anidados de Criterio y Contacto
  dejaron de cobrar el gutter dos veces. Medido a 1440px: todo el contenido arranca en x=58 (antes 115).
- **SPEC S3**: el nodo del diagrama se renderiza `E-COMMERCE` (mayúsculas por CSS, igual que el resto
  de las etiquetas mono).
- **TEST**: el test del nav ahora verifica el scroll real (`getBoundingClientRect().top < 200`), y se
  agregaron dos e2e: menú mobile (abre, navega, cierra con `aria-expanded=false` y scrollea) y guard de
  hidratación/consola en las tres rutas.
- Verificación final: `tsc` 0 · `lint` 0 · `vitest` 15/15 · `build` OK · `playwright` **39 pasan, 1 salteado**.
