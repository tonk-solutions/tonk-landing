import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TestLocale } from "../../test/intl";
import { Providers } from "../[locale]/providers";
import Home from "../[locale]/page";
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

// Async Server Components y chrome ajeno al landmark: React no renderiza
// componentes async en jsdom, y lo que se verifica es el <main> de cada página.
vi.mock("../[locale]/components/site/Header", () => ({ Header: () => null }));
vi.mock("../[locale]/components/site/Footer", () => ({ Footer: () => null }));
vi.mock("../[locale]/components/home/SideIndex", () => ({ SideIndex: () => null }));
vi.mock("../[locale]/components/home/MobileStickyCta", () => ({ MobileStickyCta: () => null }));
vi.mock("../[locale]/components/home/HeroSection", () => ({ HeroSection: () => null }));
vi.mock("../[locale]/components/home/IntegrationsBar", () => ({ IntegrationsBar: () => null }));
vi.mock("../[locale]/components/home/ServicesSection", () => ({ ServicesSection: () => null }));
vi.mock("../[locale]/components/home/ProjectsSection", () => ({ ProjectsSection: () => null }));
vi.mock("../[locale]/components/home/DiagnosticSection", () => ({ DiagnosticSection: () => null }));
vi.mock("../[locale]/components/home/ProcessSection", () => ({ ProcessSection: () => null }));
vi.mock("../[locale]/components/home/CriterioSection", () => ({ CriterioSection: () => null }));
vi.mock("../[locale]/components/home/TeamSection", () => ({ TeamSection: () => null }));
vi.mock("../[locale]/components/home/ContactSection", () => ({ ContactSection: () => null }));
vi.mock("../[locale]/services/[slug]/EnterpriseIntegrationsLanding", () => ({
  default: () => null,
}));
vi.mock("../[locale]/services/[slug]/DigitalProductLanding", () => ({ default: () => null }));

const LOCALES = ["es", "en"] as const;

function expectSkipLinkTarget(container: HTMLElement) {
  const mains = container.querySelectorAll("main");

  expect(mains).toHaveLength(1);
  expect(mains[0]).toHaveAttribute("id", "main");
  // Focusable por script (el skip link le mueve el foco) sin sumarse al tab
  // order. `tabIndex` vale -1 por defecto en jsdom, así que se exige el atributo.
  expect(mains[0]).toHaveAttribute("tabindex", "-1");
  expect((mains[0] as HTMLElement).tabIndex).toBe(-1);
}

beforeEach(() => {
  state.locale = "es";
});

describe.each(LOCALES)("destino del skip link (%s)", (locale) => {
  beforeEach(() => {
    state.locale = locale;
  });

  it("home: el main es el destino focusable", async () => {
    const { container } = render(await Home({ params: Promise.resolve({ locale }) }));

    expectSkipLinkTarget(container);
  });

  it.each([
    ["detalle de servicio", "applied-ai"],
    ["landing Enterprise", "enterprise-integrations"],
  ])("%s: el main es el destino focusable", async (_label, slug) => {
    const page = await ServicePage({ params: Promise.resolve({ locale, slug }) });
    const { container } = render(<Providers>{page}</Providers>);

    expectSkipLinkTarget(container);
  });
});
