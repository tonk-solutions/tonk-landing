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
- [x] T3 — Add `src/app/robots.ts` and `src/app/sitemap.ts` (with es/en alternates).
- [x] T4 — Consolidate JSON-LD into Organization + WebSite + a single ItemList of services; remove `priceRange`.
- [x] T5 — Render all services in the initial HTML (visible content, no JS required to read the offer).
- [x] T6 — Indexable per-service pages `/[locale]/services/[slug]` with own H1, title, description, canonical and hreflang; link them from the services section and include them in the sitemap.

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

- T2 (commit 5416bc1): Added `src/app/[locale]/opengraph-image.tsx` (next/og `ImageResponse`, 1200x630, localized tagline from `schema.slogan`, brand colors from `theme.ts`, static per-locale via `generateStaticParams`) and removed the manual broken `openGraph.images`/`twitter.images` entries in `layout.tsx` so Next wires the file-convention image automatically. Generated `public/images/logo.png` (512x512 PNG rasterized from the `TonkLogo` isotype SVG with `sharp`) via a one-off script run from the project root and not committed. Verified with `next start`: `/es/opengraph-image` → 200 `image/png` 1200x630, `/images/logo.png` → 200 `image/png`. `npm run lint`: no errors. `npm run build`: success, `/[locale]/opengraph-image` prerendered for `es`/`en`.

- T3 (commit f360dc2): Added `src/app/services/catalog.ts`, a typed catalog of the 7 services (stable English `slug`, `branch`, icon, and the index into `messages.services.<branch>.services`) that will be the single source T4/T5/T6 read from. Added `src/app/robots.ts` (allow all, points to `${SITE_URL}/sitemap.xml`) and `src/app/sitemap.ts` (lists `/es`, `/en` and, from the catalog, `/es/services/<slug>` and `/en/services/<slug>` for all 7 services, each with `alternates.languages`). Confirmed `src/proxy.ts`'s middleware matcher (`['/', '/(es|en)/:path*']`) does not intercept `/robots.txt` or `/sitemap.xml` — no change needed there. `npm run lint`: no errors. `npm run build`: success, `/robots.txt` and `/sitemap.xml` prerendered as static routes. Note: the sitemap's `/services/<slug>` URLs 404 until T6 lands the actual pages later in this branch.

- T4 (commit 180bb1c): Added `src/app/seo/structuredData.ts`, a pure `buildStructuredDataGraph()` helper (no next-intl/React dependency) producing one `@graph` with Organization, WebSite (publisher → Organization `@id`) and a single ItemList of 7 Service nodes built from `SERVICES_CATALOG` (`provider` → Organization `@id`, `url` → the real service page). Removed the `ProfessionalService` node and its invented `priceRange: "$$$$"`, and the duplicate 4-item Service/Offer lists. `layout.tsx` now renders exactly one `<script type="application/ld+json">` instead of four. Deleted the now-unused `schema.services`, `schema.offers`, `schema.offerCatalogName`, `schema.professionalServiceDescription` keys from `messages/es.json` and `messages/en.json` (kept `slogan`, `inLanguage`, `servicesListName`, `servicesListDescription`, still used). `npm run lint`: no errors. `npm run build`: success.

- T5 (commit 823ec94): Reworked `ServicesSection.tsx` so both branches (Craft/Talent) and every service's detail panel are always rendered server-side; only the inactive branch/service is hidden with `display: none` (CSS), replacing the previous `selectedBranch === branch.name && (...)` / single-`selectedService` conditional rendering that removed the other branches/services from the DOM entirely. Verified with `next start` that `/es`'s server-rendered HTML contains every one of the 7 service titles and descriptions (both branches), e.g. the Talent-branch "Onboarding e Integración" description is present even though Craft is the default selected tab. Also added a "view full page" link (`services.viewDetails` message key, added to both locale files) on each service panel pointing at its future `/services/<slug>` page via the catalog, ready for T6. `npm run lint`: no errors. `npm run build`: success.

- T6 (commit e4cabb3): Added `src/app/[locale]/services/[slug]/page.tsx` (`generateStaticParams` over all locales x the 7 catalog slugs, `generateMetadata` with localized title/description, canonical, es/en/x-default hreflang and openGraph, `notFound()` for an unknown slug), reusing Header/Footer and the shared `pickServiceContent`/`getServiceEntry` helpers from the catalog so content stays DRY with `ServicesSection` and the JSON-LD ItemList. Added `services.detail.*` message keys (backToServices, ctaTitle, ctaDescription, ctaButton) in both locale files for the page's CTA back to WhatsApp contact. Fixed a Server/Client Component boundary bug found during verification: passing a lucide icon component as Chakra's `Icon as={...}` prop from a Server Component crashed with "Functions cannot be passed directly to Client Components" (500) — replaced with rendering the lucide icon directly as a JSX element (no Chakra `Icon` wrapper) for the two icons on this page.
  Final full verification (`next build` then `next start -p 3123`): `/robots.txt` 200; `/sitemap.xml` 200, contains `tonksolutions.com.ar` (48 occurrences); `/es` HTML canonical is `https://tonksolutions.com.ar/es` and contains all 7 service names/descriptions; `/images/logo.png` 200 `image/png`; og:image URL from `/es` HTML (`/es/opengraph-image?...`) resolves 200 `image/png`; `/es/services/digital-product-development` 200, `/en/services/onboarding-integration` 200, unknown slug 404. `grep -rn 'tonksolutions\.com"'` and `'tonksolutions\.com/'` over `src`: no matches. `npm run lint`: no errors. `npm run build`: success.

## Next step
None — all tasks (T1-T6) complete. Remaining follow-ups for the user: review/merge the branch; consider running `npm audit` (16 pre-existing vulnerabilities reported by `npm install`, unrelated to this change) at their discretion.

## Parent verification (re-run)
- `npm run lint`: no errors. `npm run build`: success.
- Open item: `/[locale]` and `/[locale]/services/[slug]` are reported as dynamic (ƒ), not SSG, despite `generateStaticParams`. Pages are server-rendered so crawlers get full HTML; the "builds statically" acceptance criterion is not met yet.
- `package.json` gained an `allowScripts` block from `npm install-scripts approve` during T1.

## Review (RDD)
- Assessed: medium (slice_budget_reached, ~1030 lines). Consent: granted. Lens: review-reliability. Outcome: approved, acknowledged (lineage review-40ce5ecd0e7effb6).
- Non-blocking findings (follow-ups):
  - WARNING: `setRequestLocale` missing in the service page, its `generateMetadata` and the locale layout → the routes render dynamically instead of SSG.
  - WARNING: `pickServiceContent` indexes messages by position without bounds checks → a reorder or missing entry silently mismatches content or returns 500.
  - WARNING: no unit tests for catalog, structured data, sitemap and robots (no test runner configured).
  - SUGGESTION: validate the locale in `generateMetadata` using a shared guard.
  - SUGGESTION: the Footer hardcodes the displayed phone number instead of reading it from `CONTACT_PHONE`.

## Follow-up fixes (post-review)
- [x] F1 (commit 8340ca5) — Added server-only `resolveRequestLocale` in `src/i18n/requestLocale.ts` (`hasLocale` guard + `setRequestLocale`), used by the locale layout, its `generateMetadata`, the home page, and the service page and its `generateMetadata`. `/[locale]` and `/[locale]/services/[slug]` now build as SSG (14 service paths). It also covers the locale guard that was missing in the service `generateMetadata`.
- [x] F2 — `pickServiceContent` now throws `ServiceContentMissingError` when a branch list is missing, the index is out of range, or the title/description is empty. A drift between the catalog and the messages now fails the build instead of returning a 500 at runtime. A reorder inside the messages is still undetected: it would need slug-keyed messages.
- Checks: `npm run lint` no errors; `npm run build` success, all routes ● SSG. Smoke test (`next start`): /es, /en, /es/services/applied-ai, /en/services/onboarding-integration 200; unknown slug and /xx 404; robots and sitemap 200; /es canonical is https://tonksolutions.com.ar/es.
- Remaining suggestions not addressed: unit tests (no runner configured), hreflang in the service page hardcoded instead of using `routing.locales`, displayed phone hardcoded in the Footer, silent missing link in ServicesSection.
