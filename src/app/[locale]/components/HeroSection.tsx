"use client";

import React from 'react';
import { Box, Button, Container, Heading, Text, Flex } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

const MotionBox = motion(Box);

const HeroSection = () => {
  const t = useTranslations('hero');

  const handleScrollDown = () => {
    const contactSection = document.querySelector('#contacto');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Box
      as="section"
      id="hero"
      aria-label="Presentación de Tonk Solutions"
      position="relative"
      h="100vh"
      bg="dark.900"
      color="white"
      overflow="hidden"
    >
      {/* Dot grid pattern */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        aria-hidden="true"
        css={{
          backgroundImage: "radial-gradient(circle, rgba(6, 182, 212, 0.15) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Noise texture overlay */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        opacity={0.03}
        aria-hidden="true"
        css={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      {/* Geometric accent lines */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        aria-hidden="true"
        overflow="hidden"
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        >
          {/* Diagonal accent lines */}
          <line x1="0" y1="900" x2="600" y2="0" stroke="rgba(6, 182, 212, 0.06)" strokeWidth="1" />
          <line x1="200" y1="900" x2="800" y2="0" stroke="rgba(59, 130, 246, 0.04)" strokeWidth="1" />
          <line x1="900" y1="900" x2="1440" y2="200" stroke="rgba(6, 182, 212, 0.05)" strokeWidth="1" />

          {/* Corner frame elements */}
          <rect x="60" y="60" width="120" height="1" fill="rgba(6, 182, 212, 0.2)" />
          <rect x="60" y="60" width="1" height="80" fill="rgba(6, 182, 212, 0.2)" />
          <rect x="1260" y="60" width="120" height="1" fill="rgba(6, 182, 212, 0.2)" />
          <rect x="1380" y="60" width="1" height="80" fill="rgba(6, 182, 212, 0.2)" />
          <rect x="60" y="839" width="120" height="1" fill="rgba(6, 182, 212, 0.12)" />
          <rect x="60" y="760" width="1" height="80" fill="rgba(6, 182, 212, 0.12)" />

          {/* Small cross marks */}
          <g opacity="0.15">
            <line x1="1300" y1="700" x2="1320" y2="700" stroke="#06b6d4" strokeWidth="1" />
            <line x1="1310" y1="690" x2="1310" y2="710" stroke="#06b6d4" strokeWidth="1" />
          </g>
          <g opacity="0.1">
            <line x1="140" y1="400" x2="160" y2="400" stroke="#3b82f6" strokeWidth="1" />
            <line x1="150" y1="390" x2="150" y2="410" stroke="#3b82f6" strokeWidth="1" />
          </g>
        </svg>
      </Box>

      {/* Gradient glow accents (replacing blobs) */}
      <Box
        position="absolute"
        top="15%"
        left="-5%"
        w="400px"
        h="400px"
        aria-hidden="true"
        css={{
          background: "radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%)",
        }}
      />
      <Box
        position="absolute"
        bottom="10%"
        right="-5%"
        w="350px"
        h="350px"
        aria-hidden="true"
        css={{
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.06) 0%, transparent 70%)",
        }}
      />

      <Container maxW="1280px" mx="auto" h="full" px={{ base: 4, md: 8 }} position="relative" zIndex={2}>
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
                letterSpacing="0.2em"
                fontSize="sm"
                textTransform="uppercase"
                display="block"
                mb={3}
              >
                {t('subtitle')}
              </Text>
              <Heading
                as="h1"
                size={{ base: '2xl', md: '3xl' }}
                fontWeight="bold"
                lineHeight="shorter"
                mb={4}
                letterSpacing="tight"
              >
                {t('title')}{' '}
                <Text
                  as="span"
                  css={{
                    background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {t('titleHighlight')}
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
                color="dark.400"
                maxW="700px"
                mx="auto"
                lineHeight="tall"
              >
                {t('description')}
              </Text>
            </MotionBox>

            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              pt={6}
            >
              <Button
                size="lg"
                px={10}
                py={6}
                onClick={handleScrollDown}
                borderRadius="full"
                fontWeight="semibold"
                letterSpacing="wide"
                position="relative"
                bg="transparent"
                color="white"
                border="1px solid"
                borderColor="primary.500"
                _hover={{
                  bg: 'primary.500',
                  transform: 'scale(1.05)',
                  boxShadow: '0 0 30px rgba(6, 182, 212, 0.3)',
                }}
                transition="background 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease"
              >
                {t('cta')}
              </Button>
            </MotionBox>
          </Flex>
        </Flex>
      </Container>

      {/* Arrow down with glow ring */}
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
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <Flex
            w="40px"
            h="40px"
            borderRadius="full"
            border="1px solid"
            borderColor="primary.500"
            align="center"
            justify="center"
            opacity={0.6}
            css={{
              boxShadow: "0 0 15px rgba(6, 182, 212, 0.15)",
            }}
          >
            <ArrowDown size={18} />
          </Flex>
        </MotionBox>
      </Box>
    </Box>
  );
};

export default HeroSection;
