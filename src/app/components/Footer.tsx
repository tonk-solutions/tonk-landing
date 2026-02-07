"use client";

import React from 'react';
import { Box, Container, Flex, Link, Stack, Text } from '@chakra-ui/react';
import { FaLinkedin, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import TonkLogo from './TonkLogo';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box as="footer" role="contentinfo" bg="dark.800" color="white" py={12} px={{ base: 4, md: 8 }} w="100%" overflow="hidden">
      <Container maxW="1280px" mx="auto" w="100%" px={0}>
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align={{ base: 'center', md: 'flex-start' }}
          gap={8}
        >
          <Box maxW={{ base: '100%', md: '380px' }} mb={{ base: 8, md: 0 }}>
            <TonkLogo size="md" theme="dark" />
            <Text as="p" mt={4} color="gray.400" fontSize="sm">
              Consultoría de ingeniería de software de alta precisión especializada en
              continuidad sistémica para instituciones financieras, fintechs y corporaciones enterprise.
              Core Banking, SAP, ERP, Cloud-Native, Microservicios e IA.
            </Text>
          </Box>

          <Stack direction={{ base: 'column', md: 'row' }} gap={12}>
            <Box as="nav" aria-label="Información de contacto">
              <Text fontWeight="bold" mb={4}>Contacto</Text>
              <Stack gap={2}>
                <Link
                  href="mailto:tonksolutions@gmail.com"
                  color="gray.400"
                  fontSize="sm"
                  _hover={{ color: 'primary.400' }}
                >
                  tonksolutions@gmail.com
                </Link>
                <Link
                  href="https://wa.me/+5491123908349"
                  target="_blank"
                  rel="noopener noreferrer"
                  display="flex"
                  alignItems="center"
                  color="gray.400"
                  _hover={{ color: 'primary.400' }}
                >
                  <FaWhatsapp style={{ marginRight: '8px' }} /> WhatsApp
                </Link>
              </Stack>
            </Box>

            <Box as="nav" aria-label="Redes sociales">
              <Text fontWeight="bold" mb={4}>Nuestras redes</Text>
              <Stack direction="row" gap={4}>
                <Link
                  href="https://www.linkedin.com/company/tonk-solutions"
                  target="_blank"
                  rel="noopener noreferrer"
                  color="gray.400"
                  _hover={{ color: 'primary.400' }}
                  fontSize="xl"
                  aria-label="Tonk Solutions en LinkedIn"
                >
                  <FaLinkedin />
                </Link>
                <Link
                  href="https://www.instagram.com/tonk_solutions"
                  target="_blank"
                  rel="noopener noreferrer"
                  color="gray.400"
                  _hover={{ color: 'primary.400' }}
                  fontSize="xl"
                  aria-label="Tonk Solutions en Instagram"
                >
                  <FaInstagram />
                </Link>
              </Stack>
            </Box>
          </Stack>
        </Flex>

        <Flex
          borderTopWidth={1}
          borderTopColor="gray.700"
          mt={10}
          pt={6}
          justify="space-between"
          direction={{ base: 'column', sm: 'row' }}
          align="center"
          gap={4}
        >
          <Text fontSize="sm" color="gray.500">
            © {currentYear} Tonk Solutions. Todos los derechos reservados.
          </Text>
        </Flex>
      </Container>
    </Box>
  );
};

export default Footer;
