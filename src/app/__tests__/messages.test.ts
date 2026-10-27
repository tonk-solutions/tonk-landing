import { describe, expect, it } from "vitest";
import { createTranslator } from "next-intl";
import es from "../../../messages/es.json";
import en from "../../../messages/en.json";

type TeamMember = {
  name: string;
  role: string;
  bio: string;
  linkedin: string;
  avatarUrl: string;
  spokesperson?: boolean;
};

type Messages = {
  team: {
    label: string;
    title: string;
    description: string;
    spokesperson: string;
    members: TeamMember[];
  };
};

const locales: Array<{ name: "es" | "en"; messages: Messages }> = [
  { name: "es", messages: es as Messages },
  { name: "en", messages: en as Messages },
];

const FOUNDERS = ["Matías Castillo", "Nicolás Gómez", "Rodrigo Hernandez"];
const SPOKESPERSONS = ["Matías Castillo", "Rodrigo Hernandez"];

function deepKeyPaths(value: unknown, prefix = ""): string[] {
  if (value === null || typeof value !== "object") return [prefix];
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => deepKeyPaths(item, `${prefix}[${index}]`));
  }
  return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) =>
    deepKeyPaths(child, prefix ? `${prefix}.${key}` : key)
  );
}

describe.each(locales)("team messages ($name)", ({ name, messages }) => {
  const { team } = messages;

  it("keeps the three current founders", () => {
    expect(team.members).toHaveLength(3);
    expect(team.members.map((member) => member.name)).toEqual(FOUNDERS);
    expect(team.members.every((member) => member.avatarUrl && member.linkedin)).toBe(true);
  });

  it("marks exactly two public spokespersons: Matías and Rodrigo", () => {
    const spokespersons = team.members
      .filter((member) => member.spokesperson === true)
      .map((member) => member.name);

    expect(spokespersons).toHaveLength(2);
    expect(spokespersons).toEqual(SPOKESPERSONS);
    expect(team.members.some((member) => member.name === "Nicolás Gómez" && member.spokesperson)).toBe(
      false
    );
  });

  it(`exposes the team.spokesperson label (${name})`, () => {
    expect(typeof team.spokesperson).toBe("string");
    expect(team.spokesperson.length).toBeGreaterThan(0);
  });
});

describe("messages key parity", () => {
  it("keeps every namespace shape identical across es and en", () => {
    // Not just team: a key added to one locale and forgotten in the other is a
    // missing message at runtime, so the whole dictionary is compared.
    const esKeys = deepKeyPaths(es).sort();
    const enKeys = deepKeyPaths(en).sort();

    const onlyInEs = esKeys.filter((key) => !enKeys.includes(key));
    const onlyInEn = enKeys.filter((key) => !esKeys.includes(key));

    expect({ onlyInEs, onlyInEn }).toEqual({ onlyInEs: [], onlyInEn: [] });
  });

  it("ships the same top-level namespaces in both locales", () => {
    expect(Object.keys(en).sort()).toEqual(Object.keys(es).sort());
    // The accessibility copy lives in its own namespace so the client provider
    // can ship it without the server-only blocks.
    expect(Object.keys(es)).toContain("a11y");
  });
});

describe.each([
  { name: "es" as const, messages: es },
  { name: "en" as const, messages: en },
])("a11y messages ($name)", ({ name, messages }) => {
  const t = createTranslator({ locale: name, messages, namespace: "a11y" });

  it("interpolates the team avatar and LinkedIn labels", () => {
    const avatar = t("teamAvatar", { name: "Matías Castillo", role: "Co-Founder" });
    const linkedin = t("teamLinkedIn", { name: "Matías Castillo" });

    expect(avatar).toContain("Matías Castillo");
    expect(avatar).toContain("Co-Founder");
    expect(avatar).not.toContain("{");
    expect(linkedin).toContain("Matías Castillo");
    expect(linkedin).not.toContain("{name}");
  });
});
