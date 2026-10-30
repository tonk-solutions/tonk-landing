import { getTranslations } from "next-intl/server";
import { HOME_SECTIONS } from "@/app/sections";
import { resolveRequestLocale } from "@/i18n/requestLocale";
import { WHATSAPP_URL } from "@/app/constants";
import { buildHomePageGraph } from "@/app/seo/structuredData";
import { StructuredData } from "@/app/seo/StructuredData";
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

/**
 * Home de Tonk: nueve secciones numeradas que se leen como el documento técnico
 * de la consultora. Todo es Server Component salvo el índice lateral, el CTA
 * fijo mobile, el menú y el selector de idioma.
 */
export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const locale = resolveRequestLocale((await params).locale);

  const t = await getTranslations();
  const tContact = await getTranslations("contact");
  const tSeo = await getTranslations({ locale, namespace: "seo" });
  const tSchema = await getTranslations({ locale, namespace: "schema" });

  const webPageGraph = buildHomePageGraph({
    locale,
    name: tSeo("titleDefault"),
    description: tSeo("description"),
    inLanguage: tSchema("inLanguage"),
  });

  // Número, ancla y nombre del índice salen de HOME_SECTIONS: el número de la
  // cabecera y el del riel no pueden separarse aunque se reordenen secciones.
  const sideIndexItems = HOME_SECTIONS.map(({ namespace, id }) => ({
    number: t(`${namespace}.number`),
    label: t(`${namespace}.indexLabel`),
    href: `#${id}`,
  }));

  return (
    <div className="home-shell">
      <StructuredData id="structured-data-home" data={webPageGraph} />
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
    </div>
  );
}
