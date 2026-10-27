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
import { motion, AnimatePresence } from 'framer-motion';
import { brandAlpha } from '@/app/brandTokens';

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
      setScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const isScrolled = scrolled && !open;

  // Animation variants
  const menuVariants = {
    closed: {
      opacity: 0,
      y: "-100%",
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
    },
    open: {
      opacity: 1,
      y: "0%",
      transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1], staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    closed: { opacity: 0, y: -20 },
    open: { opacity: 1, y: 0 }
  };

  return (
    <Box
      as="header"
      position="fixed"
      top="0"
      left="0"
      w="100%"
      zIndex={999}
      bg={isScrolled ? brandAlpha.bg(0.92) : 'transparent'}
      backdropFilter={isScrolled ? 'blur(10px)' : 'none'}
      borderBottomWidth="1px"
      borderBottomColor={isScrolled ? brandAlpha.fg(0.08) : 'transparent'}
      transition="background-color 0.3s ease, border-color 0.3s ease"
    >
      <Container maxW="1280px" mx="auto" px={{ base: 5, md: 8 }} position="relative" zIndex={1000}>
        <Flex
          as="nav"
          aria-label="Navegación principal"
          py={4}
          align="center"
          justify="space-between"
        >
          <Link href="#hero" _hover={{ textDecoration: 'none' }} aria-label="Tonk Solutions - Inicio" onClick={onClose}>
            <TonkLogo variant="horizontal" height={38} priority />
          </Link>

          {/* Desktop Navigation */}
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
                fontSize="sm"
                color="brand.muted"
                _hover={{ color: 'brand.fg', textDecoration: 'none' }}
                transition="color 0.2s ease"
              >
                {link.label}
              </Link>
            ))}
            <LanguageSwitcher />
            <Link
              href="#contacto"
              bg="brand.accent"
              color="brand.bg"
              px={6}
              py={2}
              borderRadius="md"
              fontSize="sm"
              fontWeight={600}
              display="inline-block"
              _hover={{ bg: 'accent.emphasized', textDecoration: 'none' }}
              _focusVisible={{ outline: '2px solid', outlineColor: 'brand.accent', outlineOffset: '2px' }}
              transition="background 0.2s ease"
            >
              {t('contact')}
            </Link>
          </Stack>

          {/* Mobile Menu Toggle Button */}
          <IconButton
            display={{ base: 'flex', md: 'none' }}
            onClick={onToggle}
            aria-label="Abrir menú de navegación"
            color="brand.fg"
            bg="transparent"
            _hover={{ bg: 'whiteAlpha.200' }}
            variant="ghost"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </IconButton>
        </Flex>
      </Container>

      {/* Full Screen Mobile Menu */}
      <AnimatePresence>
        {open && (
          <Box
            asChild
            position="fixed"
            top="0"
            left="0"
            w="100vw"
            h="100dvh"
            bg={brandAlpha.bg(0.98)}
            backdropFilter="blur(20px)"
            display={{ base: 'flex', md: 'none' }}
            flexDirection="column"
            zIndex={999}
          >
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
            >
              <Container maxW="1280px" mx="auto" px={5} h="full" pt={24} pb={12}>
                <Flex direction="column" justify="space-between" h="full">
                  <Stack gap={8} align="center" w="full" mt={8}>
                    {navLinks.map((link) => (
                      <Box asChild key={link.href}>
                        <motion.div variants={itemVariants}>
                          <Link
                            href={link.href}
                            fontSize="2xl"
                            fontWeight={600}
                            color="brand.fg"
                            letterSpacing="tight"
                            _hover={{ color: 'brand.accent', textDecoration: 'none' }}
                            onClick={onClose}
                          >
                            {link.label}
                          </Link>
                        </motion.div>
                      </Box>
                    ))}
                  </Stack>

                  <Stack gap={8} align="center" w="full">
                    <Box asChild>
                      <motion.div variants={itemVariants}>
                        <LanguageSwitcher />
                      </motion.div>
                    </Box>

                    <Box asChild w="full" maxW="300px">
                      <motion.div variants={itemVariants}>
                        <Link
                          href="#contacto"
                          bg="brand.accent"
                          color="brand.bg"
                          px={8}
                          py={4}
                          borderRadius="full"
                          fontSize="lg"
                          fontWeight={600}
                          display="block"
                          textAlign="center"
                          w="full"
                          _hover={{ bg: 'accent.emphasized', textDecoration: 'none', transform: 'translateY(-2px)' }}
                          transition="all 0.2s"
                          onClick={onClose}
                        >
                          {t('contact')}
                        </Link>
                      </motion.div>
                    </Box>
                  </Stack>
                </Flex>
              </Container>
            </motion.div>
          </Box>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default Header;
