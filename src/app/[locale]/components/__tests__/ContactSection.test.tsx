import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "@/app/theme";
import { WHATSAPP_URL } from "@/app/constants";
import es from "../../../../../messages/es.json";
import en from "../../../../../messages/en.json";
import ContactSection from "../ContactSection";

const MESSAGES = { es, en } as const;
type TestLocale = keyof typeof MESSAGES;

/** jsdom ships no IntersectionObserver; the section only needs it to exist. */
class IntersectionObserverStub implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "0px";
  readonly thresholds: readonly number[] = [];

  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

vi.stubGlobal("IntersectionObserver", IntersectionObserverStub);

/** Locale the mocked `next-intl` resolves from; hoisted for `vi.mock`. */
const intl = vi.hoisted(() => ({ locale: "es" as TestLocale }));

vi.mock("next-intl", async () => {
  const messages = {
    es: (await import("../../../../../messages/es.json")).default,
    en: (await import("../../../../../messages/en.json")).default,
  };

  return {
    useTranslations: () => {
      const contact = messages[intl.locale].contact;
      // `t()` reads single keys and `t.raw()` reads the contact items array.
      return Object.assign(
        (key: keyof typeof contact) => contact[key],
        { raw: (key: keyof typeof contact) => contact[key] }
      );
    },
  };
});

afterEach(() => {
  cleanup();
  intl.locale = "es";
});

const renderSection = () =>
  render(
    <ChakraProvider value={theme}>
      <ContactSection />
    </ChakraProvider>
  );

describe("ContactSection call to action", () => {
  it("never nests one interactive element inside another", () => {
    const { container } = renderSection();

    // `<Link><Button>` used to wrap a button in an anchor: two tab stops, one
    // element. The section must keep exactly one focusable node per CTA.
    expect(container.querySelector("a button, button a")).toBeNull();
    expect(container.querySelector("a a, button button")).toBeNull();
  });

  it("renders the WhatsApp CTA as a single anchor carrying the button recipe", () => {
    renderSection();

    const cta = screen.getByRole("link", { name: es.contact.whatsappCta });

    expect(cta.tagName).toBe("A");
    expect(cta.getAttribute("href")).toBe(WHATSAPP_URL);
    expect(cta.getAttribute("target")).toBe("_blank");
    expect(cta.getAttribute("rel")).toBe("noopener noreferrer");
    // `Button asChild` keeps the plate: the anchor is the button.
    expect(cta.className).toContain("chakra-button");
    expect(screen.getAllByRole("link", { name: es.contact.whatsappCta })).toHaveLength(1);
  });

  it("keeps the contact items as their own single anchor each", () => {
    const { container } = renderSection();

    for (const item of es.contact.items) {
      if (!item.href) continue;
      const link = container.querySelector(`a[href="${item.href}"]`);
      expect(link).not.toBeNull();
      expect(link?.querySelector("a, button")).toBeNull();
    }
  });
});

describe("ContactSection copy", () => {
  it.each(Object.keys(MESSAGES) as TestLocale[])(
    "reads the %s labels from the messages instead of hardcoding them",
    (locale) => {
      intl.locale = locale;
      renderSection();

      expect(screen.getByRole("heading", { level: 2 }).textContent).toBe(
        MESSAGES[locale].contact.title
      );
      expect(screen.getByText(MESSAGES[locale].contact.description)).toBeTruthy();
      expect(
        screen.getByRole("link", { name: MESSAGES[locale].contact.whatsappCta })
      ).toBeTruthy();
    }
  );
});
