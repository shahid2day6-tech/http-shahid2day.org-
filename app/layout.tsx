import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import { LanguageProvider } from "./context/LanguageContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { SITE_LOGO, SITE_NAME_AR, SITE_NAME_EN, SITE_URL } from "./lib/site";
import "./globals.css";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-tajawal",
});

const title = `${SITE_NAME_AR} | ${SITE_NAME_EN}`;
const description =
  "شاهد تو داي — اكتشف أحدث الأفلام والمسلسلات والأنمي العربية والتركية والآسيوية. SHAHID2DAY catalog for movies, series, and anime.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME_EN,
  title: {
    default: title,
    template: `%s | ${SITE_NAME_AR}`,
  },
  description,
  keywords: [
    "شاهد تو داي",
    "SHAHID2DAY",
    "shahid2day",
    "شاهد لليوم",
    "أفلام",
    "مسلسلات",
    "أنمي",
    "مسلسلات عربية",
    "مسلسلات تركية",
    "مسلسلات آسيوية",
  ],
  authors: [{ name: SITE_NAME_EN, url: SITE_URL }],
  creator: SITE_NAME_EN,
  publisher: SITE_NAME_EN,
  category: "entertainment",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title,
    description: "أفلام ومسلسلات وأنمي عربي وتركي وآسيوي",
    url: SITE_URL,
    siteName: SITE_NAME_EN,
    locale: "ar_SA",
    type: "website",
    images: [
      {
        url: SITE_LOGO,
        width: 512,
        height: 512,
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
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/logo.png", sizes: "512x512", type: "image/png" },
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
      <body className={`${tajawal.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <LanguageProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
