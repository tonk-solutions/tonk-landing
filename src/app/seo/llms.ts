/**
 * Builder puro para /llms.txt.
 *
 * No depende de next-intl ni de React: recibe los mensajes por parámetro para
 * poder testearlo sin montar el runtime de Next.js. `buildLlmsInput` es la
 * única traducción de messages → builder, así la ruta y los tests no pueden
 * divergir. El formato sigue https://llmstxt.org/ (H1, resumen en blockquote,
 * secciones H2 con enlaces).
 */

import { CONTACT_EMAIL, CONTACT_PHONE, SITE_NAME, SITE_URL, WHATSAPP_URL } from "../constants";
import {
  SERVICES_CATALOG,
  pickServiceContent,
  type ServiceBranch,
  type ServiceContent,
} from "../services/catalog";

/** Idioma del archivo canónico: el por defecto del sitio (`es`). */
const LLMS_LOCALE = "es";

export interface LlmsFounder {
  name: string;
  role: string;
  linkedin: string;
}

export interface LlmsService {
  title: string;
  description: string;
  url: string;
}

export interface LlmsProject {
  name: string;
  type: string;
}

export interface LlmsCopy {
  languageNote: string;
  intro: string;
  foundersHeading: string;
  stackHeading: string;
  cloudLabel: string;
  integrationsLabel: string;
  servicesHeading: string;
  projectsHeading: string;
  contactHeading: string;
  linksHeading: string;
  emailLabel: string;
  whatsappLabel: string;
  locationLabel: string;
  cloud: string[];
  homeEs: string;
  homeEn: string;
}

export interface LlmsInput {
  siteName: string;
  siteUrl: string;
  contactEmail: string;
  contactPhone: string;
  whatsappUrl: string;
  location: string;
  copy: LlmsCopy;
  founders: LlmsFounder[];
  services: LlmsService[];
  projects: LlmsProject[];
  integrations: string[];
}

/** Subconjunto de `messages/{locale}.json` que alimenta el archivo canónico. */
export interface LlmsMessages {
  team: { members: LlmsFounder[] };
  services: {
    craft: { services: ServiceContent[] };
    talent: { services: ServiceContent[] };
  };
  projects: { items: LlmsProject[] };
  integrations: { platforms: string[] };
  footer: { location: string };
  llms: LlmsCopy;
}

/**
 * Arma el input del builder desde los mensajes de un locale. Único punto de
 * cableado: lo usan la ruta `/llms.txt` y sus tests.
 */
export function buildLlmsInput(messages: LlmsMessages): LlmsInput {
  const servicesByBranch: Record<ServiceBranch, ServiceContent[]> = {
    craft: messages.services.craft.services,
    talent: messages.services.talent.services,
  };

  const services = SERVICES_CATALOG.map((entry) => {
    const content = pickServiceContent(servicesByBranch, entry);
    return {
      title: content.title,
      description: content.description,
      url: `${SITE_URL}/${LLMS_LOCALE}/services/${entry.slug}`,
    };
  });

  return {
    siteName: SITE_NAME,
    siteUrl: SITE_URL,
    contactEmail: CONTACT_EMAIL,
    contactPhone: CONTACT_PHONE,
    whatsappUrl: WHATSAPP_URL,
    location: messages.footer.location,
    copy: messages.llms,
    founders: messages.team.members,
    services,
    projects: messages.projects.items,
    integrations: messages.integrations.platforms,
  };
}

function joinList(items: string[]): string {
  return items.map((item) => `- ${item}`).join("\n");
}

export function buildLlmsTxt(input: LlmsInput): string {
  const foundersList = input.founders
    .map((founder) => `- ${founder.name} — ${founder.role} (${founder.linkedin})`)
    .join("\n");

  const servicesList = input.services
    .map((service) => `- [${service.title}](${service.url}): ${service.description}`)
    .join("\n");
  const projectsList = joinList(
    input.projects.map((project) => `${project.name} — ${project.type}`),
  );
  const integrationsList = joinList(input.integrations);

  return `# ${input.siteName}

> ${input.copy.intro}

${input.copy.languageNote.replace("{url}", `${input.siteUrl}/en`)}

## ${input.copy.foundersHeading}

${foundersList}

## ${input.copy.stackHeading}

${input.copy.cloudLabel}: ${input.copy.cloud.join(", ")}

${input.copy.integrationsLabel}:

${integrationsList}

## ${input.copy.servicesHeading}

${servicesList}

## ${input.copy.projectsHeading}

${projectsList}

## ${input.copy.contactHeading}

- ${input.copy.emailLabel}: ${input.contactEmail}
- ${input.copy.whatsappLabel}: ${input.contactPhone} (${input.whatsappUrl})
- ${input.copy.locationLabel}: ${input.location}

## ${input.copy.linksHeading}

- ${input.copy.homeEs}: ${input.siteUrl}/es
- ${input.copy.homeEn}: ${input.siteUrl}/en
`;
}
