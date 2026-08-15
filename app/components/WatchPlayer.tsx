"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useLang } from "../context/LanguageContext";
import { titleHref } from "../lib/slug";
import type { TitleDetails } from "../lib/tmdb";
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
  const [active, setActive] = useState(0);
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
  const current = servers[Math.min(active, servers.length - 1)];
  const backHref = title ? titleHref(title) : "/";
  const seasons = title?.seasonEpisodes ?? [];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href={backHref} className="text-sm font-bold text-[#e50914]">
          ← {t("details")}
        </Link>
        <p className="truncate text-sm font-black sm:text-base" dir="auto">
          {title?.title || t("watchNow")}
        </p>
      </div>

      {type === "tv" && seasons.length > 0 && (
        <div className="mx-auto flex max-w-6xl flex-wrap gap-2 px-4 pb-3">
          <select
            value={selectedSeason}
            onChange={(e) => {
              const next = Number(e.target.value);
              setSelectedSeason(next);
              setSelectedEpisode(1);
              setActive(0);
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
            onChange={(e) => {
              setSelectedEpisode(Number(e.target.value));
              setActive(0);
            }}
            className="rounded-lg border border-[#262626] bg-[#141414] px-3 py-2 text-sm font-bold"
          >
            {(seasons.find((item) => item.seasonNumber === selectedSeason)?.episodes ?? []).map(
              (item) => (
                <option key={item.episodeNumber} value={item.episodeNumber}>
                  {t("episode")} {item.episodeNumber}
                </option>
              )
            )}
          </select>
        </div>
      )}

      <div className="mx-auto max-w-6xl px-4 pb-3">
        <p className="mb-2 text-sm font-black text-[#a3a3a3]">{t("servers")}</p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {servers.map((server, index) => {
            const selected = index === active;
            return (
              <button
                key={server.name}
                type="button"
                onClick={() => setActive(index)}
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

      <div className="mx-auto max-w-6xl px-4 pb-10">
        <div className="aspect-video overflow-hidden rounded-xl bg-[#0e0e0e]">
          {current ? (
            <iframe
              key={current.url}
              src={current.url}
              title={current.label}
              className="h-full w-full border-0"
              allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
              allowFullScreen
              referrerPolicy="no-referrer"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
