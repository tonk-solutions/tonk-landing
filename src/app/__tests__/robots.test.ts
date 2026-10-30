import { describe, expect, it } from "vitest";
import robots from "../robots";
import { SITE_URL } from "../constants";

/**
 * Política de rastreo (spec S3). El riesgo real de este archivo es bloquear por
 * accidente, así que el test fija que todos los grupos permitan todo.
 */
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Amazonbot",
  "meta-externalagent",
  "CCBot",
  "cohere-ai",
  "YouBot",
  "Diffbot",
];

const result = robots();

interface RobotsRule {
  userAgent: string | string[];
  allow?: string | string[];
  disallow?: string | string[];
}

const rules = (
  Array.isArray(result.rules) ? result.rules : [result.rules]
) as RobotsRule[];

describe("robots.txt (S3)", () => {
  it("conserva el grupo comodín que permite todo el sitio", () => {
    expect(rules[0]).toMatchObject({ userAgent: "*", allow: "/" });
  });

  it("declara los crawlers de IA por nombre", () => {
    const userAgents = rules.map((rule) => rule.userAgent);

    for (const crawler of AI_CRAWLERS) {
      expect(userAgents).toContain(crawler);
    }
  });

  it("no bloquea ninguna ruta en ningún grupo", () => {
    for (const rule of rules) {
      expect(rule.allow).toBe("/");
      expect(rule.disallow).toBeFalsy();
    }
  });

  it("sigue publicando el sitemap", () => {
    expect(result.sitemap).toBe(`${SITE_URL}/sitemap.xml`);
  });
});
