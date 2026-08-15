"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useLang } from "../context/LanguageContext";
import { listingTitle, type TitleDetails } from "../lib/tmdb";
import { titleHref } from "../lib/slug";
import { buildWatchServers } from "../lib/watchServers";

type Props = {
  id: string;
  type: "movie" | "tv";
  season: number;
  episode: number;
};

export default function WatchPlayer({ id, type, season, episode }: Props) {
  const { t, lang } = useLang();
  const [title, setTitle] = useState<TitleDetails | null>(null);
  const [started, setStarted] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(season);
  const [selectedEpisode, setSelectedEpisode] = useState(episode);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/${type === "tv" ? "tv" : "movie"}/${id}?lang=${lang === "en" ? "en" : "ar"}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data && !data.error) setTitle(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [id, type, lang]);

  const servers = useMemo(
    () => buildWatchServers(type, id, selectedSeason, selectedEpisode),
    [type, id, selectedSeason, selectedEpisode]
  );
  const current = servers[0];
  const backHref = title ? titleHref(title) : "/";
  const seasons = title?.seasonEpisodes ?? [];
  const episodes =
    seasons.find((item) => item.seasonNumber === selectedSeason)?.episodes ?? [];
  const heading = title ? listingTitle(title) : t("watchNow");
  const nextEpisode = episodes.find((item) => item.episodeNumber === selectedEpisode + 1);

  function playOn() {
    setStarted(true);
  }

  function goEpisode(next: number) {
    setSelectedEpisode(next);
    setStarted(true);
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href={backHref} className="text-sm font-bold text-[#e50914]">
          ← {t("details")}
        </Link>
        <p className="truncate text-sm font-black sm:text-base" dir="auto">
          {heading}
        </p>
        <span className="shrink-0 rounded-md bg-[#e50914] px-2 py-1 text-[11px] font-black">
          {t("subtitled")}
        </span>
      </div>

      {type === "tv" && seasons.length > 0 && (
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-4 pb-3">
          <select
            value={selectedSeason}
            onChange={(e) => {
              const next = Number(e.target.value);
              setSelectedSeason(next);
              setSelectedEpisode(1);
              setStarted(true);
            }}
            className="rounded-lg border border-[#262626] bg-[#141414] px-3 py-2 text-sm font-bold"
          >
            {seasons.map((item) => (
              <option key={item.seasonNumber} value={item.seasonNumber}>
                {t("season")} {item.seasonNumber}
              </option>
            ))}
          </select>
          <select
            value={selectedEpisode}
            onChange={(e) => goEpisode(Number(e.target.value))}
            className="rounded-lg border border-[#262626] bg-[#141414] px-3 py-2 text-sm font-bold"
          >
            {episodes.map((item) => (
              <option key={item.episodeNumber} value={item.episodeNumber}>
                {t("episode")} {item.episodeNumber}
              </option>
            ))}
          </select>
          {nextEpisode ? (
            <button
              type="button"
              onClick={() => goEpisode(nextEpisode.episodeNumber)}
              className="rounded-lg bg-[#e50914] px-3 py-2 text-sm font-black"
            >
              {t("nextEpisode")}
            </button>
          ) : null}
        </div>
      )}

      <div className="mx-auto max-w-6xl px-4 pb-10">
        <div className="relative aspect-video overflow-hidden rounded-xl bg-[#0e0e0e]">
          {title?.backdrop ? (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${title.backdrop})` }}
            />
          ) : null}
          <div className="absolute inset-0 bg-black/55" />
          {started && current ? (
            <iframe
              key={current.url}
              src={current.url}
              title={current.label}
              className="relative z-10 h-full w-full border-0"
              allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
              allowFullScreen
              referrerPolicy="origin"
            />
          ) : (
            <button
              type="button"
              onClick={() => playOn()}
              className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-4"
            >
              {title?.poster ? (
                <img
                  src={title.poster}
                  alt={heading}
                  className="h-40 w-28 rounded-lg object-cover shadow-2xl sm:h-52 sm:w-36"
                />
              ) : null}
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e50914] shadow-[0_8px_30px_rgba(229,9,20,0.55)]">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="white" aria-hidden>
                  <path d="M8 5.14v13.72L19 12 8 5.14z" />
                </svg>
              </span>
              <span className="text-lg font-black sm:text-2xl">{t("playTranslated")}</span>
              <span className="max-w-md px-4 text-center text-sm text-[#d4d4d4]" dir="auto">
                {heading}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
