/**
 * Single source of truth for the services Tonk Solutions offers.
 *
 * The English `slug` is the stable, locale-independent URL segment used for
 * `/[locale]/services/[slug]`, the sitemap and the JSON-LD `Service` nodes.
 * The actual copy (title/description) lives in `messages/{locale}.json`
 * under `services.<branch>.services[messageIndex]`; this catalog only
 * describes which entry that is, so translators keep owning the wording.
 */

export type ServiceBranch = "craft" | "talent";

export interface ServiceCatalogEntry {
  slug: string;
  branch: ServiceBranch;
  /** lucide-react icon name; must match the `iconMap` used in the UI. */
  icon: string;
  /** Index of this entry inside `services.<branch>.services` in messages. */
  messageIndex: number;
}

export interface ServiceContent {
  title: string;
  description: string;
  icon: string;
}

export const SERVICE_BRANCHES: ServiceBranch[] = ["craft", "talent"];

export const SERVICES_CATALOG: ServiceCatalogEntry[] = [
  { slug: "digital-product-development", branch: "craft", icon: "Code", messageIndex: 0 },
  { slug: "distributed-systems-architecture", branch: "craft", icon: "Cloud", messageIndex: 1 },
  { slug: "enterprise-integrations", branch: "craft", icon: "FileText", messageIndex: 2 },
  { slug: "applied-ai", branch: "craft", icon: "BrainCircuit", messageIndex: 3 },
  { slug: "technical-recruitment", branch: "talent", icon: "Users", messageIndex: 0 },
  { slug: "ai-assisted-hiring", branch: "talent", icon: "Sparkles", messageIndex: 1 },
  { slug: "onboarding-integration", branch: "talent", icon: "UserCheck", messageIndex: 2 },
];

export function getServiceEntry(slug: string): ServiceCatalogEntry | undefined {
  return SERVICES_CATALOG.find((entry) => entry.slug === slug);
}

export function getServiceSlugs(): string[] {
  return SERVICES_CATALOG.map((entry) => entry.slug);
}

/**
 * Resolves the translated content for a catalog entry given the raw
 * `services.<branch>.services` arrays for one locale (e.g. from
 * `t.raw('craft.services')` / `t.raw('talent.services')`).
 */
export function pickServiceContent(
  servicesByBranch: Record<ServiceBranch, ServiceContent[]>,
  entry: ServiceCatalogEntry
): ServiceContent {
  return servicesByBranch[entry.branch][entry.messageIndex];
}
