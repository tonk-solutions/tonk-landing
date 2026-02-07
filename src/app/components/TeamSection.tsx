"use client";

import React from 'react';
import { Box, Container, Flex, Heading, Text, Link, Grid, Icon } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Linkedin } from 'lucide-react';
import Image from 'next/image';

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
        as="article"
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
            {avatarUrl ? (
              <Box
                w="80px"
                h="80px"
                borderRadius="full"
                overflow="hidden"
                border="4px solid"
                borderColor="gray.100"
                position="relative"
              >
                <Image
                  src={avatarUrl}
                  alt={`${name} - ${role} en Tonk Solutions`}
                  width={80}
                  height={80}
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                />
              </Box>
            ) : (
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
                aria-hidden="true"
              >
                {name.charAt(0)}
              </Box>
            )}
          </Flex>

          <Flex direction="column" p={5} gap={2} align="center" flex="1">
            <Heading as="h3" size="md">
              {name}
            </Heading>
            <Text color="primary.500" fontWeight="medium" fontSize="sm">
              {role}
            </Text>
            <Text as="p" textAlign="center" color="gray.600" fontSize="sm" mt={2}>
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
              aria-label={`Perfil de LinkedIn de ${name}`}
            >
              <Icon as={Linkedin} mr={2} /> LinkedIn
            </Link>
          </Flex>
        </Flex>
      </Box>
    </MotionBox>
  );
};

interface TeamMemberData {
  name: string;
  role: string;
  bio: string;
  linkedin: string;
  delay: number;
  avatarUrl: string;
}

const TEAM_MEMBERS: ReadonlyArray<TeamMemberData> = [
  {
    name: "Ignacio Sileo",
    role: "Co-Founder & SAP/Enterprise Lead",
    bio: "Especialización en Accenture y Softtek liderando implementación y soporte de soluciones SAP para corporaciones enterprise.",
    linkedin: "https://www.linkedin.com/in/ignacio-sileo/",
    delay: 0.1,
    avatarUrl: "/images/founders/ignacio-sileo.jpeg",
  },
  {
    name: "Matías Castillo",
    role: "Co-Founder & Financial Systems Lead",
    bio: "Experiencia en BBVA como App Owner de sistemas financieros críticos, Core Banking y medios de pago.",
    linkedin: "https://www.linkedin.com/in/matias-agustin-castillo-98b332115/",
    delay: 0.2,
    avatarUrl: "/images/founders/agustin-castillo.jpeg",
  },
  {
    name: "Nicolás Gómez",
    role: "Co-Founder & Core Banking Lead",
    bio: "Trayectoria en Santander e ICBC en desarrollo y evolución de productos bancarios core y sistemas transaccionales.",
    linkedin: "https://www.linkedin.com/in/nicolas-gomez-467b26141/",
    delay: 0.3,
    avatarUrl: "/images/founders/nicolas-gomez.jpeg",
  },
  {
    name: "Rodrigo Hernandez",
    role: "Co-Founder & Cloud Architecture Lead",
    bio: "Experiencia en Endava, Stori y Rootstrap en ingeniería de soluciones cloud-native escalables y microservicios.",
    linkedin: "https://www.linkedin.com/in/rodrigoenzohernandez/",
    delay: 0.4,
    avatarUrl: "/images/founders/rodrigo-hernandez.jpeg",
  },
];

const TeamSection = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <Box
      as="section"
      id="equipo"
      aria-labelledby="equipo-heading"
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
              NUESTRO EQUIPO FUNDADOR
            </Text>
            <Heading as="h2" id="equipo-heading" size="xl" mb={4}>
              Seniority en ingeniería financiera y enterprise
            </Heading>
            <Text as="p" fontSize="lg" color="gray.600" maxW="800px" mx="auto">
              Nuestra autoridad en continuidad sistémica se sustenta en la trayectoria de
              nuestros fundadores en instituciones financieras y consultoras de primer nivel:
              BBVA, Santander, ICBC, Accenture, Softtek, Endava.
            </Text>
          </MotionBox>
        </Flex>

        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={8}>
          {TEAM_MEMBERS.map((member) => (
            <TeamMember
              key={member.name}
              name={member.name}
              role={member.role}
              bio={member.bio}
              linkedin={member.linkedin}
              delay={member.delay}
              avatarUrl={member.avatarUrl}
            />
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default TeamSection;
