"use client";

import React from 'react';
import { Box, Container, Flex, Heading, Text, Link, Grid } from '@chakra-ui/react';
import { m } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Linkedin } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { brandAlpha } from '@/app/brandTokens';

const MotionBox = m(Box);

interface TeamMemberProps {
  name: string;
  role: string;
  bio: string;
  linkedin: string;
  delay: number;
  avatarUrl?: string;
  isSpokesperson?: boolean;
  spokespersonLabel: string;
}

const TeamMember: React.FC<TeamMemberProps> = ({
  name,
  role,
  bio,
  linkedin,
  delay,
  avatarUrl,
  isSpokesperson = false,
  spokespersonLabel,
}) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const tA11y = useTranslations('a11y');

  return (
    <MotionBox
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay }}
    >
      <Box
        as="article"
        data-testid="team-card"
        bg="brand.surface"
        borderRadius="xl"
        overflow="hidden"
        borderWidth="1px"
        borderColor="brand.border"
        height="100%"
        transition="transform 0.35s ease, border-color 0.35s ease"
        _hover={{
          transform: 'translateY(-2px)',
          borderColor: 'brand.accentHalo',
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
                p="2px"
                bg={brandAlpha.fg(0.1)}
                transition="background 0.35s ease"
                _hover={{ background: 'brand.accentGlow' }}
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
                    alt={tA11y('teamAvatar', { name, role })}
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
                p="2px"
                bg={brandAlpha.fg(0.1)}
                transition="background 0.35s ease"
                _hover={{ background: 'brand.accentGlow' }}
              >
                <Box
                  w="100%"
                  h="100%"
                  borderRadius="full"
                  bg="brand.bg"
                  color="brand.fg"
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
            <Heading as="h3" fontSize="clamp(1.125rem, 2vw + 0.5rem, 1.3rem)" color="brand.fg">
              {name}
            </Heading>
            <Box textAlign="center">
              <Text
                as="p"
                fontFamily="mono"
                color="brand.muted"
                fontSize="xs"
                textTransform="uppercase"
                letterSpacing="0.08em"
              >
                {role}
              </Text>
              <Box
                w="24px"
                h="2px"
                mx="auto"
                mt={2}
                bg="brand.accent"
                opacity={0.7}
              />
            </Box>

            {isSpokesperson && (
              <Box
                data-testid="spokesperson-badge"
                display="inline-flex"
                alignItems="center"
                px={2}
                py="2px"
                mt={1}
                border="1px solid"
                borderColor="brand.accentHalo"
                borderRadius="full"
                color="brand.accent"
                fontFamily="mono"
                fontSize="10px"
                textTransform="uppercase"
                letterSpacing="0.12em"
                lineHeight="1.6"
              >
                {spokespersonLabel}
              </Box>
            )}

            <Text as="p" textAlign="center" color="brand.muted" fontSize="sm" mt={2}>
              {bio}
            </Text>
          </Flex>

          <Flex justify="center" borderTop="1px solid" borderColor="brand.border" p={4}>
            <Link
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              display="flex"
              alignItems="center"
              gap={2}
              color="brand.muted"
              fontFamily="mono"
              fontSize="xs"
              _hover={{ color: 'brand.accent' }}
              aria-label={tA11y('teamLinkedIn', { name })}
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
  avatarUrl: string;
  spokesperson?: boolean;
  delay: number;
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
      bg="brand.bg"
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
              color="brand.muted"
              fontFamily="mono"
              mb={3}
              fontSize="xs"
              textTransform="uppercase"
              letterSpacing="0.18em"
            >
              {t('label')}
            </Text>
            <Heading as="h2" id="equipo-heading" fontSize="clamp(1.8rem, 4vw + 1rem, 2.5rem)" lineHeight="1.2" mb={4} color="brand.fg">
              {t('title')}
            </Heading>
            <Text as="p" fontSize="clamp(1rem, 1.5vw + 0.5rem, 1.125rem)" color="brand.muted" maxW="800px" mx="auto">
              {t('description')}
            </Text>
          </MotionBox>
        </Flex>

        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={8}>
          {teamMembers.map((member, index) => (
            <TeamMember
              key={member.name ?? index}
              name={member.name}
              role={member.role}
              bio={member.bio}
              linkedin={member.linkedin}
              delay={member.delay}
              avatarUrl={member.avatarUrl}
              isSpokesperson={member.spokesperson === true}
              spokespersonLabel={t('spokesperson')}
            />
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default TeamSection;
