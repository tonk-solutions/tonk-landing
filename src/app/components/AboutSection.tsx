"use client";

import React from 'react';
import { Box, Container, Flex, Heading, Text, Image, Grid, Icon } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { CheckCircle } from 'lucide-react';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const AboutSection = () => {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <Box
      id="nosotros"
      py={{ base: 14, md: 20 }}
      px={{ base: 4, md: 8 }}
      bg="white"
      w="100%"
      overflow="hidden"
    >
      <Container maxW="container.xl" w="100%" px={0}>
        <Flex
          direction={{ base: 'column', lg: 'row' }}
          align="center"
          justify="space-between"
          gap={{ base: 10, lg: 16 }}
          ref={ref}
        >
          {/* Left side - Image */}
          <MotionBox
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.7 }}
            flex="1"
          >
            <Box
              position="relative"
              borderRadius="2xl"
              overflow="hidden"
              boxShadow="xl"
            >
              {/* This would be a real image in production */}
              <Box
                h={{ base: '300px', md: '400px', lg: '500px' }}
                w="full"
                bg="dark.700"
                position="relative"
              >
                <Box position="absolute" top="0" left="0" right="0" bottom="0" bg="linear-gradient(135deg, #0891b2 0%, #2563eb 100%)" opacity="0.8" />
                <Flex
                  position="absolute"
                  top="0" left="0" right="0" bottom="0"
                  justify="center"
                  align="center"
                  color="white"
                  p={8}
                >
                  <Flex direction="column" align="center" gap={2}>
                    <Heading size="lg" textAlign="center">Transformando Sistemas Críticos</Heading>
                    <Text textAlign="center">Imagen representativa del equipo Tonk Solutions trabajando</Text>
                  </Flex>
                </Flex>
              </Box>
            </Box>
          </MotionBox>

          {/* Right side - Content */}
          <MotionFlex
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            flex="1"
            direction="column"
          >
            <Text color="primary.500" fontWeight="medium" mb={2}>
              QUIÉNES SOMOS
            </Text>
            <Heading as="h2" size="xl" mb={6}>
              Socios estratégicos en tu crecimiento
            </Heading>
            
            <Text fontSize="lg" color="gray.700" mb={5}>
              En Tonk Solutions somos un equipo de ingenieros senior que viene de operar las plataformas más exigentes de la región.
            </Text>
            
            <Text fontSize="lg" color="gray.700" mb={8}>
              Nuestra tesis es la <strong>Continuidad sistémica</strong>: garantizamos que la robustez del Core Bancario y los ERPs convivan en armonía con la escalabilidad de la Nube y la eficiencia de la Inteligencia Artificial.
            </Text>

            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4} mb={8}>
              <Flex align="center" gap={3}>
                <Icon as={CheckCircle} color="primary.500" boxSize={5} />
                <Text fontWeight="medium">Experiencia en sistemas críticos</Text>
              </Flex>
              <Flex align="center" gap={3}>
                <Icon as={CheckCircle} color="primary.500" boxSize={5} />
                <Text fontWeight="medium">Modernización sin interrupciones</Text>
              </Flex>
              <Flex align="center" gap={3}>
                <Icon as={CheckCircle} color="primary.500" boxSize={5} />
                <Text fontWeight="medium">Soluciones a medida</Text>
              </Flex>
              <Flex align="center" gap={3}>
                <Icon as={CheckCircle} color="primary.500" boxSize={5} />
                <Text fontWeight="medium">Enfoque en resultados</Text>
              </Flex>
            </Grid>

            <Box>
              <Heading as="h3" size="md" mb={4} color="dark.800">
                Nuestra Misión
              </Heading>
              <Text fontSize="md" color="gray.600" fontStyle="italic" mb={4}>
                "Resolver desafíos críticos de arquitectura y deuda técnica que frenan el crecimiento del negocio, mediante equipos de ingeniería expertos capaces de intervenir desde el core del sistema hasta arquitecturas de servicios distribuidos."
              </Text>
            </Box>
          </MotionFlex>
        </Flex>
      </Container>
    </Box>
  );
};

export default AboutSection;
