import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import en from "../../../messages/en.json";
import es from "../../../messages/es.json";
import { ServicesAccordion } from "../[locale]/components/home/ServicesAccordion";
import { SERVICES_CATALOG, withServiceHrefs } from "../services/catalog";

/**
 * TL-42: la home linkea a las 7 landings /[locale]/services/[slug]. El link al
 * detalle se renderiza siempre dentro del panel del servicio, también cuando el
 * panel está cerrado, para que esté en el HTML sin ejecutar JavaScript.
 */

const LOCALE = "es";
const VIEW_DETAILS = es.services.viewDetails;
const ARROW = "→";

const isNonEmpty = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

/**
 * Orden del acordeón: primero los servicios de craft y después los de talent,
 * cada rama por `messageIndex`.
 */
const ORDERED_CATALOG = (["craft", "talent"] as const).flatMap((branch) =>
  SERVICES_CATALOG.filter((entry) => entry.branch === branch).sort(
    (a, b) => a.messageIndex - b.messageIndex,
  ),
);

function renderAccordion() {
  const { craft, talent } = withServiceHrefs(
    LOCALE,
    es.services.craft,
    es.services.talent,
  );

  return render(
    <ServicesAccordion
      craft={craft}
      talent={talent}
      cta={es.services.cta}
      viewDetails={VIEW_DETAILS}
    />,
  );
}

describe("mensajes de los links a servicios", () => {
  it.each([
    ["es", es],
    ["en", en],
  ] as const)("%s declara viewDetails y los labels del footer", (_locale, messages) => {
    expect(isNonEmpty(messages.services.viewDetails)).toBe(true);
    expect(isNonEmpty(messages.footer.serviceEnterprise)).toBe(true);
    expect(isNonEmpty(messages.footer.serviceGreenfield)).toBe(true);
  });
});

describe("acordeón de servicios", () => {
  it("renderiza los 7 links al detalle con el href de su slug", () => {
    const { container } = renderAccordion();
    const links = Array.from(
      container.querySelectorAll<HTMLAnchorElement>(`a[href^="/${LOCALE}/services/"]`),
    );

    expect(links).toHaveLength(SERVICES_CATALOG.length);
    expect(links).toHaveLength(7);

    const hrefs = links.map((link) => link.getAttribute("href"));
    expect(new Set(hrefs).size).toBe(7);
    expect(new Set(hrefs)).toEqual(
      new Set(SERVICES_CATALOG.map((entry) => `/${LOCALE}/services/${entry.slug}`)),
    );

    // Cada slug cae en el panel del servicio que le corresponde por rama y
    // `messageIndex`, no solo en algún panel.
    ORDERED_CATALOG.forEach((entry, panelIndex) => {
      const link = container.querySelector<HTMLAnchorElement>(
        `#service-panel-${panelIndex} a[href="/${LOCALE}/services/${entry.slug}"]`,
      );
      expect(link, `panel ${panelIndex} (${entry.slug})`).not.toBeNull();

      const title = es.services[entry.branch].services[entry.messageIndex].title;

      // El texto visible es sólo la acción; el título va oculto para que el
      // nombre accesible distinga los siete links.
      expect(link).toHaveAccessibleName(`${VIEW_DETAILS}: ${title}`);
      expect(link!.querySelector(".sr-only")?.textContent).toBe(`: ${title}`);
      expect(link!.querySelector('[aria-hidden="true"]')?.textContent).toBe(ARROW);
    });
  });

  it("mantiene los links en el DOM aunque los paneles estén cerrados", () => {
    const { container } = renderAccordion();

    // El primer panel arranca abierto; los otros seis, cerrados.
    const closedPanels = Array.from(container.querySelectorAll('[role="region"][hidden]'));
    expect(closedPanels).toHaveLength(6);

    for (const panel of closedPanels) {
      expect(panel.querySelector(`a[href^="/${LOCALE}/services/"]`)).not.toBeNull();
    }

    // El servicio 2 es el caso que protege el e2e: panel cerrado, link presente.
    const secondPanel = container.querySelector("#service-panel-1");
    expect(secondPanel?.hasAttribute("hidden")).toBe(true);
    expect(
      secondPanel?.querySelector('a[href="/es/services/digital-product-development"]'),
    ).not.toBeNull();
  });
});
