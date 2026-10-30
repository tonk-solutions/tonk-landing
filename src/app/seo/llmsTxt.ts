import { CONTACT_PHONE, SITE_NAME, SITE_URL, WHATSAPP_URL } from "../constants";
import {
  SERVICES_CATALOG,
  pickServiceContent,
  type ServiceContent,
} from "../services/catalog";

/**
 * `llms.txt` es el índice curado que los modelos leen antes de rastrear el
 * sitio, y `llms-full.txt` el documento completo. Los dos se generan desde
 * `messages/{locale}.json` y `services/catalog.ts`: acá no hay copy nuevo, solo
 * formato. Módulo puro (sin next-intl ni React) para que los tests lo llamen
 * con los mensajes reales.
 */

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

export interface LlmsProject {
  name: string;
  type: string;
  description: string;
  stack: string;
}

export interface LlmsMember {
  name: string;
  role: string;
  bio: string;
  linkedin: string;
}

export interface LlmsService {
  slug: string;
  title: string;
  description: string;
}

/**
 * Subconjunto de `messages/{locale}.json` que consumen los generadores. Solo
 * las claves que realmente se publican, para que un cambio de copy ajeno a
 * `llms.txt` no rompa el build.
 */
export interface LlmsMessages {
  seo: { titleDefault: string; description: string };
  hero: { titleLine1: string; titleLine2: string; lede: string };
  integrations: { label: string; platforms: string[] };
  services: {
    label: string;
    craft: { services: ServiceContent[] };
    talent: { services: ServiceContent[] };
  };
  projects: { label: string; items: LlmsProject[] };
  diagnostic: { label: string; rows: LlmsLabeledValue[] };
  process: { label: string; steps: LlmsStep[] };
  criterio: {
    label: string;
    intro: string;
    principles: string[];
    companies: string[];
    evidenceLabel: string;
    missionLabel: string;
    mission: string;
    pillars: LlmsPillar[];
  };
  team: { label: string; members: LlmsMember[] };
  contact: { label: string; rows: LlmsLabeledValue[] };
}

/** Contenido de un locale, ya resuelto contra el catálogo de servicios. */
export interface LlmsLocaleContent {
  locale: string;
  siteTitle: string;
  siteDescription: string;
  email: string;
  phone: string;
  location: string;
  hero: { title: string; lede: string };
  sections: {
    integrations: string;
    services: string;
    projects: string;
    diagnostic: string;
    process: string;
    criterio: string;
    team: string;
    contact: string;
  };
  integrations: string[];
  services: LlmsService[];
  projects: LlmsProject[];
  diagnostic: LlmsLabeledValue[];
  process: LlmsStep[];
  criterio: {
    intro: string;
    principles: string[];
    companies: string[];
    evidenceLabel: string;
    missionLabel: string;
    mission: string;
    pillars: LlmsPillar[];
  };
  team: LlmsMember[];
  contact: LlmsLabeledValue[];
}

/** Servicios del catálogo con el copy del locale, en el orden del catálogo. */export function resolveServices(messages: LlmsMessages): LlmsService[] {
  const servicesByBranch = {
    craft: messages.services.craft.services,
    talent: messages.services.talent.services,
  };

  return SERVICES_CATALOG.map((entry) => {
    const content = pickServiceContent(servicesByBranch, entry);
    return { slug: entry.slug, title: content.title, description: content.description };
  });
}

/** Adapta los mensajes crudos de un locale al contenido que publican los generadores. */
export function buildLlmsLocaleContent(
  locale: string,
  messages: LlmsMessages
): LlmsLocaleContent {
  const contact = resolveContact(messages);

  return {
    locale,
    siteTitle: messages.seo.titleDefault,
    siteDescription: messages.seo.description,
    email: contact.email,
    phone: contact.phone,
    location: contact.location,
    hero: {
      title: `${messages.hero.titleLine1} ${messages.hero.titleLine2}`,
      lede: messages.hero.lede,
    },
    sections: {
      integrations: messages.integrations.label,
      services: messages.services.label,
      projects: messages.projects.label,
      diagnostic: messages.diagnostic.label,
      process: messages.process.label,
      criterio: messages.criterio.label,
      team: messages.team.label,
      contact: messages.contact.label,
    },
    integrations: messages.integrations.platforms,
    services: resolveServices(messages),
    projects: messages.projects.items,
    diagnostic: messages.diagnostic.rows,
    process: messages.process.steps,
    criterio: {
      intro: messages.criterio.intro,
      principles: messages.criterio.principles,
      companies: messages.criterio.companies,
      evidenceLabel: messages.criterio.evidenceLabel,
      missionLabel: messages.criterio.missionLabel,
      mission: messages.criterio.mission,
      pillars: messages.criterio.pillars,
    },
    team: messages.team.members,
    contact: contact.rows,
  };
}

function absolute(path: string): string {
  return `${SITE_URL}${path}`;
}

function digits(value: string): string {
  return value.replace(/\D/g, "");
}

const CONTACT_PHONE_DIGITS = digits(CONTACT_PHONE);

export interface LlmsContact {
  /** Viñetas de S1: correo, WhatsApp con la URL de wa.me y ubicación. */
  rows: LlmsLabeledValue[];
  email: string;
  phone: string;
  location: string;
}

/**
 * Los tres datos de contacto salen de `contact.rows` y se reconocen por valor, no
 * por posición: el teléfono es la fila cuyos dígitos coinciden con `CONTACT_PHONE`,
 * el correo la que tiene `@` y la ubicación la restante. La fila de WhatsApp se
 * publica con la URL de `wa.me`, que es la que un modelo puede accionar, así que
 * nunca aparecen dos viñetas con el mismo label.
 */
export function resolveContact(messages: LlmsMessages): LlmsContact {
  const { rows } = messages.contact;
  const emailRow = rows.find((row) => row.value.includes("@"));
  const phoneRow = rows.find((row) => digits(row.value) === CONTACT_PHONE_DIGITS);
  const locationRow = rows.find((row) => row !== emailRow && row !== phoneRow);

  if (!emailRow || !phoneRow || !locationRow) {
    throw new Error(
      "llms.txt: contact.rows debe traer correo, teléfono y ubicación distinguibles"
    );
  }

  return {
    rows: rows.map((row) =>
      row === phoneRow ? { label: row.label, value: WHATSAPP_URL } : row
    ),
    email: emailRow.value,
    phone: phoneRow.value,
    location: locationRow.value,
  };
}

function localeLabel(locale: string): string {
  return locale.toUpperCase();
}

/**
 * `/llms.txt`: índice curado. Resumen y datos de contacto salen del locale por
 * defecto; las páginas se listan en todos los idiomas; los servicios se listan
 * una sola vez, en el locale por defecto.
 */
export function buildLlmsTxt(
  contents: LlmsLocaleContent[],
  defaultLocale: string
): string {
  const primary = contents.find((content) => content.locale === defaultLocale) ?? contents[0];
  if (!primary) {
    throw new Error("llms.txt requires at least one locale");
  }

  const lines: string[] = [
    `# ${SITE_NAME}`,
    "",
    `> ${primary.siteDescription}`,
    "",
    [
      primary.location,
      contents.map((content) => localeLabel(content.locale)).join(" / "),
      primary.email,
      primary.phone,
    ].join(" · "),
    "",
    "## Páginas",
    "",
    ...contents.map(
      (content) =>
        `- [${SITE_NAME} (${content.locale})](${absolute(`/${content.locale}`)}): ${content.siteTitle}`
    ),
    "",
    `## ${primary.sections.services}`,
    "",
    ...primary.services.map(
      (service) =>
        `- [${service.title}](${absolute(`/${primary.locale}/services/${service.slug}`)}): ${service.description}`
    ),
    "",
    `## ${primary.sections.contact}`,
    "",
    ...primary.contact.map((row) => `- **${row.label}:** ${row.value}`),
    "",
    `## ${primary.sections.team}`,
    "",
    ...primary.team.map((member) => `- ${member.name} — ${member.role}`),
    "",
  ];

  return lines.join("\n");
}

/**
 * `/llms-full.txt`: el documento completo, un bloque por locale en el orden
 * recibido, separados por una regla horizontal.
 */
export function buildLlmsFullTxt(contents: LlmsLocaleContent[]): string {
  return contents.map(renderLocaleDocument).join("\n---\n\n");
}

function renderLocaleDocument(content: LlmsLocaleContent): string {
  const { sections } = content;

  const lines: string[] = [
    `# ${content.siteTitle}`,
    "",
    `> ${content.siteDescription}`,
    "",
    `**${content.hero.title}**`,
    "",
    content.hero.lede,
    "",
    `## ${sections.integrations}`,
    "",
    ...content.integrations.map((platform) => `- ${platform}`),
    "",
    `## ${sections.services}`,
    "",
    ...content.services.flatMap((service) => [
      `### ${service.title}`,
      "",
      service.description,
      "",
      absolute(`/${content.locale}/services/${service.slug}`),
      "",
    ]),
    `## ${sections.projects}`,
    "",
    ...content.projects.flatMap((project) => [
      `### ${project.name}`,
      "",
      project.type,
      "",
      project.description,
      "",
      `- **Stack:** ${project.stack}`,
      "",
    ]),
    `## ${sections.diagnostic}`,
    "",
    ...content.diagnostic.map((row) => `- **${row.label}:** ${row.value}`),
    "",
    `## ${sections.process}`,
    "",
    ...content.process.map((step, index) => `${index + 1}. **${step.title}** — ${step.description}`),
    "",
    `## ${sections.criterio}`,
    "",
    content.criterio.intro,
    "",
    ...content.criterio.principles.map((principle) => `- ${principle}`),
    "",
    `**${content.criterio.evidenceLabel}:** ${content.criterio.companies.join(", ")}`,
    "",
    `**${content.criterio.missionLabel}:** ${content.criterio.mission}`,
    "",
    ...content.criterio.pillars.flatMap((pillar) => [
      `### ${pillar.title}`,
      "",
      pillar.description,
      "",
    ]),
    `## ${sections.team}`,
    "",
    ...content.team.flatMap((member) => [
      `### ${member.name}`,
      "",
      `**${member.role}**`,
      "",
      member.bio,
      "",
      member.linkedin,
      "",
    ]),
    `## ${sections.contact}`,
    "",
    ...content.contact.map((row) => `- **${row.label}:** ${row.value}`),
    "",
  ];

  return lines.join("\n");
}
