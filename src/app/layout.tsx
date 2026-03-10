import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Script from "next/script";
import { CONTACT_EMAIL, CONTACT_PHONE } from "./constants";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const SITE_URL = "https://tonksolutions.com";
const SITE_NAME = "Tonk Solutions";
const SITE_DESCRIPTION =
  "Consultora de ingeniería de software especializada en sistemas financieros críticos, migración a microservicios, arquitectura cloud-native y continuidad sistémica entre Core Banking, ERPs y tecnologías modernas.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Tonk Solutions | Ingeniería de Software Financiero & Continuidad Sistémica",
    template: "%s | Tonk Solutions",
  },
  description: SITE_DESCRIPTION,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  keywords: [
    "ingeniería de software financiero",
    "consultoría tecnológica enterprise",
    "continuidad sistémica",
    "migración a microservicios",
    "arquitectura cloud-native",
    "modernización legacy systems",
    "core banking engineering",
    "SAP integration",
    "ERP modernization",
    "fintech infrastructure",
    "deuda técnica",
    "sistemas distribuidos",
    "inteligencia artificial enterprise",
    "consultoría software Argentina",
  ],
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
    locale: "es_AR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Tonk Solutions | Ingeniería de Software Financiero & Continuidad Sistémica",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: `${SITE_URL}/images/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Tonk Solutions - Ingeniería de Alta Precisión para Desafíos de Escala",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tonk Solutions | Ingeniería de Software Financiero",
    description: SITE_DESCRIPTION,
    images: [`${SITE_URL}/images/og-image.png`],
  },
  alternates: {
    canonical: SITE_URL,
  },
  category: "technology",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "Tonk Solutions",
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo.png`,
  description:
    "Consultora de ingeniería de software de alta precisión especializada en continuidad sistémica: armonizar Core Banking, ERPs y sistemas legacy con Cloud, Microservicios e Inteligencia Artificial.",
  foundingDate: "2024",
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
    addressLocality: "Buenos Aires",
    addressCountry: "AR",
  },
  contactPoint: {
    "@type": "ContactPoint",
    email: CONTACT_EMAIL,
    telephone: CONTACT_PHONE,
    contactType: "sales",
    availableLanguage: ["Spanish", "English"],
  },
  sameAs: [
    "https://www.linkedin.com/company/tonk-solutions",
    "https://www.instagram.com/tonk_solutions",
  ],
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
  slogan: "Ingeniería de alta precisión para desafíos de escala",
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: "Tonk Solutions",
  publisher: {
    "@id": `${SITE_URL}/#organization`,
  },
  description: SITE_DESCRIPTION,
  inLanguage: "es-AR",
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": `${SITE_URL}/#services`,
  name: "Servicios de Ingeniería de Software",
  description:
    "Servicios especializados de consultoría en ingeniería de software para instituciones financieras, fintechs y corporaciones enterprise.",
  itemListElement: [
    {
      "@type": "Service",
      position: 1,
      name: "Ingeniería de Software Financiero",
      description:
        "Diseño y mantenimiento de plataformas transaccionales críticas con alta volumetría, garantizando integridad y seguridad financiera en Core Banking y medios de pago.",
      provider: { "@id": `${SITE_URL}/#organization` },
      serviceType: "Financial Software Engineering",
      areaServed: "Latin America",
    },
    {
      "@type": "Service",
      position: 2,
      name: "Arquitectura Cloud-Native y Migración a Microservicios",
      description:
        "Transformación de aplicaciones monolíticas en ecosistemas escalables y resilientes, con arquitecturas que soportan picos de demanda sin degradar el servicio.",
      provider: { "@id": `${SITE_URL}/#organization` },
      serviceType: "Cloud Architecture Consulting",
      areaServed: "Latin America",
    },
    {
      "@type": "Service",
      position: 3,
      name: "Soluciones Enterprise, SAP & ERP",
      description:
        "Orquestación de procesos críticos en grandes corporaciones donde la precisión del dato es innegociable, con integración SAP y modernización ERP.",
      provider: { "@id": `${SITE_URL}/#organization` },
      serviceType: "Enterprise Software Consulting",
      areaServed: "Latin America",
    },
    {
      "@type": "Service",
      position: 4,
      name: "IA Aplicada y Automatización Enterprise",
      description:
        "Ingeniería de inteligencia artificial con respaldo académico y práctico para gestión del conocimiento y optimización de procesos en entornos empresariales.",
      provider: { "@id": `${SITE_URL}/#organization` },
      serviceType: "AI Consulting",
      areaServed: "Latin America",
    },
  ],
};

const professionalServiceJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#professionalservice`,
  name: "Tonk Solutions",
  url: SITE_URL,
  description:
    "Consultoría de ingeniería de software especializada en continuidad sistémica entre sistemas legacy (Core Banking, SAP, ERP) y tecnologías modernas (Cloud-Native, Microservicios, IA).",
  priceRange: "$$$$",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Buenos Aires",
    addressCountry: "AR",
  },
  telephone: CONTACT_PHONE,
  email: CONTACT_EMAIL,
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Servicios de Consultoría",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Ingeniería de Software Financiero" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Arquitectura Cloud-Native" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Soluciones Enterprise SAP & ERP" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "IA Aplicada y Automatización" } },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
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
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
