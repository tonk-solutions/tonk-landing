import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { SITE_NAME, SITE_URL } from "../constants";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { resolveRequestLocale } from '@/i18n/requestLocale';
import { buildStructuredDataGraph, pickFounders } from '../seo/structuredData';
import { StructuredData } from '../seo/StructuredData';
import { buildLanguageAlternates } from '../seo/alternates';
import { buildOpenGraph, buildTwitter } from '../seo/openGraph';
import type { ServiceContent } from '../services/catalog';

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  weight: ["400", "500", "600"],
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  weight: ["400", "500"],
  display: "swap",
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
  const ogImageAlt = t('ogImageAlt');
  const canonical = `${siteUrl}/${locale}`;

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
    openGraph: buildOpenGraph({
      locale,
      url: canonical,
      title: ogTitle,
      description,
      imageAlt: ogImageAlt,
    }),
    twitter: buildTwitter({
      locale,
      title: twitterTitle,
      description,
      imageAlt: ogImageAlt,
    }),
    alternates: {
      canonical,
      languages: buildLanguageAlternates(""),
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
  const tTeam = await getTranslations({ locale, namespace: 'team' });

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
      founders: pickFounders(tTeam.raw('members')),
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
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>
        <StructuredData id="structured-data" data={structuredDataGraph} />
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
