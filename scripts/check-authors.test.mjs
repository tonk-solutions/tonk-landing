import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  findOffenders,
  isRequiredAuthor,
  parseIdent,
  REQUIRED_AUTHOR,
} from "./check-authors.mjs";

/**
 * El guard de autoría de `AGENTS.md`. Si el email o el nombre del script se
 * despegan del documento, el hook bloquea commits legítimos o deja pasar los
 * ajenos: por eso el primer test compara contra `AGENTS.md` y no contra una
 * copia.
 */
const agentsDoc = fs.readFileSync(path.resolve(__dirname, "../AGENTS.md"), "utf8");

const required = { name: REQUIRED_AUTHOR.name, email: REQUIRED_AUTHOR.email };

describe("identidad requerida", () => {
  it("coincide con la que fija AGENTS.md", () => {
    expect(agentsDoc).toContain(`${REQUIRED_AUTHOR.name} <${REQUIRED_AUTHOR.email}>`);
  });

  it("acepta la identidad exacta y el email con otras mayúsculas", () => {
    expect(isRequiredAuthor(required)).toBe(true);
    expect(
      isRequiredAuthor({ ...required, email: REQUIRED_AUTHOR.email.toUpperCase() })
    ).toBe(true);
  });

  it("rechaza otro nombre, otro email o un email que se parece", () => {
    expect(isRequiredAuthor({ ...required, name: "Nicolas Gomez" })).toBe(false);
    expect(isRequiredAuthor({ ...required, email: "nico.09g@gmail.com" })).toBe(false);
    // Un carácter de menos en el email no es la misma identidad.
    expect(
      isRequiredAuthor({
        ...required,
        email: REQUIRED_AUTHOR.email.replace("hernandez", "hernadez"),
      })
    ).toBe(false);
  });
});

describe("findOffenders", () => {
  it("no marca nada cuando todos cumplen", () => {
    expect(findOffenders([{ sha: "a", ...required }, { sha: "b", ...required }])).toEqual([]);
  });

  it("devuelve solo los commits con otra autoría", () => {
    const offenders = findOffenders([
      { sha: "a", ...required },
      { sha: "b", name: "Nicolas Gomez", email: "40148296+niico09@users.noreply.github.com" },
      { sha: "c", ...required },
    ]);

    expect(offenders.map((commit) => commit.sha)).toEqual(["b"]);
  });

  it("trata una lista vacía como válida", () => {
    expect(findOffenders([])).toEqual([]);
  });
});

describe("parseIdent", () => {
  it("lee la salida de git var GIT_AUTHOR_IDENT", () => {
    expect(
      parseIdent("Rodrigo Hernandez <39744836+rodrigoenzohernandez@users.noreply.github.com> 1760000000 -0300")
    ).toEqual(required);
  });

  it("tolera espacios alrededor", () => {
    expect(parseIdent("  Rodrigo Hernandez <rodrigoenzohernandez@gmail.com>  \n")).toEqual({
      name: "Rodrigo Hernandez",
      email: "rodrigoenzohernandez@gmail.com",
    });
  });

  it("falla si la identidad no tiene email", () => {
    expect(() => parseIdent("Rodrigo Hernandez 1760000000 -0300")).toThrow();
  });
});
