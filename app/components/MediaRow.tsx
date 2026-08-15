"use client";

import Link from "next/link";
import type { MediaItem } from "../lib/tmdb";
import { useLang } from "../context/LanguageContext";
import MediaCard from "./MediaCard";

export default function MediaRow({
  title,
  href,
  items,
}: {
  title: string;
  href?: string;
  items: MediaItem[];
}) {
  const { t } = useLang();
  if (!items.length) return null;

  return (
    <section className="mb-10">
      <div className="mb-4 flex items-end justify-between gap-3">
        <h2 className="text-xl font-black sm:text-2xl">{title}</h2>
        {href && (
          <Link href={href} className="text-sm font-bold text-[#e50914] hover:underline">
            {t("browse")}
          </Link>
        )}
      </div>
      <div className="row-scroll">
        {items.map((item) => (
          <div key={item.href ?? `${item.type}-${item.id}`} className="w-[148px] shrink-0 scroll-snap-start sm:w-[168px]">
            <MediaCard item={item} movieLabel={t("movie")} showLabel={t("show")} />
          </div>
        ))}
      </div>
    </section>
  );
}
