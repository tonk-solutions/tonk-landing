"use client";

import React from 'react';
import { Box, Container, Flex, Link, Stack, Text } from '@chakra-ui/react';
import { FaLinkedin, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import TonkLogo from './TonkLogo';
import { useTranslations } from 'next-intl';

const Footer = () => {
  const t = useTranslations('footer');
  const currentYear = new Date().getFullYear();

  const getIcon = (iconName: string | undefined) => {
    if (!iconName || typeof iconName !== 'string') return null;
    switch (iconName.toLowerCase()) {
      case 'linkedin':
        return <FaLinkedin aria-hidden="true" focusable={false} />;
      case 'instagram':
        return <FaInstagram aria-hidden="true" focusable={false} />;
      case 'whatsapp':
        return <FaWhatsapp aria-hidden="true" focusable={false} style={{ marginRight: '8px' }} />;
      default:
        return null;
    }
  };

  const socialLinks = [
    { icon: "linkedin", href: "https://www.linkedin.com/company/tonk-solutions", ariaLabel: "Tonk Solutions en LinkedIn" },
    { icon: "instagram", href: "https://www.instagram.com/tonk_solutions", ariaLabel: "Tonk Solutions en Instagram" }
  ];

  const contactLinks = [
    { label: "Email", href: "mailto:contact@tonksolutions.com.ar", value: "contact@tonksolutions.com.ar" },
    { label: "WhatsApp", href: "https://wa.me/5491123908349", value: "+54 9 11 2390-8349", icon: "whatsapp" }
  ];

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
              {t('description')}
            </Text>
          </Box>

          <Stack direction={{ base: 'column', md: 'row' }} gap={12}>
            <Box as="nav" aria-label="Información de contacto">
              <Text fontWeight="bold" mb={4}>{t('contactLabel')}</Text>
              <Stack gap={2}>
                {contactLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                    rel={link.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                    display="flex"
                    alignItems="center"
                    color="gray.400"
                    fontSize="sm"
                    _hover={{ color: 'primary.400' }}
                  >
                    {link.icon && getIcon(link.icon)}
                    {link.value}
                  </Link>
                ))}
              </Stack>
            </Box>

            <Box as="nav" aria-label="Redes sociales">
              <Text fontWeight="bold" mb={4}>{t('socialLabel')}</Text>
              <Stack direction="row" gap={4}>
                {socialLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    color="gray.400"
                    _hover={{ color: 'primary.400' }}
                    fontSize="xl"
                    aria-label={link.ariaLabel}
                  >
                    {getIcon(link.icon)}
                  </Link>
                ))}
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
            {t('copyright', { year: currentYear })}
          </Text>
        </Flex>
      </Container>
    </Box>
  );
};

export default Footer;
