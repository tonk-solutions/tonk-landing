# Landing: jerarquía de lectura y densidad de copy

Segunda pasada sobre la landing "documento de ingeniería" (`landing-documento-ingenieria`).
El cliente leyó la versión entregada y devolvió tres observaciones: mucho texto, no se sabe
dónde leer, falta jerarquía. Esta pasada arregla la causa raíz tipográfica y reordena la
densidad. Rama `fix/landing-jerarquia-lectura` desde `main` en el worktree `information`.

## Specs

**S18 — Fuentes resueltas.** `--sans` y `--mono` tienen que resolver a Geist y Geist Mono en el
elemento donde se declaran. Las variables de `next/font` viven en `<html>` (clase del `layout`),
nunca en `<body>`: una `var()` que no resuelve deja `font-family` en inválida y el navegador cae
al valor inicial (serif del sistema). La página nunca se renderiza con una serif de sistema.

**S19 — Un claim por sección.** Cada sección tiene un único `h2` de ≤ 7 palabras que entra en
como máximo 2 líneas a 1440px. Las secciones que hoy tienen título largo lo acortan; no se
agregan títulos nuevos.

**S20 — Escala de cinco niveles.** `globals.css` declara `--t-claim` (≤ 38px), `--t-sub` (≤ 22px),
`--t-body` (16px), `--t-detail` (14px) y `--t-micro` (11px). Los módulos de la home toman sus
tamaños de la escala y no declaran valores intermedios: a 1440px el texto de `main` solo puede medir
68 (titular), 37,44 (claim), 21,6 (subtítulo), 16 (cuerpo), 14 (detalle) y 11 (micro), más los 15px
de los controles. `h1 ≥ 1.6 × h2` y `h2 ≥ 2 × body`. La bajada del hero usa `--t-body` y el
statement de Criterio usa `--t-sub`.

**S21 — El acento no compite con el claim.** Los nueve números de sección —cabeceras, hero y barra
de integraciones— se renderizan a 14px (hoy 22px en la barra) y en `--muted`, no en `--accent`. El
acento queda para el titular, los CTA, el índice activo y el borde de la superficie del diagnóstico.

**S22 — Presupuesto de prosa.** El copy de la home suma ≤ 450 palabras de prosa (hoy 738) y
ningún bloque de prosa supera 22 palabras. Se conservan todos los claims distintos; se elimina la
repetición y la explicación de lo obvio. El detalle comercial no se pierde: se mueve al panel del
acordeón.

**S23 — Sin prosa duplicada.** Ninguna sección repite en su bajada lo que ya dice su claim o el
subtítulo de su grupo: Servicios y Criterio no tienen bajada y el detalle de los siete servicios
vive solo en el panel del acordeón. "Criterio" deja de apilar cuatro jerarquías: la misión es su
statement, los pilares son sus dominios y los principios son una lista compacta de una línea por
item a 1440px y a 375px (en mobile se oculta el contador para ganar ancho).

**S24 — Medida de línea.** Ningún párrafo visible pasa de 50ch (hoy 62ch).

**S25 — Orientación.** El índice lateral muestra el número y el nombre de cada sección **en reposo**,
sin hover, con 9 items y `aria-current="true"` en el activo. Para que el riel no tape contenido, desde
1280px la home reserva un gutter de 104–140px (`.home-shell`), y el nombre de índice es propio
(`indexLabel`), no el kicker de la cabecera: "Integramos con" no es un nombre de sección.
Número, ancla y nombre salen de una sola definición (`src/app/sections.ts`). En mobile, el menú
desplegable mapea las nueve secciones, no cuatro.

**S27 — e2e reproducible.** Playwright corre contra un build propio en un puerto propio (`:3111`) y
nunca reutiliza un server ajeno: el resultado no depende de qué haya escuchando en la máquina.

**S26 — Paridad i18n.** `es.json` y `en.json` mantienen paridad de claves y el mismo presupuesto de
prosa en los dos idiomas.

## Tasks

| ID | Specs | Ruta | Tarea | Commit |
|---|---|---|---|---|
| T8 | S18 | inline | Variables de `next/font` de `<body>` a `<html>` | `5bf914a` |
| T9 | S20,S21,S24 | inline | Escala tipográfica en tokens y refactor de los módulos de la home | `a21db67` |
| T10 | S19,S22,S26 | inline | Copy es/en con el presupuesto de prosa y claims cortos | `c887e39` |
| T11 | S23 | inline | Criterio, Equipo y Servicios reordenados por jerarquía | `c887e39` |
| T12 | S25 | worker | Índice lateral con nombres de sección | `7c9ae96` |
| T13 | S18–S26 | inline | Tests de la jerarquía y verificación visual | `8e890e1` |

## Log

**L1** (pedido original): "recibimos feedback de la ultima version de la landing y nos dijeron:
- tiene como mucho texto la pagina
- no se donde leer
- decile que jerarquice mejor la info"

**L2** (evidencia, diagnóstico del padre sobre `HEAD 4778de1`):
- **Causa raíz S18**: `globals.css` declara `--sans: var(--font-geist-sans), …` en `:root`, pero
  `layout.tsx` aplica las clases de `next/font` en `<body>`. Medido en dev y en el build de
  producción: `getComputedStyle(h1).fontFamily === "Times New Roman"` en `/es`. Toda la página —el
  titular de 68px incluido— se renderiza en serif del sistema. Sin Geist Mono, los micro-labels de
  11px en mayúsculas pierden su función de señal y se leen como texto corrido.
- **Densidad**: 823 palabras visibles en 9 pantallas de scroll (1440×900, 8.110px). Prosa sola: 738
  palabras. 14 bloques de prosa de más de 22 palabras; el mayor, 40.
- **Jerarquía**: `h1` 68px vs `h2` 49px = **1,39×**. Ocho secciones comparten exactamente el mismo
  tratamiento de cabecera. Doce tamaños distintos entre 10 y 28px: no hay escalón, hay continuidad.
  `Criterio` apila cuatro jerarquías (evidencia, intro + principios, misión a 28px, pilares) dentro
  de una sola sección.
- **Orientación**: el único mapa es el índice lateral, que está oculto por debajo de 1280px y solo
  muestra números.

**L3** (decisión del padre): no se pide dirección nueva. La dirección "documento de ingeniería"
queda; se corrige la resolución de fuentes, se reescala la tipografía y se recorta el copy. Los
textos que las specs anteriores fijan (S2 titular, S3 SAP, S4 proyectos, S8 filas y orden del
diagnóstico, S9 un solo CTA) no se tocan.

**L4** (cierre de la implementación):
- **Slice 1 — T8–T11**, `5bf914a` + `a21db67` + `c887e39`, 565 líneas: fuentes, escala y copy.
  **Slice 2 — T12–T13**, `7c9ae96` + `8e890e1`, 149 líneas: índice y e2e. La entrega es la rama
  `fix/landing-jerarquia-lectura`; push y PR quedan a decisión del usuario.
- **Medición antes/después** (1440×900, `/es`, build de producción):
  | Metrica | Antes | Despues |
  |---|---|---|
  | `h1` / `h2` | 68px / 49px = 1,39× | 68px / 37px = 1,82× |
  | `h2` / cuerpo | 2,88× | 2,34× |
  | Prosa de la home | 738 palabras | 413 |
  | Palabras visibles | 823 | 684 |
  | Alto de la home | 8.110px (9 pantallas) | 6.828px (7,6 pantallas) |
  | Sección más pesada | 168 palabras (Criterio) | 122 (Diagnóstico) |
  | Bloques de prosa > 22 palabras | 14 | 0 |
- **Verificación**: `npx tsc --noEmit` 0 · `npm run lint` 0 · `npx vitest run` 28/28 ·
  `npm run build` 23 rutas · `npx playwright test` sobre `next start` en :3200 **47 pasan, 1
  salteado** (el salteado es el nav de escritorio dentro del proyecto mobile, ya previsto).
- **Defecto encontrado y corregido en el camino**: al sacar el wrapper `.right` de Criterio, los
  pilares quedaron con 2 columnas en lugar de 4 (`grid-column` vivía en `.right`, no en `.pillars`).
  Lo vio la captura de la sección, no el test; se resolvió moviendo la regla a `.pillars`.
- **Desvíos respecto del pedido**: dos. (1) Los roles del equipo pasaron de inglés a español: la
  spec S14 ya lo pedía y estaban mal. (2) El layout tenía `dangerouslySetInnerHTML` y un `new URL()`
  de constante; el chequeo automático los marcó y se resolvieron sin debilitar nada — el JSON-LD se
  renderiza como hijo del `<script>` (verificado: parsea igual, 3 nodos) y `metadataBase` recibe la
  cadena. Las dos cosas están en `5bf914a` y no en un commit propio.
- **Pendiente, no pedido**: el índice lateral sigue oculto por debajo de 1280px, así que en mobile
  la orientación queda a cargo del CTA fijo y de los claims. `/[locale]/services/[slug]` sigue con
  Chakra y con el copy viejo: la segunda pasada de esa ruta no entró en este pedido.
- **No verificado**: el aspecto en Safari/Firefox. Todo lo medido es Chromium headless.

**L5** (ronda 1 de review: once hallazgos, todos aplicados):
- **S21 (QA#1, review#1)**: `IntegrationsBar` conservaba `.num` en 22px y los nueve números seguían en
  acento. Ahora los tres `.num` (cabecera, hero, barra) son 14px y `--muted`. El e2e nuevo mide los
  **nueve** números: tamaño 14 y `color !== rgb(61,245,200)`.
- **S25 (QA#2, review#2)**: los nombres estaban en `opacity: 0`. Ahora se leen en reposo: el riel toma
  `width: var(--m)` y desde 1280px la home reserva un gutter (`clamp(116px, 8.5vw, 124px)` en
  `.home-shell`) para que no tape contenido. Medido a 1440/1280/1920: `railRight` 114 < `contentLeft`
  122 (y 108 < 116, 116 < 200), cero labels con `opacity != 1`, cero labels recortados. El e2e exige
  opacidad 1, texto no vacío y no-solape, porque `toBeVisible()` de Playwright da por visible un
  elemento con `opacity: 0`.
- **Orientación mobile (QA#3)**: el menú desplegable mapeaba 4 secciones; ahora mapea las nueve
  (`indexLinks` en `Header`, derivado de `HOME_SECTIONS`). e2e: 9 links.
- **S20 (QA#4, review#6)**: `.mission p` declaraba `clamp(19px, 1.8vw, 24px)`, un sexto nivel. Pasa a
  `var(--t-sub)`. Además la bajada del hero dejó de tener un valor propio (16,56px computados) y usa
  `--t-body`. El e2e nuevo mide **todos** los tamaños de texto de `main` a 1440px y exige exactamente
  `[11, 14, 16, 21.6, 37.44, 68]` (15px es el tamaño de los controles; las etiquetas del diagrama SVG
  escalan con el viewBox y quedan fuera).
- **e2e no reproducible (QA#5)**: `reuseExistingServer` contra `:3000` hacía que el resultado dependiera
  de qué hubiera escuchando. Ahora `playwright.config.ts` levanta su propio build en `:3111` con
  `reuseExistingServer: false` y `PLAYWRIGHT_BASE_URL` queda como escape explícito. La corrida de esta
  ronda no reusa nada: `53 pasan, 1 salteado`.
- **S23 (QA#6, review#3)**: dos cambios. (a) A 375px los principios de Criterio ocupaban dos líneas en
  3 de 4: en mobile se oculta el contador y los cuatro textos se acortaron; medido con
  `getClientRects` a 375px: `[1,1,1,1]`. (b) La regla "ninguna sección muestra más de dos bloques de
  prosa" **se acota**: no describe la página entregada ni el pedido. Diagnóstico son seis filas de
  especificación y Cómo trabajamos cuatro pasos; recortarlas habría borrado el contenido comercial. La
  spec pasa a lo que sí se hizo y se verifica: no hay prosa duplicada y el detalle de servicios vive en
  el acordeón.
- **S25 contenido (review#4)**: el riel reusaba los kickers ("Integramos con", "Integraciones
  enterprise"). Cada sección tiene ahora su `indexLabel`: Inicio, Plataformas, Servicios, Proyectos,
  Diagnóstico, Proceso, Criterio, Equipo, Contacto. El 02 usa "Plataformas" porque "Integraciones" no
  entra en el gutter a 11px mono sin recortarse.
- **Una sola definición (review#5)**: `src/app/sections.ts` (`HOME_SECTIONS`) define namespace + ancla;
  el número sale de `messages.*.number`. Lo consumen `page.tsx` (riel) y `Header` (menú mobile), así
  que reordenar o renumerar una sección no puede desincronizar el riel del ancla.
- **Referencia de diseño (review#8)**: `design/landing-documento-ingenieria/index.html` queda marcado
  como histórico en un comentario de cabecera, con la escala vigente y el puntero a `globals.css`.
- **Verificación de la ronda**: `npx tsc --noEmit` 0 · `npm run lint` 0 · `npx vitest run` 28/28 ·
  `npm run build` 23 rutas · `npx playwright test` (build propio en :3111) **53 pasan, 1 salteado**.
- **Efecto lateral aceptado y medido**: el titular del hero sigue en 3 líneas con el gutter nuevo
  (1440: alto 192px / 63,92px de interlineado; 1280: 180/60,16) y la barra de integraciones envuelve en
  dos líneas a 1440, igual que antes.
