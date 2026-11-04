import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BrandLockup } from "../[locale]/components/brand/BrandLockup";
import { WORDMARK_HEIGHT } from "../[locale]/components/brand/wordmarkPaths";

/**
 * Geometría del lockup leída del SVG renderizado: la tinta del isotipo tiene que medir
 * lo que el wordmark y compartir sus líneas. Los números salen del propio markup (path,
 * círculo y transforms), no de las constantes del componente: cambiar el isotipo o la
 * caja del lockup rompe el test (spec S32).
 */

/** Números de un `transform` en orden: `translate(x,y) scale(s)` o `scale(sx,sy)`. */
const transformNumbers = (value: string | null) =>
  (value?.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);

/** Extremos verticales de un `d` con M/H/V, en el sistema de coordenadas del isotipo. */
function pathVerticalExtent(d: string) {
  const tokens = d.match(/[A-Za-z]|-?\d*\.?\d+/g) ?? [];
  const ys: number[] = [];
  let command = "";
  let index = 0;

  while (index < tokens.length) {
    const token = tokens[index];

    if (/^[A-Za-z]$/.test(token)) {
      command = token.toUpperCase();
      if (command === "M" || command === "L") {
        ys.push(Number(tokens[index + 2]));
        index += 3;
        continue;
      }

      index += 1;
      continue;
    }

    if (command === "V") ys.push(Number(token));
    index += 1;
  }

  return { top: Math.min(...ys), bottom: Math.max(...ys) };
}

function measure(variant: "horizontal" | "stacked") {
  const { container } = render(<BrandLockup variant={variant} />);
  const svg = container.querySelector("svg")!;
  const [mark, word] = svg.querySelectorAll("g");

  const [, , markScale] = transformNumbers(mark.getAttribute("transform"));
  const [wordX, baseline, wordScale] = transformNumbers(word.getAttribute("transform"));

  const path = mark.querySelector("path")!;
  const circle = mark.querySelector("circle")!;
  const stroke = Number(path.getAttribute("stroke-width")) / 2;
  const pathExtent = pathVerticalExtent(path.getAttribute("d")!);
  const circleTop = Number(circle.getAttribute("cy")) - Number(circle.getAttribute("r"));
  const circleBottom = Number(circle.getAttribute("cy")) + Number(circle.getAttribute("r"));
  const wordCapHeight = WORDMARK_HEIGHT * wordScale;

  return {
    // Tinta del isotipo y líneas del wordmark, en unidades del lockup.
    markTop: Math.min(pathExtent.top - stroke, circleTop) * markScale,
    markBottom: Math.max(pathExtent.bottom + stroke, circleBottom) * markScale,
    markBox: 32 * markScale,
    wordX,
    wordTop: baseline - wordCapHeight,
    wordBaseline: baseline,
    wordCapHeight,
    // `viewBox` = minX minY width height.
    viewBox: (svg.getAttribute("viewBox") ?? "").split(" ").map(Number),
  };
}

describe("lockup horizontal", () => {
  const lockup = measure("horizontal");

  it("la marca arranca en la línea de mayúsculas y cierra en la de base", () => {
    expect(lockup.markTop).toBeCloseTo(lockup.wordTop, 1);
    expect(lockup.markBottom).toBeCloseTo(lockup.wordBaseline, 1);
  });

  it("la tinta del isotipo mide lo que la «k» del wordmark", () => {
    expect(lockup.markBottom - lockup.markTop).toBeCloseTo(lockup.wordCapHeight, 1);
  });

  it("el hueco contra el wordmark es menor al del brand kit", () => {
    // El kit separaba isotipo y wordmark con 28 unidades.
    expect(lockup.wordX - lockup.markBox).toBeLessThan(28);
  });

  it("el viewBox deja aire debajo de la base para la «o»", () => {
    expect(lockup.viewBox[3]).toBeGreaterThan(lockup.wordBaseline + 0.5);
  });
});

describe("lockup apilado", () => {
  const lockup = measure("stacked");

  it("pone el wordmark debajo del isotipo", () => {
    expect(lockup.wordTop).toBeGreaterThan(lockup.markBottom);
  });

  it("tampoco recorta el wordmark", () => {
    expect(lockup.viewBox[3]).toBeGreaterThan(lockup.wordBaseline + 0.5);
  });
});
