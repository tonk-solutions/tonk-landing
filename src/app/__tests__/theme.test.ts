import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import theme, { accentButtonVariant } from "@/app/theme";

/**
 * SAFETY: Chakra types `getRecipe` as `any` (`styled-system/types.d.ts`), so
 * this local shape states the contract the test asserts: the button recipe
 * definition the system resolves at runtime.
 */
const buttonRecipe = theme.getRecipe("button") as {
  className?: string;
  defaultVariants?: Record<string, string>;
  variants?: { variant?: Record<string, unknown> };
};

const accentPlate = buttonRecipe.variants?.variant?.accent as
  | Record<string, unknown>
  | undefined;

const componentsDir = resolve(process.cwd(), "src/app/[locale]/components");
const sourceOf = (file: string) => readFileSync(resolve(componentsDir, file), "utf8");

/**
 * The accent CTAs live in the hero and in the contact section. TL-38 moved
 * their shared plate into the button recipe so neither file keeps its own copy
 * of the colors, hover and transition.
 */
const ACCENT_CALL_SITES = ["HeroSection.tsx", "ContactSection.tsx"];

describe("button recipe accent variant", () => {
  it("registers accent and keeps every default variant of the recipe", () => {
    // `createSystem` deep-merges over `defaultConfig`: the extra variant must
    // not replace the ones Chakra ships (solid, subtle, surface, outline, …).
    expect(Object.keys(buttonRecipe.variants?.variant ?? {})).toEqual([
      "solid",
      "subtle",
      "surface",
      "outline",
      "ghost",
      "plain",
      "accent",
    ]);
    expect(buttonRecipe.defaultVariants).toEqual({ size: "md", variant: "solid" });
    expect(buttonRecipe.className).toBe("chakra-button");
  });

  it("keeps the plate identical to the one the components used to inline", () => {
    expect(accentPlate).toMatchObject({
      bg: "brand.accent",
      color: "brand.bg",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "brand.accent",
      borderRadius: "md",
      fontWeight: "semibold",
      letterSpacing: "wide",
      transition: "background 0.3s ease, transform 0.3s ease",
      _hover: {
        bg: "accent.emphasized",
        borderColor: "accent.emphasized",
        transform: "translateY(-1px)",
      },
    });
  });

  it("exposes a typed bridge for the variant literal", () => {
    expect(accentButtonVariant).toBe("accent");
  });

  it.each(ACCENT_CALL_SITES)("stops duplicating the plate in %s", (file) => {
    const source = sourceOf(file);

    expect(source).toMatch(/variant=\{accentButtonVariant\}/);
    // No leftover inline copy of the shared declarations.
    expect(source).not.toMatch(/bg=["']brand\.accent["']/);
    expect(source).not.toMatch(/borderColor=["']brand\.accent["']/);
    expect(source).not.toMatch(/transition=["']background 0\.3s ease, transform 0\.3s ease["']/);
    expect(source).not.toMatch(/_hover=\{\{\s*bg:\s*["']accent\.emphasized["']/);
  });
});

/**
 * `layout.tsx` puts the Geist CSS variables on the body; the chain in
 * `theme.ts` must lead with them so the site never depends on `globals.css`
 * declaring `--font-body` / `--font-mono` first.
 */
const fontStack = (name: "fonts.body" | "fonts.heading" | "fonts.mono") =>
  theme.tokens.getByName(name)?.value ?? "";

describe("font tokens", () => {
  it("leads the body and heading stacks with the Geist sans variable", () => {
    for (const name of ["fonts.body", "fonts.heading"] as const) {
      const stack = fontStack(name);

      expect(stack).toContain("--font-geist-sans");
      expect(stack.startsWith("var(--font-geist-sans)")).toBe(true);
      // The alias and the system fallbacks stay behind Geist.
      expect(stack).toContain("var(--font-body)");
      expect(stack).toMatch(/Inter, system-ui, sans-serif$/);
    }
  });

  it("leads the mono stack with the Geist mono variable", () => {
    const stack = fontStack("fonts.mono");

    expect(stack).toContain("--font-geist-mono");
    expect(stack.startsWith("var(--font-geist-mono)")).toBe(true);
    expect(stack).toContain("var(--font-mono)");
    expect(stack).toMatch(/ui-monospace, SFMono-Regular, Menlo, monospace$/);
  });
});
