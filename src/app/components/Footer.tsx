"use client";

import React, { useEffect, useState } from 'react';
import { Box, Container, Flex, Link, Stack, Text } from '@chakra-ui/react';
import { FaLinkedin, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import TonkLogo from './TonkLogo';
import { getContentData, ContentData } from '@/lib/content';

interface SocialLink {
  icon: string;
  href: string;
  ariaLabel: string;
}

interface ContactLink {
  label: string;
  href: string;
  value: string;
  icon?: string;
}

const Footer = () => {
  const [content, setContent] = useState<ContentData>({});
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const loadContent = async () => {
      const data = await getContentData('footer');
      setContent(data);
    };
    loadContent();
  }, []);

  const getIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'linkedin':
        return <FaLinkedin />;
      case 'instagram':
        return <FaInstagram />;
      case 'whatsapp':
        return <FaWhatsapp style={{ marginRight: '8px' }} />;
      default:
        return null;
    }
  };

  const description = content.description as string;
  const contactLabel = content.contactLabel as string;
  const socialLabel = content.socialLabel as string;
  const contactLinks = (content.contactLinks as ContactLink[]) || [];
  const socialLinks = (content.socialLinks as SocialLink[]) || [];
  const copyright = (content.copyright as string) || '';

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
              {description}
            </Text>
          </Box>

          <Stack direction={{ base: 'column', md: 'row' }} gap={12}>
            <Box as="nav" aria-label="Información de contacto">
              <Text fontWeight="bold" mb={4}>{contactLabel}</Text>
              <Stack gap={2}>
                {contactLinks.map((link, index) => (
                  <Link
                    key={index}
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
              <Text fontWeight="bold" mb={4}>{socialLabel}</Text>
              <Stack direction="row" gap={4}>
                {socialLinks.map((link, index) => (
                  <Link
                    key={index}
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
            {copyright.replace('{year}', currentYear.toString())}
          </Text>
        </Flex>
      </Container>
    </Box>
  );
};

export default Footer;
