import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import TonkLogo from "../TonkLogo";

afterEach(cleanup);

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

  it("prioritizes the above-the-fold lockup and leaves the rest to the browser", () => {
    const { unmount } = render(<TonkLogo priority />);
    expect(screen.getByAltText("Tonk Solutions").getAttribute("fetchpriority")).toBe("high");
    unmount();

    render(<TonkLogo />);
    expect(screen.getByAltText("Tonk Solutions").hasAttribute("fetchpriority")).toBe(false);
  });

  it("paints no inline background: the lockup carries its own plate", () => {
    render(<TonkLogo />);

    const style = screen.getByAltText("Tonk Solutions").getAttribute("style") ?? "";
    expect(style).not.toContain("background");
  });
});
