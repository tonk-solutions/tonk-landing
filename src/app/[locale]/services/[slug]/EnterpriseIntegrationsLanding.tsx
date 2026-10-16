import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Text,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { ArrowLeft, CheckCircle, MessageCircle, XCircle } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link as LocaleLink } from "@/i18n/routing";
import { WHATSAPP_URL } from "@/app/constants";
import { CASE_STUDIES } from "@/app/cases/catalog";

interface EnterpriseIntegrationsLandingProps {
  locale: string;
}

interface LandingItem {
  title: string;
  description: string;
}

/**
 * Conversion-focused landing for the enterprise-integrations service.
 * Copy lives in `messages/{locale}.json` under `landing.enterpriseIntegrations`;
 * the ES wording comes verbatim from the competitor analysis §12.
 */
export default async function EnterpriseIntegrationsLanding({
  locale,
}: EnterpriseIntegrationsLandingProps) {
  const t = await getTranslations({
    locale,
    namespace: "landing.enterpriseIntegrations",
  });
  const tDetail = await getTranslations({ locale, namespace: "services.detail" });

  const heroWhatsAppUrl = `${WHATSAPP_URL}?text=${encodeURIComponent(t("hero.whatsappText"))}`;
  const ctaWhatsAppUrl = `${WHATSAPP_URL}?text=${encodeURIComponent(t("cta.whatsappText"))}`;

  const problemBullets = t.raw("problem.bullets") as string[];
  const whatWeDoItems = t.raw("whatWeDo.items") as LandingItem[];
  const whyUsItems = t.raw("whyUs.items") as LandingItem[];
  const howWeWorkSteps = t.raw("howWeWork.steps") as LandingItem[];
  const resultBullets = t.raw("results.bullets") as string[];

  return (
    <>
      {/* Hero */}
      <Box
        as="section"
        id="enterprise-integrations-hero"
        aria-labelledby="enterprise-integrations-heading"
        bg="gray.50"
        pt={{ base: 28, md: 36 }}
        pb={{ base: 14, md: 20 }}
        px={{ base: 4, md: 8 }}
      >
        <Container maxW="1280px" mx="auto" w="100%" px={0}>
          <LocaleLink
            href="/#servicios"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "24px" }}
          >
            <ArrowLeft size={16} color="#0891b2" />
            <Text as="span" fontSize="sm" fontWeight="semibold" color="primary.600">
              {tDetail("backToServices")}
            </Text>
          </LocaleLink>

          <Box maxW="820px">
            <Heading
              as="h1"
              id="enterprise-integrations-heading"
              fontSize="clamp(2rem, 4vw + 1rem, 3.25rem)"
              color="dark.900"
              lineHeight="1.15"
              letterSpacing="tight"
              mb={6}
            >
              {t("hero.title")}
            </Heading>
            <Text fontSize="lg" color="dark.600" lineHeight="1.8" mb={8} maxW="720px">
              {t("hero.description")}
            </Text>
            <ChakraLink
              href={heroWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              _hover={{ textDecoration: "none" }}
              display="inline-block"
            >
              <Button
                size="lg"
                bg="primary.500"
                color="white"
                borderRadius="full"
                px={8}
                fontWeight="semibold"
                _hover={{ bg: "primary.600" }}
              >
                <Flex align="center" gap={2}>
                  <MessageCircle size={18} />
                  <Text>{t("hero.cta")}</Text>
                </Flex>
              </Button>
            </ChakraLink>
          </Box>
        </Container>
      </Box>

      {/* Problem */}
      <Box
        as="section"
        aria-labelledby="enterprise-integrations-problem-heading"
        bg="white"
        py={{ base: 14, md: 20 }}
        px={{ base: 4, md: 8 }}
      >
        <Container maxW="1280px" mx="auto" w="100%" px={0}>
          <Box maxW="820px">
            <Heading
              as="h2"
              id="enterprise-integrations-problem-heading"
              fontSize="clamp(1.6rem, 3vw + 1rem, 2.25rem)"
              color="dark.900"
              lineHeight="1.25"
              mb={4}
            >
              {t("problem.title")}
            </Heading>
            <Text fontSize="lg" color="dark.700" lineHeight="1.7" mb={6}>
              {t("problem.intro")}
            </Text>
            <Box
              as="ul"
              role="list"
              listStyleType="none"
              pl={0}
              m={0}
              display="flex"
              flexDirection="column"
              gap={4}
            >
              {problemBullets.map((bullet) => (
                <Flex as="li" key={bullet} align="flex-start" gap={3}>
                  <Box mt="4px" flexShrink={0}>
                    <XCircle size={18} color="#94a3b8" aria-hidden="true" />
                  </Box>
                  <Text color="dark.600" lineHeight="1.7">
                    {bullet}
                  </Text>
                </Flex>
              ))}
            </Box>
            <Text mt={8} fontWeight="semibold" color="dark.800" lineHeight="1.7">
              {t("problem.closing")}
            </Text>
          </Box>
        </Container>
      </Box>

      {/* What we do */}
      <Box
        as="section"
        aria-labelledby="enterprise-integrations-what-we-do-heading"
        bg="gray.50"
        py={{ base: 14, md: 20 }}
        px={{ base: 4, md: 8 }}
      >
        <Container maxW="1280px" mx="auto" w="100%" px={0}>
          <Box maxW="820px" mb={{ base: 8, md: 12 }}>
            <Heading
              as="h2"
              id="enterprise-integrations-what-we-do-heading"
              fontSize="clamp(1.6rem, 3vw + 1rem, 2.25rem)"
              color="dark.900"
              lineHeight="1.25"
              mb={4}
            >
              {t("whatWeDo.title")}
            </Heading>
            <Text fontSize="lg" color="dark.600" lineHeight="1.7">
              {t("whatWeDo.intro")}
            </Text>
          </Box>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
            {whatWeDoItems.map((item) => (
              <Box
                key={item.title}
                bg="white"
                borderRadius="xl"
                border="1px solid"
                borderColor="gray.200"
                p={{ base: 6, md: 7 }}
                transition="border-color 0.25s ease, box-shadow 0.25s ease"
                _hover={{
                  borderColor: "primary.300",
                  boxShadow: "0 8px 30px rgba(6, 182, 212, 0.08)",
                }}
              >
                <Heading as="h3" fontSize="lg" color="dark.900" mb={2}>
                  {item.title}
                </Heading>
                <Text color="dark.600" lineHeight="1.7">
                  {item.description}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Why us */}
      <Box
        as="section"
        aria-labelledby="enterprise-integrations-why-us-heading"
        bg="white"
        py={{ base: 14, md: 20 }}
        px={{ base: 4, md: 8 }}
      >
        <Container maxW="1280px" mx="auto" w="100%" px={0}>
          <Box maxW="820px" mb={{ base: 8, md: 12 }}>
            <Heading
              as="h2"
              id="enterprise-integrations-why-us-heading"
              fontSize="clamp(1.6rem, 3vw + 1rem, 2.25rem)"
              color="dark.900"
              lineHeight="1.25"
            >
              {t("whyUs.title")}
            </Heading>
          </Box>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 6, md: 8 }}>
            {whyUsItems.map((item) => (
              <Box key={item.title} borderLeft="3px solid" borderColor="primary.500" pl={5}>
                <Heading as="h3" fontSize="lg" color="dark.900" mb={2}>
                  {item.title}
                </Heading>
                <Text color="dark.600" lineHeight="1.7">
                  {item.description}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* How we work */}
      <Box
        as="section"
        aria-labelledby="enterprise-integrations-how-we-work-heading"
        bg="gray.50"
        py={{ base: 14, md: 20 }}
        px={{ base: 4, md: 8 }}
      >
        <Container maxW="1280px" mx="auto" w="100%" px={0}>
          <Box maxW="820px" mb={{ base: 8, md: 12 }}>
            <Heading
              as="h2"
              id="enterprise-integrations-how-we-work-heading"
              fontSize="clamp(1.6rem, 3vw + 1rem, 2.25rem)"
              color="dark.900"
              lineHeight="1.25"
            >
              {t("howWeWork.title")}
            </Heading>
          </Box>
          <Box
            as="ol"
            role="list"
            listStyleType="none"
            pl={0}
            m={0}
            display="flex"
            flexDirection="column"
            gap={{ base: 6, md: 8 }}
            maxW="820px"
          >
            {howWeWorkSteps.map((step, index) => (
              <Flex as="li" key={step.title} align="flex-start" gap={5}>
                <Flex
                  w="40px"
                  h="40px"
                  borderRadius="full"
                  bg="dark.900"
                  color="white"
                  justify="center"
                  align="center"
                  flexShrink={0}
                  fontWeight="bold"
                >
                  {index + 1}
                </Flex>
                <Box>
                  <Heading as="h3" fontSize="lg" color="dark.900" mb={1}>
                    {step.title}
                  </Heading>
                  <Text color="dark.600" lineHeight="1.7">
                    {step.description}
                  </Text>
                </Box>
              </Flex>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Expected results */}
      <Box
        as="section"
        aria-labelledby="enterprise-integrations-results-heading"
        bg="white"
        py={{ base: 14, md: 20 }}
        px={{ base: 4, md: 8 }}
      >
        <Container maxW="1280px" mx="auto" w="100%" px={0}>
          <Box maxW="820px" mb={{ base: 8, md: 10 }}>
            <Heading
              as="h2"
              id="enterprise-integrations-results-heading"
              fontSize="clamp(1.6rem, 3vw + 1rem, 2.25rem)"
              color="dark.900"
              lineHeight="1.25"
            >
              {t("results.title")}
            </Heading>
          </Box>
          <Box
            as="ul"
            role="list"
            listStyleType="none"
            pl={0}
            m={0}
            display="grid"
            gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }}
            gap={4}
            maxW="900px"
          >
            {resultBullets.map((bullet) => (
              <Flex as="li" key={bullet} align="center" gap={3}>
                <CheckCircle size={18} color="#06b6d4" aria-hidden="true" />
                <Text color="dark.700" fontWeight="medium">
                  {bullet}
                </Text>
              </Flex>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Cases — renders only once CASE_STUDIES has real, authorized projects */}
      {CASE_STUDIES.length > 0 && (
        <Box
          as="section"
          aria-labelledby="enterprise-integrations-cases-heading"
          bg="gray.50"
          py={{ base: 14, md: 20 }}
          px={{ base: 4, md: 8 }}
        >
          <Container maxW="1280px" mx="auto" w="100%" px={0}>
            <Box maxW="820px" mb={{ base: 8, md: 12 }}>
              <Heading
                as="h2"
                id="enterprise-integrations-cases-heading"
                fontSize="clamp(1.6rem, 3vw + 1rem, 2.25rem)"
                color="dark.900"
                lineHeight="1.25"
              >
                {t("cases.title")}
              </Heading>
            </Box>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
              {CASE_STUDIES.map((caseStudy) => (
                <Box
                  as="article"
                  key={caseStudy.slug}
                  bg="white"
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="gray.200"
                  p={{ base: 6, md: 7 }}
                >
                  <Heading as="h3" fontSize="lg" color="dark.900" mb={2}>
                    {caseStudy.title}
                  </Heading>
                  <Text fontSize="sm" fontWeight="semibold" color="primary.600" mb={3}>
                    {caseStudy.client} · {caseStudy.sector}
                  </Text>
                  {caseStudy.results[0] && (
                    <Text color="dark.600" lineHeight="1.7">
                      {caseStudy.results[0]}
                    </Text>
                  )}
                </Box>
              ))}
            </SimpleGrid>
          </Container>
        </Box>
      )}

      {/* Final CTA */}
      <Box
        as="section"
        aria-labelledby="enterprise-integrations-cta-heading"
        bg="gray.50"
        py={{ base: 14, md: 20 }}
        px={{ base: 4, md: 8 }}
      >
        <Container maxW="1280px" mx="auto" w="100%" px={0}>
          <Box bg="dark.900" color="white" borderRadius="xl" p={{ base: 6, md: 10 }}>
            <Heading
              as="h2"
              id="enterprise-integrations-cta-heading"
              fontSize="clamp(1.5rem, 2.5vw + 0.75rem, 2rem)"
              mb={3}
            >
              {t("cta.title")}
            </Heading>
            <Text color="dark.300" mb={6} maxW="520px" lineHeight="1.7">
              {t("cta.description")}
            </Text>
            <ChakraLink
              href={ctaWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              _hover={{ textDecoration: "none" }}
              display="inline-block"
            >
              <Button
                size="lg"
                bg="primary.500"
                color="white"
                borderRadius="full"
                px={8}
                fontWeight="semibold"
                _hover={{ bg: "primary.600" }}
              >
                <Flex align="center" gap={2}>
                  <MessageCircle size={18} />
                  <Text>{t("cta.button")}</Text>
                </Flex>
              </Button>
            </ChakraLink>
          </Box>
        </Container>
      </Box>
    </>
  );
}
