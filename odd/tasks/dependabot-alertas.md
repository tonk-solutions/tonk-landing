# Dependabot — 75 alertas abiertas a cero

Cierre de todas las alertas de Dependabot abiertas en `tonk-solutions/tonk-landing`
(75, todas en `package-lock.json`): actualización de dependencias directas y
transitivas a las versiones parcheadas, sin romper build, tipos, lint ni tests.
Rama `dependabot`, adelantada a `origin/main` (`9f01220`).

## Specs

**S1 — Cero alertas.** Ninguna de las 75 alertas abiertas queda con una instancia
resuelta dentro de su rango vulnerable, y `npm audit` sobre el lockfile nuevo reporta
`0 vulnerabilities`.

**S2 — Nada desaparece ni baja.** Ninguna dependencia directa declarada en
`package.json` se elimina, y ninguna versión instalada queda por debajo de la que
tenía el lockfile base.

**S3 — Suben los paquetes alertados, no el resto.** Cada dependencia directa declara
una versión que cierra sus alertas; los transitivos suben dentro del rango que declara
su padre (`npm update`) y, cuando el padre fija una versión exacta vulnerable, se
resuelve con `overrides`. El `package-lock.json` se regenera con npm, nunca a mano.

**S4 — Verificación igual que el base.** `npm run typecheck`, `npm run lint`,
`npm test`, `npm run build` y `npm run test:e2e` dan los mismos resultados que en
`9f01220`, sin fallos nuevos.

**S5 — Lockfile reproducible.** Una instalación limpia (`npm ci`) reproduce el
árbol declarado por el lockfile sin modificarlo.

## Tasks

| ID | Specs | Ruta | Tarea | Commit |
|---|---|---|---|---|
| T1 | S4 | inline | Baseline en `9f01220`: `npm ci`, `npm audit` (18 vulns locales / 75 alertas), typecheck, lint, tests, build y e2e | — |
| T2 | S1,S2,S3 | inline | Subir dependencias directas (`next`, `sharp`, `next-intl`, `vitest`) y refrescar transitivos con `npm update` | `fix(deps): cerrar las 75 alertas de Dependabot` |
| T3 | S3 | inline | Actualizar `allowScripts` del `package.json` a las versiones resueltas | idem T2 |
| T4 | S1,S4,S5 | inline | Verificación: alerta por alerta, `npm audit`, `npm ci` limpio, typecheck, lint, tests, build y e2e | — |

## Log

**L1** (pedido original, verbatim): "hay 75 warnings de dependabot en este repositorio. Soluciona todo"

**L2** (evidencia, inventario): `gh api repos/tonk-solutions/tonk-landing/dependabot/alerts?state=open`
devuelve 75 alertas, las 75 con `manifest_path=package-lock.json`. Reparto por paquete:
`next` 35 (4 críticas: RCE sin autenticar en Image Optimization con AVIF y con SVG, RCE en
`use cache` con typed arrays, y RCE en servidores Windows), `js-yaml` 6,
`brace-expansion` 4, `postcss` 4, `sharp` 3, `picomatch` 3,
`vitest`/`@vitest/mocker`/`tinypool` 5, `postcss-selector-parser` 2, `next-intl` 2,
`@babel/core` 1, `browserslist` 1, `baseline-browser-mapping` 1, `flatted` 1,
`@humanfs/node` 1, `icu-minify` 1.

**L3** (evidencia, entorno): Node `v26.12.1`, npm `12.2.1`, registry público. El `npm ci`
del baseline falla en el `postinstall` de `sharp@0.34.5` (no encuentra binario prebuilt y
cae a compilar con node-gyp, que no está instalado), así que la verificación local se hace
con `npm ci --ignore-scripts`. Es una limitación de esta máquina, no del lockfile:
`netlify.toml` no fija versión de Node. `sharp@0.35.5` ya no publica `postinstall`.

**L4** (evidencia, baseline en `9f01220`): typecheck 0 · lint 0 · `vitest` 35/35 ·
build 26 páginas estáticas / 23 rutas · e2e **59 pasan, 1 salteado** (el nav de escritorio
en el proyecto mobile, salteado a propósito) · `npm audit` 18 vulnerabilidades
(3 críticas, 8 altas, 5 moderadas, 2 bajas).
El puerto 3000 estaba ocupado por un `next start` del clon principal
(`~/Desarrollo/Tonk/Tools/tonk-landing`, 9 h de vida), y Playwright lo reusa por
`reuseExistingServer`, así que los e2e se corren contra un `next start` propio en 3210-3212
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
- `allowScripts` del `package.json` pasa de las versiones viejas a las resueltas
  (`sharp@0.35.5`, `@parcel/watcher@2.6.0`, `@swc/core@1.16.20`, `unrs-resolver@1.12.2`).
  Sin eso npm 12 bloquea los `postinstall` que el propio `allowScripts` declara permitidos.
- `vitest.config.ts`: `__dirname` → `import.meta.dirname`. Vite 8.3.5 avisaba que
  `__dirname` deja de estar soportado con `configLoader: 'native'`; el nuevo piso de
  engines de Vite (`^20.19 || >=22.12`) garantiza `import.meta.dirname` (Node 20.11+).

**L6** (evidencia, verificación final):
- **Alerta por alerta**: un chequeo independiente recorre las 75 alertas, busca cada
  instancia resuelta del paquete en el lockfile nuevo y la evalúa con semver contra
  `vulnerable_version_range`: **0 instancias vulnerables**, `tinypool` sin instancia.
- `npm audit`: `0 vulnerabilities`.
- `npm ci --ignore-scripts` sobre árbol borrado: 751 paquetes, md5 del lockfile idéntico
  antes y después (S5).
- typecheck 0 · lint 0 · `vitest` 35/35 (sin el warning de `__dirname`) ·
  build 26 páginas / mismas 23 rutas · e2e **59 pasan, 1 salteado**, igual que el base.
- Una corrida de e2e (la primera tras el build) falló 8 tests de interacción con
  `aria-expanded` en "false": click antes de hidratar con 12 workers. No volvió a
  reproducirse en cinco corridas (serial `--workers=1` 8/8, paralelo ×2, frío y caliente),
  y los mismos tests reciben el mismo tratamiento en el base.
