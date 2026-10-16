# Feature: Pilar 1 — Marca y evidencia (TL-1)

## Objective
Ship the repo-buildable parts of Jira epic TL-1: turn `/[locale]/services/enterprise-integrations` into the conversion-focused landing from §12 of the competitor analysis, and prepare the data surfaces for case studies (TL-6) and testimonials (TL-7) so publishing is content-only once real material exists.

## Problem / why
- TL-1 children: TL-9 (landing `/es/integraciones-enterprise`), TL-6 (3 casos de éxito), TL-7 (3 testimonios), TL-8 (LinkedIn, non-repo).
- The current service page for `enterprise-integrations` is minimal (icon + description + generic WhatsApp CTA). The full landing copy is already written in `analisis-competencia-y-plan-de-accion.md` §12.
- TL-6 and TL-7 are blocked on real content (3 real projects with metrics, 3 authorized testimonials). Publishing invented cases or testimonials would defeat the epic's purpose (credibility).
- TL-9's "home reenfocada al nicho" acceptance item is gated on TL-10 (one-line niche phrase approved by the 4 founders).

## Decisions
- **Route (user decision, 2026-10-16):** the landing lives at the existing `/[locale]/services/enterprise-integrations` URL. No new `/integraciones-enterprise` route (avoids SEO cannibalization and keeps sitemap/JSON-LD/hreflang wiring). A pretty-alias redirect is deferred until explicitly requested.
- **TL-10 phrase (user decision, 2026-10-16):** the one-line niche phrase is «Integraciones enterprise complejas, sin intermediarios.» (chosen without "en LatAm", based on §11.1). Applies to the home and the proposals template; the §12 landing copy stays compatible. Unblocks T2.
- Cases data model follows §13 template fields so TL-6 is additive.
- No fabricated cases/testimonials: the landing's cases section renders only when `CASE_STUDIES` is non-empty.

## Scope / constraints
- Next.js 16 App Router + next-intl (`es`, `en`) + Chakra UI v3 + TypeScript.
- ES copy: verbatim from §12 (`analisis-competencia-y-plan-de-accion.md` lines 368–460). EN copy: neutral professional translation.
- Code identifiers/comments in English; copy lives in `messages/{locale}.json`.
- No new dependencies. Do not touch sitemap, JSON-LD, proxy or routing (same URL).

## TDD
- Mode: off (source: no test runner in `package.json`; only `dev`, `build`, `start`, `lint`).
- Checks per task: `npm run lint`, `npm run build`, plus grep of the prerendered HTML for key landing copy in both locales.
- Environment: on this machine `npm ci` needs `SHARP_IGNORE_GLOBAL_LIBVIPS=1` (system libvips makes sharp fall back to a failing source build). Postinstall scripts are pre-approved in `package.json.allowScripts`.

## Tasks
- [x] T1 — TL-9a: Enterprise-integrations landing (DONE, commit 166f397). Sections: hero → problem → what we do → why us → how we work → expected results → conditional cases → final CTA ("Solicitar diagnóstico de integración" → WhatsApp with prefilled text). New `landing.enterpriseIntegrations` namespace in both messages; landing metadata (title/description) per locale. New `src/app/cases/catalog.ts` (typed, empty) driving the cases section.
  - Route: delegated direct — one bounded writer (2+ non-trivial files: page, component, catalog, messages ×2). Trigger: writer rule.
- [x] T2 — TL-9b: Home re-focused to the niche (DONE, commit feb678d). Hero renders the TL-10 phrase verbatim, niche description and CTA; services section reframed with enterprise integrations first (craft message arrays reordered + `catalog.ts` `messageIndex` remapped); SEO metadata and `schema.slogan` aligned in both locales. Components untouched (messages-only change).
  - Route: delegated direct — one bounded writer (messages ×2 + `catalog.ts`). Trigger: writer rule.
- [ ] T3 — TL-6: `/es/casos` page + fill `CASE_STUDIES` with 3 real projects (BLOCKED on founder content).
- [ ] T4 — TL-7: Testimonials on home + contact (BLOCKED on authorized testimonials).
- TL-8 (LinkedIn): non-repo work; founders only.

## Acceptance criteria
- T1: `/es|/en/services/enterprise-integrations` render the full landing from §12; CTA opens WhatsApp with prefilled message; cases section hidden while `CASE_STUDIES` is empty; landing metadata updated in both locales; `npm run lint` and `npm run build` pass; prerendered HTML contains the hero title and CTA in both locales.
- T3: 3 cases published with concrete metrics (§13 fields), linked from home.
- T4: 3 testimonials visible on home and contact page.

## Delivery
- Branch: `feature/pilar-1-marca-y-evidencia`. Strategy: **stacked-to-main** (user decision, 2026-10-16). T1 ships as a single PR to main with an accepted `size:exception` (733 authored changed lines; one honest slicing pass found no cohesive split under 400 — the component and copy are atomic and the cases scaffold only removes ~60 lines). T2/T3/T4 ship as independent PRs to main when unblocked. Push and PR creation remain user decisions.
- PRs (2026-10-16): **#24** `feature/pilar-1-landing` → `main` — landing + docs (`size:exception` accepted; native review approved and burned). **#25** `feature/pilar-1-marca-y-evidencia` → `feature/pilar-1-landing` — home re-focus (T2); retarget to `main` after #24 merges. Merge remains a human decision.
- Reviewed boundary: `4341687` (T1 landing; native review approved and burned) → advanced past passive docs to `931513c`. T2 (`feb678d`) assessed **medium / `under_budget`** (86 of ≈400 lines): no review due yet — it stays pending in the slice until a later commit reaches the delivery budget.

## Progress / evidence
- 2026-10-16: Branch created from `main`. Feature doc created. Route decision recorded (expand existing service page; user picked the recommended option).
- T1 (commit 166f397, 729+/4−): landing implemented by one bounded writer. New `EnterpriseIntegrationsLanding.tsx` (async server component, 9 sections, prefilled WhatsApp CTAs, cases section gated on `CASE_STUDIES.length > 0`), surgical branch in `[slug]/page.tsx` (+ metadata via `landing.enterpriseIntegrations.meta`), new typed `src/app/cases/catalog.ts`, `landing.enterpriseIntegrations` namespace added to both messages (ES verbatim §12, EN neutral translation). Evidence: `npm run lint` no issues; `npm run build` exit 0 (23/23 static pages; both locales prerendered — landing + six other services per locale); ES/EN prerendered HTML contain hero title and CTA (`grep -c` = 1 each); `Casos de éxito</h2>` count 0 while the catalog is empty; exactly one `<h1>`, six `<h2>`; two prefilled `wa.me` links per locale. Kept deviations: `meta.title` excludes the brand (layout template appends " | Tonk Solutions"); §12's bold subhead folded into `whatWeDo.title/intro`. Repo-local git identity set to match the repo's recent commits (`Nicolas Gomez <40148296+niico09@users.noreply.github.com>`).
- T1 review (RDD preflight: risk medium, 779 changed lines, one native lens `review-reliability`, lineage `review-7c6b548b422a0e9c`): **approved**; authority burned with the exact acknowledgement (consumed revision `sha256:8f20dae402e1fc5565fbd5319babf434f42f5c39705acfadbcd65128f554b9b6`). Advisory, non-blocking findings recorded as follow-ups: R3-001 — the cases-hidden gate and the slug-specific metadata contract have no committed automated assertion (TDD off; one-time manual checks only); R3-002 — the landing reads list copy through five unchecked `t.raw(...)` casts, the same repo-wide pattern used by `ServicesSection`.
- Post-review docs (`89082b6`, `ec8449f`): assess with `--base-ref 4341687 --committed-only` → `passive` (`non_executable_only`), `review_due: false`. The analysis document is now tracked in the repo (`docs(plan)` commit `ec8449f`). Jira TL-9 moved to "En curso" with a progress comment (implementation + evidence + pending items).
- TL-10 decision (Jira comment 11792): phrase registered as «Integraciones enterprise complejas, sin intermediarios.» (without "en LatAm"); TL-10 moved to "En curso".
- T2 (commit feb678d, 45+/41−): home refocused by one bounded writer. Hero renders the phrase verbatim (title + gradient highlight), niche description + CTA "Hablemos de tu integración"; `services.title` = "Nuestro foco: las integraciones enterprise"; craft arrays reordered in both locales (enterprise integrations first; catalog `messageIndex` remapped, guard passing); `seo.*` + `schema.slogan` aligned. EN uses "no intermediaries", matching the wording already present in `landing.enterpriseIntegrations`. Components untouched. Evidence: lint clean; build 23/23 (`/[locale]`, `/[locale]/opengraph-image`, `/[locale]/services/[slug]` ×14); ES home HTML contains the phrase, the new services title, and integrations before digital product in DOM order; EN home aligned; 14 service pages prerendered. Assess: medium (`configuration_change`), `review_due: false` (`under_budget`, 86/≈400) → no native review due; the commit stays pending in the slice from `931513c`.
- T2 follow-up (advisory): `seo.ogImageAlt` is dead copy — the rendered `og:image:alt` comes from the hardcoded `alt` export in `opengraph-image.tsx`. Cosmetic; wire or drop the key later.
- Note: prerendered HTML mirrors every message string twice (DOM + RSC flight payload), so `grep -c` = 2 where the DOM renders once; this pre-exists the change.
