"use client";

import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Flex,
  IconButton,
  Link,
  Button,
  Stack,
  useDisclosure
} from '@chakra-ui/react';
import { Menu, X } from 'lucide-react';
import TonkLogo from './TonkLogo';

const Header = () => {
  const { open, onToggle } = useDisclosure();
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Box
      as="nav"
      position="fixed"
      w="100%"
      maxW="100vw"
      zIndex={999}
      bg={scrolled ? 'white' : 'transparent'}
      color={scrolled ? 'gray.800' : 'white'}
      boxShadow={scrolled ? 'sm' : 'none'}
      transition="all 0.3s ease"
      overflow="hidden"
    >
      <Container maxW="container.xl">
        <Flex
          py={4}
          align="center"
          justify="space-between"
        >
          <Link href="#hero" _hover={{ textDecoration: 'none' }}>
            <TonkLogo theme={scrolled ? 'light' : 'dark'} size="sm" />
          </Link>

          <Stack
            direction="row"
            gap={8}
            align="center"
            display={{ base: 'none', md: 'flex' }}
          >
            <Link href="#servicios" fontWeight={500} color={scrolled ? 'gray.800' : 'white'} _hover={{ color: 'primary.500', textDecoration: 'none' }}>Servicios</Link>
            <Link href="#nosotros" fontWeight={500} color={scrolled ? 'gray.800' : 'white'} _hover={{ color: 'primary.500', textDecoration: 'none' }}>Nosotros</Link>
            <Link href="#equipo" fontWeight={500} color={scrolled ? 'gray.800' : 'white'} _hover={{ color: 'primary.500', textDecoration: 'none' }}>Equipo</Link>
            <Link 
              href="#contacto" 
              bg="primary.500"
              color="white"
              px={6}
              py={2}
              borderRadius="md"
              fontSize="sm"
              fontWeight={500}
              display="inline-block"
              _hover={{ bg: 'primary.600', textDecoration: 'none' }}
            >
              Contáctanos
            </Link>
          </Stack>

          <IconButton
            display={{ base: 'flex', md: 'none' }}
            onClick={onToggle}
            aria-label="Toggle Navigation"
            color={scrolled ? 'gray.800' : 'white'}
            bg="transparent"
            _hover={{ bg: 'transparent' }}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </IconButton>
        </Flex>
      </Container>

      {open && (
        <Box
          bg="white"
          p={4}
          display={{ md: 'none' }}
          w="100%"
          maxW="100vw"
          overflow="hidden"
        >
          <Stack gap={4}>
            <Link href="#servicios" fontWeight={500} color="gray.800" _hover={{ color: 'primary.500' }}>Servicios</Link>
            <Link href="#nosotros" fontWeight={500} color="gray.800" _hover={{ color: 'primary.500' }}>Nosotros</Link>
            <Link href="#equipo" fontWeight={500} color="gray.800" _hover={{ color: 'primary.500' }}>Equipo</Link>
            <Link 
              href="#contacto" 
              bg="primary.500"
              color="white"
              px={6}
              py={2}
              borderRadius="md"
              fontSize="sm"
              fontWeight={500}
              display="block"
              textAlign="center"
              w="full"
              _hover={{ bg: 'primary.600', textDecoration: 'none' }}
            >
              Contáctanos
            </Link>
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default Header;
