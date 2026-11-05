/**
 * Single source of truth for the services Tonk Solutions offers.
 *
 * The English `slug` is the stable, locale-independent URL segment used for
 * `/[locale]/services/[slug]`, the sitemap and the JSON-LD `Service` nodes.
 * The actual copy (title/description) lives in `messages/{locale}.json`
 * under `services.<branch>.services[messageIndex]`; this catalog only
 * describes which entry that is, so translators keep owning the wording.
 */

import type { ServiceGroup } from "@/app/[locale]/components/home/ServicesAccordion";

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
  { slug: "enterprise-integrations", branch: "craft", icon: "FileText", messageIndex: 0 },
  { slug: "digital-product-development", branch: "craft", icon: "Code", messageIndex: 1 },
  { slug: "distributed-systems-architecture", branch: "craft", icon: "Cloud", messageIndex: 2 },
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

/** Raised when the messages for a locale do not match the catalog. */
export class ServiceContentMissingError extends Error {
  constructor(entry: ServiceCatalogEntry, reason: string) {
    super(
      `Missing content for service "${entry.slug}" at services.${entry.branch}.services[${entry.messageIndex}]: ${reason}`
    );
    this.name = "ServiceContentMissingError";
  }
}

/**
 * Resolves the translated content for a catalog entry given the raw
 * `services.<branch>.services` arrays for one locale (e.g. from
 * `t.raw('craft.services')` / `t.raw('talent.services')`).
 *
 * Throws `ServiceContentMissingError` when the entry is absent or has an
 * empty title/description, so a catalog/messages drift fails loudly at
 * build time instead of rendering broken pages.
 */
export function pickServiceContent(
  servicesByBranch: Record<ServiceBranch, ServiceContent[]>,
  entry: ServiceCatalogEntry
): ServiceContent {
  const branchServices = servicesByBranch[entry.branch];
  if (!Array.isArray(branchServices)) {
    throw new ServiceContentMissingError(entry, "branch list is not an array");
  }

  const content = branchServices[entry.messageIndex];
  if (!content) {
    throw new ServiceContentMissingError(entry, "index out of range");
  }
  if (!content.title?.trim() || !content.description?.trim()) {
    throw new ServiceContentMissingError(entry, "empty title or description");
  }

  return content;
}

/** Accordion group as it arrives from the messages: no detail href yet. */
export interface ServiceGroupContent {
  label: string;
  subtitle: string;
  services: ServiceContent[];
}

/**
 * Adds the detail landing href to every service of one accordion group.
 *
 * The slug comes from `SERVICES_CATALOG` (branch + `messageIndex`), never from
 * the translated copy, so the URL is identical in both locales. Pure on
 * purpose: the server section and the tests must derive the links the same way.
 */
function withGroupHrefs(
  locale: string,
  group: ServiceGroupContent,
  branch: ServiceBranch
): ServiceGroup {
  return {
    ...group,
    services: group.services.map((service, messageIndex) => {
      const entry = SERVICES_CATALOG.find(
        (candidate) =>
          candidate.branch === branch && candidate.messageIndex === messageIndex
      );

      // A message without a catalog entry would render a broken link, so it
      // fails loudly here, like `pickServiceContent` does on the detail page.
      if (!entry) {
        throw new Error(
          `Missing catalog entry for services.${branch}.services[${messageIndex}]`
        );
      }

      return { ...service, href: `/${locale}/services/${entry.slug}` };
    }),
  };
}

/**
 * Builds the two accordion groups the home renders, each service linked to its
 * `/[locale]/services/[slug]` landing.
 */
export function withServiceHrefs(
  locale: string,
  craft: ServiceGroupContent,
  talent: ServiceGroupContent
): { craft: ServiceGroup; talent: ServiceGroup } {
  return {
    craft: withGroupHrefs(locale, craft, "craft"),
    talent: withGroupHrefs(locale, talent, "talent"),
  };
}
