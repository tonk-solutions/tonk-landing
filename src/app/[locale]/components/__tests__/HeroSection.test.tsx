import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "@/app/theme";
import es from "../../../../../messages/es.json";
import HeroSection from "../HeroSection";
import HeroDecor from "../HeroDecor";
import MobileStickyCta from "../MobileStickyCta";

const heroMessages = es.hero as Record<string, string>;

// The hero is an async Server Component: `next-intl/server` is the only piece of
// the Next runtime it needs, so the suite resolves it from the Spanish messages.
vi.mock("next-intl/server", async () => {
  const messages = (await import("../../../../../messages/es.json")).default as {
    hero: Record<string, string>;
  };
  return {
    getTranslations: async () => (key: string) => messages.hero[key],
  };
});

afterEach(cleanup);

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ChakraProvider value={theme}>{ui}</ChakraProvider>);

/** Every rule Emotion injected for the rendered tree, as raw CSS text. */
const styleText = () =>
  Array.from(document.querySelectorAll("style"))
    .map((node) => node.textContent ?? "")
    .join("\n");

/** Emotion hash class: the one that carries the resolved declarations. */
const emotionClassOf = (element: HTMLElement) =>
  (element.className as string)
    .split(" ")
    .find((token) => token.startsWith("css-")) ?? "";

/** Escapes a class name so it can be embedded in a regular expression. */
const escapePattern = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Declarations of the base (non media) rule that owns the element class. */
const baseRuleOf = (css: string, className: string) =>
  css.match(new RegExp(`\\.${escapePattern(className)}\\{([^}]*)\\}`))?.[1] ?? "";

/** Whether a media rule for that class declares the given property value. */
const mediaRuleDeclares = (css: string, className: string, declaration: string) =>
  new RegExp(`@media[^{]*\\{\\.${className}\\{[^}]*${declaration}`).test(css);

const heroSource = readFileSync(
  resolve(process.cwd(), "src/app/[locale]/components/HeroSection.tsx"),
  "utf8"
);

describe("HeroSection", () => {
  it("renders the call to action as a plain anchor to the contact section", async () => {
    renderWithTheme(await HeroSection());

    const cta = screen.getByRole("link", { name: heroMessages.cta });

    expect(cta.tagName).toBe("A");
    expect(cta.getAttribute("href")).toBe("#contacto");
  });

  it("keeps the button recipe plate on the anchor", async () => {
    renderWithTheme(await HeroSection());

    const cta = screen.getByRole("link", { name: heroMessages.cta });

    // Chakra's button recipe is what keeps the hero plate pixel-identical.
    expect(cta.className).toContain("chakra-button");
  });

  it("renders the hero copy from the messages on the server", async () => {
    renderWithTheme(await HeroSection());

    expect(screen.getByRole("heading", { level: 1 }).textContent).toContain(
      heroMessages.titleHighlight
    );
    expect(screen.getByText(heroMessages.description)).toBeTruthy();
    expect(screen.getByText(heroMessages.subtitle)).toBeTruthy();
  });

  it("stays a Server Component: no client directive and no scroll handler", () => {
    expect(heroSource).not.toMatch(/^\s*["']use client["']/m);
    expect(heroSource).not.toMatch(/\bonClick\b/);
    expect(heroSource).toMatch(/getTranslations\(["']hero["']\)/);
  });
});

describe("HeroDecor", () => {
  it("renders the decoration as a single screen-reader hidden layer", () => {
    renderWithTheme(<HeroDecor />);

    const decor = screen.getByTestId("hero-decor");

    expect(decor.getAttribute("aria-hidden")).toBe("true");
    expect(decor.querySelector("svg")).not.toBeNull();
    expect(decor.children).toHaveLength(5);
  });

  it("paints on desktop only", () => {
    renderWithTheme(<HeroDecor />);

    const css = styleText();
    const className = emotionClassOf(screen.getByTestId("hero-decor"));

    expect(baseRuleOf(css, className)).toContain("display:none");
    expect(mediaRuleDeclares(css, className, "display:block")).toBe(true);
  });
});

describe("MobileStickyCta", () => {
  it("links to the contact section with the hero CTA copy", () => {
    renderWithTheme(<MobileStickyCta label={heroMessages.cta} />);

    const cta = screen.getByRole("link", { name: heroMessages.cta });

    expect(cta.getAttribute("href")).toBe("#contacto");
    expect(cta.textContent).toBe(heroMessages.cta);
  });

  it("sticks to the bottom below md, clears the home indicator and yields on desktop", () => {
    renderWithTheme(<MobileStickyCta label={heroMessages.cta} />);

    const css = styleText();
    const bar = screen.getByTestId("mobile-sticky-cta");
    const barClass = emotionClassOf(bar);
    const barRule = baseRuleOf(css, barClass);

    expect(barRule).toContain("display:flex");
    expect(barRule).toContain("position:fixed");
    expect(barRule).toContain("padding-bottom:calc(8px + env(safe-area-inset-bottom");
    expect(mediaRuleDeclares(css, barClass, "display:none")).toBe(true);
  });

  it("paints the call to action with the accent semantic tokens", () => {
    renderWithTheme(<MobileStickyCta label={heroMessages.cta} />);

    const css = styleText();
    const ctaRule = baseRuleOf(css, emotionClassOf(screen.getByRole("link", { name: heroMessages.cta })));

    expect(ctaRule).toContain("background:var(--chakra-colors-accent-solid)");
    expect(ctaRule).toContain("color:var(--chakra-colors-accent-contrast)");
  });
});
