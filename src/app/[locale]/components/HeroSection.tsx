"use client";

import React from "react";
import { Box, Button, Container, Heading, Text, Flex } from "@chakra-ui/react";
import { ArrowDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { brandAlpha, brandTokens } from "@/app/brandTokens";

const HeroSection = () => {
  const t = useTranslations("hero");

  const handleScrollDown = () => {
    const contactSection = document.querySelector("#contacto");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Box
      as="section"
      id="hero"
      aria-label="Presentación de Tonk Solutions"
      position="relative"
      h="100vh"
      bg="brand.bg"
      color="brand.fg"
      overflow="hidden"
    >
      {/* Dot grid pattern */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        aria-hidden="true"
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
        aria-hidden="true"
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
        aria-hidden="true"
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
        aria-hidden="true"
        background={`radial-gradient(circle, ${brandAlpha.accent(0.04)} 0%, transparent 70%)`}
      />
      <Box
        position="absolute"
        bottom="10%"
        right="-5%"
        w="350px"
        h="350px"
        aria-hidden="true"
        background={`radial-gradient(circle, ${brandAlpha.muted(0.06)} 0%, transparent 70%)`}
      />

      <Container maxW="1280px" mx="auto" h="full" px={{ base: 4, md: 8 }} position="relative" zIndex={2}>
        <Flex
          direction="column"
          align="center"
          justify="center"
          textAlign="center"
          h="full"
          pt={{ base: "80px", md: "0" }}
        >
          <Flex direction="column" gap={6} maxW="800px" align="center">
            <Box className="hero-fade-block-1">
              <Text
                as="span"
                color="brand.muted"
                fontFamily="mono"
                fontWeight="medium"
                letterSpacing="0.2em"
                fontSize="xs"
                textTransform="uppercase"
                display="block"
                mb={4}
              >
                {t("subtitle")}
              </Text>
              <Heading
                as="h1"
                fontSize="clamp(2rem, 5vw + 1rem, 3.5rem)"
                fontWeight="semibold"
                lineHeight="1.1"
                mb={4}
                letterSpacing="tight"
                color="brand.fg"
              >
                {t("title")}{" "}
                <Text as="span" color="brand.accent">
                  {t("titleHighlight")}
                </Text>
              </Heading>
            </Box>

            <Box className="hero-fade-block-2">
              <Text
                as="p"
                fontSize="clamp(1.125rem, 2vw + 0.5rem, 1.25rem)"
                color="brand.muted"
                maxW="700px"
                mx="auto"
                lineHeight="1.6"
              >
                {t("description")}
              </Text>
            </Box>

            <Box className="hero-fade-block-3" pt={6}>
              <Button
                size="lg"
                px={10}
                py={6}
                onClick={handleScrollDown}
                borderRadius="md"
                fontWeight="semibold"
                letterSpacing="wide"
                position="relative"
                bg="brand.accent"
                color="brand.bg"
                border="1px solid"
                borderColor="brand.accent"
                _hover={{
                  bg: "accent.emphasized",
                  borderColor: "accent.emphasized",
                  transform: "translateY(-1px)",
                }}
                transition="background 0.3s ease, transform 0.3s ease"
              >
                {t("cta")}
              </Button>
            </Box>
          </Flex>
        </Flex>
      </Container>

      <Box
        position="absolute"
        bottom="32px"
        left="50%"
        transform="translateX(-50%)"
        textAlign="center"
        aria-hidden="true"
      >
        <Box className="hero-arrow-bounce">
          <Flex
            w="40px"
            h="40px"
            borderRadius="full"
            border="1px solid"
            borderColor="brand.borderStrong"
            align="center"
            justify="center"
            color="brand.muted"
          >
            <ArrowDown size={18} />
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};

export default HeroSection;
