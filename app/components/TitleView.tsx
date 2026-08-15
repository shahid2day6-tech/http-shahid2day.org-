"use client";

import Image from "next/image";
import type { TitleDetails } from "../lib/tmdb";
import { useLang } from "../context/LanguageContext";
import MediaRow from "./MediaRow";

function InfoRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <span className="shrink-0 rounded-md bg-[#e50914] px-3 py-1 text-sm font-bold text-white">
        {label}
      </span>
      <span className="pt-0.5 text-sm leading-7 text-white sm:text-base" dir="auto">
        {value}
      </span>
    </div>
  );
}

export default function TitleView({ title }: { title: TitleDetails }) {
  const { t } = useLang();

  return (
    <article>
      <section className="bg-[#050505] px-4 py-8 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-start">
          {title.poster && (
            <div className="relative mx-auto h-[360px] w-[240px] shrink-0 overflow-hidden rounded-xl border border-[#262626] shadow-2xl sm:mx-0 sm:h-[420px] sm:w-[280px]">
              <Image src={title.poster} alt={title.title} fill className="object-cover" priority />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h1 className="mb-5 text-2xl font-black sm:text-4xl" dir="auto">
              {title.title}
            </h1>

            <div className="space-y-3">
              <InfoRow
                label={t("classification")}
                value={title.type === "tv" ? t("show") : t("movie")}
              />
              <InfoRow label={t("year")} value={title.year} />
              <InfoRow label={t("rating")} value={title.rating !== "0" ? `★ ${title.rating}` : ""} />
              <InfoRow label={t("duration")} value={title.runtime} />
              <InfoRow
                label={t("seasons")}
                value={title.seasons ? `${title.seasons}` : ""}
              />
              <InfoRow label={t("genres")} value={title.genres.join(" / ")} />
            </div>

            {title.overview && (
              <div className="mt-6">
                <span className="inline-block rounded-md bg-[#e50914] px-3 py-1 text-sm font-bold text-white">
                  {t("overview")}
                </span>
                <div className="mt-2 rounded-xl bg-[#1c1c1c] p-4 text-sm leading-8 text-[#f0f0f0] sm:p-5 sm:text-base">
                  <p dir="auto">{title.overview}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
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
                    ) : null}
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
