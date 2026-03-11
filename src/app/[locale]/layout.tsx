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
  
  if (!routing.locales.includes(locale as 'es' | 'en')) {
    notFound();
  }
  
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
      url: `${siteUrl}/${locale}`,
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
      canonical: `${siteUrl}/${locale}`,
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
  const tSeo = await getTranslations({ locale, namespace: 'seo' });
  const tSchema = await getTranslations({ locale, namespace: 'schema' });

  const siteUrl = "https://tonksolutions.com";
  const siteName = "Tonk Solutions";
  const description = tSeo('description');
  const orgDescription = description;
  const slogan = tSchema('slogan');
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
    inLanguage: tSchema('inLanguage'),
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${siteUrl}/#services`,
    name: tSchema('servicesListName'),
    description: tSchema('servicesListDescription'),
    itemListElement: [
      {
        "@type": "Service",
        position: 1,
        name: tSchema('services.financial.name'),
        description: tSchema('services.financial.description'),
        provider: { "@id": `${siteUrl}/#organization` },
        serviceType: "Financial Software Engineering",
        areaServed: "Latin America",
      },
      {
        "@type": "Service",
        position: 2,
        name: tSchema('services.cloudNative.name'),
        description: tSchema('services.cloudNative.description'),
        provider: { "@id": `${siteUrl}/#organization` },
        serviceType: "Cloud Architecture Consulting",
        areaServed: "Latin America",
      },
      {
        "@type": "Service",
        position: 3,
        name: tSchema('services.enterprise.name'),
        description: tSchema('services.enterprise.description'),
        provider: { "@id": `${siteUrl}/#organization` },
        serviceType: "Enterprise Software Consulting",
        areaServed: "Latin America",
      },
      {
        "@type": "Service",
        position: 4,
        name: tSchema('services.ai.name'),
        description: tSchema('services.ai.description'),
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
    description: tSchema('professionalServiceDescription'),
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
      name: tSchema('offerCatalogName'),
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: tSchema('offers.financial') } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: tSchema('offers.cloudNative') } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: tSchema('offers.enterprise') } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: tSchema('offers.ai') } },
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
