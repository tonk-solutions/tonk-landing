# Landing — mejoras de contenido, mobile y LLMO

Cuatro ajustes pedidos por el dueño sobre la home de Tonk Solutions (`fix/landing`).
Alcance: CSS de la home, copy `messages/{es,en}.json`, datos estructurados y un
recurso nuevo `/llms.txt`. No se toca el prototipo congelado `design/landing-documento-ingenieria/`.

## Specs

**S1 — Mobile en inglés sin desborde.** Pedido textual: `desde mobile cuando lo pasas a ingles, se rompe el responsive`.
En `/en` con ancho de viewport entre 320px y 767px la página no desborda a lo ancho
(`document.documentElement.scrollWidth <= clientWidth`) y el `h1` se ve completo, sin
texto cortado. `/es` se mantiene igual que hoy (sin desborde y con la misma tipografía).
El pedido previo S2 de `odd/tasks/landing-documento-ingenieria.md` (regla menta continua
en una sola línea) se conserva mientras la frase entre en una línea; por debajo de 768px
la frase del titular puede envolver para no desbordar.

**S2 — Sin Accenture.** Pedido textual: `eliminar accenture`.
La palabra `Accenture` no aparece en `messages/es.json` ni en `messages/en.json`, y por lo
tanto no aparece en la home ni en `/[locale]/services/[slug]`. Las listas de empresas
quedan `BBVA`, `Santander`, `ICBC`, `Endava`, `Rootstrap`. El prototipo de `design/` es
referencia visual congelada y no se edita.

**S3 — AWS, Google Cloud y Firebase visibles en la barra.** Pedido textual: `mencionar cosas de AWS, google cloud y firebase`
y luego, al confirmarse el alcance, `4. Lo quiero visibile`.
La barra `Integramos con` tiene **11 plataformas** en este orden: `Dynamics 365`, `Salesforce`,
`Odoo`, `AWS`, `Google Cloud`, `Firebase`, `ARCA`, `Mercado Pago`, `Stripe`,
`WhatsApp Business API`, `APIs propias` (en inglés, `Own APIs`). El contador dice
`11 plataformas` / `11 platforms`. Los tres nombres también aparecen en la descripción del servicio de
arquitectura, el pilar `Cloud Native`, `seo.keywords`, `knowsAbout` del JSON-LD y `/llms.txt`. La lista
no usa separadores `·`: con 11 items envuelve en cualquier ancho y el punto quedaba al principio de la
línea, así que la separación es `column-gap`.

**S4 — LLMO: la ficha canónica del equipo no incluye a Ignacio Sileo.** Pedido textual: `Arreglar el LLMO porque sigue apareciendo ignacio sileo cuando no deberia aprecer`.
`/llms.txt` responde 200 con `text/plain`, lista a los tres co-founders
(`Matías Castillo`, `Nicolás Gómez`, `Rodrigo Hernandez`) y no contiene `Ignacio` ni `Sileo`.
El nodo `Organization` del JSON-LD declara `founder` con exactamente esas tres personas.
Ningún texto de `messages/` ni `src/app/seo/` menciona a Ignacio Sileo.

## Tasks

- **T1** (S1) — CSS del hero y de la barra de integraciones en mobile + regresión e2e de overflow. Commit `fix(landing): …`.
- **T2** (S2) — Quitar Accenture de `criterio.companies`, `criterio.intro` y del copy de `whyUs`; test de guarda en `messages.test.ts`. Commit `content(landing): …`.
- **T3** (S3) — AWS / Google Cloud / Firebase en copy, keywords y `knowsAbout`; test de guarda. Commit `content(landing): …`.
- **T4** (S4) — Builder + ruta `/llms.txt`, `founder` en el grafo JSON-LD, tests unitarios y e2e. Commit `feat(seo): …`.
- **T5** (todas) — `vitest`, `tsc --noEmit`, `eslint`, `next build` y `playwright test`; evidencia en este Log.

## Log

**L1 — Pedido del dueño (verbatim).**
```text
hay cosas que hay que mejorar de la landing.
desde mobile cuando lo pasas a ingles, se rompe el responsive
eliminar accenture
mencionar cosas de AWS, google cloud y firebase
Arreglar el LLMO porque sigue apareciendo ignacio sileo cuando no deberia aprecer
```

**L2 — Diagnóstico del desborde (antes del fix).** Medido con el Chromium del sistema sobre la home
renderizada (`/es` y `/en`, 320/360/390/430/768px):

- `/es`: sin desborde en todos los anchos.
- `/en`: 101px a 320, 61px a 360, 43px a 390, 46px a 430. Único elemento fuera del viewport:
  `span.hl` del `h1` (`"and products built from scratch."`, `white-space: nowrap`, 401px de ancho con
  34px de tipografía).
- El header, el menú mobile y el selector de idioma no se rompen: cambiar de idioma no altera su geometría.
- La barra `Integramos con` envolvía dejando el separador `·` al comienzo de la línea, en los dos idiomas.

**L3 — Decisiones derivadas de L1.**

- **S1**: por debajo de 768px la frase resaltada puede envolver (`display: inline`, `white-space: normal`);
  desde 768px se mantiene en una línea con la regla menta continua. Evita el desborde sin achicar el
  titular un 30% (la alternativa que entraba a 320px era 23,7px de tipografía).
- **S1 (extra)**: los separadores `·` se reemplazan por `column-gap` equivalente al espaciado del
  separador de escritorio: en el titular (`.meta`) por debajo de 768px y en la barra de integraciones
  (`.list`) por debajo de 1280px, que son los anchos donde cada uno envuelve.
- **S3**: AWS, Google Cloud y Firebase **no** se suman a la barra `Integramos con` porque esa lista está
  congelada en 8 plataformas por S3 del doc del port y por `messages.test.ts`. Se mencionan en la
  descripción del servicio de arquitectura, el pilar `Cloud Native`, `seo.keywords`, `knowsAbout` del
  JSON-LD y `/llms.txt`. *(Revisado en L6: el dueño pidió que fueran visibles en la barra.)*
- **S4**: no existe `/llms.txt` ni en el repo ni en los dominios desplegados (404), y `Ignacio Sileo` no
  aparece en el sitio actual: sobrevive en índices viejos (perfil de LinkedIn, ramas públicas del repo con
  `content/team.md`). El fix del sitio es publicar la ficha canónica: `/llms.txt` + `founder` en el JSON-LD
  con la lista de los tres co-founders. El archivo no dice nada sobre nóminas previas: una afirmación
  negativa sobre terceros no se puede respaldar desde el repo y amplifica el nombre que se busca
  desindexar.

**L4 — Verificación sobre el árbol final.**

- `vitest run`: 4 archivos, 30 tests, exit 0.
- `tsc --noEmit`: exit 0. `eslint .`: exit 0.
- `next build`: exit 0; `/llms.txt` queda prerenderizado como estático.
- `playwright test` (contra `next start` en `:3200` con un config temporal no commiteado): **49 pasan,
  1 salteado**, exit 0. Incluye 8 corridas del guard de ancho (320/360/390/430 × es/en × desktop/mobile)
  y el e2e de `/llms.txt`.
- Barrido manual de ancho en 19 viewports (320→1440) sobre el documento renderizado: desborde 0 en `/es`
  y `/en`.
- `/llms.txt`: `200`, `content-type: text/plain; charset=utf-8`, resumen único con ciudad y huso, lista
  de los tres co-founders, las siete páginas de servicio enlazadas con su URL canónica, proyectos,
  AWS/Google Cloud/Firebase, ARCA y contacto; sin `Ignacio`/`Sileo`.
- HTML de `/es`, `/en`, `/es/services/enterprise-integrations` y
  `/en/services/distributed-systems-architecture`: 0 apariciones de `Accenture`, `Ignacio` o `Sileo`;
  AWS, Google Cloud y Firebase presentes; JSON-LD con `founder` de tres personas.
- **Fuera del código**: los índices de búsqueda y de LLM siguen citando fuentes viejas (LinkedIn y ramas
  remotas del repo). Borrar esas ramas públicas o pedir desindexación requiere decisión del dueño.

**L5 — Ronda 1 de QA/review (11 hallazgos aplicados).**

- **Resumen canónico sin duplicar**: el blockquote concatenaba `llms.intro` + `seo.description` y repetía
  "consultora boutique". Ahora es una sola frase (`llms.intro`) con ciudad, `GMT−3` y foco.
- **Enlaces**: `Servicios` ya no es una lista de títulos; cada entrada sale del catálogo con
  `https://tonksolutions.com.ar/es/services/<slug>` y su descripción. `Proyectos` sigue sin URL porque no
  existe ruta de proyecto.
- **Cableado único**: `buildLlmsInput(messages)` es el único mapeo messages → builder y lo usan la ruta y
  el unit test, así un campo mal pasado falla en los dos.
- **Etiquetas i18n**: `Email`, `WhatsApp` y `Ubicación` salen de `messages.llms.*` y la URL de
  `languageNote` se arma con `SITE_URL` (placeholder `{url}`), sin dominio hardcodeado.
- **Sin nota defensiva**: se elimina `llms.foundersNote`; el archivo lista el equipo actual y no afirma
  nada sobre nóminas previas (hallazgo de riesgo de contenido).
- **Founders validados**: `pickFounders` valida `name`/`role`/`linkedin` y falla el render si `team.members`
  cambia de forma; el test unitario y el e2e del JSON-LD usan los mensajes reales, no un fixture.
- **`sameAs` consistente**: cada `Person` emite `sameAs` como array, igual que el `Organization`.
- **S3 por path**: el test fija `services.craft.services[2]` y `criterio.pillars[0]` en los dos idiomas, así
  revertir una sola descripción no pasa desapercibido.
- **Guard de ancho**: agrega 640, 767 y 768 para cubrir la banda 431-767 y el borde del switch de CSS.
- **Espaciado**: `column-gap` mobile iguala el espaciado equivalente al `·` de escritorio (35px en el
  titular, 32px en la barra), sin salto al cruzar 767/768 ni 1279/1280.
- **Pendiente fuera de ronda**: a 320px el CTA "Hablemos por WhatsApp" de
  `/[locale]/services/[slug]` se recorta ~25px por un ancestro con `overflow-x: hidden`; es preexistente de
  esa ruta y queda como follow-up (no hay diff de esta ronda ahí).

  Verificación de la ronda: `vitest run` **35/35** · `tsc --noEmit` 0 · `eslint .` 0 · `next build` 0
  (`/llms.txt` prerenderizado) · `playwright test` contra `next start :3200` **59 pasan, 1 salteado**
  (guard de ancho con 640/767/768 y JSON-LD de `/es` y `/en` incluidos).

**L6 — Cambio de requerimiento sobre S3 (verbatim).**
```text
4. Lo quiero visibile
```
- La barra `Integramos con` pasa a **11 plataformas** con `AWS`, `Google Cloud` y `Firebase` entre `Odoo`
  y `ARCA`, y el contador a `11 plataformas` / `11 platforms`. `messages.test.ts` fija el conteo, la
  paridad es/en y la presencia de los tres nombres.
- Se retiran los separadores `·` de la lista en todos los anchos (`column-gap: 32px`): con 11 items
  envuelve también en desktop y el punto quedaba abriendo la segunda línea.
- S3 del doc del port (`odd/tasks/landing-documento-ingenieria.md`) se reescribe: 11 plataformas y
  contador `11 plataformas`.

**L7 — Ramas remotas obsoletas (decisión del dueño: `2. OK`).**
El borrado de refs remotas está bloqueado por el sandbox (`git push --delete`), así que queda como paso
manual del dueño. Ramas públicas del repo que todavía contienen la ficha de Ignacio Sileo —con su SHA
corto para poder recuperarlas—:

```text
feature/critical-problems                      7dc5062
feature/first-init                             ef4e8bf
feature/improvement-SEO-LLMO                   433177a
feature/improvement-optimization               78a6aef
feature/improvement-ui-desing                  021adfd
feature/pilar-1-landing                        931513c
feature/pilar-1-marca-y-evidencia              aa3d30b
feature/skills                                 d53f48c
feature/wrap-services-into-branches            ce97928
fix/seo-1-domain-assets-sitemap                980993f
fix/seo-2-jsonld                               6162023
fix/seo-3-services-pages                       50a7be1
fix/seo-4-static-locale                        a1d600d
refactor/decouple-presentation-from-content    9e3bce8
refactor/improve-based-on-repo-scan            882a191
revert-12-feature/improvement-ui-desing        b5e05f2
```

Ninguna es head de un PR abierto (los abiertos son #27, #29 y #30), así que el borrado no cierra PRs.
`main`, `fix/landing` y las ramas de esos tres PRs no contienen la cadena.

**L8 — Borrado de ramas verificado (29/10/2026).** El dueño corrió la eliminación de refs. Después de
`git fetch --prune` quedan 8 ramas remotas (`chore/bump-deps-2026-10`, `feat/landing-documento-ingenieria`,
`feature/TL-23-voseo-i18n`, `feature/TL-30-mejoras-landing`, `feature/TL-33-rediseno-visual`,
`fix/pie-diagrama-emotion-duplicado`, `franky/fix-tonk-landing-28`, `main`) y **ninguna contiene
`Ignacio` ni `Sileo`**; las 16 ramas de L7 ya no existen en `origin`.

Residuo conocido y fuera del alcance de refs: los commits viejos siguen alcanzables desde los PR
históricos y la API de GitHub. Una limpieza total exigiría reescribir la historia (`git filter-repo` +
force push), con costo sobre PRs, forks y clones existentes. El sitio publicado y la ficha canónica
(`/llms.txt` y JSON-LD) ya no mencionan esa nómina.
