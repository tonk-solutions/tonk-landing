"use client";

import React from 'react';
import { Box, Container, Grid, Heading, Text, Icon, Flex } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Code, Cloud, FileText, BrainCircuit } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

const MotionBox = motion(Box);

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactElement;
  delay: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, icon, delay }) => {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <MotionBox
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay: delay }}
    >
      <Box
        as="article"
        bg="white"
        borderRadius="xl"
        p={6}
        boxShadow="lg"
        borderTop="4px solid"
        borderColor="primary.500"
        height="100%"
        transition="all 0.3s"
        _hover={{ transform: 'translateY(-8px)', boxShadow: 'xl' }}
      >
        <Flex
          w="60px"
          h="60px"
          bg="primary.50"
          color="primary.500"
          borderRadius="lg"
          justify="center"
          align="center"
          mb={4}
          aria-hidden="true"
        >
          {icon}
        </Flex>
        <Heading as="h3" size="md" mb={3} color="gray.800">
          {title}
        </Heading>
        <Text as="p" color="gray.600">
          {description}
        </Text>
      </Box>
    </MotionBox>
  );
};

const ServicesSection = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <Box
      as="section"
      id="servicios"
      aria-labelledby="servicios-heading"
      py={{ base: 14, md: 20 }}
      px={{ base: 4, md: 8 }}
      bg="gray.50"
      w="100%"
      overflow="hidden"
    >
      <Container maxW="container.xl" w="100%" px={0}>
        <Flex direction="column" gap={10} mb={10} ref={ref} align="center">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            textAlign="center"
            maxW="800px"
            w="full"
          >
            <Text color="primary.500" fontWeight="medium" mb={2}>
              NUESTROS SERVICIOS DE INGENIERÍA
            </Text>
            <Heading as="h2" id="servicios-heading" size="xl" mb={4}>
              Soluciones de software enterprise para desafíos de escala
            </Heading>
            <Text as="p" fontSize="lg" color="gray.600">
              Sabemos que llegar al Product-Market Fit es solo el primer paso.
              El verdadero desafío es que la tecnología soporte el crecimiento sin romperse.
              Nuestra especialización en ingeniería de software financiero y migración de sistemas legacy
              nos posiciona como socios estratégicos en esa transición.
            </Text>
          </MotionBox>
        </Flex>
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }}
          gap={{ base: 4, md: 8 }}
          w="100%"
        >
          <ServiceCard
            title="Ingeniería de Software Financiero"
            description="Diseñamos y mantenemos plataformas transaccionales críticas de Core Banking y medios de pago, manejando alta volumetría con integridad y seguridad financiera garantizada."
            icon={<Icon as={Code} boxSize={8} />}
            delay={0.1}
          />
          <ServiceCard
            title="Arquitectura Cloud-Native y Microservicios"
            description="Transformamos monolitos en ecosistemas escalables y resilientes mediante migración a microservicios y arquitecturas cloud-native que soportan picos de demanda sin degradación."
            icon={<Icon as={Cloud} boxSize={8} />}
            delay={0.2}
          />
          <ServiceCard
            title="Soluciones Enterprise, SAP & ERP"
            description="Orquestamos procesos críticos en grandes corporaciones con integración SAP y modernización ERP, donde la precisión del dato y la continuidad sistémica son innegociables."
            icon={<Icon as={FileText} boxSize={8} />}
            delay={0.3}
          />
          <ServiceCard
            title="IA Aplicada y Automatización Enterprise"
            description="Implementamos inteligencia artificial con respaldo académico y práctico para gestión del conocimiento, automatización de procesos y optimización operativa en entornos empresariales."
            icon={<Icon as={BrainCircuit} boxSize={8} />}
            delay={0.4}
          />
        </Grid>
      </Container>
    </Box>
  );
};

export default ServicesSection;
