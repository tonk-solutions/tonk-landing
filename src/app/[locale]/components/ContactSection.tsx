"use client";

import React from 'react';
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Stack,
  Icon,
  Link,
  Button,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Mail, Phone, MapPin, ArrowRight, MessageCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

interface ContactItemData {
  icon: string;
  label: string;
  value: string;
  href?: string;
}

const iconMap: Record<string, React.ElementType> = {
  Mail,
  Phone,
  MapPin,
};

interface ContactItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
  href?: string;
  index: number;
  inView: boolean;
}

const ContactItem: React.FC<ContactItemProps> = ({ icon, label, value, href, index, inView }) => {
  const content = (
    <MotionFlex
      initial={{ opacity: 0, x: 30 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
      transition={{ duration: 0.5, delay: 0.3 + index * 0.12 }}
      align="center"
      gap={5}
      p={5}
      borderRadius="xl"
      bg="dark.800"
      border="1px solid"
      borderColor="dark.700"
      position="relative"
      overflow="hidden"
      role="group"
      cursor={href ? "pointer" : "default"}
      css={{ transition: "border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease" }}
      _hover={{
        borderColor: "var(--chakra-colors-primary-500, #06b6d4)",
        transform: "translateY(-2px)",
        boxShadow: "0 8px 32px rgba(6, 182, 212, 0.12)",
      }}
    >
      {/* Subtle gradient shine on hover */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        opacity={0}
        _groupHover={{ opacity: 0.04 }}
        background="linear-gradient(135deg, #06b6d4, #3b82f6)"
        transition="opacity 0.3s ease"
        aria-hidden="true"
      />

      <Flex
        w="48px"
        h="48px"
        borderRadius="lg"
        justify="center"
        align="center"
        flexShrink={0}
        position="relative"
        background="linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(59, 130, 246, 0.1))"
      >
        <Icon as={icon} boxSize={5} color="primary.400" />
      </Flex>

      <Box flex="1" position="relative" zIndex={1} minW={0}>
        <Text
          fontSize="xs"
          fontWeight="bold"
          textTransform="uppercase"
          letterSpacing="0.1em"
          color="dark.400"
          mb={1}
        >
          {label}
        </Text>
        <Text
          fontSize="sm"
          color="dark.200"
          fontWeight="medium"
          _groupHover={{ color: 'primary.300' }}
          transition="color 0.3s ease"
          wordBreak="break-word"
        >
          {value}
        </Text>
      </Box>

      {href && (
        <Box position="relative" zIndex={1} flexShrink={0}>
          <Flex
            w="32px"
            h="32px"
            borderRadius="md"
            bg="dark.700"
            justify="center"
            align="center"
            _groupHover={{ bg: 'primary.500' }}
            transition="background 0.3s ease"
          >
            <ArrowRight size={14} color="currentColor" />
          </Flex>
        </Box>
      )}
    </MotionFlex>
  );

  if (href) {
    return (
      <Link
        href={href}
        target={href.startsWith('mailto:') ? undefined : '_blank'}
        rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
        _hover={{ textDecoration: 'none' }}
        display="block"
      >
        {content}
      </Link>
    );
  }

  return content;
};

const ContactSection = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const t = useTranslations('contact');
  const contactItems: ContactItemData[] = t.raw('items');

  return (
    <Box
      as="section"
      id="contacto"
      aria-labelledby="contacto-heading"
      py={{ base: 16, md: 24 }}
      px={{ base: 4, md: 8 }}
      bg="dark.900"
      position="relative"
      overflow="hidden"
      w="100%"
      scrollMarginTop="80px"
    >
      {/* Dot grid pattern — matching Hero */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        aria-hidden="true"
        bgImage="radial-gradient(circle, rgba(6, 182, 212, 0.08) 1px, transparent 1px)"
        bgSize="32px 32px"
      />

      {/* Noise texture overlay */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        opacity={0.02}
        aria-hidden="true"
        bgImage={`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`}
        bgRepeat="repeat"
        bgSize="128px 128px"
      />

      {/* Gradient glow accents */}
      <Box
        position="absolute"
        top="-10%"
        left="-8%"
        w="450px"
        h="450px"
        aria-hidden="true"
        background="radial-gradient(circle, rgba(6, 182, 212, 0.07) 0%, transparent 70%)"
      />
      <Box
        position="absolute"
        bottom="-10%"
        right="-5%"
        w="400px"
        h="400px"
        aria-hidden="true"
        background="radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)"
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
          viewBox="0 0 1440 600"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        >
          <line x1="0" y1="600" x2="400" y2="0" stroke="rgba(6, 182, 212, 0.04)" strokeWidth="1" />
          <line x1="1100" y1="600" x2="1440" y2="100" stroke="rgba(59, 130, 246, 0.03)" strokeWidth="1" />

          {/* Corner frame elements */}
          <rect x="60" y="40" width="80" height="1" fill="rgba(6, 182, 212, 0.15)" />
          <rect x="60" y="40" width="1" height="60" fill="rgba(6, 182, 212, 0.15)" />
          <rect x="1300" y="540" width="80" height="1" fill="rgba(6, 182, 212, 0.1)" />
          <rect x="1380" y="480" width="1" height="61" fill="rgba(6, 182, 212, 0.1)" />
        </svg>
      </Box>

      {/* Gradient separator at top */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        h="1px"
        background="linear-gradient(90deg, transparent, #06b6d4, #3b82f6, transparent)"
        aria-hidden="true"
      />

      <Container maxW="1280px" mx="auto" position="relative" zIndex="2" w="100%" px={{ base: 5, md: 8 }}>
        <Flex
          ref={ref}
          direction={{ base: 'column', lg: 'row' }}
          gap={{ base: 12, lg: 20 }}
          align={{ base: 'flex-start', lg: 'center' }}
        >
          {/* Left column — Copy */}
          <Box flex="1" maxW={{ base: "100%", lg: "520px" }}>
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
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
                {t('label')}
              </Text>

              <Heading
                as="h2"
                id="contacto-heading"
                fontSize="clamp(1.8rem, 4vw + 1rem, 3rem)"
                color="white"
                mb={5}
                lineHeight="1.2"
                letterSpacing="tight"
              >
                {t('title')}
              </Heading>

              <Text
                as="p"
                fontSize="clamp(1rem, 1.5vw + 0.5rem, 1.125rem)"
                color="dark.400"
                lineHeight="1.6"
                maxW="440px"
                mb={8}
              >
                {t('description')}
              </Text>
            </MotionBox>

            {/* WhatsApp CTA */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link
                href="https://wa.me/5491123908349"
                target="_blank"
                rel="noopener noreferrer"
                _hover={{ textDecoration: 'none' }}
                display="inline-block"
              >
                <Button
                  size="lg"
                  px={8}
                  py={6}
                  borderRadius="full"
                  fontWeight="semibold"
                  letterSpacing="wide"
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
                  <Flex align="center" gap={2}>
                    <MessageCircle size={18} />
                    <Text>Escribinos por WhatsApp</Text>
                  </Flex>
                </Button>
              </Link>
            </MotionBox>
          </Box>

          {/* Right column — Contact items */}
          <Box flex="1" w="full" maxW={{ base: "100%", lg: "480px" }}>
            <Stack gap={4} w="full">
              {contactItems.map((item, index) => (
                <ContactItem
                  key={item.label}
                  icon={iconMap[item.icon] || Mail}
                  label={item.label}
                  value={item.value}
                  href={item.href}
                  index={index}
                  inView={inView}
                />
              ))}
            </Stack>

            {/* Decorative bottom accent */}
            <MotionBox
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              mt={6}
            >
              <Box
                h="1px"
                  background="linear-gradient(90deg, rgba(6, 182, 212, 0.2), rgba(59, 130, 246, 0.15), transparent)"
              />
            </MotionBox>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default ContactSection;
