"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { MediaItem } from "../lib/tmdb";
import { useLang } from "../context/LanguageContext";

export default function Hero({ items }: { items: MediaItem[] }) {
  const { t } = useLang();
  const slides = items.filter((item) => item.backdrop).slice(0, 6);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const current = slides[index];
  if (!current) return null;
  const href = current.type === "tv" ? `/tv/${current.id}` : `/movie/${current.id}`;

  return (
    <section className="relative mb-10 h-[68vw] max-h-[620px] min-h-[380px] overflow-hidden rounded-b-3xl border-b border-[#262626]">
      <Image
        src={current.backdrop!}
        alt={current.title}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="hero-mask absolute inset-0" />
      <div className="absolute inset-0 flex items-end">
        <div className="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 sm:pb-14">
          <p className="mb-3 inline-flex rounded-full border border-[#e50914]/50 bg-[#e50914]/15 px-3 py-1 text-xs font-bold text-[#e6e2d8]">
            {t("trending")}
          </p>
          <h1 className="max-w-2xl text-3xl font-black leading-tight sm:text-5xl" dir="auto">
            {current.title}
          </h1>
          <p className="mt-3 max-w-xl line-clamp-3 text-sm leading-7 text-[#d4d4d4] sm:text-base">
            {current.overview}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={href} className="btn-red px-5 py-2.5 text-sm">
              {t("details")}
            </Link>
            <Link href="/movies" className="btn-light px-5 py-2.5 text-sm">
              {t("heroCta")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
