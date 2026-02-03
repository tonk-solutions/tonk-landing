"use client";

import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ServicesSection from './components/ServicesSection';
import AboutSection from './components/AboutSection';
import TeamSection from './components/TeamSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', width: '100%', overflow: 'hidden' }}>
      <Header />
      <main style={{ width: '100%' }}>
        <HeroSection />
        <ServicesSection />
        <AboutSection />
        <TeamSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
