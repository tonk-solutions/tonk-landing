import { CONTACT_EMAIL, CONTACT_PHONE, SITE_NAME, SITE_URL } from "../constants";
import {
  SERVICES_CATALOG,
  pickServiceContent,
  type ServiceBranch,
  type ServiceContent,
} from "../services/catalog";

export interface FounderInfo {
  name: string;
  role: string;
  linkedin: string;
  /** Solo los co-founders se publican como `Organization.founder`. */
  founder: boolean;
}

export interface OrganizationInfo {
  description: string;
  slogan: string;
  foundingDate: string;
  addressLocality: string;
  addressCountry: string;
  linkedinUrl: string;
  instagramUrl: string;
  founders: FounderInfo[];
}

export interface WebsiteInfo {
  inLanguage: string;
}

export interface ServicesListInfo {
  name: string;
  description: string;
  servicesByBranch: Record<ServiceBranch, ServiceContent[]>;
}

export interface StructuredDataInput {
  locale: string;
  organization: OrganizationInfo;
  website: WebsiteInfo;
  servicesList: ServicesListInfo;
}

/**
 * Deriva los founders desde `team.members` de los mensajes. Valida la forma para
 * que un rename o un campo faltante rompa el render en vez de emitir un
 * `founder` vacío o con `undefined` en el JSON-LD.
 */
export function pickFounders(members: unknown): FounderInfo[] {
  if (!Array.isArray(members)) {
    throw new Error("team.members tiene que ser un array para armar founder en el JSON-LD");
  }

  return members.map((member, index) => {
    const { name, role, linkedin, founder } = (member ?? {}) as Partial<FounderInfo>;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof role !== "string" ||
      !role.trim() ||
      typeof linkedin !== "string" ||
      !/^https?:\/\//.test(linkedin)
    ) {
      throw new Error(
        `team.members[${index}] necesita name, role y linkedin válidos para el JSON-LD`,
      );
    }

    return { name, role, linkedin, founder: founder === true };
  });
}

const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const SERVICES_LIST_ID = `${SITE_URL}/#services`;

const KNOWS_ABOUT = [
  "Financial Software Engineering",
  "Systemic Continuity",
  "Core Banking Systems",
  "Microservices Migration",
  "Cloud-Native Architecture",
  "ERP Modernization",
  "Legacy System Modernization",
  "Technical Debt Resolution",
  "Distributed Systems",
  "Enterprise AI",
  "AWS",
  "Google Cloud",
  "Firebase",
];

/**
 * Builds a single `@graph` combining Organization, WebSite and an ItemList
 * of Service nodes, replacing the previous four overlapping JSON-LD blocks
 * (which duplicated Service/Offer nodes and included an invented
 * `priceRange`). Pure function: all copy comes from the caller so this
 * module has no dependency on next-intl or React.
 */
export function buildStructuredDataGraph(input: StructuredDataInput) {
  const organizationNode = {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    description: input.organization.description,
    foundingDate: input.organization.foundingDate,
    areaServed: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: -34.6037,
        longitude: -58.3816,
      },
      description: "Latin America",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: input.organization.addressLocality,
      addressCountry: input.organization.addressCountry,
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: CONTACT_EMAIL,
      telephone: CONTACT_PHONE,
      contactType: "sales",
      availableLanguage: ["Spanish", "English"],
    },
    sameAs: [input.organization.linkedinUrl, input.organization.instagramUrl].filter(Boolean),
    knowsAbout: KNOWS_ABOUT,
    slogan: input.organization.slogan,
    email: CONTACT_EMAIL,
    founder: input.organization.founders
      .filter((founder) => founder.founder)
      .map((founder) => ({
        "@type": "Person",
        name: founder.name,
        jobTitle: founder.role,
        sameAs: [founder.linkedin],
      })),
  };

  const websiteNode = {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    publisher: { "@id": ORGANIZATION_ID },
    description: input.organization.description,
    inLanguage: input.website.inLanguage,
  };

  const servicesListNode = {
    "@type": "ItemList",
    "@id": SERVICES_LIST_ID,
    name: input.servicesList.name,
    description: input.servicesList.description,
    itemListElement: SERVICES_CATALOG.map((entry, index) => {
      const content = pickServiceContent(input.servicesList.servicesByBranch, entry);
      return {
        "@type": "Service",
        "@id": serviceNodeId(input.locale, entry.slug),
        position: index + 1,
        name: content.title,
        description: content.description,
        provider: { "@id": ORGANIZATION_ID },
        areaServed: "Latin America",
        url: servicePageUrl(input.locale, entry.slug),
      };
    }),
  };

  return {
    "@context": "https://schema.org",
    "@graph": [organizationNode, websiteNode, servicesListNode],
  };
}

function servicePageUrl(locale: string, slug: string): string {
  return `${SITE_URL}/${locale}/services/${slug}`;
}

/**
 * Id compartido por el `Service` del ItemList y el `Service` de la página de
 * detalle: para un consumidor son la misma entidad, no dos.
 */
function serviceNodeId(locale: string, slug: string): string {
  return `${servicePageUrl(locale, slug)}#service`;
}

interface WebPageInput {
  pageUrl: string;
  name: string;
  description: string;
  inLanguage: string;
}

function buildWebPageNode(input: WebPageInput) {
  return {
    "@type": "WebPage",
    "@id": `${input.pageUrl}#webpage`,
    url: input.pageUrl,
    name: input.name,
    description: input.description,
    inLanguage: input.inLanguage,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORGANIZATION_ID },
  };
}

/**
 * Grafo de la home: solo el `WebPage` propio. La Organization, el WebSite y los
 * founders ya viajan en el grafo del layout y se enlazan por `@id`.
 */
export function buildHomePageGraph(input: {
  locale: string;
  name: string;
  description: string;
  inLanguage: string;
}) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      buildWebPageNode({
        pageUrl: `${SITE_URL}/${input.locale}`,
        name: input.name,
        description: input.description,
        inLanguage: input.inLanguage,
      }),
    ],
  };
}

/**
 * Grafo del detalle de servicio: `WebPage` + `Service` + `BreadcrumbList`
 * enlazados por `@id` al grafo del layout. El `Service` usa el nombre del
 * catálogo —el mismo del ItemList, para no publicar dos entidades
 * contradictorias— y el `WebPage` usa el título SEO de la página.
 */
export function buildServicePageGraph(input: {
  locale: string;
  slug: string;
  pageName: string;
  pageDescription: string;
  serviceName: string;
  serviceDescription: string;
  inLanguage: string;
  siteName: string;
  servicesLabel: string;
}) {
  const pageUrl = servicePageUrl(input.locale, input.slug);
  const homeUrl = `${SITE_URL}/${input.locale}`;
  const serviceId = serviceNodeId(input.locale, input.slug);
  const breadcrumbId = `${pageUrl}#breadcrumb`;

  const webPage = {
    ...buildWebPageNode({
      pageUrl,
      name: input.pageName,
      description: input.pageDescription,
      inLanguage: input.inLanguage,
    }),
    breadcrumb: { "@id": breadcrumbId },
    mainEntity: { "@id": serviceId },
  };

  const service = {
    "@type": "Service",
    "@id": serviceId,
    name: input.serviceName,
    description: input.serviceDescription,
    url: pageUrl,
    provider: { "@id": ORGANIZATION_ID },
    areaServed: "Latin America",
  };

  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id": breadcrumbId,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: input.siteName, item: homeUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: input.servicesLabel,
        item: `${homeUrl}#s03`,
      },
      { "@type": "ListItem", position: 3, name: input.pageName, item: pageUrl },
    ],
  };

  return {
    "@context": "https://schema.org",
    "@graph": [webPage, service, breadcrumb],
  };
}
