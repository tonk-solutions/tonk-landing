# Dependabot — 75 alertas abiertas a cero

Cierre de las 75 alertas de Dependabot abiertas en `tonk-solutions/tonk-landing`
(todas en `package-lock.json`): actualización de dependencias directas y transitivas a
las versiones parcheadas, sin romper build, tipos, lint ni tests.
Rama `dependabot`, adelantada a `origin/main` (`9f01220`).

Las alertas de GitHub siguen en estado `open` sobre el default branch hasta que esto se
mergee y Dependabot vuelva a escanear; lo que se verifica acá es que ninguna queda con
una instancia resuelta dentro de su rango vulnerable.

## Specs

**S1 — Cero alertas.** Ninguna de las 75 alertas queda con una instancia resuelta dentro
de su `vulnerable_version_range`, y `npm audit` sobre el lockfile nuevo reporta
`0 vulnerabilities`.

**S2 — Nada desaparece, nada baja y el árbol es válido.** Ninguna dependencia directa
declarada en `package.json` se elimina ni baja de versión, y `npm ls --all` sale 0 sin
`ELSPROBLEMS`: cada peer que declara un rango tiene una resolución que lo cumple. El base
(`9f01220`) cumple ese invariante; el cambio también tiene que cumplirlo.

**S3 — Suben los paquetes alertados, no el resto.** Cada dependencia directa declara una
versión que cierra sus alertas; los transitivos suben dentro del rango que declara su
padre (`npm update`) y, cuando el padre fija una versión exacta vulnerable, se resuelve
con `overrides`. El `package-lock.json` se regenera con npm, nunca a mano.

**S4 — Verificación igual que el base.** `npm run typecheck`, `npm run lint`,
`npm test`, `npm run build` y `npm run test:e2e` dan los mismos resultados que en
`9f01220`, sin fallos nuevos.

**S5 — Instalación limpia reproducible por el camino real.** `npm ci` **sin flags**
(con los `postinstall` habilitados) sobre un árbol vacío reproduce el árbol declarado:
misma cantidad de paquetes, 0 vulnerabilidades, `npm ls --all` en 0, tests y build en
verde.

**S6 — Entorno declarado.** El piso de Node que exigen las dependencias está escrito en
`engines.node` y acompañado por `.nvmrc` y `NODE_VERSION` de Netlify, con la misma
coherencia entre los tres.

**S7 — `allowScripts` sostenible.** Las entradas permiten los `postinstall` que realmente
existen, sobreviven a los bumps de versión y no tienen entradas muertas; el procedimiento
para mantenerlas queda documentado.

## Tasks

| ID | Specs | Ruta | Tarea | Commit |
|---|---|---|---|---|
| T1 | S4 | inline | Baseline en `9f01220`: `npm ci`, `npm audit`, `npm ls --all`, typecheck, lint, tests, build y e2e | — |
| T2 | S1,S2,S3 | inline | Subir dependencias directas (`next`, `sharp`, `next-intl`, `vitest`) y refrescar transitivos con `npm update` | `fix(deps): cerrar las 75 alertas de Dependabot` |
| T3 | S7 | inline | `allowScripts` a las versiones resueltas | idem T2 |
| T4 | S1,S4,S5 | inline | Verificación de la ronda 0: alerta por alerta, `npm audit`, typecheck, lint, tests, build y e2e | — |
| T5 | S2 | inline | Fijar `yaml` 2.x como devDependency: el árbol quedaba inválido con yaml 1.10.3 en la raíz | ronda 1 |
| T6 | S6 | inline | Declarar el piso de Node: `engines.node`, `.nvmrc`, `NODE_VERSION` en `netlify.toml` y requisito en `SETUP.md` | ronda 1 |
| T7 | S7 | inline | `allowScripts` por nombre, sin la entrada muerta de `sharp`, con `fsevents` incluido y el procedimiento documentado | ronda 1 |
| T8 | S5 | inline | Re-verificar la instalación limpia por el camino real (`npm ci` sin flags) y corregir la evidencia | ronda 1 |
| T9 | S2 | inline | Sacar el alias `@data` de `vitest.config.ts` (apunta a un `./data` inexistente) | ronda 1 |

## Log

**L1** (pedido original, verbatim): "hay 75 warnings de dependabot en este repositorio. Soluciona todo"

**L2** (evidencia, inventario): `gh api repos/tonk-solutions/tonk-landing/dependabot/alerts?state=open`
devuelve 75 alertas, las 75 con `manifest_path=package-lock.json`. Reparto real por
paquete: `next` 38, `js-yaml` 8, `brace-expansion` 4, `postcss` 4, `picomatch` 3,
`sharp` 3, `@vitest/mocker` 2, `next-intl` 2, `postcss-selector-parser` 2, `tinypool` 2,
`@babel/core` 1, `@humanfs/node` 1, `baseline-browser-mapping` 1, `browserslist` 1,
`flatted` 1, `icu-minify` 1, `vitest` 1 (suma 75).
Las 4 críticas de `next` son RCE sin autenticar: en Image Optimization con AVIF y con
SVG, en `use cache` con typed arrays, y en servidores Windows.

**L3** (evidencia, entorno): Node `v26.12.1`, npm `12.2.1`, registry público. El `npm ci`
del baseline falla en el `postinstall` de `sharp@0.34.5` (no encuentra binario prebuilt y
cae a compilar con node-gyp, que no está instalado), así que el baseline se verifica con
`npm ci --ignore-scripts`. Es una limitación de esta máquina, no del lockfile:
`netlify.toml` no fijaba versión de Node. `sharp@0.35.5` ya no publica `postinstall`.

**L4** (evidencia, baseline en `9f01220`): `npm ci --ignore-scripts` 753 paquetes ·
`npm audit` 18 vulnerabilidades (3 críticas, 8 altas, 5 moderadas, 2 bajas) ·
`npm ls --all` **0** (el árbol del base es válido, con `yaml` 2.9.1 en la raíz) ·
typecheck 0 · lint 0 · `vitest` 35/35 · build 26 páginas estáticas / 23 rutas ·
e2e **59 pasan, 1 salteado** (el nav de escritorio en el proyecto mobile, salteado a
propósito).
El puerto 3000 estaba ocupado por un `next start` del clon principal
(`~/Desarrollo/Tonk/Tools/tonk-landing`, 9 h de vida), y Playwright lo reusa por
`reuseExistingServer`, así que los e2e se corren contra un `next start` propio en 3210-3213
con `PLAYWRIGHT_BASE_URL`. Sin eso, 16 tests fallan por servir un build viejo del clon
principal: no es un defecto del repo.

**L5** (evidencia, cambio):
- `next` `^16.1.6` → `^16.4.3` (resuelto 16.4.3). Arrastra `postcss` anidado de
  8.4.31 a 8.5.23, que es la versión parcheada, y `sharp` como peer opcional a `^0.35.5`.
- `sharp` `^0.34.5` → `^0.35.5` (resuelto 0.35.5). El `^` sobre 0.x no permite minors,
  así que el rango tenía que cambiar para poder salir de 0.34.
- `next-intl` `^4.8.3` → `^4.9.2` (resuelto 4.14.9). Cierra el open redirect y la
  prototype pollution de `precompile`, y sube `icu-minify`.
- `vitest` `^3.2.7` → `^4.1.12` (resuelto 4.1.12). Cierra `@vitest/mocker` y `tinypool`;
  `tinypool` deja de existir en el árbol, así que sus 2 alertas se cierran por remoción.
- `npm update` subió el resto de los transitivos dentro de sus rangos: `js-yaml` 4.3.2 y
  el 3.15.2 de `gray-matter`, `picomatch` 2.3.2 y 4.0.7, `brace-expansion` 1.1.21 y 5.0.12,
  `zod` 4.6.7, `flatted` 3.4.4, `browserslist` 4.29.5, `baseline-browser-mapping` 2.11.34,
  `postcss-selector-parser` 6.1.5, `@babel/core` 7.29.7, `@humanfs/node` 0.16.8.
  **No hizo falta ningún `overrides`**: el único pin exacto problemático (`postcss` de
  `next`) lo resolvió el propio `next` 16.4.3.
- `vitest.config.ts`: `__dirname` → `import.meta.dirname`. Vite 8.3.5 avisaba que
  `__dirname` deja de estar soportado con `configLoader: 'native'`.

**L6** (evidencia, ronda 0): alerta por alerta, 0 instancias dentro del rango vulnerable
(las 75 revisadas, `tinypool` sin instancia) · `npm audit` 0 · typecheck 0 · lint 0 ·
`vitest` 35/35 · build 26 páginas / 23 rutas · e2e 59 pasan, 1 salteado.
Una corrida de e2e (la primera tras el build) falló 8 tests de interacción con
`aria-expanded` en `"false"`: click antes de hidratar con 12 workers. No se reprodujo en
cinco corridas posteriores (serial `--workers=1` 8/8, paralelo ×2, frío y caliente).

**L7** (correcciones de la ronda 1, todas verificadas):
- **`yaml` (S2, hallazgo alto)**: el lockfile dejaba `node_modules/yaml` en 1.10.3
  mientras `postcss-load-config@6.0.1` (vía `tailwindcss`) y `vite@8.3.5` (vía `vitest`)
  declaran el peer `^2.4.2`, así que `npm ls --all` salía 1 con
  `invalid: yaml@1.10.3`. Era hoisting, no un downgrade real, pero el árbol quedaba
  inválido y `npm ci` no avisaba. Arreglo: `yaml ^2.9.1` como devDependency; la raíz queda
  en 2.9.1 y `cosmiconfig` conserva su 1.10.3 anidado, igual que en el base.
  Verificado: `npm ls yaml` y `npm ls --all` en **0**.
- **Piso de Node (S6)**: `next@16.4.3` pide `>=20.9.0` y el `vite@8.3.5` anidado en
  `vitest` pide `^20.19.0 || >=22.12.0`; `vitest@4.1.12` declara un rango más laxo, así
  que npm no avisaba nada. Se agrega `engines.node: "^20.19.0 || >=22.12.0"` (el rango
  exacto, no un `>=` que dejaría pasar la 21), `.nvmrc` con `22`,
  `NODE_VERSION = "22"` en `netlify.toml` y el requisito en `SETUP.md`.
- **`allowScripts` (S7)**: las entradas pinneadas (`@swc/core@1.16.20`) dejan de aplicar
  en el bump siguiente y obligan a reeditar a mano; `sharp@0.35.5` era una entrada muerta
  (0.35.5 no publica script) y `fsevents@2.3.3` sí declara `install: node-gyp rebuild` y
  no estaba, así que en macOS el allowlist le bloqueaba el script. Ahora las entradas van
  por nombre (`@parcel/watcher`, `@swc/core`, `fsevents`, `unrs-resolver`), sin `sharp`, y
  el procedimiento (`npm install-scripts approve --no-allow-scripts-pin`, `ls`, `prune`)
  queda en `SETUP.md`. Verificado: `npm install-scripts ls` responde
  "No packages with unreviewed install scripts".
- **Evidencia de S5**: la ronda 0 midió la instalación limpia con `--ignore-scripts`, que
  desactiva justo los `postinstall` que controla `allowScripts`. Medición nueva por el
  camino real en un directorio vacío (`git ls-files -co --exclude-standard` + `npm ci` sin
  flags): **751 paquetes**, `found 0 vulnerabilities`, `npm ls --all` **0**,
  `vitest` 35/35, `next build` OK.
- **`vitest.config.ts` (S2, alias muerto)**: se saca `@data`, que apuntaba a un `./data`
  inexistente (`git ls-files data` vacío, ningún import en `src/`, ningún path en
  `tsconfig.json`). Queda solo `@` → `src`, que es el alias real del proyecto.

**L8** (evidencia, ronda 1, sobre el worktree):
- alerta por alerta: 75 revisadas, **0 instancias vulnerables**.
- `npm ls yaml` 0 · `npm ls --all` 0 (el base también sale 0, verificado aparte con
  `git archive 9f01220` + `npm ci`).
- `npm install-scripts ls`: sin scripts pendientes de revisión.
- typecheck 0 · lint 0 · `vitest` 35/35 · build 26 páginas / 23 rutas · e2e **59 pasan,
  1 salteado** contra `next start` propio en 3213, igual que el base.

**L9** (fragilidad conocida, no corregida en esta ronda): `e2e/landing.spec.ts:88` hace
click sobre `#s03 button[aria-expanded]` inmediatamente después del `goto`, sin ninguna
señal de hidratación, y `playwright.config.ts` deja `workers` indefinido fuera de CI, así
que en una máquina cargada el click puede llegar antes de que React enganche el handler
(es el flake de L6). No es regresión de esta ronda. Si se quiere cerrar: esperar una señal
de hidratación antes del primer click y acotar los workers en local.
