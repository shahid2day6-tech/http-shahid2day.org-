"use client";

import Image from "next/image";
import { useLang } from "../context/LanguageContext";

export type TvSeason = {
  season_number: number;
  name: string;
  episode_count: number;
  poster: string | null;
  year?: string | null;
};

export type TvEpisode = {
  episode_number: number;
  name: string;
  overview: string;
  still: string | null;
  runtime: number | null;
  vote_average: number;
};

export default function TvEpisodeBrowser({
  seasons,
  episodes,
  selectedSeason,
  selectedEpisode,
  loading,
  onSelectSeason,
  onSelectEpisode,
}: {
  seasons: TvSeason[];
  episodes: TvEpisode[];
  selectedSeason: number;
  selectedEpisode: number;
  loading: boolean;
  onSelectSeason: (season: number) => void;
  onSelectEpisode: (episode: number) => void;
}) {
  const { t } = useLang();
  const currentSeason = seasons.find((s) => s.season_number === selectedSeason) ?? seasons[0];
  const sortedEpisodes = [...episodes].sort((a, b) => a.episode_number - b.episode_number);

  if (seasons.length === 0) {
    return <p className="text-sm text-[var(--text-muted)]">{t("noEpisodes")}</p>;
  }

  return (
    <section id="tv-episodes" className="mb-6 space-y-3">
      <div className="season-rail">
        <div className="season-rail-head">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span>{t("allSeasons")}</span>
        </div>
        <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
          {seasons.map((season) => {
            const active = season.season_number === selectedSeason;
            return (
              <button
                key={season.season_number}
                type="button"
                onClick={() => onSelectSeason(season.season_number)}
                className={`season-card ${active ? "season-card-active" : ""}`}
                aria-pressed={active}
              >
                <span className="text-[10px] font-semibold tracking-wide text-white/70">
                  {t("season")} {season.season_number}
                </span>
                <span className="my-0.5 text-3xl font-black leading-none text-white">
                  {season.season_number}
                </span>
                <span className="text-[11px] font-medium text-white/65">
                  {season.year || "—"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="episode-panel episode-rail" style={{ background: "#c62828" }}>
        <div className="episode-rail-head">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <polygon points="5,3 19,12 5,21" />
          </svg>
          <span>{t("allEpisodes")}</span>
        </div>

        {currentSeason && (
          <div className="episode-rail-summary">
            <div className="relative h-12 w-9 shrink-0 overflow-hidden rounded-md bg-black/25">
              {currentSeason.poster ? (
                <Image
                  src={currentSeason.poster}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="36px"
                />
              ) : null}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-black">
                {currentSeason.name || `${t("season")} ${currentSeason.season_number}`}
              </p>
              <p className="text-xs text-white/80">
                {[currentSeason.year, `${currentSeason.episode_count} ${t("episodes")}`]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="skeleton h-[6.75rem] w-[5.75rem] shrink-0 rounded-xl bg-black/20" />
            ))}
          </div>
        ) : (
          <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
            {sortedEpisodes.map((ep) => {
              const active = selectedEpisode === ep.episode_number;
              return (
                <button
                  key={ep.episode_number}
                  type="button"
                  onClick={() => onSelectEpisode(ep.episode_number)}
                  className={`episode-num-card ${active ? "episode-num-card-active" : ""}`}
                  aria-pressed={active}
                  aria-label={`${t("episode")} ${ep.episode_number}`}
                >
                  <span className="episode-num-card-value">{ep.episode_number}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
