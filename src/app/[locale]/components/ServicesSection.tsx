"use client";

import React, { useState } from 'react';
import { Box, Container, Grid, Heading, Text, Icon, Flex, SegmentGroup } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Code, Cloud, FileText, BrainCircuit, Users, CheckCircle, Sparkles, UserCheck, Hammer, UsersRound } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { useTranslations } from 'next-intl';

const MotionBox = motion(Box);

interface Service {
  title: string;
  description: string;
  icon: string;
}

interface Branch {
  name: string;
  subtitle: string;
  services: Service[];
}

const iconMap: Record<string, React.ElementType> = {
  Code,
  Cloud,
  FileText,
  BrainCircuit,
  Users,
  CheckCircle,
  Sparkles,
  UserCheck,
};

interface BranchServicesGridProps {
  branch: Branch;
}

const BranchServicesGrid: React.FC<BranchServicesGridProps> = ({ branch }) => {
  const [selectedServiceIndex, setSelectedServiceIndex] = useState(0);

  if (branch.services.length === 0) return null;

  const selectedService = branch.services[selectedServiceIndex];

  return (
    <Grid
      templateColumns={{ base: "1fr", lg: "300px 1fr" }}
      gap={{ base: 6, lg: 12 }}
      w="100%"
      bg="white"
      rounded="xl"
      p={{ base: 6, lg: 8 }}
      boxShadow="sm"
      border="1px solid"
      borderColor="gray.100"
    >
      <Box>
        <Text
          fontSize="xs"
          fontWeight="bold"
          color="dark.500"
          textTransform="uppercase"
          letterSpacing="0.15em"
          mb={6}
        >
          {branch.name === "Producto" ? "Nuestras Especialidades" : "Nuestros Servicios"}
        </Text>
        <Flex direction="column" gap={2}>
          {branch.services.map((service, index) => (
            <Box
              key={service.title}
              p={4}
              rounded="lg"
              cursor="pointer"
              onClick={() => setSelectedServiceIndex(index)}
              onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedServiceIndex(index); } }}
              role="button"
              tabIndex={0}
              transition="background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease"
              position="relative"
              bg={selectedServiceIndex === index ? "dark.900" : "white"}
              border="1px solid"
              borderColor={selectedServiceIndex === index ? "dark.700" : "gray.200"}
              _hover={{
                borderColor: selectedServiceIndex === index ? "dark.700" : "primary.300",
                bg: selectedServiceIndex === index ? "dark.900" : "gray.50",
              }}
              boxShadow={selectedServiceIndex === index ? "0 4px 20px rgba(6, 182, 212, 0.1)" : undefined}
            >
              <Flex align="center" gap={3}>
                <Flex
                  w="36px"
                  h="36px"
                  borderRadius="md"
                  bg={selectedServiceIndex === index ? "primary.500" : "gray.100"}
                  justify="center"
                  align="center"
                  transition="background 0.25s ease"
                >
                  <Icon
                    as={iconMap[service.icon] || Code}
                    boxSize={4}
                    color={selectedServiceIndex === index ? "white" : "dark.500"}
                  />
                </Flex>
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  color={selectedServiceIndex === index ? "white" : "dark.700"}
                >
                  {service.title}
                </Text>
              </Flex>
            </Box>
          ))}
        </Flex>
      </Box>

      <Box display="flex" alignItems="center">
        <MotionBox
          key={selectedService.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Flex align="center" gap={5} mb={6}>
            <Flex
              w="80px"
              h="80px"
              borderRadius="xl"
              justify="center"
              align="center"
              background="linear-gradient(135deg, #06b6d4, #2563eb)"
            >
              <Icon as={iconMap[selectedService.icon] || Code} boxSize={10} color="white" />
            </Flex>
            <Box>
              <Heading as="h3" fontSize="clamp(1.5rem, 3vw + 0.5rem, 2rem)" color="dark.900" lineHeight="1.3">
                {selectedService.title}
              </Heading>
              <Box
                w="40px"
                h="2px"
                mt={2}
                background="linear-gradient(90deg, #06b6d4, transparent)"
              />
            </Box>
          </Flex>

          <Text fontSize="clamp(0.875rem, 1vw + 0.5rem, 1rem)" color="dark.600" lineHeight="1.8" mb={8}>
            {selectedService.description}
          </Text>

        </MotionBox>
      </Box>
    </Grid>
  );
};

const ServicesSection = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const t = useTranslations('services');
  
  const branches: Branch[] = [
    {
      name: t('craft.name'),
      subtitle: t('craft.subtitle'),
      services: t.raw('craft.services') as Service[]
    },
    {
      name: t('talent.name'),
      subtitle: t('talent.subtitle'),
      services: t.raw('talent.services') as Service[]
    }
  ];
  
  const [selectedBranch, setSelectedBranch] = useState(branches[0].name);

  const branchIcons: Record<string, React.ElementType> = {
    [branches[0].name]: Hammer,
    [branches[1].name]: UsersRound,
  };

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
      scrollMarginTop="80px"
    >
      <Container maxW="1280px" mx="auto" w="100%" px={0}>
        <Flex direction="column" gap={10} mb={10} ref={ref} align="center">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            textAlign="center"
            maxW="800px"
            w="full"
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
            <Heading as="h2" id="servicios-heading" fontSize="clamp(1.8rem, 4vw + 1rem, 2.5rem)" lineHeight="1.2" mb={4}>
              {t('title')}
            </Heading>
            <Text as="p" fontSize="clamp(1rem, 1.5vw + 0.5rem, 1.125rem)" color="dark.500">
              {t('description')}
            </Text>
          </MotionBox>
        </Flex>
        <Box display="flex" justifyContent="center" mb={8} suppressHydrationWarning>
          <SegmentGroup.Root
            value={selectedBranch}
            onValueChange={(e) => setSelectedBranch(e.value || branches[0]?.name || "")}
            size="lg"
            bg="white"
            p={1}
            rounded="full"
            border="1px solid"
            borderColor="gray.200"
            css={{
              "--segment-indicator-bg": "var(--chakra-colors-dark-900, #0f172a)",
              "--segment-indicator-shadow": "none",
            }}
            suppressHydrationWarning
          >
            <SegmentGroup.Indicator rounded="full" />
            {branches.map((branch) => (
              <SegmentGroup.Item 
                key={branch.name} 
                value={branch.name}
                px={8}
                py={3}
                rounded="full"
                _checked={{
                  bg: "dark.900",
                }}
                bg="white"
              >
                <Flex align="center" gap={2}>
                  <Icon
                    as={branchIcons[branch.name] || Hammer}
                    boxSize={4}
                    _checked={{ color: "white" }}
                  />
                  <SegmentGroup.ItemText 
                    fontWeight="semibold"
                    color="dark.600"
                    _checked={{
                      color: "white",
                    }}
                    fontSize="sm"
                  >
                    {branch.name}
                  </SegmentGroup.ItemText>
                </Flex>
                <SegmentGroup.ItemHiddenInput />
              </SegmentGroup.Item>
            ))}
          </SegmentGroup.Root>
        </Box>

        {branches.map((branch) => (
          selectedBranch === branch.name && (
            <MotionBox
              key={branch.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              mb={8}
              textAlign="center"
            >
              <Text as="p" fontSize="lg" color="dark.500" maxW="600px" mx="auto">
                {branch.subtitle}
              </Text>
            </MotionBox>
          )
        ))}

        {branches.map((branch) => (
          selectedBranch === branch.name && (
            <BranchServicesGrid key={branch.name} branch={branch} />
          )
        ))}
      </Container>
    </Box>
  );
};

export default ServicesSection;
