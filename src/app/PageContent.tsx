'use client';

import dynamic from 'next/dynamic';
import { Box } from '@chakra-ui/react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import type { ContentFrontmatter } from '@/lib/mdx-content';

const ServicesSection = dynamic(() => import('./components/ServicesSection'), { ssr: true });
const AboutSection = dynamic(() => import('./components/AboutSection'), { ssr: true });
const TeamSection = dynamic(() => import('./components/TeamSection'), { ssr: true });
const ContactSection = dynamic(() => import('./components/ContactSection'), { ssr: true });
const Footer = dynamic(() => import('./components/Footer'), { ssr: true });

interface PageContentProps {
  hero: ContentFrontmatter;
  navigation: ContentFrontmatter;
  services: ContentFrontmatter;
  about: ContentFrontmatter;
  team: ContentFrontmatter;
  contact: ContentFrontmatter;
}

export function PageContent({ hero, navigation, services, about, team, contact }: PageContentProps) {
  return (
    <Box minH="100vh" w="100%" overflow="hidden">
      <Header initialContent={navigation} />
      <Box as="main" role="main" w="100%">
        <HeroSection initialContent={hero} />
        <ServicesSection initialContent={services} />
        <AboutSection initialContent={about} />
        <TeamSection initialContent={team} />
        <ContactSection initialContent={contact} />
      </Box>
      <Footer />
    </Box>
  );
}
