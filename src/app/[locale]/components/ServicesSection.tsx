"use client";

import React, { useState } from 'react';
import { Box, Container, Grid, Heading, Text, Icon, Flex, SegmentGroup } from '@chakra-ui/react';
import { m } from 'framer-motion';
import { Code, Cloud, FileText, BrainCircuit, Users, CheckCircle, Sparkles, UserCheck, Hammer, UsersRound, ArrowRight } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { useTranslations } from 'next-intl';
import { Link as LocaleLink } from '@/i18n/routing';
import { SERVICES_CATALOG, type ServiceBranch } from '@/app/services/catalog';
import { brandAlpha, brandTokens } from '@/app/brandTokens';

const MotionBox = m(Box);

interface Service {
  title: string;
  description: string;
  icon: string;
}

interface Branch {
  key: ServiceBranch;
  name: string;
  subtitle: string;
  services: Service[];
}

const iconMap: Record<string, React.ElementType> = {
  Code,
  Cloud,
  FileText,
  BrainCircuit,
  Users,
  CheckCircle,
  Sparkles,
  UserCheck,
};

interface BranchServicesGridProps {
  branch: Branch;
  isActive: boolean;
}

const BranchServicesGrid: React.FC<BranchServicesGridProps> = ({ branch, isActive }) => {
  const [selectedServiceIndex, setSelectedServiceIndex] = useState(0);
  const t = useTranslations('services');

  if (branch.services.length === 0) return null;

  return (
    <Grid
      display={isActive ? "grid" : "none"}
      templateColumns={{ base: "1fr", lg: "300px 1fr" }}
      gap={{ base: 6, lg: 12 }}
      w="100%"
      bg="brand.surface"
      rounded="xl"
      p={{ base: 6, lg: 8 }}
      border="1px solid"
      borderColor="brand.border"
    >
      <Box>
        <Text
          fontSize="xs"
          fontFamily="mono"
          color="brand.muted"
          textTransform="uppercase"
          letterSpacing="0.15em"
          mb={6}
        >
          {branch.name === "Producto" ? "Nuestras Especialidades" : "Nuestros Servicios"}
        </Text>
        <Flex direction="column" gap={2}>
          {branch.services.map((service, index) => (
            <Box
              key={service.title}
              p={4}
              rounded="lg"
              cursor="pointer"
              onClick={() => setSelectedServiceIndex(index)}
              onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedServiceIndex(index); } }}
              role="button"
              tabIndex={0}
              transition="background 0.25s ease, border-color 0.25s ease"
              position="relative"
              bg={selectedServiceIndex === index ? "brand.bg" : "transparent"}
              border="1px solid"
              borderColor={selectedServiceIndex === index ? "brand.accentHalo" : brandAlpha.fg(0.06)}
              _hover={{
                borderColor: selectedServiceIndex === index ? "brand.accentGlow" : "brand.borderStrong",
                bg: selectedServiceIndex === index ? "brand.bg" : brandAlpha.fg(0.03),
              }}
            >
              <Flex align="center" gap={3}>
                <Flex
                  w="36px"
                  h="36px"
                  borderRadius="md"
                  bg={selectedServiceIndex === index ? "brand.accentSubtle" : brandAlpha.fg(0.05)}
                  justify="center"
                  align="center"
                  transition="background 0.25s ease"
                >
                  <Icon
                    as={iconMap[service.icon] || Code}
                    boxSize={4}
                    color={selectedServiceIndex === index ? "brand.accent" : "brand.muted"}
                  />
                </Flex>
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  color={selectedServiceIndex === index ? "brand.fg" : "brand.muted"}
                >
                  {service.title}
                </Text>
              </Flex>
            </Box>
          ))}
        </Flex>
      </Box>

      <Box>
        {branch.services.map((service, index) => {
          const isSelected = selectedServiceIndex === index;
          const catalogEntry = SERVICES_CATALOG.find(
            (entry) => entry.branch === branch.key && entry.messageIndex === index
          );

          return (
            <MotionBox
              key={service.title}
              display={isSelected ? "flex" : "none"}
              alignItems="center"
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Box>
                <Flex align="center" gap={5} mb={6}>
                  <Flex
                    w="80px"
                    h="80px"
                    borderRadius="xl"
                    justify="center"
                    align="center"
                    bg="brand.accentSubtle"
                    border="1px solid"
                    borderColor="brand.accentHalo"
                    flexShrink={0}
                  >
                    <Icon as={iconMap[service.icon] || Code} boxSize={9} color="brand.accent" />
                  </Flex>
                  <Box>
                    <Heading as="h3" fontSize="clamp(1.5rem, 3vw + 0.5rem, 2rem)" color="brand.fg" lineHeight="1.3">
                      {service.title}
                    </Heading>
                    <Box
                      w="40px"
                      h="2px"
                      mt={2}
                      bg="brand.accent"
                      opacity={0.7}
                    />
                  </Box>
                </Flex>

                <Text fontSize="clamp(0.875rem, 1vw + 0.5rem, 1rem)" color="brand.muted" lineHeight="1.8" mb={6}>
                  {service.description}
                </Text>

                {catalogEntry && (
                  <LocaleLink
                    href={`/services/${catalogEntry.slug}`}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Text as="span" fontSize="sm" fontWeight="semibold" color="brand.accent">
                      {t('viewDetails')}
                    </Text>
                    <Icon as={ArrowRight} boxSize={4} color="brand.accent" />
                  </LocaleLink>
                )}
              </Box>
            </MotionBox>
          );
        })}
      </Box>
    </Grid>
  );
};

const ServicesSection = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const t = useTranslations('services');

  const branches: Branch[] = [
    {
      key: 'craft',
      name: t('craft.name'),
      subtitle: t('craft.subtitle'),
      services: t.raw('craft.services') as Service[]
    },
    {
      key: 'talent',
      name: t('talent.name'),
      subtitle: t('talent.subtitle'),
      services: t.raw('talent.services') as Service[]
    }
  ];

  const [selectedBranch, setSelectedBranch] = useState(branches[0].name);

  const branchIcons: Record<string, React.ElementType> = {
    [branches[0].name]: Hammer,
    [branches[1].name]: UsersRound,
  };

  return (
    <Box
      as="section"
      id="servicios"
      aria-labelledby="servicios-heading"
      py={{ base: 14, md: 20 }}
      px={{ base: 4, md: 8 }}
      bg="brand.bg"
      w="100%"
      overflow="hidden"
      scrollMarginTop="80px"
    >
      <Container maxW="1280px" mx="auto" w="100%" px={0}>
        <Flex direction="column" gap={10} mb={10} ref={ref} align="center">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            textAlign="center"
            maxW="800px"
            w="full"
          >
            <Text
              color="brand.muted"
              fontFamily="mono"
              mb={3}
              fontSize="xs"
              textTransform="uppercase"
              letterSpacing="0.18em"
            >
              {t('label')}
            </Text>
            <Heading as="h2" id="servicios-heading" fontSize="clamp(1.8rem, 4vw + 1rem, 2.5rem)" lineHeight="1.2" mb={4} color="brand.fg">
              {t('title')}
            </Heading>
            <Text as="p" fontSize="clamp(1rem, 1.5vw + 0.5rem, 1.125rem)" color="brand.muted">
              {t('description')}
            </Text>
          </MotionBox>
        </Flex>
        <Box display="flex" justifyContent="center" mb={8} suppressHydrationWarning>
          <SegmentGroup.Root
            value={selectedBranch}
            onValueChange={(e) => setSelectedBranch(e.value || branches[0]?.name || "")}
            size="lg"
            bg="brand.surface"
            p={1}
            rounded="full"
            border="1px solid"
            borderColor={brandAlpha.fg(0.08)}
            css={{
              "--segment-indicator-bg": `var(--chakra-colors-brand-bg, ${brandTokens.bg})`,
              "--segment-indicator-shadow": "none",
            }}
            suppressHydrationWarning
          >
            <SegmentGroup.Indicator rounded="full" />
            {branches.map((branch) => (
              <SegmentGroup.Item
                key={branch.name}
                value={branch.name}
                px={8}
                py={3}
                rounded="full"
                _checked={{
                  bg: "brand.bg",
                }}
                bg="transparent"
              >
                <Flex align="center" gap={2}>
                  <Icon
                    as={branchIcons[branch.name] || Hammer}
                    boxSize={4}
                    _checked={{ color: "brand.accent" }}
                  />
                  <SegmentGroup.ItemText
                    fontFamily="mono"
                    fontWeight="medium"
                    color="brand.muted"
                    _checked={{
                      color: "brand.fg",
                    }}
                    fontSize="sm"
                  >
                    {branch.name}
                  </SegmentGroup.ItemText>
                </Flex>
                <SegmentGroup.ItemHiddenInput />
              </SegmentGroup.Item>
            ))}
          </SegmentGroup.Root>
        </Box>

        {branches.map((branch) => (
          <Box key={branch.name} display={selectedBranch === branch.name ? "block" : "none"} mb={8} textAlign="center">
            <Text as="p" fontSize="lg" color="brand.muted" maxW="600px" mx="auto">
              {branch.subtitle}
            </Text>
          </Box>
        ))}

        {branches.map((branch) => (
          <BranchServicesGrid
            key={branch.name}
            branch={branch}
            isActive={selectedBranch === branch.name}
          />
        ))}
      </Container>
    </Box>
  );
};

export default ServicesSection;
