"use client";

import React from 'react';
import { Box, Container, Flex, Heading, Text, Grid, Icon } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { CheckCircle, Cloud, Building2, Database, BrainCircuit } from 'lucide-react';
import { useTranslations } from 'next-intl';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

interface PillarItemProps {
  title: string;
  description: string;
  icon: React.ElementType;
  delay: number;
  inView: boolean;
  borderRight?: string;
  borderBottom?: string;
}

const PillarItem: React.FC<PillarItemProps> = ({ title, description, icon: IconComponent, delay, inView, borderRight, borderBottom }) => (
  <MotionBox
    initial={{ opacity: 0, y: 20 }}
    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
    transition={{ duration: 0.5, delay }}
    p={6}
    position="relative"
    borderRight={borderRight}
    borderBottom={borderBottom}
  >
    <Flex direction="column" align="center" gap={3}>
      <Flex
        w="48px"
        h="48px"
        borderRadius="lg"
        bg="dark.800"
        justify="center"
        align="center"
        mb={1}
      >
        <IconComponent size={22} color="#06b6d4" />
      </Flex>
      <Text
        fontSize="md"
        fontWeight="700"
        lineHeight="1.2"
        color="white"
        textAlign="center"
      >
        {title}
      </Text>
      <Text
        fontSize="xs"
        color="dark.400"
        textAlign="center"
        lineHeight="1.4"
      >
        {description}
      </Text>
    </Flex>
  </MotionBox>
);

const AboutSection = () => {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  const t = useTranslations('about');

  const icons = [Cloud, Building2, Database, BrainCircuit];
  const translatedPillars = t.raw('pillars') as Array<{ title: string; description: string }>;
  const pillars = translatedPillars.map((pillar, index) => ({
    ...pillar,
    icon: icons[index]
  }));

  return (
    <Box
      as="section"
      id="nosotros"
      aria-labelledby="nosotros-heading"
      py={{ base: 14, md: 20 }}
      px={{ base: 4, md: 8 }}
      bg="white"
      w="100%"
      overflow="hidden"
      scrollMarginTop="80px"
    >
      <Container maxW="1280px" mx="auto" w="100%" px={0}>
        <Flex
          direction={{ base: 'column', lg: 'row' }}
          align="center"
          justify="space-between"
          gap={{ base: 8, lg: 16 }}
          ref={ref}
        >
          <MotionBox
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.7 }}
            flex="1"
            order={{ base: 2, lg: 1 }}
          >
            <Box
              as="aside"
              aria-label="Imagen representativa de continuidad sistémica"
              position="relative"
              borderRadius="2xl"
              overflow="hidden"
            >
              {/* Stats grid replacing placeholder */}
              <Box
                bg="dark.900"
                borderRadius="2xl"
                p={{ base: 6, md: 10 }}
                position="relative"
                overflow="hidden"
              >
                {/* Dot pattern */}
                <Box
                  position="absolute"
                  inset="0"
                  aria-hidden="true"
                  bgImage="radial-gradient(circle, rgba(6, 182, 212, 0.08) 1px, transparent 1px)"
                  bgSize="24px 24px"
                />

                {/* Corner accent */}
                <Box
                  position="absolute"
                  top="20px"
                  right="20px"
                  w="40px"
                  h="40px"
                  aria-hidden="true"
                >
                  <Box position="absolute" top="0" right="0" w="20px" h="1px" bg="primary.500" opacity={0.4} />
                  <Box position="absolute" top="0" right="0" w="1px" h="20px" bg="primary.500" opacity={0.4} />
                </Box>
                <Box
                  position="absolute"
                  bottom="20px"
                  left="20px"
                  w="40px"
                  h="40px"
                  aria-hidden="true"
                >
                  <Box position="absolute" bottom="0" left="0" w="20px" h="1px" bg="primary.500" opacity={0.4} />
                  <Box position="absolute" bottom="0" left="0" w="1px" h="20px" bg="primary.500" opacity={0.4} />
                </Box>

                <Flex direction="column" align="center" gap={2} mb={8} position="relative" zIndex={1}>
                  <Heading size="md" color="white" textAlign="center">{t('imageTitle')}</Heading>
                  <Text textAlign="center" color="dark.400" fontSize="sm">
                    {t('imageSubtitle')}
                  </Text>
                </Flex>

                <Grid
                  templateColumns="1fr 1fr"
                  gap={0}
                  position="relative"
                  zIndex={1}
                >
                  {pillars.map((pillar, index) => {
                    const isFirstCol = index % 2 === 0;
                    const isFirstRow = index < 2;
                    return (
                      <PillarItem
                        key={pillar.title}
                        title={pillar.title}
                        description={pillar.description}
                        icon={pillar.icon}
                        delay={0.1 * (index + 1)}
                        inView={inView}
                        borderRight={isFirstCol ? "1px solid rgba(148, 163, 184, 0.15)" : undefined}
                        borderBottom={isFirstRow ? "1px solid rgba(148, 163, 184, 0.15)" : undefined}
                      />
                    );
                  })}
                </Grid>
              </Box>
            </Box>
          </MotionBox>

          <MotionFlex
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            flex="1"
            direction="column"
            order={{ base: 1, lg: 2 }}
          >
            <Text
              color="primary.500"
              fontWeight="semibold"
              mb={2}
              fontSize="sm"
              textTransform="uppercase"
              letterSpacing="0.15em"
            >
              {t('label')}
            </Text>
            <Heading as="h2" id="nosotros-heading" fontSize="clamp(1.8rem, 4vw + 1rem, 2.5rem)" lineHeight="1.2" mb={6}>
              {t('title')}
            </Heading>

            <Text as="p" fontSize="clamp(1rem, 1.5vw + 0.5rem, 1.125rem)" color="dark.600" mb={5}>
              {t('description')}
            </Text>

            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4} mb={8}>
              {t.raw('valuePoints').map((point: string, index: number) => (
                <Flex key={index} align="center" gap={3}>
                  <Icon as={CheckCircle} color="primary.500" boxSize={5} aria-hidden="true" />
                  <Text fontWeight="medium">{point}</Text>
                </Flex>
              ))}
            </Grid>

            <Box as="blockquote" pl={4} borderLeft="2px solid" borderColor="primary.500">
              <Heading as="h3" fontSize="clamp(1.125rem, 2vw + 0.5rem, 1.3rem)" mb={4} color="dark.800">
                {t('missionTitle')}
              </Heading>
              <Text as="p" fontSize="md" color="dark.500" fontStyle="italic" mb={4}>
                {t('mission')}
              </Text>
            </Box>
          </MotionFlex>
        </Flex>
      </Container>
    </Box>
  );
};

export default AboutSection;
