import { describe, expect, it, vi } from "vitest";
import type { MetadataRoute } from "next";

// `@/i18n/routing` also builds next-intl navigation, which needs the Next runtime;
// the sitemap only reads the routing config, so the navigation factory is stubbed.
vi.mock("next-intl/navigation", () => ({
  createNavigation: () => ({
    Link: () => null,
    redirect: () => undefined,
    usePathname: () => "/",
    useRouter: () => ({ push: () => undefined }),
  }),
}));

import sitemap from "../sitemap";
import { SITE_URL } from "../constants";
import { routing } from "@/i18n/routing";
import { getServiceSlugs } from "../services/catalog";

type SitemapEntry = MetadataRoute.Sitemap[number];

const entries = sitemap();
const DEFAULT_LOCALE = routing.defaultLocale;

function languagesOf(entry: SitemapEntry): Record<string, string> {
  return (entry.alternates?.languages ?? {}) as Record<string, string>;
}

/** Locale-independent path of a sitemap URL (`""` for the home page). */
function pathOf(entry: SitemapEntry): string {
  const match = routing.locales.find((locale) =>
    entry.url.endsWith(`/${locale}`) || entry.url.includes(`/${locale}/`)
  );

  return match ? entry.url.slice(`${SITE_URL}/${match}`.length) : entry.url;
}

describe("sitemap entries", () => {
  it("lists the home page and every service slug for every locale", () => {
    const expected = [
      ...routing.locales.map((locale) => `${SITE_URL}/${locale}`),
      ...routing.locales.flatMap((locale) =>
        getServiceSlugs().map((slug) => `${SITE_URL}/${locale}/services/${slug}`)
      ),
    ];

    expect(entries.map((entry) => entry.url).sort()).toEqual(expected.sort());
  });
});

describe("sitemap language alternates", () => {
  it("declares x-default on every entry", () => {
    const missing = entries
      .filter((entry) => !languagesOf(entry)["x-default"])
      .map((entry) => entry.url);

    expect(missing).toEqual([]);
  });

  it("points x-default at the Spanish URL of the same path", () => {
    for (const entry of entries) {
      const languages = languagesOf(entry);

      expect(languages["x-default"]).toBe(`${SITE_URL}/${DEFAULT_LOCALE}${pathOf(entry)}`);
      expect(languages["x-default"]).toBe(languages[DEFAULT_LOCALE]);
    }
  });

  it("keeps every locale plus x-default in the alternates map", () => {
    for (const entry of entries) {
      const languages = languagesOf(entry);

      expect(Object.keys(languages).sort()).toEqual(
        [...routing.locales, "x-default"].sort()
      );
    }
  });

  it("leaves the home page x-default as the bare Spanish root", () => {
    const home = entries.find((entry) => entry.url === `${SITE_URL}/${DEFAULT_LOCALE}`);

    expect(home).toBeDefined();
    expect(languagesOf(home as SitemapEntry)["x-default"]).toBe(`${SITE_URL}/es`);
  });

  it("exposes an x-default for a service page too", () => {
    const slug = getServiceSlugs()[0];
    const service = entries.find(
      (entry) => entry.url === `${SITE_URL}/${DEFAULT_LOCALE}/services/${slug}`
    );

    expect(service).toBeDefined();
    expect(languagesOf(service as SitemapEntry)["x-default"]).toBe(
      `${SITE_URL}/es/services/${slug}`
    );
  });
});
