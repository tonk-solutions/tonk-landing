# Feature: Operational documentation (TL-12, TL-16, TL-21)

## Objective
Produce the documentation deliverables of three TL tickets in a private team repo (`tonk-solutions/tonk-handbook`, created for this): the integration-diagnostic package definition (TL-12), the internal processes bundle (TL-16), and the security policy (TL-21).

## Problem / why
- TL-12: the diagnostic package must be defined and sellable (scope, price, deliverables, process) before offering it; the landing already funnels to a "Solicitar diagnóstico de integración" CTA.
- TL-16: processes currently live in the founders' heads; the ticket asks for a private repo (~10 pages max) so any founder can pick up another's project.
- TL-21: a basic access/backup/NDA policy signed by the 4; no SOC 2/ISO pursuit at this stage.
- Operational content lives in the private handbook repo; **this doc tracks only status and references** (tonk-landing became private on 2026-10-16).

## Scope / constraints
- Deliverable repo: `tonk-solutions/tonk-handbook` (private). Docs in Spanish (internal audience).
- No code changes here. Keep operational details (pricing, policy text) out of this repo — they live in the handbook.
- Docs are **proposals v0.1** for the founders to review and adjust. The tickets' outcomes (sales metric, signatures, adoption) remain with the founders.

## TDD
- N/A (pure documentation). Check: structural readback + founder review. No runner configured.

## Tasks
- [x] D1 — TL-12: `comercial/diagnostico-de-integracion.md`.
- [x] D2 — TL-16: `procesos/01-estimacion-de-proyectos.md`, `02-code-review.md`, `03-documentar-integraciones.md`, `04-handoff-al-cliente.md`.
- [x] D3 — TL-21: `seguridad/politica-de-seguridad.md` (+ signature block for the 4 founders).
- [x] D4 — Publish repo, update Jira (TL-12/16/21), update this doc + Engram mirror.
- Route: direct inline (parent) — the content is a synthesis of parent-held context (analysis §6, brand voice, decisions); delegating would require transferring the full content spec. No code involved.

## Acceptance criteria
- The three documents exist in the private repo with a README index; the processes bundle stays within TL-16's ~10-page cap.
- Jira TL-12, TL-16 and TL-21 carry a comment linking the docs and listing what remains on the founders' side (review, signatures, sales).

## Delivery
- New private repo `tonk-solutions/tonk-handbook`; commits per area (comercial / procesos / seguridad). Initial version goes directly to `main` (docs repo, no PR flow needed).

## Progress / evidence
- 2026-10-16: Repo `tonk-solutions/tonk-handbook` created (private, default branch `main`). Published: `41bbf7a` (README + comercial), `2bd9023` (procesos ×4), `95f933a` (seguridad). Jira: TL-12/16/21 moved to "En curso" with evidence comments (11796–11798). Pending on the founders' side: price sign-off (TL-12), process review (TL-16), policy signatures (TL-21).
