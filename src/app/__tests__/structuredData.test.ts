import { describe, expect, it } from "vitest";
import { buildStructuredDataGraph } from "../seo/structuredData";

interface PersonNode {
  "@type": "Person";
  name: string;
  jobTitle: string;
  sameAs: string;
}

interface OrganizationNode {
  "@type": "Organization";
  knowsAbout: string[];
  founder: PersonNode[];
}

const BASE_INPUT = {
  locale: "es",
  organization: {
    description: "Consultora de ingeniería de software senior en Buenos Aires.",
    slogan: "Integraciones enterprise complejas, y producto desde cero.",
    foundingDate: "2026",
    addressLocality: "Buenos Aires",
    addressCountry: "AR",
    linkedinUrl: "https://www.linkedin.com/company/tonk-solutions",
    instagramUrl: "https://www.instagram.com/tonk_solutions",
    founders: [
      {
        name: "Matías Castillo",
        role: "Co-Founder · Financial Systems Lead",
        linkedin:
          "https://www.linkedin.com/in/matias-agustin-castillo-98b332115/",
      },
      {
        name: "Nicolás Gómez",
        role: "Co-Founder · Core Banking",
        linkedin: "https://www.linkedin.com/in/nicolas-gomez-467b26141/",
      },
      {
        name: "Rodrigo Hernandez",
        role: "Co-Founder · Platform Engineering",
        linkedin: "https://www.linkedin.com/in/rodrigoenzohernandez/",
      },
    ],
  },
  website: {
    inLanguage: "es-AR",
  },
  servicesList: {
    name: "Servicios de Ingeniería de Software",
    description: "Servicios especializados de consultoría.",
    servicesByBranch: {
      craft: [
        { title: "Integraciones y Sistemas Enterprise", description: "Conectamos sistemas.", icon: "FileText" },
        { title: "Productos desde Cero", description: "Construimos productos.", icon: "Code" },
        { title: "Arquitectura y Sistemas Distribuidos", description: "Diseñamos arquitecturas.", icon: "Cloud" },
        { title: "IA Aplicada", description: "Incorporamos IA.", icon: "BrainCircuit" },
      ],
      talent: [
        { title: "Búsqueda y Selección Técnica", description: "Identificamos ingenieros.", icon: "Users" },
        { title: "Proceso Apoyado en IA", description: "Usamos IA.", icon: "Sparkles" },
        { title: "Onboarding e Integración", description: "Acompañamos.", icon: "UserCheck" },
      ],
    },
  },
};

describe("buildStructuredDataGraph", () => {
  it("declara founder con exactamente tres Person", () => {
    const graph = buildStructuredDataGraph(BASE_INPUT);
    const organization = graph["@graph"].find(
      (node) => node["@type"] === "Organization",
    ) as OrganizationNode | undefined;

    expect(organization).toBeDefined();
    expect(Array.isArray(organization!.founder)).toBe(true);
    expect(organization!.founder).toHaveLength(3);
    expect(organization!.founder.map((person) => person["@type"])).toEqual([
      "Person",
      "Person",
      "Person",
    ]);
  });

  it("los founders tienen nombre, jobTitle y sameAs correctos", () => {
    const graph = buildStructuredDataGraph(BASE_INPUT);
    const organization = graph["@graph"].find(
      (node) => node["@type"] === "Organization",
    ) as OrganizationNode | undefined;

    expect(organization!.founder.map((person) => person.name)).toEqual([
      "Matías Castillo",
      "Nicolás Gómez",
      "Rodrigo Hernandez",
    ]);
    expect(organization!.founder.map((person) => person.jobTitle)).toEqual([
      "Co-Founder · Financial Systems Lead",
      "Co-Founder · Core Banking",
      "Co-Founder · Platform Engineering",
    ]);
    expect(
      organization!.founder.every((person) => person.sameAs.length > 0),
    ).toBe(true);
  });

  it("no menciona a Ignacio Sileo en el grafo serializado", () => {
    const graph = buildStructuredDataGraph(BASE_INPUT);
    const json = JSON.stringify(graph);

    expect(json).not.toMatch(/Ignacio/i);
    expect(json).not.toMatch(/Sileo/i);
  });

  it("knowsAbout incluye AWS, Google Cloud y Firebase", () => {
    const graph = buildStructuredDataGraph(BASE_INPUT);
    const organization = graph["@graph"].find(
      (node) => node["@type"] === "Organization",
    ) as OrganizationNode | undefined;

    expect(organization!.knowsAbout).toContain("AWS");
    expect(organization!.knowsAbout).toContain("Google Cloud");
    expect(organization!.knowsAbout).toContain("Firebase");
  });
});
