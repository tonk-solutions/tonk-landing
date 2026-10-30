/**
 * Builders puros de los artefactos LLMO: `/llms.txt` y `/llms-full.txt`.
 *
 * No dependen de next-intl ni de React: reciben los mensajes por parámetro para
 * poder testearlos sin montar el runtime de Next.js. `buildLlmsInput` es la
 * única traducción de messages → builders, así las rutas y los tests no pueden
 * divergir. El formato de `/llms.txt` sigue https://llmstxt.org/ (H1, resumen en
 * blockquote, secciones H2 con enlaces) y el locale canónico es el por defecto.
 */

import { CONTACT_PHONE, SITE_NAME, SITE_URL, WHATSAPP_URL } from "../constants";
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
  bio: string;
  /** Solo los co-founders entran en la sección de equipo fundador. */
  founder?: boolean;
}

export interface LlmsService {
  title: string;
  description: string;
  url: string;
}

export interface LlmsProject {
  name: string;
  type: string;
  description: string;
  stack: string;
}

export interface LlmsLabeledValue {
  label: string;
  value: string;
}

export interface LlmsStep {
  title: string;
  description: string;
}

export interface LlmsPillar {
  title: string;
  description: string;
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

/**
 * Títulos de sección del documento completo. Salen de los labels que ya existen
 * en `messages`, sin agregar copy nuevo.
 */
export interface LlmsHeadings {
  diagnostic: string;
  process: string;
  criterio: string;
  team: string;
  evidenceLabel: string;
  missionLabel: string;
}

export interface LlmsCriterio {
  principles: string[];
  companies: string[];
  mission: string;
  pillars: LlmsPillar[];
}

export interface LlmsInput {
  siteName: string;
  siteUrl: string;
  contactEmail: string;
  contactPhone: string;
  whatsappUrl: string;
  location: string;
  copy: LlmsCopy;
  headings: LlmsHeadings;
  founders: LlmsFounder[];
  services: LlmsService[];
  projects: LlmsProject[];
  integrations: string[];
  hero: { title: string; lede: string };
  diagnostic: LlmsLabeledValue[];
  process: LlmsStep[];
  criterio: LlmsCriterio;
  contactRows: LlmsLabeledValue[];
}

/** Subconjunto de `messages/{locale}.json` que alimenta los dos artefactos. */
export interface LlmsMessages {
  hero: { titleLine1: string; titleLine2: string; lede: string };
  llms: LlmsCopy;
  team: { label: string; members: LlmsFounder[] };
  services: {
    craft: { services: ServiceContent[] };
    talent: { services: ServiceContent[] };
  };
  projects: { items: LlmsProject[] };
  integrations: { platforms: string[] };
  diagnostic: { label: string; rows: LlmsLabeledValue[] };
  process: { label: string; steps: LlmsStep[] };
  criterio: {
    label: string;
    principles: string[];
    companies: string[];
    evidenceLabel: string;
    missionLabel: string;
    mission: string;
    pillars: LlmsPillar[];
  };
  contact: { rows: LlmsLabeledValue[] };
}

function digits(value: string): string {
  return value.replace(/\D/g, "");
}

const CONTACT_PHONE_DIGITS = digits(CONTACT_PHONE);

export interface LlmsContact {
  /** Filas de `contact.rows` con el WhatsApp resuelto a su URL de wa.me. */
  rows: LlmsLabeledValue[];
  email: string;
  phone: string;
  location: string;
}

/**
 * Los tres datos de contacto salen de `contact.rows` y se reconocen por valor, no
 * por posición: el teléfono es la fila cuyos dígitos coinciden con
 * `CONTACT_PHONE`, el correo la que tiene `@` y la ubicación la restante. Así
 * `llms.txt` publica el mismo texto que la landing y no una versión formateada
 * aparte.
 */
export function resolveContact(messages: LlmsMessages): LlmsContact {
  const { rows } = messages.contact;
  const emailRow = rows.find((row) => row.value.includes("@"));
  const phoneRow = rows.find((row) => digits(row.value) === CONTACT_PHONE_DIGITS);
  const locationRow = rows.find((row) => row !== emailRow && row !== phoneRow);

  if (!emailRow || !phoneRow || !locationRow) {
    throw new Error(
      "llms: contact.rows tiene que traer correo, teléfono y ubicación distinguibles",
    );
  }

  return {
    rows: rows.map((row) =>
      row === phoneRow ? { label: row.label, value: WHATSAPP_URL } : row,
    ),
    email: emailRow.value,
    phone: phoneRow.value,
    location: locationRow.value,
  };
}

/**
 * Arma el input de los builders desde los mensajes de un locale. Único punto de
 * cableado: lo usan las dos rutas y sus tests.
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

  const contact = resolveContact(messages);

  return {
    siteName: SITE_NAME,
    siteUrl: SITE_URL,
    contactEmail: contact.email,
    contactPhone: contact.phone,
    whatsappUrl: WHATSAPP_URL,
    location: contact.location,
    copy: messages.llms,
    headings: {
      diagnostic: messages.diagnostic.label,
      process: messages.process.label,
      criterio: messages.criterio.label,
      team: messages.team.label,
      evidenceLabel: messages.criterio.evidenceLabel,
      missionLabel: messages.criterio.missionLabel,
    },
    founders: messages.team.members.filter((member) => member.founder),
    services,
    projects: messages.projects.items,
    integrations: messages.integrations.platforms,
    hero: {
      title: `${messages.hero.titleLine1} ${messages.hero.titleLine2}`,
      lede: messages.hero.lede,
    },
    diagnostic: messages.diagnostic.rows,
    process: messages.process.steps,
    criterio: {
      principles: messages.criterio.principles,
      companies: messages.criterio.companies,
      mission: messages.criterio.mission,
      pillars: messages.criterio.pillars,
    },
    contactRows: contact.rows,
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

/**
 * `/llms-full.txt`: la landing completa en Markdown para que un modelo no tenga
 * que rastrear el sitio. Mismo `LlmsInput` que `/llms.txt`, así que el copy sale
 * de un solo lugar.
 */
export function buildLlmsFullTxt(input: LlmsInput): string {
  const { copy, headings } = input;

  const lines: string[] = [
    `# ${input.siteName}`,
    "",
    `> ${copy.intro}`,
    "",
    `**${input.hero.title}**`,
    "",
    input.hero.lede,
    "",
    `## ${copy.stackHeading}`,
    "",
    `${copy.cloudLabel}: ${copy.cloud.join(", ")}`,
    "",
    `${copy.integrationsLabel}: ${input.integrations.join(", ")}`,
    "",
    `## ${copy.servicesHeading}`,
    "",
    ...input.services.flatMap((service) => [
      `### ${service.title}`,
      "",
      service.description,
      "",
      service.url,
      "",
    ]),
    `## ${copy.projectsHeading}`,
    "",
    ...input.projects.flatMap((project) => [
      `### ${project.name}`,
      "",
      project.type,
      "",
      project.description,
      "",
      project.stack,
      "",
    ]),
    `## ${headings.diagnostic}`,
    "",
    ...input.diagnostic.map((row) => `- **${row.label}:** ${row.value}`),
    "",
    `## ${headings.process}`,
    "",
    ...input.process.map((step, index) => `${index + 1}. **${step.title}** — ${step.description}`),
    "",
    `## ${headings.criterio}`,
    "",
    ...input.criterio.principles.map((principle) => `- ${principle}`),
    "",
    `**${headings.evidenceLabel}:** ${input.criterio.companies.join(", ")}`,
    "",
    `**${headings.missionLabel}:** ${input.criterio.mission}`,
    "",
    ...input.criterio.pillars.flatMap((pillar) => [
      `### ${pillar.title}`,
      "",
      pillar.description,
      "",
    ]),
    `## ${headings.team}`,
    "",
    ...input.founders.flatMap((founder) => [
      `### ${founder.name}`,
      "",
      `**${founder.role}**`,
      "",
      founder.bio,
      "",
      founder.linkedin,
      "",
    ]),
    `## ${copy.contactHeading}`,
    "",
    ...input.contactRows.map((row) => `- **${row.label}:** ${row.value}`),
    "",
    `## ${copy.linksHeading}`,
    "",
    `- ${copy.homeEs}: ${input.siteUrl}/es`,
    `- ${copy.homeEn}: ${input.siteUrl}/en`,
    "",
  ];

  return lines.join("\n");
}
