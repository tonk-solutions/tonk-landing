import { Box, Button, chakra, Container, Flex, Heading, Text } from "@chakra-ui/react";
import { ArrowDown } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { accentButtonVariant } from "@/app/theme";
import HeroDecor from "./HeroDecor";

/**
 * Hero as a Server Component: the copy and the decorative layers are rendered
 * on the server and the call to action is a real anchor, so the hero ships no
 * scroll handler and hydrates no component of its own.
 *
 * The anchor target is the contact section (`#contacto`); `html` already sets
 * `scroll-behavior: smooth`, which keeps the previous glide without JS.
 */
const HeroSection = async () => {
  const t = await getTranslations("hero");
  const tA11y = await getTranslations("a11y");
  const integrations = t.raw("integrations") as string[];

  return (
    <Box
      as="section"
      id="hero"
      aria-label={tA11y("heroLabel")}
      position="relative"
      bg="brand.bg"
      color="brand.fg"
      overflow="hidden"
      display="flex"
      alignItems="center"
      css={{
        // Smallest viewport keeps the CTA above the fold on phones; `vh` is the fallback.
        minHeight: "100vh",
        "@supports (min-height: 100svh)": { minHeight: "100svh" },
      }}
    >
      <HeroDecor />

      <Container
        maxW="1280px"
        mx="auto"
        w="100%"
        px={{ base: 4, md: 8 }}
        pt={{ base: "56px", md: "0" }}
        pb={{ base: "76px", md: "0" }}
        position="relative"
        zIndex={2}
      >
        <Flex direction="column" align="center" justify="center" textAlign="center" w="100%">
          <Flex direction="column" gap={{ base: 3, md: 6 }} maxW="800px" align="center">
            <Box className="hero-fade-block-1">
              {/*
                Eyebrow above the title. `sm` keeps it legible on the smallest
                phones; the tracking tightens on base so the 27-character
                subtitle still fits inside 360px (328px of content) on a
                single line, and opens back up from `md`.
              */}
              <Text
                as="span"
                color="brand.muted"
                fontFamily="mono"
                fontWeight="medium"
                letterSpacing={{ base: "0.12em", md: "0.2em" }}
                fontSize="sm"
                textTransform="uppercase"
                display="block"
                mb={{ base: 3, md: 4 }}
              >
                {t("subtitle")}
              </Text>
              <Heading
                as="h1"
                fontSize="clamp(2rem, 5vw + 1rem, 3.5rem)"
                fontWeight="semibold"
                lineHeight="1.1"
                mb={{ base: 3, md: 4 }}
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

            <Box className="hero-fade-block-3" pt={{ base: 3, md: 6 }}>
              {/*
                The anchor inherits Chakra's button recipe, which also sets
                `type="button"`: browsers and assistive tech ignore `type` on a
                link, and this keeps the plate pixel-identical to the previous
                JS button.
              */}
              <Button
                asChild
                variant={accentButtonVariant}
                size="lg"
                px={10}
                py={6}
              >
                <a href="#contacto">{t("cta")}</a>
              </Button>

              {/*
                Integration strip: a semantic list, small and sober, that wraps
                instead of overflowing on a 360px viewport.
              */}
              <Box mt={{ base: 5, md: 7 }}>
                <Text
                  as="p"
                  fontFamily="mono"
                  fontSize="xs"
                  letterSpacing="0.18em"
                  textTransform="uppercase"
                  color="brand.muted"
                  mb={2.5}
                >
                  {t("integrationsLabel")}
                </Text>
                <chakra.ul
                  data-testid="hero-integrations"
                  display="flex"
                  flexWrap="wrap"
                  alignItems="center"
                  justifyContent="center"
                  gap={2}
                  m={0}
                  p={0}
                  listStyleType="none"
                >
                  {integrations.map((integration) => (
                    <chakra.li
                      key={integration}
                      px={2.5}
                      py={1}
                      borderWidth="1px"
                      borderColor="brand.border"
                      borderRadius="full"
                      fontSize="xs"
                      lineHeight="1.4"
                      color="brand.muted"
                    >
                      {integration}
                    </chakra.li>
                  ))}
                </chakra.ul>
              </Box>
            </Box>
          </Flex>
        </Flex>
      </Container>

      {/* Decorative scroll hint: desktop only, on phones the sticky CTA owns that edge. */}
      <Box
        display={{ base: "none", md: "block" }}
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
