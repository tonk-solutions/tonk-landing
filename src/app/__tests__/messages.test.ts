import { describe, expect, it } from "vitest";
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
  it("keeps the team block shape identical across es and en", () => {
    const esKeys = deepKeyPaths((es as Messages).team).sort();
    const enKeys = deepKeyPaths((en as Messages).team).sort();
    expect(enKeys).toEqual(esKeys);
  });
});
