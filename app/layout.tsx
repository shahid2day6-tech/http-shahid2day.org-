import type { Metadata } from "next";
import { Suspense } from "react";
import Script from "next/script";
import { Bebas_Neue, Tajawal } from "next/font/google";
import { LanguageProvider } from "./context/LanguageContext";
import SiteShell from "./components/SiteShell";
import AntiAdblock from "./components/AntiAdblock";
import { MonetagTag } from "./components/ads/MonetagTag";
import { MonetagVignette } from "./components/ads/MonetagVignette";
import { MonetagOnclick } from "./components/ads/MonetagOnclick";
import { MonetagClickGate } from "./components/ads/MonetagClickGate";
import { SITE_LOGO, SITE_NAME_AR, SITE_NAME_EN, SITE_URL } from "./lib/site";
import { pageKeywords, SEO_DESCRIPTION } from "./lib/seo";
import "./globals.css";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-tajawal",
});

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
});

const title = `${SITE_NAME_AR} | ${SITE_NAME_EN}`;
const description = SEO_DESCRIPTION;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME_EN,
  title: {
    default: title,
    template: `%s | ${SITE_NAME_AR} | ${SITE_NAME_EN}`,
  },
  description,
  keywords: pageKeywords(),
  verification: {
    google: "7B70jSYQyMKbAYWnNp_L4G6DWtwFBUeGY-XgeFefxlw",
  },
  authors: [{ name: SITE_NAME_EN, url: SITE_URL }],
  creator: SITE_NAME_EN,
  publisher: SITE_NAME_EN,
  category: "entertainment",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title,
    description: SEO_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME_EN,
    locale: "ar_SA",
    type: "website",
    images: [
      {
        url: SITE_LOGO,
        width: 1024,
        height: 1024,
        alt: title,
      },
    ],
  },
  twitter: {
    card: "summary",
    title,
    description,
    images: [SITE_LOGO],
  },
  icons: {
    icon: [
      { url: "/logo.png", sizes: "1024x1024", type: "image/png" },
      { url: "/icon.png", sizes: "1024x1024", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
    shortcut: "/logo.png",
  },
  appleWebApp: {
    capable: true,
    title: SITE_NAME_EN,
    statusBarStyle: "black-translucent",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME_AR,
  alternateName: SITE_NAME_EN,
  url: SITE_URL,
  inLanguage: ["ar", "en"],
  keywords: pageKeywords().join(", "),
  image: `${SITE_URL}${SITE_LOGO}`,
  publisher: {
    "@type": "Organization",
    name: SITE_NAME_EN,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}${SITE_LOGO}`,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${tajawal.variable} ${bebas.variable} antialiased`}>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-QQLS5BWD27" strategy="afterInteractive" />
        <Script id="ga-gtag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-QQLS5BWD27');
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <LanguageProvider>
          <SiteShell>{children}</SiteShell>
          <MonetagClickGate />
          <MonetagTag />
          <MonetagVignette />
          <MonetagOnclick />
          <Suspense fallback={null}>
            <AntiAdblock />
          </Suspense>
        </LanguageProvider>
      </body>
    </html>
  );
}
