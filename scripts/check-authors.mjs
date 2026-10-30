#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { argv, exit, stderr, stdout } from "node:process";
import { pathToFileURL } from "node:url";

/**
 * Verifica la regla de autoría de `AGENTS.md`: lo que llega a `main` va a nombre
 * de Rodrigo Hernandez porque el deploy de Netlify se gestiona con esa cuenta.
 *
 * Uso:
 *   node scripts/check-authors.mjs                  # origin/main..HEAD
 *   node scripts/check-authors.mjs <desde>..<hasta> # un rango puntual
 *   node scripts/check-authors.mjs --author-ident   # el autor del commit entrante
 *
 * Sale con 1 y explica cómo arreglarlo si encuentra commits con otra autoría. Si
 * no puede leer el historial (clon shallow, sin `origin`) avisa y no bloquea: el
 * guard no debe romper por un problema de entorno.
 */
export const REQUIRED_AUTHOR = Object.freeze({
  name: "Rodrigo Hernandez",
  email: "39744836+rodrigoenzohernandez@users.noreply.github.com",
});

const AUTHOR_FLAG = `--author="${REQUIRED_AUTHOR.name} <${REQUIRED_AUTHOR.email}>"`;
const ZERO_SHA = /^0+$/;

function clean(value) {
  return value.trim();
}

function sameName(left, right) {
  return clean(left) === clean(right);
}

function sameEmail(left, right) {
  return clean(left).toLowerCase() === clean(right).toLowerCase();
}

/** ¿La identidad cumple la regla? El nombre se compara exacto y el email sin mayúsculas. */
export function isRequiredAuthor(identity) {
  return (
    sameName(identity.name, REQUIRED_AUTHOR.name) &&
    sameEmail(identity.email, REQUIRED_AUTHOR.email)
  );
}

/** Commits que incumplen la regla. Puro: recibe la lista ya leída de git. */
export function findOffenders(commits) {
  return commits.filter((commit) => !isRequiredAuthor(commit));
}

/** `Rodrigo Hernandez <mail> 1760000000 -0300` → `{ name, email }`. */
export function parseIdent(raw) {
  const match = /^(?<name>.*?)\s*<(?<email>[^>]+)>/.exec(raw.trim());

  if (!match?.groups) {
    throw new Error(`no pude interpretar la identidad de git: ${raw}`);
  }

  return { name: match.groups.name, email: match.groups.email };
}

function git(args) {
  return execFileSync("git", args, { encoding: "utf8" });
}

/** Lee `sha`, autor y email de cada commit del rango, del más nuevo al más viejo. */
function readCommits(range) {
  const output = git(["log", range, "--format=%H%x00%an%x00%ae"]);

  return output
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [sha, name, email] = line.split("\0");
      return { sha: sha.slice(0, 7), name, email };
    });
}

function report(offenders, scope) {
  stderr.write(`\ncheck-authors: ${scope}\n`);
  stderr.write(
    `La autoría tiene que ser ${REQUIRED_AUTHOR.name} <${REQUIRED_AUTHOR.email}> (ver AGENTS.md).\n\n`
  );

  for (const commit of offenders) {
    stderr.write(`  ${commit.sha}  ${commit.name} <${commit.email}>\n`);
  }

  stderr.write(`\nUn commit:\n  git commit --amend --no-edit ${AUTHOR_FLAG}\n`);
  stderr.write(
    `\nUna rama entera:\n  GIT_SEQUENCE_EDITOR=: git rebase -i <base> \\\n    --exec 'git commit --amend --no-edit ${AUTHOR_FLAG}'\n\n`
  );
}

function checkIdent() {
  const identity = parseIdent(git(["var", "GIT_AUTHOR_IDENT"]));

  if (isRequiredAuthor(identity)) {
    return 0;
  }

  report([{ sha: "(entrante)", ...identity }], "el commit que estás por crear va a main");
  return 1;
}

function checkRange(range) {
  if (!range || ZERO_SHA.test(range)) {
    return 0;
  }

  let commits;
  try {
    commits = readCommits(range);
  } catch {
    stderr.write(
      `check-authors: no pude leer "${range}" (clon shallow o sin origin); se omite la verificación.\n`
    );
    return 0;
  }

  const offenders = findOffenders(commits);

  if (offenders.length === 0) {
    if (commits.length > 0) {
      stdout.write(`check-authors: ${commits.length} commit(s) con la autoría correcta.\n`);
    }
    return 0;
  }

  report(offenders, `commits sin la autoría correcta en ${range}`);
  return 1;
}

function main() {
  const [flag, value] = argv.slice(2);

  if (flag === "--author-ident") {
    return exit(checkIdent());
  }

  const range = flag && flag !== "--range" ? flag : value ?? "origin/main..HEAD";

  return exit(checkRange(range));
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  main();
}
