"use client";

import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Container, 
  Flex, 
  Heading, 
  Input, 
  Text, 
  Textarea, 
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
  
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

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
        <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={10} ref={ref}>
          {/* Left side - Contact Info */}
          <MotionBox
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6 }}
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
                    <Text color="gray.600">+54 9 11 XXXX-XXXX</Text>
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

          {/* Right side - Contact Form */}
          <MotionBox
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Box
              bg="white"
              borderRadius="xl"
              boxShadow="lg"
              p={{ base: 6, md: 8 }}
              borderTop="4px solid"
              borderColor="primary.500"
            >
              <form onSubmit={handleSubmit}>
                <Stack gap={5}>
                  <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={5} w="full">
                    <Box>
                      <Text mb={2} fontWeight="medium">Nombre</Text>
                      <Input 
                        type="text" 
                        placeholder="Tu nombre"
                      />
                    </Box>
                    <Box>
                      <Text mb={2} fontWeight="medium">Correo Electrónico</Text>
                      <Input 
                        type="email" 
                        placeholder="tucorreo@ejemplo.com"
                      />
                    </Box>
                  </Grid>

                  <Box w="full">
                    <Text mb={2} fontWeight="medium">Empresa</Text>
                    <Input 
                      type="text" 
                      placeholder="Nombre de tu empresa"
                    />
                  </Box>

                  <Box w="full">
                    <Text mb={2} fontWeight="medium">Mensaje</Text>
                    <Textarea 
                      placeholder="Cuéntanos sobre tu proyecto o desafío"
                      rows={5}
                    />
                  </Box>

                  {submitted && (
                    <Box w="full" p={4} bg="green.50" borderRadius="md" color="green.700">
                      ✓ Mensaje enviado. Nos pondremos en contacto pronto.
                    </Box>
                  )}

                  <Button 
                    bg="primary.500"
                    color="white"
                    size="lg" 
                    type="submit" 
                    w="full" 
                    mt={4}
                    _hover={{ bg: 'primary.600' }}
                  >
                    Enviar Mensaje
                  </Button>
                </Stack>
              </form>
            </Box>
          </MotionBox>
        </Grid>
      </Container>
    </Box>
  );
};

export default ContactSection;
