"use client";

import React from 'react';
import { Box, Container, Flex, Heading, Text, Link, Grid, Icon } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Linkedin } from 'lucide-react';

const MotionBox = motion(Box);

interface TeamMemberProps {
  name: string;
  role: string;
  bio: string;
  linkedin: string;
  delay: number;
  avatarUrl?: string;
}

const TeamMember: React.FC<TeamMemberProps> = ({ name, role, bio, linkedin, delay, avatarUrl }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <MotionBox
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay }}
    >
      <Box
        bg="white"
        borderRadius="xl"
        overflow="hidden"
        boxShadow="md"
        borderWidth="1px"
        borderColor="gray.100"
        height="100%"
        transition="all 0.3s ease"
        _hover={{ boxShadow: 'lg', transform: 'translateY(-5px)' }}
      >
        <Flex direction="column" h="100%">
          <Flex justify="center" pt={8} pb={4}>
            <Box
              w="80px"
              h="80px"
              borderRadius="full"
              bg="primary.500"
              color="white"
              display="flex"
              alignItems="center"
              justifyContent="center"
              border="4px solid"
              borderColor="gray.100"
              fontSize="2xl"
              fontWeight="bold"
            >
              {name.charAt(0)}
            </Box>
          </Flex>

          <Flex direction="column" p={5} gap={2} align="center" flex="1">
            <Heading as="h3" size="md">
              {name}
            </Heading>
            <Text color="primary.500" fontWeight="medium" fontSize="sm">
              {role}
            </Text>
            <Text textAlign="center" color="gray.600" fontSize="sm" mt={2}>
              {bio}
            </Text>
          </Flex>

          <Flex justify="center" borderTop="1px solid" borderColor="gray.100" p={4}>
            <Link 
              href={linkedin} 
              target="_blank"
              rel="noopener noreferrer"
              display="flex" 
              alignItems="center" 
              color="secondary.600"
              _hover={{ color: 'secondary.500' }}
            >
              <Icon as={Linkedin} mr={2} /> LinkedIn
            </Link>
          </Flex>
        </Flex>
      </Box>
    </MotionBox>
  );
};

const TeamSection = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const teamMembers = [
    {
      name: "Ignacio Sileo",
      role: "Co-Founder",
      bio: "Especialización en Accenture y Softtek con implementación y soporte de soluciones SAP.",
      linkedin: "https://www.linkedin.com/in/ignacio-sileo/",
      delay: 0.1
    },
    {
      name: "Matías Castillo",
      role: "Co-Founder",
      bio: "Experiencia en BBVA como App Owner de sistemas financieros críticos y medios de pago.",
      linkedin: "https://www.linkedin.com/in/matias-agustin-castillo-98b332115/",
      delay: 0.2
    },
    {
      name: "Nicolás Gómez",
      role: "Co-Founder",
      bio: "Trayectoria en Santander e ICBC en desarrollo y evolución de productos bancarios core.",
      linkedin: "https://www.linkedin.com/in/nicolas-gomez-467b26141/",
      delay: 0.3
    },
    {
      name: "Rodrigo Hernandez",
      role: "Co-Founder",
      bio: "Experiencia en Endava, Stori y Rootstrap en desarrollo de soluciones escalables.",
      linkedin: "https://www.linkedin.com/in/rodrigoenzohernandez/",
      delay: 0.4
    },
  ];

  return (
    <Box
      id="equipo"
      py={{ base: 14, md: 20 }}
      px={{ base: 4, md: 8 }}
      bg="gray.50"
      w="100%"
      overflow="hidden"
    >
      <Container maxW="container.xl" w="100%" px={0}>
        <Flex direction="column" gap={6} mb={12} ref={ref}>
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            textAlign="center"
          >
            <Text color="primary.500" fontWeight="medium" mb={2}>
              NUESTRO EQUIPO
            </Text>
            <Heading as="h2" size="xl" mb={4}>
              El Seniority Detrás de Tonk
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="800px" mx="auto">
              Nuestra autoridad se sustenta en la trayectoria de nuestros directores en compañías de primer nivel.
            </Text>
          </MotionBox>
        </Flex>

        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={8}>
          {teamMembers.map((member, index) => (
            <TeamMember
              key={index}
              name={member.name}
              role={member.role}
              bio={member.bio}
              linkedin={member.linkedin}
              delay={member.delay}
            />
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default TeamSection;
