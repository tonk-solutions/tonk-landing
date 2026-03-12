"use client";

import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Flex,
  IconButton,
  Link,
  Stack,
  useDisclosure
} from '@chakra-ui/react';
import { Menu, X } from 'lucide-react';
import TonkLogo from './TonkLogo';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslations } from 'next-intl';

const Header = () => {
  const { open, onToggle, onClose } = useDisclosure();
  const [scrolled, setScrolled] = useState(false);
  const t = useTranslations('nav');

  const navLinks = [
    { label: t('services'), href: '#servicios' },
    { label: t('about'), href: '#nosotros' },
    { label: t('team'), href: '#equipo' },
    { label: t('contact'), href: '#contacto' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Box
      as="header"
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
      <Container maxW="1280px" mx="auto" px={{ base: 5, md: 8 }}>
        <Flex
          as="nav"
          aria-label="Navegación principal"
          py={4}
          align="center"
          justify="space-between"
        >
          <Link href="#hero" _hover={{ textDecoration: 'none' }} aria-label="Tonk Solutions - Inicio">
            <TonkLogo theme={scrolled ? 'light' : 'dark'} size="sm" />
          </Link>

          <Stack
            direction="row"
            gap={8}
            align="center"
            display={{ base: 'none', md: 'flex' }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                fontWeight={500}
                color={scrolled ? 'gray.800' : 'white'}
                _hover={{ color: 'primary.500', textDecoration: 'none' }}
              >
                {link.label}
              </Link>
            ))}
            <LanguageSwitcher />
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
              {t('contact')}
            </Link>
          </Stack>

          <IconButton
            display={{ base: 'flex', md: 'none' }}
            onClick={onToggle}
            aria-label="Abrir menú de navegación"
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
          as="nav"
          aria-label="Navegación móvil"
          bg="white"
          p={4}
          display={{ md: 'none' }}
          w="100%"
          maxW="100vw"
          overflow="hidden"
        >
          <Stack gap={4}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                fontWeight={500}
                color="gray.800"
                _hover={{ color: 'primary.500' }}
                onClick={onClose}
              >
                {link.label}
              </Link>
            ))}
            <Box display="flex" justifyContent="center">
              <LanguageSwitcher />
            </Box>
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
              onClick={onClose}
            >
              {t('contact')}
            </Link>
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default Header;
