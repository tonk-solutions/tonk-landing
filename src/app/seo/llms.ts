/**
 * Builder puro para /llms.txt.
 *
 * No depende de next-intl ni de React: recibe todos los datos por parámetro
 * para poder testearlo sin montar el runtime de Next.js. El formato sigue
 * la propuesta de https://llmstxt.org/ (título H1, resumen en blockquote,
 * secciones H2).
 */

export interface LlmsFounder {
  name: string;
  role: string;
  linkedin: string;
}

export interface LlmsService {
  title: string;
}

export interface LlmsProject {
  name: string;
  type: string;
}

export interface LlmsCopy {
  languageNote: string;
  intro: string;
  foundersHeading: string;
  foundersNote: string;
  stackHeading: string;
  cloudLabel: string;
  integrationsLabel: string;
  servicesHeading: string;
  projectsHeading: string;
  contactHeading: string;
  linksHeading: string;
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
  seoDescription: string;
  location: string;
  copy: LlmsCopy;
  founders: LlmsFounder[];
  services: LlmsService[];
  projects: LlmsProject[];
  integrations: string[];
}

function joinList(items: string[]): string {
  return items.map((item) => `- ${item}`).join("\n");
}

export function buildLlmsTxt(input: LlmsInput): string {
  const foundersList = input.founders
    .map((founder) => `- ${founder.name} — ${founder.role} (${founder.linkedin})`)
    .join("\n");

  const servicesList = joinList(input.services.map((service) => service.title));
  const projectsList = joinList(
    input.projects.map((project) => `${project.name} — ${project.type}`),
  );
  const integrationsList = joinList(input.integrations);

  return `# ${input.siteName}

> ${input.copy.intro} ${input.seoDescription}

${input.copy.languageNote}

## ${input.copy.foundersHeading}

${input.copy.foundersNote}

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

- Email: ${input.contactEmail}
- WhatsApp: ${input.contactPhone} (${input.whatsappUrl})
- Ubicación: ${input.location}

## ${input.copy.linksHeading}

- ${input.copy.homeEs}: ${input.siteUrl}/es
- ${input.copy.homeEn}: ${input.siteUrl}/en
`;
}
