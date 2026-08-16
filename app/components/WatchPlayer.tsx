"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLang } from "../context/LanguageContext";
import { listingTitle, type TitleDetails, type TvSeasonEpisode } from "../lib/tmdb";
import { titleHref } from "../lib/slug";
import { buildWatchServers } from "../lib/watchServers";
import MediaRow from "./MediaRow";
import TvEpisodeBrowser, { type TvEpisode, type TvSeason } from "./TvEpisodeBrowser";

type Props = {
  id: string;
  type: "movie" | "tv";
  season: number;
  episode: number;
  initialTitle?: TitleDetails | null;
  initialEpisodes?: TvSeasonEpisode[];
};

export default function WatchPlayer({
  id,
  type,
  season,
  episode,
  initialTitle = null,
  initialEpisodes = [],
}: Props) {
  const { t, lang, isRtl } = useLang();
  const router = useRouter();
  const [title, setTitle] = useState<TitleDetails | null>(initialTitle);
  const [started, setStarted] = useState(true);
  const [active, setActive] = useState(0);
  const [selectedSeason, setSelectedSeason] = useState(season);
  const [selectedEpisode, setSelectedEpisode] = useState(episode);
  const [episodes, setEpisodes] = useState<TvSeasonEpisode[]>(initialEpisodes);
  const [epLoading, setEpLoading] = useState(false);
  const pendingEpisodeRef = useRef<number | null>(null);

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

  useEffect(() => {
    if (type !== "tv") return;
    let cancelled = false;
    setEpLoading(true);
    fetch(`/api/tv/${id}/season/${selectedSeason}?lang=${lang === "en" ? "en" : "ar"}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data || data.error) return;
        const list = (data.episodes ?? []) as TvSeasonEpisode[];
        setEpisodes(list);
        const pending = pendingEpisodeRef.current;
        if (pending && list.some((item) => item.episodeNumber === pending)) {
          setSelectedEpisode(pending);
          pendingEpisodeRef.current = null;
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setEpLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, type, lang, selectedSeason]);

  const servers = useMemo(
    () => buildWatchServers(type, id, selectedSeason, selectedEpisode),
    [type, id, selectedSeason, selectedEpisode]
  );
  const current = servers[Math.min(active, Math.max(servers.length - 1, 0))];
  const backHref = title ? titleHref(title) : "/";
  const heading = title ? listingTitle(title) : t("watchNow");
  const seasonCards: TvSeason[] =
    type === "movie" && title
      ? [
          {
            season_number: 1,
            name: title.title,
            episode_count: 1,
            poster: title.poster,
            year: title.year,
          },
        ]
      : (title?.seasonList ?? []).map((item) => ({
          season_number: item.seasonNumber,
          name: item.name,
          episode_count: item.episodeCount,
          poster: item.poster,
          year: item.year,
        }));
  const episodeCards: TvEpisode[] =
    type === "movie" && title
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
  const episodeNav = useMemo(() => {
    const sorted = [...seasonCards].sort((a, b) => a.season_number - b.season_number);
    const index = sorted.findIndex((item) => item.season_number === selectedSeason);
    const maxEp = episodes.length
      ? Math.max(...episodes.map((item) => item.episodeNumber))
      : 0;
    let prev: { s: number; e: number } | null = null;
    if (selectedEpisode > 1) prev = { s: selectedSeason, e: selectedEpisode - 1 };
    else if (index > 0) {
      const previous = sorted[index - 1];
      prev = { s: previous.season_number, e: previous.episode_count || 1 };
    }
    let next: { s: number; e: number } | null = null;
    if (maxEp && selectedEpisode < maxEp) next = { s: selectedSeason, e: selectedEpisode + 1 };
    else if (index >= 0 && index < sorted.length - 1) {
      next = { s: sorted[index + 1].season_number, e: 1 };
    }
    return { prev, next };
  }, [seasonCards, episodes, selectedSeason, selectedEpisode]);

  function syncUrl(nextSeason: number, nextEpisode: number) {
    const params = new URLSearchParams(window.location.search);
    params.set("id", id);
    params.set("type", type);
    if (type === "tv") {
      params.set("season", String(nextSeason));
      params.set("episode", String(nextEpisode));
    }
    router.replace(`/watch?${params.toString()}`, { scroll: false });
  }

  function playOn(index = active) {
    setActive(index);
    setStarted(true);
  }

  function playEpisode(nextEpisode: number) {
    setSelectedEpisode(nextEpisode);
    setStarted(true);
    syncUrl(selectedSeason, nextEpisode);
    document.getElementById("watch-player")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function goTo(nextSeason: number, nextEpisode: number) {
    if (nextSeason !== selectedSeason) {
      pendingEpisodeRef.current = nextEpisode;
      setSelectedSeason(nextSeason);
    }
    setSelectedEpisode(nextEpisode);
    setStarted(true);
    syncUrl(nextSeason, nextEpisode);
    document.getElementById("watch-player")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto flex max-w-[1100px] items-center justify-between gap-3 px-4 py-3">
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

      {title ? (
        <section className="mx-auto mb-4 max-w-[1100px] overflow-hidden rounded-2xl border border-[#262626] bg-[#141414] px-4">
          <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-end">
            {title.poster ? (
              <img
                src={title.poster}
                alt={heading}
                className="mx-auto h-44 w-[118px] rounded-xl object-cover shadow-xl sm:mx-0 sm:h-52 sm:w-36"
              />
            ) : null}
            <div className="min-w-0 flex-1 text-center sm:text-start">
              <span className="inline-flex rounded-md bg-[#e50914] px-2.5 py-0.5 text-[12px] font-black text-white">
                HD
              </span>
              {title.year ? (
                <p className="mt-1 text-sm font-semibold text-[#a3a3a3]">{title.year}</p>
              ) : null}
              <h1 className="mt-1 text-xl font-black sm:text-3xl" dir="auto">
                {heading}
              </h1>
              <p className="mt-2 text-sm font-semibold text-[#d4d4d4]">
                {[
                  title.type === "tv" ? t("show") : t("movie"),
                  title.runtime,
                  title.genres.slice(0, 3).join(" / "),
                  title.rating !== "0" ? `★ ${title.rating}` : "",
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              {title.overview ? (
                <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#a3a3a3]" dir="auto">
                  {title.overview}
                </p>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      <div className="mx-auto max-w-[1100px] px-4 pb-3">
        <p className="mb-2 text-sm font-black text-[#a3a3a3]">{t("servers")}</p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {servers.map((server, index) => {
            const selected = index === active && started;
            return (
              <button
                key={server.name}
                type="button"
                onClick={() => playOn(index)}
                className={`relative shrink-0 rounded-lg px-4 py-2 text-sm font-black ${
                  selected ? "bg-[#e50914] text-white" : "bg-[#1a1a1a] text-[#d4d4d4]"
                }`}
              >
                {server.label}
                {server.recommended ? (
                  <span className="absolute -top-2 start-1 rounded bg-[#3f3f3f] px-1.5 py-0.5 text-[9px] font-bold text-white">
                    {t("recommended")}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mx-auto max-w-[1100px] px-4 pb-10">
        <div id="watch-player" className="relative aspect-video overflow-hidden rounded-xl bg-[#0e0e0e]">
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

        {seasonCards.length > 0 && type === "tv" ? (
          <div
            className="mt-4 mb-4 flex items-stretch gap-2 sm:gap-3"
            dir={isRtl ? "rtl" : "ltr"}
            role="navigation"
            aria-label={t("episodes")}
          >
            <button
              type="button"
              disabled={epLoading || !episodeNav.prev}
              onClick={() => episodeNav.prev && goTo(episodeNav.prev.s, episodeNav.prev.e)}
              className={`episode-nav-btn flex flex-1 items-center justify-center gap-2 ${
                !epLoading && episodeNav.prev ? "" : "episode-nav-btn-disabled"
              }`}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className={isRtl ? "rotate-180" : ""}
                aria-hidden
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
              <span className="hidden truncate sm:inline">{t("prevEpisode")}</span>
            </button>
            <div className="flex min-w-[5.5rem] flex-col items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-2 text-center">
              <span className="text-[10px] font-semibold text-[var(--text-dim)]">{t("episode")}</span>
              <span className="text-sm font-black">
                {selectedEpisode}
                {episodes.length > 0 ? ` / ${Math.max(...episodes.map((item) => item.episodeNumber))}` : ""}
              </span>
            </div>
            <button
              type="button"
              disabled={epLoading || !episodeNav.next}
              onClick={() => episodeNav.next && goTo(episodeNav.next.s, episodeNav.next.e)}
              className={`episode-nav-btn flex flex-1 items-center justify-center gap-2 ${
                !epLoading && episodeNav.next ? "episode-nav-btn-primary" : "episode-nav-btn-disabled"
              }`}
            >
              <span className="hidden truncate sm:inline">{t("nextEpisode")}</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className={isRtl ? "rotate-180" : ""}
                aria-hidden
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        ) : null}

        {title && seasonCards.length > 0 ? (
          <TvEpisodeBrowser
            seasons={seasonCards}
            episodes={episodeCards}
            selectedSeason={type === "movie" ? 1 : selectedSeason}
            selectedEpisode={type === "movie" ? 1 : selectedEpisode}
            loading={type === "tv" && epLoading && episodeCards.length === 0}
            onSelectSeason={(nextSeason) => {
              if (type === "movie") {
                document.getElementById("watch-player")?.scrollIntoView({ behavior: "smooth", block: "start" });
                return;
              }
              pendingEpisodeRef.current = null;
              setSelectedSeason(nextSeason);
              syncUrl(nextSeason, selectedEpisode);
            }}
            onSelectEpisode={playEpisode}
          />
        ) : null}

        {title?.similar?.length ? <MediaRow title={t("similar")} items={title.similar} /> : null}
      </div>
    </div>
  );
}
