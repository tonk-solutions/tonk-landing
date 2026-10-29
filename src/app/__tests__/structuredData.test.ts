import { describe, expect, it } from "vitest";
import { buildStructuredDataGraph, pickFounders } from "../seo/structuredData";
import messages from "../../../messages/es.json";

interface PersonNode {
  "@type": "Person";
  name: string;
  jobTitle: string;
  sameAs: string[];
}

interface OrganizationNode {
  "@type": "Organization";
  knowsAbout: string[];
  founder: PersonNode[];
}

// Los founders salen de los mensajes reales: si `team.members` cambia de forma,
// este test cae igual que el render (el e2e además mira el HTML servido).
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
    founders: pickFounders(messages.team.members),
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

function organizationOf(input: typeof BASE_INPUT): OrganizationNode {
  const graph = buildStructuredDataGraph(input);
  const organization = graph["@graph"].find((node) => node["@type"] === "Organization");

  expect(organization).toBeDefined();
  return organization as unknown as OrganizationNode;
}

describe("buildStructuredDataGraph", () => {
  it("declara founder con exactamente tres Person y los datos reales de team.members", () => {
    const organization = organizationOf(BASE_INPUT);

    expect(Array.isArray(organization.founder)).toBe(true);
    expect(organization.founder).toHaveLength(3);
    expect(organization.founder.map((person) => person["@type"])).toEqual([
      "Person",
      "Person",
      "Person",
    ]);
    expect(organization.founder.map((person) => person.name)).toEqual(
      messages.team.members.map((member) => member.name),
    );
    expect(organization.founder.map((person) => person.jobTitle)).toEqual(
      messages.team.members.map((member) => member.role),
    );
  });

  it("sameAs de cada founder es un array, igual que el del Organization", () => {
    const organization = organizationOf(BASE_INPUT);

    for (const person of organization.founder) {
      expect(Array.isArray(person.sameAs)).toBe(true);
      expect(person.sameAs).toHaveLength(1);
      expect(person.sameAs[0]).toMatch(/^https:\/\/www\.linkedin\.com\//);
    }
  });

  it("no menciona a Ignacio Sileo en el grafo serializado", () => {
    const json = JSON.stringify(buildStructuredDataGraph(BASE_INPUT));

    expect(json).not.toMatch(/Ignacio/i);
    expect(json).not.toMatch(/Sileo/i);
  });

  it("knowsAbout incluye AWS, Google Cloud y Firebase", () => {
    const organization = organizationOf(BASE_INPUT);

    expect(organization.knowsAbout).toContain("AWS");
    expect(organization.knowsAbout).toContain("Google Cloud");
    expect(organization.knowsAbout).toContain("Firebase");
  });
});

describe("pickFounders", () => {
  it("deriva los tres co-founders con LinkedIn desde team.members", () => {
    const founders = pickFounders(messages.team.members);

    expect(founders).toHaveLength(3);
    expect(founders.every((founder) => founder.linkedin.startsWith("https://"))).toBe(true);
  });

  it("falla si un miembro no trae LinkedIn, en vez de emitir undefined", () => {
    expect(() => pickFounders([{ name: "Alguien", role: "Co-Founder" }])).toThrow(
      /team\.members\[0\] necesita name, role y linkedin/,
    );
  });

  it("falla si team.members no es un array", () => {
    expect(() => pickFounders({})).toThrow(/tiene que ser un array/);
  });
});
