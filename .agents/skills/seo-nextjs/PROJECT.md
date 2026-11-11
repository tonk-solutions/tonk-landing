# Project-local notes (tonk-landing)

These constraints apply only in this repository. They are not part of the upstream `seo-nextjs` skill. Do not fold them into `SKILL.md`: the next `npx skills update` replaces this directory and would drop both that edit and this file. The same constraints are recorded in the repo root `AGENTS.md`, which that update does not touch.

- This site uses Next.js App Router under `src/app/[locale]/`, plus next-intl. There is no root `app/` directory. `test -d app` must NOT be treated as Pages Router.
- Do not replace or casually rewrite existing schema, hreflang, x-default, sitemap/robots, llms, or founder/identity copy already reconciled in the repo.
- Semrush MCP is optional and should be skipped unless already connected.
