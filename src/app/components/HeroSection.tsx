"use client";

import React from 'react';
import { Box, Button, Container, Heading, Text, Flex } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

const MotionBox = motion(Box);

const HeroSection = () => {
  const handleScrollDown = () => {
    const servicesSection = document.querySelector('#servicios');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Box
      as="section"
      id="hero"
      aria-label="Presentación de Tonk Solutions"
      position="relative"
      h="100vh"
      bg="#0f172a"
      color="white"
      overflow="hidden"
    >
      <Box
        position="absolute"
        top="10%"
        left="5%"
        w="300px"
        h="300px"
        bg="primary.500"
        filter="blur(100px)"
        opacity="0.1"
        borderRadius="full"
        aria-hidden="true"
      />
      <Box
        position="absolute"
        bottom="20%"
        right="10%"
        w="250px"
        h="250px"
        bg="secondary.500"
        filter="blur(100px)"
        opacity="0.08"
        borderRadius="full"
        aria-hidden="true"
      />

      <Container maxW="container.xl" h="full" px={{ base: 4, md: 8 }}>
        <Flex
          direction="column"
          align="center"
          justify="center"
          textAlign="center"
          h="full"
          pt={{ base: '80px', md: '0' }}
        >
          <Flex direction="column" gap={6} maxW="800px" align="center">
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Text
                as="span"
                color="primary.400"
                fontWeight="medium"
                letterSpacing="wider"
                fontSize="lg"
                display="block"
                mb={2}
              >
                Consultoría de Ingeniería de Software para el Sector Financiero
              </Text>
              <Heading
                as="h1"
                size={{ base: '2xl', md: '3xl' }}
                fontWeight="bold"
                lineHeight="shorter"
                mb={4}
              >
                Ingeniería de alta precisión para{' '}
                <Text as="span" color="primary.400">
                  desafíos de escala
                </Text>
              </Heading>
            </MotionBox>

            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Text
                as="p"
                fontSize={{ base: 'lg', md: 'xl' }}
                color="gray.300"
                maxW="700px"
                mx="auto"
                lineHeight="tall"
              >
                Cuando la agilidad del mercado choca con la rigidez de los sistemas heredados,
                Tonk Solutions aporta <strong>continuidad sistémica</strong>: el puente de ingeniería
                que armoniza Core Banking y ERPs con Cloud-Native, Microservicios e Inteligencia Artificial.
              </Text>
            </MotionBox>

            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              pt={6}
            >
              <Button
                bg="primary.500"
                color="white"
                size="lg"
                px={8}
                onClick={handleScrollDown}
                _hover={{ bg: 'primary.600' }}
              >
                Descubre Cómo
              </Button>
            </MotionBox>
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
        <MotionBox
          animate={{ y: [0, 12, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ArrowDown size={24} style={{ opacity: 0.7 }} />
        </MotionBox>
      </Box>
    </Box>
  );
};

export default HeroSection;
