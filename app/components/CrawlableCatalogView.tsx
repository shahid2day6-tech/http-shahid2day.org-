"use client";

import Link from "next/link";
import { useLang } from "../context/LanguageContext";
import type { CrawlLink } from "../lib/crawlCatalog";
import type { DictKey } from "../lib/i18n";

export default function CrawlableCatalogView({
  kind,
  links,
  compact,
}: {
  kind: "home" | "movies" | "series" | "anime";
  links: CrawlLink[];
  compact: boolean;
}) {
  const { t, lang } = useLang();
  const headingKey: DictKey =
    kind === "movies"
      ? "crawlMovies"
      : kind === "series"
        ? "crawlSeries"
        : kind === "anime"
          ? "crawlAnime"
          : "crawlHome";
  const blurbKey: DictKey = kind === "anime" ? "crawlAnimeBlurb" : "crawlBlurb";

  return (
    <section className={`mx-auto px-4 pb-16 sm:px-6 ${compact ? "max-w-3xl" : "max-w-[1100px]"}`}>
      <h2 className="mb-4 text-xl font-black text-white sm:text-2xl">{t(headingKey)}</h2>
      <p className="mb-5 text-sm text-[#a3a3a3]">{t(blurbKey)}</p>
      <ul className={`grid grid-cols-1 gap-2 ${compact ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
        {links.map((link) => {
          const label =
            lang === "ar" || !link.title
              ? link.label
              : `Watch ${link.type === "tv" ? t("show") : t("movie")} ${link.title}${
                  link.year ? ` ${link.year}` : ""
                } ${t("subtitledOnline")}`;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block rounded-lg border border-[#262626] bg-[#141414] px-3 py-2 text-sm text-white transition hover:border-[#e50914] hover:text-[#e50914]"
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
