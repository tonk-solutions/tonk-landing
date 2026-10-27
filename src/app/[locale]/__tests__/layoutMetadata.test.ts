import { describe, expect, it, vi } from "vitest";

// `generateMetadata` only needs the i18n server APIs and the locale validator;
// the rest of the Next runtime (navigation, fonts) is stubbed for the suite.
vi.mock("next-intl/server", () => ({
  getMessages: async () => ({}),
  getTranslations: async () => {
    const t = (key: string) => key;
    return Object.assign(t, { raw: () => ["tonk", "solutions"] });
  },
  setRequestLocale: () => undefined,
}));

vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("notFound");
  },
}));

// Geist resolves Next's font loader at import time; only the CSS variable names matter here.
vi.mock("geist/font/sans", () => ({ GeistSans: { variable: "font-geist-sans" } }));
vi.mock("geist/font/mono", () => ({ GeistMono: { variable: "font-geist-mono" } }));

// `@/i18n/routing` also builds next-intl navigation, which resolves Next's ESM entry.
vi.mock("next-intl/navigation", () => ({
  createNavigation: () => ({
    Link: () => null,
    redirect: () => undefined,
    usePathname: () => "/",
    useRouter: () => ({ push: () => undefined }),
  }),
}));

import { generateMetadata } from "../layout";
import { SITE_URL } from "../../constants";
import { routing } from "@/i18n/routing";

function metadataFor(locale: string) {
  return generateMetadata({ params: Promise.resolve({ locale }) });
}

describe("locale layout metadata", () => {
  it("declares x-default pointing at the Spanish site root", async () => {
    const metadata = await metadataFor("es");

    expect(metadata.alternates?.languages).toMatchObject({
      es: `${SITE_URL}/es`,
      en: `${SITE_URL}/en`,
      "x-default": `${SITE_URL}/es`,
    });
  });

  it("keeps x-default on the English tree too, and the canonical locale-aware", async () => {
    const metadata = await metadataFor("en");

    expect(metadata.alternates?.canonical).toBe(`${SITE_URL}/en`);
    expect(
      (metadata.alternates?.languages as Record<string, string>)["x-default"]
    ).toBe(`${SITE_URL}/es`);
  });

  it("serves x-default for the default locale", async () => {
    const metadata = await metadataFor(routing.defaultLocale);

    expect(
      (metadata.alternates?.languages as Record<string, string>)["x-default"]
    ).toBe(`${SITE_URL}/es`);
  });
});
