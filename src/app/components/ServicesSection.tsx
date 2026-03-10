"use client";

import React, { useEffect, useState } from 'react';
import { Box, Container, Grid, Heading, Text, Icon, Flex, SegmentGroup } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Code, Cloud, FileText, BrainCircuit, Users, CheckCircle, Sparkles, UserCheck } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { getContentData, ContentData } from '@/lib/content';

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
  const selectedService = branch.services[selectedServiceIndex];

  return (
    <Grid
      templateColumns={{ base: "1fr", lg: "300px 1fr" }}
      gap={{ base: 6, lg: 12 }}
      w="100%"
      bg="white"
      rounded="lg"
      p={{ base: 6, lg: 8 }}
      boxShadow="sm"
    >
      <Box>
        <Text
          fontSize="xs"
          fontWeight="bold"
          color="gray.500"
          textTransform="uppercase"
          letterSpacing="wide"
          mb={6}
        >
          {branch.name === "Producto" ? "Nuestras Especialidades" : "Nuestros Servicios"}
        </Text>
        <Flex direction="column" gap={3}>
          {branch.services.map((service, index) => (
            <Box
              key={service.title}
              p={4}
              rounded="lg"
              bg={selectedServiceIndex === index ? "primary.50" : "white"}
              border="2px solid"
              borderColor={selectedServiceIndex === index ? "primary.500" : "gray.200"}
              cursor="pointer"
              onClick={() => setSelectedServiceIndex(index)}
              transition="all 0.2s"
              _hover={{
                borderColor: "primary.300",
                bg: "primary.50",
              }}
            >
              <Flex align="center" gap={3}>
                <Icon
                  as={iconMap[service.icon] || Code}
                  boxSize={6}
                  color={selectedServiceIndex === index ? "primary.500" : "gray.400"}
                />
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  color={selectedServiceIndex === index ? "gray.900" : "gray.700"}
                >
                  {service.title}
                </Text>
              </Flex>
            </Box>
          ))}
        </Flex>
      </Box>

      <Box>
        <MotionBox
          key={selectedService.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Flex align="center" gap={4} mb={6}>
            <Flex
              w="80px"
              h="80px"
              bg="primary.50"
              color="primary.500"
              borderRadius="lg"
              justify="center"
              align="center"
            >
              <Icon as={iconMap[selectedService.icon] || Code} boxSize={10} />
            </Flex>
            <Heading as="h3" size="lg" color="gray.900">
              {selectedService.title}
            </Heading>
          </Flex>

          <Box
            w="60px"
            h="1px"
            bg="primary.500"
            mb={6}
          />

          <Text fontSize="md" color="gray.600" lineHeight="1.8" mb={8}>
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
  const [content, setContent] = useState<ContentData>({});
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>("Producto");

  useEffect(() => {
    const loadContent = async () => {
      const data = await getContentData('services');
      setContent(data);
      setBranches((data.branches as Branch[]) || []);
    };
    loadContent();
  }, []);

  const label = content.label as string;
  const title = content.title as string;
  const description = content.description as string;

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
            <Text color="primary.500" fontWeight="medium" mb={2}>
              {label}
            </Text>
            <Heading as="h2" id="servicios-heading" size="xl" mb={4}>
              {title}
            </Heading>
            <Text as="p" fontSize="lg" color="gray.600">
              {description}
            </Text>
          </MotionBox>
        </Flex>
        <Box display="flex" justifyContent="center" mb={8} suppressHydrationWarning>
          <SegmentGroup.Root
            value={selectedBranch}
            onValueChange={(e) => setSelectedBranch(e.value || "Producto")}
            size="lg"
            bg="white"
            p={1}
            rounded="full"
            border="2px solid"
            borderColor="gray.200"
            css={{
              "--segment-indicator-bg": "var(--chakra-colors-primary-500)",
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
                  bg: "primary.500",
                }}
                bg="white"
              >
                <SegmentGroup.ItemText 
                  fontWeight="semibold"
                  color="gray.700"
                  _checked={{
                    color: "white",
                  }}
                >
                  {branch.name}
                </SegmentGroup.ItemText>
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
              <Text as="p" fontSize="lg" color="gray.600" maxW="600px" mx="auto">
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
