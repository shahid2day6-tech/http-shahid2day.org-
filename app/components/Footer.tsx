"use client";

import Link from "next/link";
import { useLang } from "../context/LanguageContext";

export default function Footer() {
  const { t } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-[#243044] bg-[#0a0e1a]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
        <div>
          <span className="brand-wordmark text-[1.55rem]" dir="ltr">
            SHAHID<span className="digit">2</span>DAY
          </span>
          <p className="mt-4 max-w-sm text-sm leading-7 text-[#d6cfc2]">{t("footerAbout")}</p>
        </div>
        <div>
          <p className="mb-3 text-sm font-black">{t("browse")}</p>
          <div className="grid grid-cols-1 gap-2 text-sm text-[#cfcfcf]">
            <Link href="/movies">{t("movies")}</Link>
            <Link href="/series">{t("series")}</Link>
            <Link href="/movies/arabic">{t("arabicMovies")}</Link>
            <Link href="/series/arabic">{t("arabicSeries")}</Link>
            <Link href="/series/ramadan">{t("ramadanSeries")}</Link>
            <Link href="/movies/turkish">{t("turkishMovies")}</Link>
            <Link href="/series/turkish">{t("turkishSeries")}</Link>
          </div>
        </div>
        <div className="text-sm text-[#a3a3a3]">
          <p>shahid2day.org</p>
          <p className="mt-2">
            {t("rights")} © {year} {t("brand")}
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-xs">
            <Link href="/about" className="hover:text-[#e50914]">About</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
