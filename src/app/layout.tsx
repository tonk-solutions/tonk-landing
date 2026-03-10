import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Script from "next/script";
import { CONTACT_EMAIL, CONTACT_PHONE } from "./constants";
import { getFrontmatterOnly } from "@/lib/mdx-content";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export async function generateMetadata(): Promise<Metadata> {
  const seo = (await getFrontmatterOnly("seo")) || {};

  const siteUrl = (seo.siteUrl as string) || "https://tonksolutions.com";
  const siteName = (seo.siteName as string) || "Tonk Solutions";
  const description = (seo.description as string) || "";
  const titleDefault = (seo.titleDefault as string) || siteName;
  const titleTemplate = (seo.titleTemplate as string) || `%s | ${siteName}`;
  const keywords = (seo.keywords as string[]) || [];
  const ogTitle = (seo.ogTitle as string) || titleDefault;
  const ogImageAlt = (seo.ogImageAlt as string) || siteName;
  const twitterTitle = (seo.twitterTitle as string) || titleDefault;
  const locale = (seo.locale as string) || "es_AR";

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
      locale,
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
    },
    category: "technology",
  };
}


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const seo = (await getFrontmatterOnly("seo")) || {};

  const siteUrl = (seo.siteUrl as string) || "https://tonksolutions.com";
  const siteName = (seo.siteName as string) || "Tonk Solutions";
  const description = (seo.description as string) || "";
  const orgDescription = (seo.orgDescription as string) || description;
  const slogan = (seo.slogan as string) || "";
  const foundingDate = (seo.foundingDate as string) || "";
  const addressLocality = (seo.addressLocality as string) || "Buenos Aires";
  const addressCountry = (seo.addressCountry as string) || "AR";
  const linkedinUrl = (seo.linkedinUrl as string) || "";
  const instagramUrl = (seo.instagramUrl as string) || "";

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
    inLanguage: "es-AR",
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${siteUrl}/#services`,
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
        provider: { "@id": `${siteUrl}/#organization` },
        serviceType: "Financial Software Engineering",
        areaServed: "Latin America",
      },
      {
        "@type": "Service",
        position: 2,
        name: "Arquitectura Cloud-Native y Migración a Microservicios",
        description:
          "Transformación de aplicaciones monolíticas en ecosistemas escalables y resilientes, con arquitecturas que soportan picos de demanda sin degradar el servicio.",
        provider: { "@id": `${siteUrl}/#organization` },
        serviceType: "Cloud Architecture Consulting",
        areaServed: "Latin America",
      },
      {
        "@type": "Service",
        position: 3,
        name: "Soluciones Enterprise, SAP & ERP",
        description:
          "Orquestación de procesos críticos en grandes corporaciones donde la precisión del dato es innegociable, con integración SAP y modernización ERP.",
        provider: { "@id": `${siteUrl}/#organization` },
        serviceType: "Enterprise Software Consulting",
        areaServed: "Latin America",
      },
      {
        "@type": "Service",
        position: 4,
        name: "IA Aplicada y Automatización Enterprise",
        description:
          "Ingeniería de inteligencia artificial con respaldo académico y práctico para gestión del conocimiento y optimización de procesos en entornos empresariales.",
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
    description:
      "Consultoría de ingeniería de software especializada en continuidad sistémica entre sistemas legacy (Core Banking, SAP, ERP) y tecnologías modernas (Cloud-Native, Microservicios, IA).",
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
      name: "Servicios de Consultoría",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Ingeniería de Software Financiero" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Arquitectura Cloud-Native" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Soluciones Enterprise SAP & ERP" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "IA Aplicada y Automatización" } },
      ],
    },
  };

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
