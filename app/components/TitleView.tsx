"use client";

import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";
import { listingTitle, type TitleDetails, type TvSeasonEpisode } from "../lib/tmdb";
import { useLang } from "../context/LanguageContext";
import MediaRow from "./MediaRow";
import TvEpisodeBrowser, { type TvEpisode, type TvSeason } from "./TvEpisodeBrowser";
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
  const firstSeason = title.seasonList?.[0]?.seasonNumber ?? 1;
  const [selectedSeason, setSelectedSeason] = useState(firstSeason);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [episodes, setEpisodes] = useState<TvSeasonEpisode[]>([]);
  const [epLoading, setEpLoading] = useState(false);

  useEffect(() => {
    if (title.type !== "tv") return;
    let cancelled = false;
    setEpLoading(true);
    fetch(`/api/tv/${title.id}/season/${selectedSeason}?lang=${lang === "en" ? "en" : "ar"}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data || data.error) return;
        setEpisodes((data.episodes ?? []) as TvSeasonEpisode[]);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setEpLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [title.id, title.type, lang, selectedSeason]);

  const watchHref = `/watch?id=${title.id}&type=${title.type}${
    title.type === "tv" ? `&season=${selectedSeason}&episode=${selectedEpisode}` : ""
  }`;
  const seasonCards: TvSeason[] =
    title.type === "movie"
      ? [
          {
            season_number: 1,
            name: title.title,
            episode_count: 1,
            poster: title.poster,
            year: title.year,
          },
        ]
      : (title.seasonList ?? []).map((item) => ({
          season_number: item.seasonNumber,
          name: item.name,
          episode_count: item.episodeCount,
          poster: item.poster,
          year: item.year,
        }));
  const episodeCards: TvEpisode[] =
    title.type === "movie"
      ? [
          {
            episode_number: 1,
            name: title.title,
            overview: title.overview,
            still: title.backdrop || title.poster,
            runtime: Number((title.runtime || "").replace(/\D/g, "")) || null,
            vote_average: Number(title.rating) || 0,
          },
        ]
      : episodes.map((item) => ({
          episode_number: item.episodeNumber,
          name: item.name,
          overview: item.overview,
          still: item.still,
          runtime: item.runtime,
          vote_average: item.voteAverage,
        }));

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
        <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-5 px-4 py-6 sm:px-6 md:flex-row md:items-end md:gap-8 md:py-10 lg:pl-[252px]">
          {title.poster && (
            <div className="relative aspect-[2/3] w-[min(78vw,280px)] shrink-0 overflow-hidden rounded-2xl border border-[#262626] shadow-2xl sm:w-[300px] md:w-[320px] lg:w-[360px]">
              <Image src={title.poster} alt={title.title} fill className="object-cover" sizes="(max-width: 768px) 78vw, 360px" />
            </div>
          )}
          <div className="w-full max-w-2xl">
            <h1 className="text-2xl font-black sm:text-4xl md:text-5xl" dir="rtl">
              {listingTitle(title)}
            </h1>
            <div className="mt-4 flex flex-col items-start gap-2">
              <FactBox
                label={t("classification")}
                value={title.type === "tv" ? t("show") : t("movie")}
              />
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
              <FactBox label={t("duration")} value={title.runtime} />
              <FactBox label={t("network")} value={title.network ?? ""} />
              <FactBox label={t("genres")} value={title.genres.join(" / ")} />
            </div>
          </div>
        </div>
        <div className="relative z-10 mx-auto mb-6 flex w-full max-w-md flex-row justify-center gap-3 px-4 lg:absolute lg:bottom-16 lg:left-4 lg:mx-0 lg:mb-0 lg:w-[220px] lg:max-w-none lg:flex-col lg:px-0">
          <ActionBox href={watchHref} label={t("watchNow")} tone="red">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#9d0b12" aria-hidden>
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

      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
        {seasonCards.length > 0 ? (
          <TvEpisodeBrowser
            seasons={seasonCards}
            episodes={episodeCards}
            selectedSeason={title.type === "movie" ? 1 : selectedSeason}
            selectedEpisode={title.type === "movie" ? 1 : selectedEpisode}
            loading={title.type === "tv" && epLoading && episodeCards.length === 0}
            onSelectSeason={(nextSeason) => {
              setSelectedSeason(nextSeason);
              setSelectedEpisode(1);
            }}
            onSelectEpisode={(nextEpisode) => {
              setSelectedEpisode(nextEpisode);
              window.location.href = `/watch?id=${title.id}&type=${title.type}${
                title.type === "tv" ? `&season=${selectedSeason}&episode=${nextEpisode}` : ""
              }`;
            }}
          />
        ) : null}
      </div>

      <div id="watch-on" className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <SiteAdsterraRail />
        {title.overview && (
          <section className="mb-10 max-w-3xl rounded-2xl bg-[#141414] p-5 sm:p-6">
            <h2 className="mb-3 text-xl font-black">{t("overview")}</h2>
            <p className="leading-8 text-[#d4d4d4]" dir="auto">
              {title.overview}
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

        <MediaRow title={t("similar")} items={title.similar} />
      </div>
    </article>
  );
}
