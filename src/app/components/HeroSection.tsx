"use client";

import React, { useEffect, useState } from 'react';
import { Box, Button, Container, Heading, Text, Flex } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { getContentData, ContentData } from '@/lib/content';

const MotionBox = motion(Box);

const HeroSection = () => {
  const [content, setContent] = useState<ContentData>({});

  useEffect(() => {
    const loadContent = async () => {
      const data = await getContentData('hero');
      setContent(data);
    };
    loadContent();
  }, []);

  const handleScrollDown = () => {
    const servicesSection = document.querySelector('#servicios');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const subtitle = content.subtitle as string;
  const title = content.title as string;
  const titleHighlight = content.titleHighlight as string;
  const description = content.description as string;
  const cta = content.cta as string;

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

      <Container maxW="1280px" mx="auto" h="full" px={{ base: 4, md: 8 }}>
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
                {subtitle}
              </Text>
              <Heading
                as="h1"
                size={{ base: '2xl', md: '3xl' }}
                fontWeight="bold"
                lineHeight="shorter"
                mb={4}
              >
                {title}{' '}
                <Text as="span" color="primary.400">
                  {titleHighlight}
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
                dangerouslySetInnerHTML={{ __html: description ? description.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') : '' }}
              />
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
                {cta}
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
