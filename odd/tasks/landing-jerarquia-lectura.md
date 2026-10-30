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
tamaños de la escala; ningún título de sección declara un tamaño propio. A 1440px:
`h1 ≥ 1.6 × h2` y `h2 ≥ 2 × body`.

**S21 — El acento no compite con el claim.** El número de sección se renderiza a 14px (hoy 22px).
El acento queda para el titular, los CTA, el índice activo y la superficie del diagnóstico.

**S22 — Presupuesto de prosa.** El copy de la home suma ≤ 450 palabras de prosa (hoy 738) y
ningún bloque de prosa supera 22 palabras. Se conservan todos los claims distintos; se elimina la
repetición y la explicación de lo obvio. El detalle comercial no se pierde: se mueve al panel del
acordeón.

**S23 — Detalle subordinado.** Ninguna sección muestra más de dos bloques de prosa a la vista.
El detalle de los siete servicios vive solo en el panel abierto. "Criterio" deja de apilar cuatro
jerarquías (intro + principios + misión + pilares): misión y pilares son el contenido, los
principios pasan a una lista compacta de una línea.

**S24 — Medida de línea.** Ningún párrafo visible pasa de 50ch (hoy 62ch).

**S25 — Orientación.** El índice lateral muestra el nombre de cada sección además del número, con
9 items y `aria-current="true"` en el activo.

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
