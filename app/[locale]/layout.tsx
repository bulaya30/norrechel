import "../globals.css";

import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";

import { routing } from "@/i18n/routing";
import LocaleProvider from "./locale-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

type SupportedLocale = "en" | "fr";

const siteUrl = "https://www.norrechel.netlify.app";

const siteMetadata: Record<
  SupportedLocale,
  {
    title: string;
    description: string;
  }
> = {
  en: {
    title: "Norrechel — Software Developer & Technology Professional",
    description:
      "Norrechel is the personal portfolio of a software developer and technology professional, featuring projects, articles, technical expertise, and professional work.",
  },

  fr: {
    title:
      "Norrechel — Développeur logiciel & professionnel de la technologie",
    description:
      "Norrechel est le portfolio personnel d'un développeur logiciel et professionnel de la technologie, présentant ses projets, articles, compétences techniques et réalisations professionnelles.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const currentLocale: SupportedLocale =
    locale === "fr" ? "fr" : "en";

  const metadata = siteMetadata[currentLocale];

  const localeUrl = `${siteUrl}/${currentLocale}`;

  return {
    metadataBase: new URL(siteUrl),

    title: {
      default: metadata.title,
      template: `%s | Norrechel`,
    },

    description: metadata.description,

    icons: {
      icon: [
        // {
        //   url: "/favicon.ico",
        //   sizes: "any",
        // },
        {
          url: "/favicon.png",
          type: "image/png",
          sizes: "32x32",
        },
      ],

      apple: [
        {
          url: "/apple-icon.png",
          sizes: "180x180",
          type: "image/png",
        },
      ],
    },

    alternates: {
      canonical: localeUrl,

      languages: {
        en: `${siteUrl}/en`,
        fr: `${siteUrl}/fr`,
      },
    },

    openGraph: {
      title: metadata.title,
      description: metadata.description,
      url: localeUrl,
      type: "website",
      siteName: "Norrechel",
      locale:
        currentLocale === "fr"
          ? "fr_FR"
          : "en_US",

      alternateLocale:
        currentLocale === "fr"
          ? ["en_US"]
          : ["fr_FR"],
    },

    twitter: {
      card: "summary_large_image",
      title: metadata.title,
      description: metadata.description,
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({
    locale,
  }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

function LocaleLoadingFallback() {
  return (
    <main
      className="min-h-screen"
      aria-busy="true"
      aria-label="Loading page"
    />
  );
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Suspense fallback={<LocaleLoadingFallback />}>
          <LocaleProvider locale={locale}>
            {children}
          </LocaleProvider>
        </Suspense>
      </body>
    </html>
  );
}