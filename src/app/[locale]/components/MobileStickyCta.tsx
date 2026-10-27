import { Box, Link } from "@chakra-ui/react";

interface MobileStickyCtaProps {
  /** Button label, reused from the hero CTA copy. */
  label: string;
  /** Anchor target; defaults to the contact section. */
  href?: string;
}

/**
 * Mobile-only sticky call to action.
 *
 * It is a plain anchor to the contact section, so it needs no client component
 * of its own: the bar shows up below `md`, sticks to the bottom edge and keeps
 * the home indicator area free through `env(safe-area-inset-bottom)`.
 */
const MobileStickyCta = ({ label, href = "#contacto" }: MobileStickyCtaProps) => {
  return (
    <Box
      display={{ base: "flex", md: "none" }}
      position="fixed"
      bottom="0"
      left="0"
      right="0"
      zIndex={900}
      px={4}
      pt={2}
      bg="brand.bg"
      borderTopWidth="1px"
      borderTopColor="brand.border"
      css={{ paddingBottom: "calc(8px + env(safe-area-inset-bottom, 0px))" }}
      data-testid="mobile-sticky-cta"
    >
      <Link
        href={href}
        flex="1"
        display="flex"
        alignItems="center"
        justifyContent="center"
        minH="44px"
        px={6}
        borderRadius="md"
        bg="accent.solid"
        color="accent.contrast"
        fontSize="md"
        fontWeight="semibold"
        letterSpacing="wide"
        _hover={{ bg: "accent.emphasized", textDecoration: "none" }}
        _focusVisible={{ outline: "2px solid", outlineColor: "accent.solid", outlineOffset: "2px" }}
        transition="background 0.2s ease"
      >
        {label}
      </Link>
    </Box>
  );
};

export default MobileStickyCta;
