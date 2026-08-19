import type { Metadata } from "next";
import { cookies } from "next/headers";
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
import { AdChromeGuard } from "./components/ads/AdChromeGuard";
import { PlayerCornerAds } from "./components/ads/PlayerCornerAds";
import { SITE_LOGO, SITE_NAME_AR, SITE_NAME_EN, SITE_URL } from "./lib/site";
import { pageKeywords, SEO_DESCRIPTION } from "./lib/seo";
import { htmlLangDir, parseUiLang, UI_LANG_KEY } from "./lib/langPref";
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

const title = `${SITE_NAME_EN} | Watch Movies & Series Online Free`;
const description = SEO_DESCRIPTION;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME_EN,
  title: {
    default: title,
    template: `%s | ${SITE_NAME_EN}`,
  },
  description,
  keywords: pageKeywords(),
  verification: {
    google: [
      "7B70jSYQyMKbAYWnNp_L4G6DWtwFBUeGY-XgeFefxlw",
      "4vzeWpLuwWURO06DBsX8NXJ6uGosbwx_AHoqz9qWyeg",
      "rneDTZ9WVyS_qyWoeCx_V1U59XebiAXJjCtd0q6ct_U",
    ],
    other: {
      clckd: "237d59ff30c2737d80e61b0f9969ed4f",
      "141f2ead4524320f21fe73ef86766a6178294da9":
        "141f2ead4524320f21fe73ef86766a6178294da9",
    },
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
    locale: "en_US",
    alternateLocale: ["ar_SA"],
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
  name: SITE_NAME_EN,
  alternateName: [SITE_NAME_AR, "watch2day", "shahid2day", "watch 2 day"],
  url: SITE_URL,
  inLanguage: ["en", "ar"],
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const initialLang = parseUiLang((await cookies()).get(UI_LANG_KEY)?.value);
  const { htmlLang, dir } = htmlLangDir(initialLang);
  return (
    <html lang={htmlLang} dir={dir} suppressHydrationWarning>
      <head>
        <meta name="clckd" content="237d59ff30c2737d80e61b0f9969ed4f" />
        <meta
          name="141f2ead4524320f21fe73ef86766a6178294da9"
          content="141f2ead4524320f21fe73ef86766a6178294da9"
        />
      </head>
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
        <LanguageProvider initialLang={initialLang}>
          <SiteShell>{children}</SiteShell>
          <AdChromeGuard />
          <PlayerCornerAds />
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
