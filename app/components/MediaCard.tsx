"use client";

import Image from "next/image";
import Link from "next/link";
import type { MediaItem } from "../lib/tmdb";
import { titleHref } from "../lib/slug";
import { useLang } from "../context/LanguageContext";
import { CoverAgeBadge } from "./CoverAgeBadge";

export default function MediaCard({
  item,
  movieLabel,
  showLabel,
}: {
  item: MediaItem;
  movieLabel: string;
  showLabel: string;
}) {
  const { t, lang } = useLang();
  const href = item.href ?? titleHref(item, lang);
  const badge = item.isFranchise ? t("franchise") : item.type === "tv" ? showLabel : movieLabel;

  return (
    <Link href={href} className="poster-card group block w-full">
      <div className="relative aspect-[2/3] bg-[#1a1a1a]">
        {item.poster ? (
          <Image
            src={item.poster}
            alt={item.title}
            fill
            sizes="300px"
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[#666]">
            {item.title}
          </div>
        )}
        <span className="absolute left-2 top-2 z-10 rounded-md bg-[#e50914] px-1.5 py-0.5 text-[10px] font-black text-white rtl:left-auto rtl:right-2">
          {badge}
        </span>
        <CoverAgeBadge tmdbId={item.id} tmdbType={item.type} />
        {Number(item.rating) > 0 && (
          <span className="absolute end-2 bottom-2 rounded-md bg-black/70 px-1.5 py-0.5 text-[11px] font-bold text-[#e6e2d8]">
            ★ {item.rating}
          </span>
        )}
      </div>
      <div className="p-2.5">
        <p className="line-clamp-2 text-sm font-extrabold leading-snug" dir="auto">
          {item.title}
        </p>
        <p className="mt-1 text-xs text-[#a3a3a3]">
          {item.year}
          {!item.isFranchise && item.originalLanguage && item.originalLanguage !== "ar"
            ? ` · ${t("subtitled")}`
            : ""}
        </p>
      </div>
    </Link>
  );
}
