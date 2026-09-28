import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "../globals.css";
import { Providers } from "./providers";
import { SITE_NAME, SITE_URL } from "../constants";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { resolveRequestLocale } from '@/i18n/requestLocale';
import { buildStructuredDataGraph } from '../seo/structuredData';
import type { ServiceContent } from '../services/catalog';

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = resolveRequestLocale((await params).locale);

  const t = await getTranslations({ locale, namespace: 'seo' });

  const siteUrl = SITE_URL;
  const siteName = SITE_NAME;
  const description = t('description');
  const titleDefault = t('titleDefault');
  const titleTemplate = `%s | ${siteName}`;
  const keywords = t.raw('keywords') as string[];
  const ogTitle = t('ogTitle');
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
    },
    twitter: {
      card: "summary_large_image",
      title: twitterTitle,
      description,
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
  const locale = resolveRequestLocale((await params).locale);

  const messages = await getMessages();
  const tSeo = await getTranslations({ locale, namespace: 'seo' });
  const tSchema = await getTranslations({ locale, namespace: 'schema' });
  const tServices = await getTranslations({ locale, namespace: 'services' });

  const structuredDataGraph = buildStructuredDataGraph({
    locale,
    organization: {
      description: tSeo('description'),
      slogan: tSchema('slogan'),
      foundingDate: "2026",
      addressLocality: "Buenos Aires",
      addressCountry: "AR",
      linkedinUrl: "https://www.linkedin.com/company/tonk-solutions",
      instagramUrl: "https://www.instagram.com/tonk_solutions",
    },
    website: {
      inLanguage: tSchema('inLanguage'),
    },
    servicesList: {
      name: tSchema('servicesListName'),
      description: tSchema('servicesListDescription'),
      servicesByBranch: {
        craft: tServices.raw('craft.services') as ServiceContent[],
        talent: tServices.raw('talent.services') as ServiceContent[],
      },
    },
  });

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
    >
      <body className={`${syne.variable} ${dmSans.variable}`}>
        <script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredDataGraph) }}
        />
        <NextIntlClientProvider messages={messages}>
          <Providers>
            {children}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
