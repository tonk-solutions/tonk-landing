# Feature: SEO audit fixes

## Objective
Fix every finding of the SEO audit of tonksolutions.com.ar so the live site is indexable, previews correctly and exposes its full service offering to crawlers.

## Problem / why
- Canonical, og:url, hreflang and JSON-LD point to `https://tonksolutions.com` (non-existent domain).
- `og:image` and JSON-LD logo reference missing files.
- No `robots.txt` / `sitemap.xml`.
- 4 overlapping JSON-LD blocks (8 Service, 4 Offer nodes) and an invented `priceRange`.
- Services content is hidden behind a client-side switcher (only the selected service is in the initial HTML).
- `WHATSAPP_URL` constant is masked (`+549****8349`).
- Single-page site: no indexable URL per service.

## Scope / constraints
- Next.js 16 App Router + next-intl (`es`, `en`), Chakra UI.
- Single source of truth for the site URL: `https://tonksolutions.com.ar`.
- Generated artifacts (code, copy, comments) in English unless extending existing Spanish copy in `messages/es.json`.
- No new dependencies unless strictly needed (`next/og` and `sharp` are available).

## TDD
- Mode: off (source: no test runner configured in the project; `package.json` has only `dev`, `build`, `start`, `lint`).
- Checks per task: `npm run lint`, `npm run build`.

## Tasks
- [x] T1 — Centralize `SITE_URL = https://tonksolutions.com.ar` and use it for metadataBase, canonical, alternates/hreflang, og:url and JSON-LD; fix `WHATSAPP_URL` and reuse it in Footer/ContactSection.
- [x] T2 — Provide a real OG image (1200×630) and a real logo asset for JSON-LD.
- [ ] T3 — Add `src/app/robots.ts` and `src/app/sitemap.ts` (with es/en alternates).
- [ ] T4 — Consolidate JSON-LD into Organization + WebSite + a single ItemList of services; remove `priceRange`.
- [ ] T5 — Render all services in the initial HTML (visible content, no JS required to read the offer).
- [ ] T6 — Indexable per-service pages `/[locale]/services/[slug]` with own H1, title, description, canonical and hreflang; link them from the services section and include them in the sitemap.

## Acceptance criteria
- No reference to `tonksolutions.com"` / `https://tonksolutions.com/` remains in `src`.
- `/robots.txt`, `/sitemap.xml`, OG image and logo resolve in the production build.
- Built HTML of `/es` contains the names of every service.
- Each service page builds statically for both locales.
- `npm run lint` and `npm run build` pass.

## Delivery
- Branch: `fix/seo-audit`. Strategy: ask-on-risk (forecast likely > 400 authored lines because of T6).

## Progress / evidence
- T1 (commit d8bbfd7): Added `SITE_URL`/`SITE_NAME` to `src/app/constants.ts`, replaced hardcoded `https://tonksolutions.com` in `src/app/[locale]/layout.tsx` (metadataBase, canonical, alternates, og:url, JSON-LD `@id`/`url`) with the constant. Unmasked `WHATSAPP_URL` (`https://wa.me/5491123908349`) and switched `Footer.tsx` / `ContactSection.tsx` to import it instead of a hardcoded link. `npm install` was required first (node_modules was absent) and native postinstall scripts (sharp, swc, parcel watcher, unrs-resolver) were approved via `npm install-scripts approve` — recorded in `package.json.allowScripts`. `npm run lint`: no errors. `npm run build`: success (Turbopack, static + `/[locale]` dynamic route).

- T2 (commit pending): Added `src/app/[locale]/opengraph-image.tsx` (next/og `ImageResponse`, 1200x630, localized tagline from `schema.slogan`, brand colors from `theme.ts`, static per-locale via `generateStaticParams`) and removed the manual broken `openGraph.images`/`twitter.images` entries in `layout.tsx` so Next wires the file-convention image automatically. Generated `public/images/logo.png` (512x512 PNG rasterized from the `TonkLogo` isotype SVG with `sharp`) via a one-off script run from the project root and not committed. Verified with `next start`: `/es/opengraph-image` → 200 `image/png` 1200x630, `/images/logo.png` → 200 `image/png`. `npm run lint`: no errors. `npm run build`: success, `/[locale]/opengraph-image` prerendered for `es`/`en`.

## Next step
T3.
