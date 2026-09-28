import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Box, Container, Flex, Heading, Text, Link as ChakraLink, Button } from "@chakra-ui/react";
import { ArrowLeft, MessageCircle, Code, Cloud, FileText, BrainCircuit, Users, Sparkles, UserCheck } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Link as LocaleLink, routing } from "@/i18n/routing";
import { resolveRequestLocale } from "@/i18n/requestLocale";
import { SITE_NAME, SITE_URL, WHATSAPP_URL } from "@/app/constants";
import {
  getServiceEntry,
  getServiceSlugs,
  pickServiceContent,
  type ServiceContent,
} from "@/app/services/catalog";

const iconMap: Record<string, React.ElementType> = {
  Code,
  Cloud,
  FileText,
  BrainCircuit,
  Users,
  Sparkles,
  UserCheck,
};

interface ServicePageParams {
  locale: string;
  slug: string;
}

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getServiceSlugs().map((slug) => ({ locale, slug }))
  );
}

async function resolveServiceContent(locale: string, slug: string) {
  const entry = getServiceEntry(slug);
  if (!entry) {
    return null;
  }

  const t = await getTranslations({ locale, namespace: "services" });
  const servicesByBranch = {
    craft: t.raw("craft.services") as ServiceContent[],
    talent: t.raw("talent.services") as ServiceContent[],
  };

  return { entry, content: pickServiceContent(servicesByBranch, entry) };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<ServicePageParams>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = resolveRequestLocale(rawLocale);
  const resolved = await resolveServiceContent(locale, slug);

  if (!resolved) {
    notFound();
  }

  const { content } = resolved;
  const canonical = `${SITE_URL}/${locale}/services/${slug}`;

  return {
    title: content.title,
    description: content.description,
    alternates: {
      canonical,
      languages: {
        es: `${SITE_URL}/es/services/${slug}`,
        en: `${SITE_URL}/en/services/${slug}`,
        "x-default": `${SITE_URL}/es/services/${slug}`,
      },
    },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: SITE_NAME,
      title: content.title,
      description: content.description,
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<ServicePageParams>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale = resolveRequestLocale(rawLocale);

  const resolved = await resolveServiceContent(locale, slug);

  if (!resolved) {
    notFound();
  }

  const { content } = resolved;
  const tDetail = await getTranslations({ locale, namespace: "services.detail" });
  const ServiceIcon = iconMap[content.icon] || Code;

  return (
    <div style={{ minHeight: "100vh", width: "100%", overflow: "hidden" }}>
      <Header />
      <main role="main" style={{ width: "100%" }}>
        <Box
          as="section"
          pt={{ base: 28, md: 36 }}
          pb={{ base: 16, md: 24 }}
          px={{ base: 4, md: 8 }}
          bg="gray.50"
          minH="100vh"
        >
          <Container maxW="900px" mx="auto">
            <LocaleLink
              href="/#servicios"
              style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "24px" }}
            >
              <ArrowLeft size={16} color="#0891b2" />
              <Text as="span" fontSize="sm" fontWeight="semibold" color="primary.600">
                {tDetail("backToServices")}
              </Text>
            </LocaleLink>

            <Flex align="center" gap={5} mb={6}>
              <Flex
                w="72px"
                h="72px"
                borderRadius="xl"
                justify="center"
                align="center"
                background="linear-gradient(135deg, #06b6d4, #2563eb)"
                flexShrink={0}
              >
                <ServiceIcon size={36} color="#ffffff" />
              </Flex>
              <Heading as="h1" fontSize="clamp(1.8rem, 4vw + 1rem, 2.75rem)" color="dark.900" lineHeight="1.2">
                {content.title}
              </Heading>
            </Flex>

            <Text fontSize="lg" color="dark.600" lineHeight="1.8" mb={10} maxW="720px">
              {content.description}
            </Text>

            <Box bg="dark.900" color="white" borderRadius="xl" p={{ base: 6, md: 10 }}>
              <Heading as="h2" fontSize="xl" mb={3}>
                {tDetail("ctaTitle")}
              </Heading>
              <Text color="dark.300" mb={6} maxW="520px">
                {tDetail("ctaDescription")}
              </Text>
              <ChakraLink
                href={WHATSAPP_URL}
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
                    <Text>{tDetail("ctaButton")}</Text>
                  </Flex>
                </Button>
              </ChakraLink>
            </Box>
          </Container>
        </Box>
      </main>
      <Footer />
    </div>
  );
}
