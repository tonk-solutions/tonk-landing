"use client";

import { Box } from '@chakra-ui/react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ServicesSection from './components/ServicesSection';
import AboutSection from './components/AboutSection';
import TeamSection from './components/TeamSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

export default function Home() {
  return (
    <Box minH="100vh" w="100%" overflow="hidden">
      <Header />
      <Box as="main" role="main" w="100%">
        <HeroSection />
        <ServicesSection />
        <AboutSection />
        <TeamSection />
        <ContactSection />
      </Box>
      <Footer />
    </Box>
  );
}
