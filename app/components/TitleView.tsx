"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { listingTitle, type TitleDetails } from "../lib/tmdb";
import { useLang } from "../context/LanguageContext";
import MediaRow from "./MediaRow";
import BrandWordmark from "./BrandWordmark";

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
      className={`flex w-full max-w-[220px] flex-col items-center justify-center rounded-2xl px-6 py-7 ${colors}`}
    >
      {children}
      <span className="mt-3 text-lg font-black text-white">{label}</span>
    </a>
  );
}

export default function TitleView({ title }: { title: TitleDetails }) {
  const { t } = useLang();

  return (
    <article>
      <section className="relative min-h-[420px] overflow-hidden">
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
        <div className="absolute top-5 start-4 z-10 sm:start-6">
          <BrandWordmark size="lg" />
        </div>
        <div className="relative mx-auto flex max-w-7xl flex-col gap-6 px-4 py-16 sm:flex-row sm:items-end sm:px-6 sm:pl-[252px]">
          {title.poster && (
            <div className="relative h-[280px] w-[186px] shrink-0 overflow-hidden rounded-2xl border border-[#262626] shadow-2xl">
              <Image src={title.poster} alt={title.title} fill className="object-cover" />
            </div>
          )}
          <div className="max-w-2xl">
            <h1 className="text-3xl font-black sm:text-5xl" dir="rtl">
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
        <div className="relative z-10 mx-4 mb-6 flex w-[220px] flex-col gap-3 sm:absolute sm:bottom-16 sm:left-4 sm:mx-0 sm:mb-0">
          <ActionBox
            href={`/watch?id=${title.id}&type=${title.type}${
              title.type === "tv" ? "&season=1&episode=1" : ""
            }`}
            label={t("watchNow")}
            tone="red"
          >
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

      <div id="watch-on" className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
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

        {title.seasonEpisodes && title.seasonEpisodes.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-5 text-xl font-black">{t("episodes")}</h2>
            <div className="space-y-8">
              {title.seasonEpisodes.map((season) => (
                <div key={season.seasonNumber}>
                  <h3 className="mb-3 text-lg font-bold text-white">
                    {t("season")} {season.seasonNumber}
                    {season.name ? ` · ${season.name}` : ""}
                  </h3>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {season.episodes.map((episode) => (
                      <a
                        key={`${season.seasonNumber}-${episode.episodeNumber}`}
                        href={`/watch?id=${title.id}&type=tv&season=${season.seasonNumber}&episode=${episode.episodeNumber}`}
                        className="overflow-hidden rounded-xl bg-[#141414] hover:bg-[#1c1c1c]"
                      >
                        <div className="relative aspect-video bg-[#1a1a1a]">
                          {episode.still ? (
                            <Image
                              src={episode.still}
                              alt={episode.name}
                              fill
                              sizes="220px"
                              className="object-cover"
                            />
                          ) : null}
                          <span className="absolute start-2 top-2 rounded-md bg-[#e50914] px-1.5 py-0.5 text-[10px] font-black text-white">
                            {t("episode")} {episode.episodeNumber}
                          </span>
                        </div>
                        <div className="p-2.5">
                          <p className="line-clamp-2 text-sm font-bold" dir="auto">
                            {episode.name}
                          </p>
                          {episode.airDate ? (
                            <p className="mt-1 text-xs text-[#a3a3a3]">{episode.airDate}</p>
                          ) : null}
                        </div>
                      </a>
                    ))}
                  </div>
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
