"use client";

import React, { useEffect, useState } from 'react';
import { Box, Container, Grid, Heading, Text, Icon, Flex } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Code, Cloud, FileText, BrainCircuit } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { getContentData, ContentData } from '@/lib/content';

const MotionBox = motion(Box);

interface Service {
  title: string;
  description: string;
  icon: string;
}

const iconMap: Record<string, React.ElementType> = {
  Code,
  Cloud,
  FileText,
  BrainCircuit,
};

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
  const [content, setContent] = useState<ContentData>({});
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const loadContent = async () => {
      const data = await getContentData('services');
      setContent(data);
      setServices((data.services as Service[]) || []);
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
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }}
          gap={{ base: 4, md: 8 }}
          w="100%"
        >
          {services.map((service, index) => (
            <ServiceCard
              key={service.title}
              title={service.title}
              description={service.description}
              icon={<Icon as={iconMap[service.icon] || Code} boxSize={8} />}
              delay={0.1 * (index + 1)}
            />
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default ServicesSection;
