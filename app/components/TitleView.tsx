"use client";

import Image from "next/image";
import type { TitleDetails } from "../lib/tmdb";
import { useLang } from "../context/LanguageContext";
import MediaRow from "./MediaRow";
import BrandWordmark from "./BrandWordmark";

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
        <div className="relative mx-auto flex max-w-7xl flex-col gap-6 px-4 py-16 sm:flex-row sm:items-end sm:px-6">
          {title.poster && (
            <div className="relative h-[280px] w-[186px] shrink-0 overflow-hidden rounded-2xl border border-[#262626] shadow-2xl">
              <Image src={title.poster} alt={title.title} fill className="object-cover" />
            </div>
          )}
          <div className="max-w-2xl">
            <p className="mb-2 text-sm font-bold text-[#e50914]">
              {title.type === "tv" ? t("show") : t("movie")}
            </p>
            <h1 className="text-3xl font-black sm:text-5xl" dir="auto">
              {title.title}
            </h1>
            <div className="mt-3 flex flex-wrap gap-2 text-sm text-[#d4d4d4]">
              {title.year && <span>{title.year}</span>}
              {title.rating !== "0" && <span>★ {title.rating}</span>}
              {title.runtime && <span>{title.runtime}</span>}
              {title.seasons ? (
                <span>
                  {title.seasons} {t("seasons")}
                </span>
              ) : null}
              {title.genres.map((genre) => (
                <span key={genre} className="rounded-full bg-white/10 px-2 py-0.5">
                  {genre}
                </span>
              ))}
            </div>
            {title.trailer && (
              <a
                href={`https://www.youtube.com/watch?v=${title.trailer}`}
                target="_blank"
                rel="noreferrer"
                className="btn-light mt-5 inline-flex px-5 py-2.5 text-sm"
              >
                {t("watchTrailer")}
              </a>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {title.overview && (
          <section className="mb-10">
            <h2 className="mb-3 text-xl font-black">{t("overview")}</h2>
            <p className="max-w-3xl leading-8 text-[#d4d4d4]">{title.overview}</p>
          </section>
        )}

        {title.trailer && (
          <section className="mb-10">
            <h2 className="mb-3 text-xl font-black">{t("watchTrailer")}</h2>
            <div className="aspect-video overflow-hidden rounded-2xl border border-[#262626] bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${title.trailer}`}
                title={title.title}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
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
