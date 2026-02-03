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
      id="hero"
      position="relative"
      h="100vh"
      bg="#0f172a"
      color="white"
      overflow="hidden"
    >
      {/* Background Elements */}
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
      />

      {/* Content */}
      <Container maxW="container.xl" h="full" px={{ base: 4, md: 8 }}>
        <Flex
          direction="column"
          align="center"
          justify="center"
          textAlign="center"
          h="full"
          pt={{ base: '80px', md: '0' }}
        >
          <Flex direction="column" gap={6} maxW="800px" align="center"  >
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Text
                color="primary.400"
                fontWeight="medium"
                letterSpacing="wider"
                fontSize="lg"
                mb={2}
              >
                Transformación Tecnológica y Talento de Élite
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
              <Text fontSize={{ base: 'lg', md: 'xl' }} color="gray.300" maxW="700px" mx="auto" lineHeight="tall">
                En un entorno donde la agilidad del mercado choca con la rigidez de los sistemas heredados, 
                Tonk Solutions surge como el puente de ingeniería necesario para cerrar esa brecha.
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

      {/* Scroll Indicator */}
      <Box
        position="absolute"
        bottom="32px"
        left="50%"
        transform="translateX(-50%)"
        textAlign="center"
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
