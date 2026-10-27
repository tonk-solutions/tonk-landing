import dynamic from "next/dynamic";
import { getTranslations } from "next-intl/server";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import ServicesSection from "./components/ServicesSection";
import AboutSection from "./components/AboutSection";
import MobileStickyCta from "./components/MobileStickyCta";
import { SectionLoadingFallback } from "./components/SectionLoadingFallback";
import { resolveRequestLocale } from "@/i18n/requestLocale";

const TeamSection = dynamic(() => import("./components/TeamSection"), {
  loading: () => <SectionLoadingFallback />,
});

const ContactSection = dynamic(() => import("./components/ContactSection"), {
  loading: () => <SectionLoadingFallback />,
});

const Footer = dynamic(() => import("./components/Footer"), {
  loading: () => <SectionLoadingFallback />,
});

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  resolveRequestLocale((await params).locale);
  const tHero = await getTranslations("hero");

  return (
    <div
      className="page-shell"
      style={{ minHeight: "100vh", width: "100%", overflow: "hidden" }}
    >
      <Header />
      <main role="main" style={{ width: "100%" }}>
        <HeroSection />
        <ServicesSection />
        <AboutSection />
        <TeamSection />
        <ContactSection />
      </main>
      <Footer />
      <MobileStickyCta label={tHero("cta")} />
    </div>
  );
}
