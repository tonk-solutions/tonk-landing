import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "../globals.css";
import { Providers } from "./providers";
import Script from "next/script";
import { CONTACT_EMAIL, CONTACT_PHONE } from "../constants";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo' });

  const siteUrl = "https://tonksolutions.com";
  const siteName = "Tonk Solutions";
  const description = t('description');
  const titleDefault = t('titleDefault');
  const titleTemplate = `%s | ${siteName}`;
  const keywords = t.raw('keywords') as string[];
  const ogTitle = t('ogTitle');
  const ogImageAlt = t('ogImageAlt');
  const twitterTitle = t('twitterTitle');
  const localeMap: Record<string, string> = {
    es: "es_AR",
    en: "en_US"
  };
  const ogLocale = localeMap[locale] || "es_AR";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: titleDefault,
      template: titleTemplate,
    },
    description,
    authors: [{ name: siteName, url: siteUrl }],
    creator: siteName,
    publisher: siteName,
    keywords,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: ogLocale,
      url: siteUrl,
      siteName,
      title: ogTitle,
      description,
      images: [
        {
          url: `${siteUrl}/images/og-image.png`,
          width: 1200,
          height: 630,
          alt: ogImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: twitterTitle,
      description,
      images: [`${siteUrl}/images/og-image.png`],
    },
    alternates: {
      canonical: siteUrl,
      languages: {
        'es': `${siteUrl}/es`,
        'en': `${siteUrl}/en`,
      },
    },
    category: "technology",
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'es' | 'en')) {
    notFound();
  }

  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: 'seo' });

  const siteUrl = "https://tonksolutions.com";
  const siteName = "Tonk Solutions";
  const description = t('description');
  const orgDescription = description;
  const slogan = locale === 'es' ? "Ingeniería senior para proyectos que importan" : "Senior engineering for projects that matter";
  const foundingDate = "2026";
  const addressLocality = "Buenos Aires";
  const addressCountry = "AR";
  const linkedinUrl = "https://www.linkedin.com/company/tonk-solutions";
  const instagramUrl = "https://www.instagram.com/tonk_solutions";

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: siteName,
    url: siteUrl,
    logo: `${siteUrl}/images/logo.png`,
    description: orgDescription,
    foundingDate,
    areaServed: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: -34.6037,
        longitude: -58.3816,
      },
      description: "Latin America",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality,
      addressCountry,
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: CONTACT_EMAIL,
      telephone: CONTACT_PHONE,
      contactType: "sales",
      availableLanguage: ["Spanish", "English"],
    },
    sameAs: [linkedinUrl, instagramUrl].filter(Boolean),
    knowsAbout: [
      "Financial Software Engineering",
      "Systemic Continuity",
      "Core Banking Systems",
      "Microservices Migration",
      "Cloud-Native Architecture",
      "SAP Integration",
      "ERP Modernization",
      "Legacy System Modernization",
      "Technical Debt Resolution",
      "Distributed Systems",
      "Enterprise AI",
    ],
    slogan,
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: siteName,
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
    description,
    inLanguage: locale === 'es' ? 'es-AR' : 'en-US',
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${siteUrl}/#services`,
    name: locale === 'es' ? "Servicios de Ingeniería de Software" : "Software Engineering Services",
    description: locale === 'es'
      ? "Servicios especializados de consultoría en ingeniería de software para instituciones financieras, fintechs y corporaciones enterprise."
      : "Specialized software engineering consulting services for financial institutions, fintechs, and enterprise corporations.",
    itemListElement: [
      {
        "@type": "Service",
        position: 1,
        name: locale === 'es' ? "Ingeniería de Software Financiero" : "Financial Software Engineering",
        description: locale === 'es'
          ? "Diseño y mantenimiento de plataformas transaccionales críticas con alta volumetría, garantizando integridad y seguridad financiera en Core Banking y medios de pago."
          : "Design and maintenance of critical transactional platforms with high volume, ensuring financial integrity and security in Core Banking and payment methods.",
        provider: { "@id": `${siteUrl}/#organization` },
        serviceType: "Financial Software Engineering",
        areaServed: "Latin America",
      },
      {
        "@type": "Service",
        position: 2,
        name: locale === 'es' ? "Arquitectura Cloud-Native y Migración a Microservicios" : "Cloud-Native Architecture and Microservices Migration",
        description: locale === 'es'
          ? "Transformación de aplicaciones monolíticas en ecosistemas escalables y resilientes, con arquitecturas que soportan picos de demanda sin degradar el servicio."
          : "Transformation of monolithic applications into scalable and resilient ecosystems, with architectures that support demand peaks without degrading service.",
        provider: { "@id": `${siteUrl}/#organization` },
        serviceType: "Cloud Architecture Consulting",
        areaServed: "Latin America",
      },
      {
        "@type": "Service",
        position: 3,
        name: locale === 'es' ? "Soluciones Enterprise, SAP & ERP" : "Enterprise Solutions, SAP & ERP",
        description: locale === 'es'
          ? "Orquestación de procesos críticos en grandes corporaciones donde la precisión del dato es innegociable, con integración SAP y modernización ERP."
          : "Orchestration of critical processes in large corporations where data precision is non-negotiable, with SAP integration and ERP modernization.",
        provider: { "@id": `${siteUrl}/#organization` },
        serviceType: "Enterprise Software Consulting",
        areaServed: "Latin America",
      },
      {
        "@type": "Service",
        position: 4,
        name: locale === 'es' ? "IA Aplicada y Automatización Enterprise" : "Applied AI and Enterprise Automation",
        description: locale === 'es'
          ? "Ingeniería de inteligencia artificial con respaldo académico y práctico para gestión del conocimiento y optimización de procesos en entornos empresariales."
          : "Artificial intelligence engineering with academic and practical support for knowledge management and process optimization in business environments.",
        provider: { "@id": `${siteUrl}/#organization` },
        serviceType: "AI Consulting",
        areaServed: "Latin America",
      },
    ],
  };

  const professionalServiceJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${siteUrl}/#professionalservice`,
    name: siteName,
    url: siteUrl,
    description: locale === 'es'
      ? "Consultoría de ingeniería de software especializada en continuidad sistémica entre sistemas legacy (Core Banking, SAP, ERP) y tecnologías modernas (Cloud-Native, Microservicios, IA)."
      : "Software engineering consulting specialized in systemic continuity between legacy systems (Core Banking, SAP, ERP) and modern technologies (Cloud-Native, Microservices, AI).",
    priceRange: "$$$$",
    address: {
      "@type": "PostalAddress",
      addressLocality,
      addressCountry,
    },
    telephone: CONTACT_PHONE,
    email: CONTACT_EMAIL,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: locale === 'es' ? "Servicios de Consultoría" : "Consulting Services",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: locale === 'es' ? "Ingeniería de Software Financiero" : "Financial Software Engineering" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: locale === 'es' ? "Arquitectura Cloud-Native" : "Cloud-Native Architecture" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: locale === 'es' ? "Soluciones Enterprise SAP & ERP" : "Enterprise Solutions SAP & ERP" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: locale === 'es' ? "IA Aplicada y Automatización" : "Applied AI and Automation" } },
      ],
    },
  };

  return (
    <html 
      lang={locale} 
      data-scroll-behavior="smooth"
    >
      <head>
        <Script
          id="organization-jsonld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Script
          id="website-jsonld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <Script
          id="services-jsonld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
        />
        <Script
          id="professional-service-jsonld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceJsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${poppins.variable}`}>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            {children}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
