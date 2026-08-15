import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import { LanguageProvider } from "./context/LanguageContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { SITE_NAME_AR, SITE_NAME_EN, SITE_URL } from "./lib/site";
import "./globals.css";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-tajawal",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME_AR} | ${SITE_NAME_EN}`,
    template: `%s | ${SITE_NAME_AR}`,
  },
  description:
    "شاهد لليوم — اكتشف أحدث الأفلام والمسلسلات والأنمي العربية والتركية والآسيوية. Shahid2Day catalog for movies, series, and anime.",
  keywords: [
    "شاهد لليوم",
    "shahid2day",
    "أفلام",
    "مسلسلات",
    "أنمي",
    "مسلسلات عربية",
    "مسلسلات تركية",
    "مسلسلات آسيوية",
  ],
  openGraph: {
    title: `${SITE_NAME_AR} | ${SITE_NAME_EN}`,
    description: "أفلام ومسلسلات وأنمي عربي وتركي وآسيوي",
    url: SITE_URL,
    siteName: SITE_NAME_EN,
    locale: "ar_SA",
    type: "website",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${tajawal.variable} antialiased`}>
        <LanguageProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
