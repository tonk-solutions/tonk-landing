import { Box } from "@chakra-ui/react";
import { brandAlpha, brandTokens } from "@/app/brandTokens";

/**
 * Decorative backdrop of the hero: dot grid, noise texture, accent lines and
 * two ambient radial glows.
 *
 * It is pure ornament, so it never paints on mobile (`display: none` below the
 * `md` breakpoint): phones get the flat graphite background and skip 5 stacked
 * layers of gradients, an inline SVG and a tiled noise image.
 */
const HeroDecor = () => {
  return (
    <Box
      position="absolute"
      top="0"
      left="0"
      right="0"
      bottom="0"
      display={{ base: "none", md: "block" }}
      aria-hidden="true"
      pointerEvents="none"
      data-testid="hero-decor"
    >
      {/* Dot grid pattern */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bgImage={`radial-gradient(circle, ${brandAlpha.fg(0.06)} 1px, transparent 1px)`}
        bgSize="32px 32px"
      />

      {/* Noise texture overlay */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        opacity={0.03}
        bgImage={`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`}
        bgRepeat="repeat"
        bgSize="128px 128px"
      />

      {/* Geometric accent lines */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        overflow="hidden"
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
        >
          <line x1="0" y1="900" x2="600" y2="0" stroke={brandAlpha.muted(0.12)} strokeWidth="1" />
          <line x1="200" y1="900" x2="800" y2="0" stroke={brandAlpha.fg(0.05)} strokeWidth="1" />
          <line x1="900" y1="900" x2="1440" y2="200" stroke={brandAlpha.muted(0.1)} strokeWidth="1" />

          <rect x="60" y="60" width="120" height="1" fill={brandTokens.borderStrong} />
          <rect x="60" y="60" width="1" height="80" fill={brandTokens.borderStrong} />
          <rect x="1260" y="60" width="120" height="1" fill={brandTokens.borderStrong} />
          <rect x="1380" y="60" width="1" height="80" fill={brandTokens.borderStrong} />
          <rect x="60" y="839" width="120" height="1" fill={brandAlpha.fg(0.1)} />
          <rect x="60" y="760" width="1" height="80" fill={brandAlpha.fg(0.1)} />

          <g opacity="0.35">
            <line x1="1300" y1="700" x2="1320" y2="700" stroke={brandTokens.accent} strokeWidth="1" />
            <line x1="1310" y1="690" x2="1310" y2="710" stroke={brandTokens.accent} strokeWidth="1" />
          </g>
          <g opacity="0.2">
            <line x1="140" y1="400" x2="160" y2="400" stroke={brandTokens.muted} strokeWidth="1" />
            <line x1="150" y1="390" x2="150" y2="410" stroke={brandTokens.muted} strokeWidth="1" />
          </g>
        </svg>
      </Box>

      <Box
        position="absolute"
        top="15%"
        left="-5%"
        w="400px"
        h="400px"
        background={`radial-gradient(circle, ${brandAlpha.accent(0.04)} 0%, transparent 70%)`}
      />
      <Box
        position="absolute"
        bottom="10%"
        right="-5%"
        w="350px"
        h="350px"
        background={`radial-gradient(circle, ${brandAlpha.muted(0.06)} 0%, transparent 70%)`}
      />
    </Box>
  );
};

export default HeroDecor;
