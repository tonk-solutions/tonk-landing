"use client";

import React from 'react';
import { Box, Container, Flex, Heading, Text, Grid, Icon } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { CheckCircle } from 'lucide-react';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const VALUE_POINTS: ReadonlyArray<string> = [
  "Experiencia en sistemas financieros críticos",
  "Modernización legacy sin interrupciones",
  "Migración a microservicios y cloud-native",
  "Continuidad sistémica Core Banking + Cloud",
];

const AboutSection = () => {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

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
                    <Heading size="lg" textAlign="center">Continuidad Sistémica</Heading>
                    <Text textAlign="center">
                      Armonizando Core Banking y ERPs con Cloud, Microservicios e IA
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
              QUIÉNES SOMOS
            </Text>
            <Heading as="h2" id="nosotros-heading" size="xl" mb={6}>
              Socios estratégicos en ingeniería de software financiero
            </Heading>

            <Text as="p" fontSize="lg" color="gray.700" mb={5}>
              En Tonk Solutions somos un equipo de ingenieros senior que viene de operar
              las plataformas financieras más exigentes de la región: Core Banking,
              medios de pago, y sistemas transaccionales de alta criticidad.
            </Text>

            <Text as="p" fontSize="lg" color="gray.700" mb={8}>
              Nuestra propuesta de valor es la <strong>Continuidad Sistémica</strong>:
              garantizamos que la robustez del Core Bancario y los ERPs (SAP, Oracle)
              convivan en armonía con la escalabilidad de la Nube, la modularidad de los
              Microservicios y la eficiencia de la Inteligencia Artificial.
            </Text>

            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4} mb={8}>
              {VALUE_POINTS.map((point) => (
                <Flex key={point} align="center" gap={3}>
                  <Icon as={CheckCircle} color="primary.500" boxSize={5} aria-hidden="true" />
                  <Text fontWeight="medium">{point}</Text>
                </Flex>
              ))}
            </Grid>

            <Box as="blockquote">
              <Heading as="h3" size="md" mb={4} color="dark.800">
                Nuestra Misión
              </Heading>
              <Text as="p" fontSize="md" color="gray.600" fontStyle="italic" mb={4}>
                Resolver desafíos críticos de arquitectura y deuda técnica que frenan el
                crecimiento del negocio, mediante equipos de ingeniería expertos capaces de
                intervenir desde el core del sistema hasta arquitecturas de servicios
                distribuidos, asegurando la continuidad sistémica en cada fase de la
                transformación digital.
              </Text>
            </Box>
          </MotionFlex>
        </Flex>
      </Container>
    </Box>
  );
};

export default AboutSection;
