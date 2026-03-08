import { getFrontmatterOnly } from "@/lib/mdx-content";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import ServicesSection from "./components/ServicesSection";
import AboutSection from "./components/AboutSection";
import TeamSection from "./components/TeamSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import type {
  NavigationContent,
  ServicesContent,
  ContactContent,
} from "@/types/content";

export default async function Home() {
  // Load content for interactive (client) sections at build time
  const [navRaw, servicesRaw, contactRaw] = await Promise.all([
    getFrontmatterOnly("navigation"),
    getFrontmatterOnly("services"),
    getFrontmatterOnly("contact"),
  ]);

  const navContent = (navRaw ?? {}) as unknown as NavigationContent;
  const servicesContent = (servicesRaw ?? {}) as unknown as ServicesContent;
  const contactContent = (contactRaw ?? {}) as unknown as ContactContent;

  return (
    <div className="min-h-dvh w-full overflow-x-hidden">
      <Header
        navLinks={navContent.links ?? []}
        ctaLabel={navContent.ctaLabel ?? "Contactanos"}
        ctaHref={navContent.ctaHref ?? "#contacto"}
      />
      <main role="main" className="w-full">
        <HeroSection />
        <ServicesSection content={servicesContent} />
        <AboutSection />
        <TeamSection />
        <ContactSection content={contactContent} />
      </main>
      <Footer />
    </div>
  );
}
