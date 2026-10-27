"use client";

import React from 'react';
import { Box, Container, Flex, Link, Stack, Text } from '@chakra-ui/react';
import { Linkedin, Instagram, MessageCircle } from 'lucide-react';
import TonkLogo from './TonkLogo';
import { useTranslations } from 'next-intl';
import { CONTACT_EMAIL, WHATSAPP_URL } from '@/app/constants';
import { brandAlpha } from '@/app/brandTokens';

const Footer = () => {
  const t = useTranslations('footer');
  const currentYear = new Date().getFullYear();

  const getIcon = (iconName: string | undefined) => {
    if (!iconName || typeof iconName !== 'string') return null;
    switch (iconName.toLowerCase()) {
      case 'linkedin':
        return <Linkedin size={18} aria-hidden="true" />;
      case 'instagram':
        return <Instagram size={18} aria-hidden="true" />;
      case 'whatsapp':
        return <MessageCircle size={16} aria-hidden="true" style={{ marginRight: '6px' }} />;
      default:
        return null;
    }
  };

  const socialLinks = [
    { icon: "linkedin", href: "https://www.linkedin.com/company/tonk-solutions", ariaLabel: "Tonk Solutions en LinkedIn" },
    { icon: "instagram", href: "https://www.instagram.com/tonk_solutions", ariaLabel: "Tonk Solutions en Instagram" }
  ];

  const contactLinks = [
    { label: "Email", href: `mailto:${CONTACT_EMAIL}`, value: CONTACT_EMAIL },
    { label: "WhatsApp", href: WHATSAPP_URL, value: "+54 9 11 2390-8349", icon: "whatsapp" }
  ];

  return (
    <Box as="footer" role="contentinfo" position="relative" bg="brand.bg" color="brand.fg" pt={0} pb={10} px={{ base: 4, md: 8 }} w="100%" overflow="hidden">
      {/* Hairline separator */}
      <Box w="100%" h="1px" mb={12} bg={brandAlpha.fg(0.08)} aria-hidden="true" />

      <Container maxW="1280px" mx="auto" w="100%" px={0}>
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align={{ base: 'center', md: 'flex-start' }}
          gap={8}
        >
          <Box maxW={{ base: '100%', md: '380px' }} mb={{ base: 8, md: 0 }}>
            <TonkLogo variant="apilado" height={96} />
            <Text as="p" mt={5} color="brand.muted" fontSize="sm" lineHeight="tall">
              {t('description')}
            </Text>
          </Box>

          <Stack direction={{ base: 'column', md: 'row' }} gap={12}>
            <Box as="nav" aria-label="Información de contacto">
              <Text
                mb={4}
                fontFamily="mono"
                fontSize="xs"
                textTransform="uppercase"
                letterSpacing="0.15em"
                color="brand.muted"
              >
                {t('contactLabel')}
              </Text>
              <Stack gap={3}>
                {contactLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                    rel={link.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                    display="flex"
                    alignItems="center"
                    color="brand.muted"
                    fontSize="sm"
                    _hover={{ color: 'brand.accent' }}
                    transition="color 0.2s ease"
                  >
                    {link.icon && getIcon(link.icon)}
                    {link.value}
                  </Link>
                ))}
              </Stack>
            </Box>

            <Box as="nav" aria-label="Redes sociales">
              <Text
                mb={4}
                fontFamily="mono"
                fontSize="xs"
                textTransform="uppercase"
                letterSpacing="0.15em"
                color="brand.muted"
              >
                {t('socialLabel')}
              </Text>
              <Stack direction="row" gap={3}>
                {socialLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    w="36px"
                    h="36px"
                    borderRadius="md"
                    color="brand.muted"
                    bg="brand.surface"
                    border="1px solid"
                    borderColor={brandAlpha.fg(0.06)}
                    _hover={{
                      color: 'brand.accent',
                      borderColor: 'brand.accentGlow',
                    }}
                    transition="color 0.2s ease, border-color 0.2s ease"
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
          borderTopColor={brandAlpha.fg(0.08)}
          mt={10}
          pt={6}
          justify="space-between"
          direction={{ base: 'column', sm: 'row' }}
          align="center"
          gap={4}
        >
          <Text fontSize="xs" color="brand.muted">
            {t('copyright', { year: currentYear })}
          </Text>
        </Flex>
      </Container>
    </Box>
  );
};

export default Footer;
