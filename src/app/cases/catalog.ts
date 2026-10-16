/**
 * Case studies catalog.
 *
 * Currently empty: TL-6 fills it with real, authorized projects following the
 * §13 template fields (see `analisis-competencia-y-plan-de-accion.md`).
 * Pages that surface cases render nothing while this list is empty, so
 * publishing is content-only. Never add fabricated cases.
 */

export interface CaseStudy {
  slug: string;
  title: string;
  client: string;
  sector: string;
  challenge: string;
  solution: string;
  stack: string[];
  results: string[];
  testimonial?: string;
  deliveredAt: string;
  team: string[];
}

export const CASE_STUDIES: CaseStudy[] = [];
