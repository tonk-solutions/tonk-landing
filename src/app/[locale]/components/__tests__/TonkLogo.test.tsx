import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import TonkLogo from "../TonkLogo";

afterEach(cleanup);

const logoSource = readFileSync(
  resolve(process.cwd(), "src/app/[locale]/components/TonkLogo.tsx"),
  "utf8"
);

describe("TonkLogo", () => {
  it("renders the horizontal dark lockup with the Tonk Solutions alt text", () => {
    render(<TonkLogo />);

    const logo = screen.getByAltText("Tonk Solutions");
    expect(logo).toBeTruthy();
    expect(logo.getAttribute("src")).toBe("/brand/tonk-lockup-horizontal-oscuro.svg");
  });

  it("renders the stacked dark lockup when variant is apilado", () => {
    render(<TonkLogo variant="apilado" />);

    const logo = screen.getByAltText("Tonk Solutions");
    expect(logo.getAttribute("src")).toBe("/brand/tonk-lockup-apilado-oscuro.svg");
  });

  it("serves the static SVG as-is instead of routing it through the optimizer", () => {
    render(<TonkLogo />);

    const src = screen.getByAltText("Tonk Solutions").getAttribute("src") ?? "";

    // `unoptimized` is what keeps the brand SVG out of `/_next/image`.
    expect(src).not.toContain("/_next/image");
    expect(src).toMatch(/^\/brand\/.*\.svg$/);
    expect(logoSource).toMatch(/from ["']next\/image["']/);
    expect(logoSource).toMatch(/\bunoptimized\b/);
    expect(logoSource).not.toMatch(/@next\/next\/no-img-element/);
  });

  it("reserves the lockup box with explicit width and height at the lockup ratio", () => {
    render(<TonkLogo height={40} />);

    const logo = screen.getByAltText("Tonk Solutions");

    // 520x192 horizontal lockup at 40px tall: 40 * 520 / 192 = 108.33 -> 108.
    expect(logo.getAttribute("width")).toBe("108");
    expect(logo.getAttribute("height")).toBe("40");
  });

  it("prioritizes the above-the-fold lockup and leaves the rest to the browser", () => {
    const { unmount } = render(<TonkLogo priority />);

    const prioritized = screen.getByAltText("Tonk Solutions");
    expect(prioritized.getAttribute("fetchpriority")).toBe("high");
    expect(prioritized.hasAttribute("loading")).toBe(false);
    unmount();

    render(<TonkLogo />);

    const deferred = screen.getByAltText("Tonk Solutions");
    expect(deferred.getAttribute("loading")).toBe("lazy");
    expect(deferred.hasAttribute("fetchpriority")).toBe(false);
  });

  it("paints no inline background: the lockup carries its own plate", () => {
    render(<TonkLogo />);

    const style = screen.getByAltText("Tonk Solutions").getAttribute("style") ?? "";
    expect(style).not.toContain("background");
  });
});
