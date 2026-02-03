"use client";

import React from 'react';
import { 
  Box, 
  Container, 
  Flex, 
  Heading, 
  Text, 
  Stack,
  Grid,
  Icon,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Mail, Phone, MapPin } from 'lucide-react';

const MotionBox = motion(Box);

const ContactSection = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  
  return (
    <Box
      id="contacto"
      py={{ base: 14, md: 20 }}
      px={{ base: 4, md: 8 }}
      bg="white"
      position="relative"
      overflow="hidden"
      w="100%"
    >
      {/* Background Elements */}
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
      />
      
      <Container maxW="container.xl" position="relative" zIndex="2" w="100%" px={0}>
        <Flex justify="center" ref={ref}>
          {/* Contact Info - Centered */}
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
                  CONTÁCTANOS
                </Text>
                <Heading as="h2" size="xl" mb={4}>
                  ¿Listo para Escalar?
                </Heading>
                <Text fontSize="lg" color="gray.600" maxW="500px">
                  Cuéntanos sobre tu desafío tecnológico y te mostraremos cómo podemos ayudarte a superarlo.
                </Text>
              </Box>

              <Stack gap={6} align="flex-start" w="full">
                <Flex align="center" gap={4}>
                  <Flex 
                    w="50px" 
                    h="50px" 
                    bg="primary.50" 
                    color="primary.500" 
                    borderRadius="lg" 
                    justify="center" 
                    align="center"
                  >
                    <Icon as={Mail} boxSize={5} />
                  </Flex>
                  <Box>
                    <Text fontWeight="medium" color="gray.700">Correo Electrónico</Text>
                    <Text color="gray.600">tonksolutions@gmail.com</Text>
                  </Box>
                </Flex>

                <Flex align="center" gap={4}>
                  <Flex 
                    w="50px" 
                    h="50px" 
                    bg="primary.50" 
                    color="primary.500" 
                    borderRadius="lg" 
                    justify="center" 
                    align="center"
                  >
                    <Icon as={Phone} boxSize={5} />
                  </Flex>
                  <Box>
                    <Text fontWeight="medium" color="gray.700">WhatsApp</Text>
                    <Text color="gray.600">+54 9 11 2390-8349</Text>
                  </Box>
                </Flex>

                <Flex align="center" gap={4}>
                  <Flex 
                    w="50px" 
                    h="50px" 
                    bg="primary.50" 
                    color="primary.500" 
                    borderRadius="lg" 
                    justify="center" 
                    align="center"
                  >
                    <Icon as={MapPin} boxSize={5} />
                  </Flex>
                  <Box>
                    <Text fontWeight="medium" color="gray.700">Ubicación</Text>
                    <Text color="gray.600">Buenos Aires, Argentina</Text>
                  </Box>
                </Flex>
              </Stack>
            </Stack>
          </MotionBox>
        </Flex>
      </Container>
    </Box>
  );
};

export default ContactSection;
