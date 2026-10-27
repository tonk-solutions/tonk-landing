import type { ButtonProps } from "@chakra-ui/react";

// Separate from theme.ts so Server Components can import it without pulling
// the whole Chakra system into the RSC graph (breaks `next build`).
/**
 * Chakra types `Button`'s `variant` prop from its own static recipe, so a
 * variant registered in this system cannot be spelled as a bare literal. The
 * single cast lives here; call sites just read `accentButtonVariant`.
 *
 * SAFETY: the invariant TypeScript cannot check is that `accent` really exists
 * on the button recipe built above. `createSystem(defaultConfig, customConfig)`
 * deep-merges it, so it is rendered by the same system the components use; the
 * recipe test in `theme.test.ts` fails if the variant stops resolving.
 */
export const accentButtonVariant = "accent" as unknown as NonNullable<
  ButtonProps["variant"]
>;

