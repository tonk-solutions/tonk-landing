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
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Mail, Phone, MapPin } from 'lucide-react';

const MotionBox = motion(Box);

interface ContactItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
  href?: string;
}

const ContactItem: React.FC<ContactItemProps> = ({ icon, label, value, href }) => (
  <Flex align="center" gap={4}>
    <Flex
      w="50px"
      h="50px"
      bg="primary.50"
      color="primary.500"
      borderRadius="lg"
      justify="center"
      align="center"
      aria-hidden="true"
    >
      <Icon as={icon} boxSize={5} />
    </Flex>
    <Box>
      <Text fontWeight="medium" color="gray.700">{label}</Text>
      {href ? (
        <Link href={href} color="gray.600" _hover={{ color: 'primary.500' }}>
          {value}
        </Link>
      ) : (
        <Text color="gray.600">{value}</Text>
      )}
    </Box>
  </Flex>
);

const ContactSection = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <Box
      as="section"
      id="contacto"
      aria-labelledby="contacto-heading"
      py={{ base: 14, md: 20 }}
      px={{ base: 4, md: 8 }}
      bg="white"
      position="relative"
      overflow="hidden"
      w="100%"
    >
      <Box
        position="absolute"
        top="-10%"
        right="-5%"
        w="300px"
        h="300px"
        bg="primary.500"
        filter="blur(100px)"
        opacity="0.05"
        borderRadius="full"
        aria-hidden="true"
      />

      <Container maxW="1280px" mx="auto" position="relative" zIndex="2" w="100%" px={0}>
        <Flex justify="center" ref={ref}>
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            maxW="600px"
            w="full"
          >
            <Stack align="flex-start" gap={8}>
              <Box>
                <Text color="primary.500" fontWeight="medium" mb={2}>
                  CONTACTO
                </Text>
                <Heading as="h2" id="contacto-heading" size="xl" mb={4}>
                  ¿Listo para escalar tu plataforma?
                </Heading>
                <Text as="p" fontSize="lg" color="gray.600" maxW="500px">
                  Cuéntanos sobre tu desafío de arquitectura, deuda técnica o migración de
                  sistemas legacy y te mostraremos cómo la continuidad sistémica puede
                  transformar tu operación.
                </Text>
              </Box>

              <Stack gap={6} align="flex-start" w="full">
                <ContactItem
                  icon={Mail}
                  label="Correo Electrónico"
                  value="tonksolutions@gmail.com"
                  href="mailto:tonksolutions@gmail.com"
                />
                <ContactItem
                  icon={Phone}
                  label="WhatsApp"
                  value="+54 9 11 2390-8349"
                  href="https://wa.me/+5491123908349"
                />
                <ContactItem
                  icon={MapPin}
                  label="Ubicación"
                  value="Buenos Aires, Argentina"
                />
              </Stack>
            </Stack>
          </MotionBox>
        </Flex>
      </Container>
    </Box>
  );
};

export default ContactSection;
