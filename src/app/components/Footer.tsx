"use client";

import React from 'react';
import { Box, Container, Flex, Link, Stack, Text } from '@chakra-ui/react';
import { FaLinkedin, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import TonkLogo from './TonkLogo';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <Box as="footer" bg="dark.800" color="white" py={12} px={{ base: 4, md: 8 }} w="100%" overflow="hidden">
      <Container maxW="container.xl" w="100%" px={0}>
        <Flex 
          direction={{ base: 'column', md: 'row' }} 
          justify="space-between" 
          align={{ base: 'center', md: 'flex-start' }}
          gap={8}
        >
          <Box maxW={{ base: '100%', md: '380px' }} mb={{ base: 8, md: 0 }}>
            <TonkLogo size="md" theme="dark" />
            <Text mt={4} color="gray.400" fontSize="sm">
              Ingeniería de alta precisión para desafíos de escala. Resolvemos desafíos críticos de arquitectura y deuda técnica que frenan el crecimiento del negocio.
            </Text>
          </Box>

          <Stack direction={{ base: 'column', md: 'row' }} gap={12}>
            <Box>
              <Text fontWeight="bold" mb={4}>Contacto</Text>
              <Stack gap={2}>
                <Text color="gray.400" fontSize="sm">tonksolutions@gmail.com</Text>
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

            <Box>
              <Text fontWeight="bold" mb={4}>Nuestras redes</Text>
              <Stack direction="row" gap={4}>
                <Link 
                  href="https://www.linkedin.com/company/tonk-solutions" 
                  target="_blank"
                  rel="noopener noreferrer"
                  color="gray.400"
                  _hover={{ color: 'primary.400' }}
                  fontSize="xl"
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
