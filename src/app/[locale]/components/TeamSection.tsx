"use client";

import React from 'react';
import { Box, Container, Flex, Heading, Text, Link, Grid } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Linkedin } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

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
        boxShadow="sm"
        borderWidth="1px"
        borderColor="gray.100"
        height="100%"
        transition="transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease"
        _hover={{
          boxShadow: 'md',
          transform: 'scale(1.02)',
          borderColor: 'primary.300',
        }}
      >
        <Flex direction="column" h="100%">
          <Flex justify="center" pt={8} pb={4}>
            {avatarUrl ? (
              <Box
                w="88px"
                h="88px"
                borderRadius="full"
                overflow="hidden"
                position="relative"
                p="3px"
                transition="all 0.35s ease"
                background="linear-gradient(135deg, rgba(203, 213, 225, 0.5), rgba(203, 213, 225, 0.5))"
                _hover={{
                  background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
                }}
              >
                <Box
                  w="100%"
                  h="100%"
                  borderRadius="full"
                  overflow="hidden"
                  position="relative"
                >
                  <Image
                    src={avatarUrl}
                    alt={`${name} - ${role} en Tonk Solutions`}
                    width={88}
                    height={88}
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  />
                </Box>
              </Box>
            ) : (
              <Box
                w="88px"
                h="88px"
                borderRadius="full"
                position="relative"
                p="3px"
                transition="all 0.35s ease"
                background="linear-gradient(135deg, rgba(203, 213, 225, 0.5), rgba(203, 213, 225, 0.5))"
                _hover={{
                  background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
                }}
              >
                <Box
                  w="100%"
                  h="100%"
                  borderRadius="full"
                  bg="dark.900"
                  color="white"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="2xl"
                  fontWeight="bold"
                  aria-hidden="true"
                >
                  {name.charAt(0)}
                </Box>
              </Box>
            )}
          </Flex>

          <Flex direction="column" p={5} gap={2} align="center" flex="1">
            <Heading as="h3" fontSize="clamp(1.125rem, 2vw + 0.5rem, 1.3rem)">
              {name}
            </Heading>
            <Box>
              <Text
                color="primary.600"
                fontWeight="semibold"
                fontSize="sm"
                textTransform="uppercase"
                letterSpacing="0.08em"
              >
                {role}
              </Text>
              <Box
                w="24px"
                h="2px"
                mx="auto"
                mt={1}
                background="linear-gradient(90deg, #06b6d4, transparent)"
              />
            </Box>
            <Text as="p" textAlign="center" color="dark.500" fontSize="sm" mt={2}>
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
              gap={2}
              color="dark.500"
              fontSize="sm"
              fontWeight="medium"
              _hover={{ color: 'primary.500' }}
              aria-label={`Perfil de LinkedIn de ${name}`}
              transition="color 0.2s ease"
            >
              <Linkedin size={16} /> LinkedIn
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

const TeamSection = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const t = useTranslations('team');
  
  type RawMember = Omit<TeamMemberData, 'delay'>;
  const rawMembers = t.raw('members') as RawMember[];
  const teamMembers: TeamMemberData[] = rawMembers.map((member, index) => ({
    ...member,
    delay: 0.1 * (index + 1),
  }));

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
      scrollMarginTop="80px"
    >
      <Container maxW="1280px" mx="auto" w="100%" px={0}>
        <Flex direction="column" gap={6} mb={12} ref={ref}>
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            textAlign="center"
          >
            <Text
              color="primary.500"
              fontWeight="semibold"
              mb={2}
              fontSize="sm"
              textTransform="uppercase"
              letterSpacing="0.15em"
            >
              {t('label')}
            </Text>
            <Heading as="h2" id="equipo-heading" fontSize="clamp(1.8rem, 4vw + 1rem, 2.5rem)" lineHeight="1.2" mb={4}>
              {t('title')}
            </Heading>
            <Text as="p" fontSize="clamp(1rem, 1.5vw + 0.5rem, 1.125rem)" color="dark.500" maxW="800px" mx="auto">
              {t('description')}
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
              avatarUrl={member.avatarUrl}
            />
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default TeamSection;
