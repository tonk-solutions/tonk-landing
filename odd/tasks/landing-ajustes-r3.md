# Landing: ajustes del dueño sobre el índice, el logo y el diagnóstico

Tercera pasada sobre la landing "documento de ingeniería" (`landing-documento-ingenieria`).
El dueño revisó el sitio publicado y devolvió cinco observaciones: el índice lateral se superpone,
se lee chico, marca la sección anterior, no responde al hover en la sección activa y el isotipo
queda más bajo que el wordmark. Rama `fix/landing` (fast-forward desde
`fix/landing-jerarquia-lectura-r2`), worktree `fix-landing`.

## Specs

**S28 — El riel no se superpone al contenido.** Pedido textual: `Menu superpuesto`.
Entre 1280px y 1920px —la banda donde el riel está visible— ningún elemento de `main` se dibuja
debajo del índice: el borde izquierdo de la hoja del Diagnóstico (`#s05 dl` y su superficie) queda
a la derecha del borde derecho de los ítems del riel, y los nombres de sección nunca se recortan
con `ellipsis` a 1280px y a 1440px.

**S29 — El riel se lee más grande y con más aire.** Pedido textual: `capaz en web lo haria resaltar
mas un poco mas grande, con mas margen`. Los ítems del riel usan `--t-detail` (14px) de la escalera
S20, con 34px de alto mínimo y el gutter de `.home-shell` entre 160px y 176px desde 1280px. Sigue
sin usar el acento en los ítems inactivos.

**S30 — La sección activa es la que se está leyendo.** Pedido textual: `el slider a veces tarda
como en procesar en que seccion está: ejemplo: está en criterio y me marca proceso`.
El ítem con `aria-current="true"` es el de la última sección cuyo inicio ya pasó la línea de
lectura (35% de la ventana), y en el pie de página es la última sección. Hay un solo `aria-current`
en todo el riel y se actualiza en el mismo scroll, sin quedar una sección atrás.

**S31 — El hover se ve en cualquier ítem.** Pedido textual: `no me funciona el hover de diagnostico`.
Pasar el mouse por cualquier ítem del riel cambia el fondo del ítem, incluido el que tiene
`aria-current="true"`: la regla del estado activo no puede anular la del hover.

**S32 — La marca mide lo que el texto.** Pedido textual: `el logo me gusta, capaz haria mas pegado el
icono al logo, osea al texto, y a la T del icono la haria cubriendo todo el alto del texto, no puede
quedar mas chico que la palabra tonk en altura`. En el lockup horizontal la tinta del isotipo (barra
de la T arriba, nodo menta abajo) mide el alto de la «k» del wordmark, arranca en la línea de
mayúsculas y cierra en la línea de base, y el hueco contra el wordmark es menor a las 28 unidades
del brand kit. El lockup apilado del footer conserva las proporciones del kit.

## Tasks

| ID | Specs | Ruta | Tarea | Commit |
| --- | --- | --- | --- | --- |
| T1 | S28 | inline | La hoja del diagnóstico no invade el gutter del riel desde 1280px | `fix(landing): …` |
| T2 | S29 | inline | Riel a `--t-detail`, ítems de 34px y gutter de 160–176px | `fix(landing): …` |
| T3 | S30 | inline | Sección activa por posición en cada scroll, no por `IntersectionObserver` | `fix(landing): …` |
| T4 | S31 | inline | Hover con fondo propio que gana sobre `aria-current` | `fix(landing): …` |
| T5 | S32 | inline | Lockup horizontal: marca del alto del texto y hueco de 8 unidades | `fix(landing): …` |
| T6 | todas | — | `vitest`, `tsc --noEmit`, `eslint`, `next build`, `playwright test` y capturas | — |

## Log

**L1 — Pedido del dueño (verbatim).**
```text
- Menu superpuesto -> [Image#1]
- el menu slider ese, me encanta, capaz en web lo haria resaltar mas un poco mas grande, con mas margen
- el slider a veces tarda como en procesar en que seccion está:
ejemplo: está en criterio y me marca proceso -> [Image#2]
- no me funciona el hover de diagnostico
- [Image#3] el logo me gusta, capaz haria mas pegado el icono al logo, osea al texto, y a la T del icono
la haria cubriendo todo el alto del texto, no puede quedar mas chico que la palabra tonk en altura
```

**L2 — Diagnóstico sobre el árbol de la r2, medido en Chromium.**

- **S28**: el riel medía `--m` = 116–124px, pero `.surfaceBlock` conservaba `margin-inline: -24px`:
  la hoja del Diagnóstico arrancaba en x=92–100 y quedaba 24px debajo de los nombres del riel
  (x≤108–116). A 1920px el gutter natural lo tapaba y el defecto no se veía: el bug vivía en la
  banda 1280–1600.
- **S30**: el `IntersectionObserver` usaba `rootMargin: -40% 0px -40% 0px` y elegía el mayor
  `intersectionRatio`. Con secciones de ~870px la banda de 20% de ventana nunca cruza un umbral
  distinto de 0, así que el callback solo se enteraba de la sección que entraba con ratio ~0, la
  comparaba contra la que salía (~0,2) y conservaba la anterior; cuando la anterior salía de la
  banda no quedaba ninguna entrada visible y el riel se congelaba hasta la sección siguiente.
- **S31**: `.item:hover` y `.item[aria-current="true"]` tienen la misma especificidad y la regla del
  activo se declaraba después: en la sección activa el hover no producía ningún cambio (medido:
  `rgb(61, 245, 200)` con y sin mouse encima).
- **S32**: el kit ubica la tinta del isotipo entre 7 y 29 de su grilla de 32 y el lockup horizontal
  la escalaba a 128 unidades con el wordmark en 96: la marca arrancaba 20 unidades por debajo de la
  línea de mayúsculas y cerraba 12 unidades por debajo de la línea de base, con 28 unidades de hueco.

**L3 — Verificación sobre el árbol final.**

- `vitest run`: 8 archivos, **82 tests**, exit 0. Suma `brandLockup.test.ts` (4: tinta = alto del
  texto, líneas de mayúsculas y de base, hueco menor al del kit y lockup apilado intacto).
- `tsc --noEmit`: exit 0. `eslint .`: exit 0.
- `next build`: exit 0 (5,9s), 14 rutas de servicio prerenderizadas y `/llms.txt`, `/llms-full.txt`,
  `robots.txt` y `sitemap.xml` estáticos.
- `playwright test`: **101 pasan, 1 salteado**, exit 0, contra un `next start` propio en `:3111` con
  build nuevo. Incluye el guard de ancho (320–768), las tres corridas de la hoja del diagnóstico
  (1280/1440/1680), el recorrido del índice por s05 → s07 → s03 y el pie de página, y el hover del
  ítem activo.
- Medido en Chromium sobre el build de este diff (1440px salvo indicación): riel de 160px a
  1280/1440 y 176px desde 1600, ítems de 34px con el texto centrado (5,8px de aire arriba y abajo),
  fuente de 14px y los nueve nombres completos (sin `ellipsis`); la hoja del diagnóstico arranca en
  x=160/176, a la derecha de los ítems del riel (152/168); el ítem activo pasa de fondo
  `transparent` en reposo a `rgba(61, 245, 200, 0.12)` con el mouse encima.
- Lockup horizontal en el header: **112×32px** renderizados (la r2 medía 114×32; la caja del isotipo
  sube a 35 unidades y el hueco baja a 8, así que el conjunto se angosta 2px). La tinta del isotipo va
  de 23,10 a 47,10px y la «k» del wordmark de 23,10 a 47,10px: mismas líneas. La «o» cierra en
  47,41px dentro del `viewBox` de 128,55 unidades, sin el recorte de 0,24px de la r2, y el hueco
  marca→palabra queda en 6,2px (antes 11,0px).

**L4 — Base de la ronda.** El feedback describe el sitio publicado, que corre el árbol de
`fix/landing-jerarquia-lectura-r2`; el worktree `fix-landing` de este flow estaba una ronda atrás
(`fix/landing` ya mergeada en `main`). La rama avanzó con `git merge --ff-only
fix/landing-jerarquia-lectura-r2` (fast-forward, sin reescribir historia) y los arreglos quedan
encima de esa base. El lockup apilado del footer no se toca.


**L5 — Ronda 1 de QA/review (12 hallazgos aplicados).**

- **Testing que se auto-satisfacía (qa, major)**: el test de la hoja comparaba `sheetLeft` contra el
  borde derecho del riel, que vale 0 si el riel está `display:none`, y S29 no tenía aserciones. Ahora
  mide por corte el ancho del riel (160/160/176), exige la visibilidad, los nueve ítems, `font-size`
  de 14px, `min-height` de 34px y que ningún label quede recortado.
- **Tests tautológicos del lockup (qa major + review minor)**: `brandLockup.test.ts` comparaba
  `(MARK_INK.top/32)*icon` contra `wordTop`, que es la misma fórmula del componente. Pasó a
  `brandLockup.test.tsx` y mide el SVG renderizado: extremos verticales del isotipo desde el `d` del
  path (M/H/V) más el trazo, y las líneas del wordmark desde el `transform` de su grupo y
  `WORDMARK_HEIGHT`.
- **`viewBox` cerrando en la línea de base (qa, minor)**: la «o» del wordmark sobresale 0,24px y
  quedaba recortada. Se agrega `BASELINE_OVERSCAN = 2` al alto; el mismo defecto preexistente del
  footer queda cubierto.
- **Texto pegado arriba del hover (qa y review, minor)**: `align-items: baseline` con
  `min-height: 34px` dejaba 0px arriba y 11,6px abajo. Ahora `align-items: center` (5,8/5,8 medidos).
- **Cambio de layout sin scroll (review, major)**: el riel solo escuchaba `scroll` y `resize`; se suma
  un `ResizeObserver` sobre `document.body` que dispara el mismo recálculo y se desconecta en el
  cleanup.
- **`wordTop` y `gap` del lockup apilado (review, major)**: `wordTop: 184` era el literal de
  `icon + gap` y `gap` quedó muerto. Ahora `wordTop: STACKED_ICON + STACKED_GAP` y `gap` sigue siendo
  la fuente de las dos variantes; el apilado deriva su `wordTop` de las constantes.
- **`markSize={35}` en el Header (review, minor)**: duplicaba el default. El Header ya no pasa el
  prop y el valor vive una sola vez, como `DEFAULT_MARK_BOX` con su motivo escrito.
- **Grilla de 32 repartida en literales (review, minor)**: `MARK_GRID` reemplaza los tres literales
  nuevos del lockup (`Isotipo.tsx` conserva su `viewBox`, que es su propia geometría).
- **Selector del riel repetido (review, minor)**: `const RAIL` en el tope de `e2e/landing.spec.ts`,
  usado por `page.locator` y por los `page.evaluate`.
- **Números de L3 (qa, minor)**: corregidos a los medidos (112×32, tinta 23,10→47,10px en las dos,
  hueco 6,2px) y se documenta el `BASELINE_OVERSCAN`.

  Verificación de la ronda: `vitest run` **84/84** · `tsc --noEmit` 0 · `eslint .` 0 · `next build` 0 ·
  `playwright test` **101 pasan, 1 salteado** (el riel ahora también se verifica en 1280, 1440 y 1680
  con ancho, tipografía y recorte de labels).
