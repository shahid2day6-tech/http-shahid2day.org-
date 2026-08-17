"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { MediaItem } from "../lib/tmdb";
import { titleHref } from "../lib/slug";
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
  const href = titleHref(current);

  return (
    <section className="relative mb-6 h-[min(72svh,560px)] min-h-[360px] overflow-hidden rounded-b-3xl border-b border-[#243044] sm:mb-8 sm:h-[min(70svh,620px)] md:h-[min(64svh,680px)] lg:h-[min(58vw,620px)]">
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
        <div className="mx-auto w-full max-w-7xl px-4 pb-6 sm:px-6 sm:pb-10 md:pb-14">
          <p className="mb-2 inline-flex rounded-full border border-[#e50914]/50 bg-[#e50914]/15 px-3 py-1 text-xs font-bold text-[#e6e2d8] sm:mb-3">
            {t("trending")}
          </p>
          <h1 className="max-w-2xl text-2xl font-black leading-tight sm:text-4xl md:text-5xl" dir="auto">
            {current.title}
          </h1>
          <p className="mt-2 max-w-xl line-clamp-2 text-sm leading-6 text-[#d4d4d4] sm:mt-3 sm:line-clamp-3 sm:leading-7 md:text-base">
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
