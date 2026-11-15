import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MESSAGES, type TestLocale } from "../../test/intl";
import { WHATSAPP_URL } from "../constants";
import { Providers } from "../[locale]/providers";
import { ContactSection } from "../[locale]/components/home/ContactSection";
import { DiagnosticSection } from "../[locale]/components/home/DiagnosticSection";
import { TeamSection } from "../[locale]/components/home/TeamSection";
import DigitalProductLanding from "../[locale]/services/[slug]/DigitalProductLanding";
import EnterpriseIntegrationsLanding from "../[locale]/services/[slug]/EnterpriseIntegrationsLanding";
import ServicePage from "../[locale]/services/[slug]/page";

const state = vi.hoisted(() => ({ locale: "es" as "es" | "en" }));

vi.mock("next-intl/server", async () => {
  const { createGetTranslations } = await import("../../test/intl");
  return {
    getTranslations: createGetTranslations(() => state.locale as TestLocale),
    setRequestLocale: () => {},
  };
});

vi.mock("@/i18n/routing", () => ({
  routing: { locales: ["es", "en"], defaultLocale: "es" },
  Link: ({ href, children, ...rest }: { href: string; children?: React.ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

vi.mock("../[locale]/components/site/Header", () => ({ Header: () => null }));
vi.mock("../[locale]/components/site/Footer", () => ({ Footer: () => null }));

const LOCALES = ["es", "en"] as const;

const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Nombre accesible esperado: arranca con el texto visible (WCAG 2.5.3) y cierra
 * con el aviso. El espacio entre ambos no se exige: lo normaliza el cálculo del
 * nombre, no el markup.
 */
function nameWithHint(visible: string, hint: string) {
  return expect.stringMatching(new RegExp(`^${escape(visible)}\\s*${escape(hint)}$`));
}

/** Links que el DOM marca como `target="_blank"`: son los que tienen que avisar. */
function newTabLinks(container: HTMLElement): HTMLAnchorElement[] {
  return Array.from(container.querySelectorAll<HTMLAnchorElement>('a[target="_blank"]'));
}

describe.each(LOCALES)("links que abren otra pestaña (%s)", (locale) => {
  const messages = MESSAGES[locale];
  const hint = messages.a11y.newTabHint;

  beforeEach(() => {
    state.locale = locale;
  });

  it("el aviso sale del idioma activo", () => {
    expect(hint).not.toBe(MESSAGES[locale === "es" ? "en" : "es"].a11y.newTabHint);
  });

  it("contacto: el aviso suma al nombre accesible sin cambiar el texto visible", async () => {
    const { getByRole } = render(await ContactSection());
    const link = getByRole("link", { name: new RegExp(`^${escape(messages.contact.cta)}`) });

    expect(link).toHaveAttribute("href", WHATSAPP_URL);
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link).toHaveAccessibleName(nameWithHint(messages.contact.cta, hint));
    expect(link).not.toHaveAttribute("aria-describedby");
    expect(link.firstChild).toHaveTextContent(messages.contact.cta);
  });

  it("diagnóstico: el aviso suma al nombre accesible", async () => {
    const { getByRole } = render(await DiagnosticSection());
    const link = getByRole("link", { name: new RegExp(`^${escape(messages.diagnostic.cta)}`) });

    expect(link).toHaveAttribute("href", WHATSAPP_URL);
    expect(link).toHaveAccessibleName(nameWithHint(messages.diagnostic.cta, hint));
    expect(link).not.toHaveAttribute("aria-describedby");
  });

  it("equipo: cada LinkedIn nombra la pestaña nueva", async () => {
    const { container } = render(await TeamSection());
    const links = newTabLinks(container);
    const expected = messages.team.members.filter((member) => "linkedin" in member);

    expect(links.length).toBeGreaterThan(0);
    expect(links).toHaveLength(expected.length);
    for (const link of links) {
      expect(link).toHaveAccessibleName(nameWithHint(messages.team.linkedinLabel, hint));
    }
  });

  it("producto digital: los dos CTAs nombran la pestaña nueva", async () => {
    const copy = messages.landing.digitalProductDevelopment;
    const { container } = render(await DigitalProductLanding({ locale }));
    const links = newTabLinks(container);

    expect(links.map((link) => link.getAttribute("href"))).toEqual([
      expect.stringContaining(WHATSAPP_URL),
      expect.stringContaining(WHATSAPP_URL),
    ]);
    expect(links[0]).toHaveAccessibleName(nameWithHint(copy.hero.cta, hint));
    expect(links[1]).toHaveAccessibleName(nameWithHint(copy.cta.button, hint));
  });

  it("enterprise: hero y CTA final nombran la pestaña nueva", async () => {
    const copy = messages.landing.enterpriseIntegrations;
    const { container } = render(
      <Providers>{await EnterpriseIntegrationsLanding({ locale })}</Providers>,
    );
    const links = newTabLinks(container);

    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAccessibleName(nameWithHint(copy.hero.cta, hint));
    expect(links[1]).toHaveAccessibleName(nameWithHint(copy.cta.button, hint));
    for (const link of links) expect(link).not.toHaveAttribute("aria-describedby");
  });

  it("detalle de servicio: el CTA nombra la pestaña nueva", async () => {
    const page = await ServicePage({ params: Promise.resolve({ locale, slug: "applied-ai" }) });
    const { container } = render(<Providers>{page}</Providers>);
    const links = newTabLinks(container);

    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute("href", WHATSAPP_URL);
    expect(links[0]).toHaveAccessibleName(nameWithHint(messages.services.detail.ctaButton, hint));
    expect(links[0]).not.toHaveAttribute("aria-describedby");
  });
});

describe("una sola key para el aviso de pestaña nueva", () => {
  it.each(LOCALES)("%s no duplica el aviso fuera de a11y", (locale) => {
    const { team, landing } = MESSAGES[locale];

    expect(team).not.toHaveProperty("newTabHint");
    expect(landing.digitalProductDevelopment).not.toHaveProperty("newTabHint");
  });
});
