"use client";

import { useEffect } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { listingTitle, titleGenres, titleOverview, titleRuntime, type TitleDetails } from "../lib/tmdb";
import { formatAgeBadge } from "../lib/tmdbAge";
import { useTmdbAgeCode } from "../lib/useTmdbAgeCode";
import { useLang } from "../context/LanguageContext";
import { titleHref } from "../lib/slug";
import MediaRow from "./MediaRow";
import { SiteAdsterraRail } from "./ads/SiteAdsterraRail";

function FactBox({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex w-fit max-w-full items-center gap-2">
      <span className="inline-block w-fit rounded-md bg-[#e50914] px-3 py-1.5 text-sm font-bold text-white">
        {label}
      </span>
      <span className="text-sm font-bold text-white sm:text-base" dir="auto">
        {value}
      </span>
    </div>
  );
}

function ActionBox({
  href,
  label,
  tone,
  children,
}: {
  href: string;
  label: string;
  tone: "red" | "green";
  children: ReactNode;
}) {
  const colors =
    tone === "red"
      ? "bg-[#9d0b12] shadow-[0_8px_24px_rgba(157,11,18,0.45)]"
      : "bg-[#2f6b45] shadow-[0_8px_24px_rgba(47,107,69,0.45)]";
  return (
    <a
      href={href}
      className={`flex w-full max-w-[220px] flex-1 flex-col items-center justify-center rounded-2xl px-4 py-5 sm:px-6 sm:py-7 ${colors}`}
    >
      {children}
      <span className="mt-3 text-lg font-black text-white">{label}</span>
    </a>
  );
}

export default function TitleView({ title }: { title: TitleDetails }) {
  const { t, lang } = useLang();
  const router = useRouter();
  const pathname = usePathname();
  const ageCode = useTmdbAgeCode(title.type, title.id) ?? "13";
  const firstSeason = title.seasonList?.[0]?.seasonNumber ?? 1;
  const watchHref = `/watch?id=${title.id}&type=${title.type}${
    title.type === "tv" ? `&season=${firstSeason}&episode=1` : ""
  }`;
  const heading = listingTitle(title, lang);
  const overview = titleOverview(title, lang);
  const genreText = titleGenres(title, lang);
  const runtimeText = titleRuntime(title, lang);

  useEffect(() => {
    const wanted = titleHref(title, lang);
    let current = pathname;
    try {
      current = decodeURIComponent(pathname);
    } catch {
      /* keep */
    }
    if (wanted && current !== wanted) {
      router.replace(wanted);
    }
  }, [lang, pathname, router, title]);

  return (
    <article>
      <section className="relative overflow-hidden md:min-h-[560px] lg:min-h-[640px]">
        {title.backdrop && (
          <Image
            src={title.backdrop}
            alt={title.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        )}
        <div className="hero-mask absolute inset-0" />
        <div
          dir="ltr"
          className="relative mx-auto flex max-w-7xl flex-col items-center gap-5 px-4 py-6 sm:px-6 md:flex-row md:items-end md:justify-between md:gap-8 md:py-10 lg:pl-[252px]"
        >
          <div className="w-full max-w-2xl md:pb-2">
            <h1 className="text-2xl font-black sm:text-4xl md:text-5xl" dir={lang === "ar" ? "rtl" : "ltr"}>
              {heading}
            </h1>
            <div className="mt-4 flex flex-col items-start gap-2">
              <FactBox
                label={t("classification")}
                value={title.type === "tv" ? t("show") : t("movie")}
              />
              <FactBox label={t("ageRating")} value={formatAgeBadge(ageCode)} />
              <FactBox label={t("year")} value={title.year} />
              <FactBox
                label={t("rating")}
                value={title.rating !== "0" ? `★ ${title.rating}` : ""}
              />
              <FactBox
                label={t("seasons")}
                value={title.seasons ? String(title.seasons) : ""}
              />
              <FactBox
                label={t("episodes")}
                value={title.episodes ? String(title.episodes) : ""}
              />
              <FactBox label={t("duration")} value={runtimeText} />
              <FactBox label={t("network")} value={title.network ?? ""} />
              <FactBox label={t("genres")} value={genreText} />
            </div>
          </div>
          {title.poster && (
            <div className="relative aspect-[2/3] w-[min(78vw,280px)] shrink-0 overflow-hidden rounded-2xl border border-[#262626] shadow-2xl order-first sm:w-[300px] md:order-none md:w-[320px] lg:w-[360px]">
              <Image src={title.poster} alt={title.title} fill className="object-cover" sizes="(max-width: 768px) 78vw, 360px" />
            </div>
          )}
        </div>
        <div className="relative z-10 mx-auto mb-6 flex w-full max-w-md flex-row justify-center gap-3 px-4 lg:absolute lg:bottom-16 lg:left-4 lg:mx-0 lg:mb-0 lg:w-[220px] lg:max-w-none lg:flex-col lg:px-0">
          <ActionBox href={watchHref} label={t("watchNow")} tone="red">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#e50914" aria-hidden>
                <path d="M8 5.14v13.72L19 12 8 5.14z" />
              </svg>
            </span>
          </ActionBox>
          <ActionBox href="#watch-on" label={t("downloadNow")} tone="green">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M6.5 16.5A4.5 4.5 0 0 1 7 7.6 5.5 5.5 0 0 1 17.7 9 3.8 3.8 0 0 1 18 16.5"
                  stroke="#2f6b45"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="M12 11v7m0 0-3-3m3 3 3-3"
                  stroke="#2f6b45"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </ActionBox>
        </div>
      </section>

      <div id="watch-on" className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {overview && (
          <section className="mb-10 max-w-3xl rounded-2xl bg-[#141414] p-5 sm:p-6">
            <h2 className="mb-3 text-xl font-black">{t("overview")}</h2>
            <p className="leading-8 text-[#d4d4d4]" dir="auto">
              {overview}
            </p>
          </section>
        )}

        {title.providers.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-3 text-xl font-black">{t("watchOn")}</h2>
            <div className="flex flex-wrap gap-3">
              {title.providers.map((provider) => (
                <div
                  key={provider.name}
                  className="flex items-center gap-2 rounded-full border border-[#262626] bg-[#141414] px-3 py-1.5 text-sm"
                >
                  {provider.logo && (
                    <Image
                      src={provider.logo}
                      alt={provider.name}
                      width={24}
                      height={24}
                      className="rounded"
                    />
                  )}
                  {provider.name}
                </div>
              ))}
            </div>
          </section>
        )}

        {title.cast.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-3 text-xl font-black">{t("cast")}</h2>
            <div className="row-scroll">
              {title.cast.map((person) => (
                <div key={person.name} className="w-[110px] shrink-0">
                  <div className="relative mb-2 aspect-[2/3] overflow-hidden rounded-xl bg-[#141414]">
                    {person.photo ? (
                      <Image src={person.photo} alt={person.name} fill className="object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-2xl font-black text-white/70">
                        {person.name.trim().charAt(0) || "؟"}
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-bold" dir="auto">
                    {person.name}
                  </p>
                  <p className="text-xs text-[#a3a3a3]" dir="auto">
                    {person.character}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        <SiteAdsterraRail variant="alt" className="mb-10" />
        <MediaRow title={t("similar")} items={title.similar} />
      </div>
    </article>
  );
}
