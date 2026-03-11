"use client";

import React from 'react';
import { Box, Container, Flex, Heading, Text, Grid, Icon } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { CheckCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const AboutSection = () => {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  const t = useTranslations('about');

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
              boxShadow="xl"
            >
              <Box
                h={{ base: '300px', md: '400px', lg: '500px' }}
                w="full"
                bg="dark.700"
                position="relative"
              >
                <Box
                  position="absolute"
                  top="0" left="0" right="0" bottom="0"
                  bg="linear-gradient(135deg, #0891b2 0%, #2563eb 100%)"
                  opacity="0.8"
                />
                <Flex
                  position="absolute"
                  top="0" left="0" right="0" bottom="0"
                  justify="center"
                  align="center"
                  color="white"
                  p={8}
                >
                  <Flex direction="column" align="center" gap={2}>
                    <Heading size="lg" textAlign="center">{t('imageTitle')}</Heading>
                    <Text textAlign="center">
                      {t('imageSubtitle')}
                    </Text>
                  </Flex>
                </Flex>
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
            <Text color="primary.500" fontWeight="medium" mb={2}>
              {t('label')}
            </Text>
            <Heading as="h2" id="nosotros-heading" size="xl" mb={6}>
              {t('title')}
            </Heading>

            <Text as="p" fontSize="lg" color="gray.700" mb={5}>
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

            <Box as="blockquote">
              <Heading as="h3" size="md" mb={4} color="dark.800">
                {t('missionTitle')}
              </Heading>
              <Text as="p" fontSize="md" color="gray.600" fontStyle="italic" mb={4}>
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
