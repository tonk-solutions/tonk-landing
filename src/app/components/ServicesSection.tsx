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
        >
          {icon}
        </Flex>
        <Heading as="h3" size="md" mb={3} color="gray.800">
          {title}
        </Heading>
        <Text color="gray.600">
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
      id="servicios"
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
              NUESTROS SERVICIOS
            </Text>
            <Heading as="h2" size="xl" mb={4}>
              Soluciones integrales para desafíos de escala
            </Heading>
            <Text fontSize="lg" color="gray.600">
              &quot;Sabemos que llegar al Product-Market Fit es solo el primer paso. El verdadero desafío es que la tecnología soporte el crecimiento sin romperse. Ahí es donde entramos nosotros.&quot;
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
            description="Diseñamos y mantenemos la columna vertebral de operaciones críticas, manejando altos volúmenes transaccionales y garantizando integridad y seguridad financiera."
            icon={<Icon as={Code} boxSize={8} />}
            delay={0.1}
          />
          <ServiceCard
            title="Arquitectura Cloud-Native"
            description="Transformamos aplicaciones monolíticas en ecosistemas escalables y resilientes, especializándonos en arquitecturas que soportan picos de demanda sin degradar el servicio."
            icon={<Icon as={Cloud} boxSize={8} />}
            delay={0.2}
          />
          <ServiceCard
            title="Soluciones Enterprise & SAP"
            description="Resolvemos la complejidad operativa de grandes corporaciones, orquestando procesos críticos donde la precisión del dato es innegociable."
            icon={<Icon as={FileText} boxSize={8} />}
            delay={0.3}
          />
          <ServiceCard
            title="IA Aplicada y Automatización"
            description="Aplicamos ingeniería de IA con respaldo académico y práctico para la gestión del conocimiento y mejora de procesos técnicos en entornos empresariales."
            icon={<Icon as={BrainCircuit} boxSize={8} />}
            delay={0.4}
          />
        </Grid>
      </Container>
    </Box>
  );
};

export default ServicesSection;
