import { getTranslations } from "next-intl/server";
import { resolveRequestLocale } from "@/i18n/requestLocale";
import { WHATSAPP_URL } from "@/app/constants";
import { Header } from "./components/site/Header";
import { Footer } from "./components/site/Footer";
import { SideIndex } from "./components/home/SideIndex";
import { MobileStickyCta } from "./components/home/MobileStickyCta";
import { HeroSection } from "./components/home/HeroSection";
import { IntegrationsBar } from "./components/home/IntegrationsBar";
import { ServicesSection } from "./components/home/ServicesSection";
import { ProjectsSection } from "./components/home/ProjectsSection";
import { DiagnosticSection } from "./components/home/DiagnosticSection";
import { ProcessSection } from "./components/home/ProcessSection";
import { CriterioSection } from "./components/home/CriterioSection";
import { TeamSection } from "./components/home/TeamSection";
import { ContactSection } from "./components/home/ContactSection";

const SECTION_NAMESPACES = [
  "hero",
  "integrations",
  "services",
  "projects",
  "diagnostic",
  "process",
  "criterio",
  "team",
  "contact",
] as const;

/**
 * Home de Tonk: nueve secciones numeradas que se leen como el documento técnico
 * de la consultora. Todo es Server Component salvo el índice lateral, el CTA
 * fijo mobile, el menú y el selector de idioma.
 */
export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  resolveRequestLocale((await params).locale);

  const t = await getTranslations();
  const tContact = await getTranslations("contact");

  // El índice necesita número y label de cada sección; los labels ya viven en
  // los namespaces de i18n, así que los derivamos del mismo mensaje raíz.
  const sideIndexItems = SECTION_NAMESPACES.map((namespace, index) => ({
    number: String(index + 1).padStart(2, "0"),
    label: t(`${namespace}.label`),
  }));

  return (
    <>
      <Header />
      <SideIndex items={sideIndexItems} />

      <main id="main">
        <HeroSection />
        <IntegrationsBar />
        <ServicesSection />
        <ProjectsSection />
        <DiagnosticSection />
        <ProcessSection />
        <CriterioSection />
        <TeamSection />
        <ContactSection />
      </main>

      <Footer />
      <MobileStickyCta label={tContact("cta")} href={WHATSAPP_URL} />
    </>
  );
}
