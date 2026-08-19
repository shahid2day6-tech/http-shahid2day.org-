"use client";

import { useEffect, useRef, useState } from "react";
import type { MediaItem } from "../lib/tmdb";
import { useLang } from "../context/LanguageContext";
import MediaCard from "./MediaCard";
import { InGridAdCard } from "./ads/InGridAdCard";
import { pickRandomInsertAfter } from "./ads/randomInGridSlots";

export default function WatchSuggestions({ items }: { items: MediaItem[] }) {
  const { t, isRtl } = useLang();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const check = () => {
      const max = el.scrollWidth - el.clientWidth;
      setAtStart(Math.abs(el.scrollLeft) <= 8);
      setAtEnd(Math.abs(el.scrollLeft) >= max - 8);
    };
    check();
    el.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      el.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [items.length]);

  if (!items.length) return null;

  const insertAfter = pickRandomInsertAfter(
    items.length,
    items.length >= 8 ? 2 : 1,
    6,
    "watch-suggest",
  );

  function scrollByAmount(direction: "next" | "prev") {
    const el = scrollRef.current;
    if (!el) return;
    const amount = Math.max(el.clientWidth * 0.75, 300);
    const delta = direction === "next" ? amount : -amount;
    el.scrollBy({ left: isRtl ? -delta : delta, behavior: "smooth" });
  }

  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-[#262626] bg-[#141414] p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-base font-black sm:text-lg">
          <span className="h-5 w-1 rounded-full bg-[#e50914]" />
          {t("suggestions")}
        </h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollByAmount("prev")}
            disabled={atStart}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#262626] bg-[#1a1a1a] disabled:opacity-35"
            aria-label={isRtl ? "السابق" : "Previous"}
          >
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
              className={isRtl ? "rotate-180" : ""}
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => scrollByAmount("next")}
            disabled={atEnd}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e50914]/40 bg-[#e50914]/15 text-[#e50914] disabled:opacity-35"
            aria-label={isRtl ? "التالي" : "Next"}
          >
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
              className={isRtl ? "rotate-180" : ""}
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
      <div ref={scrollRef} className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {items.flatMap((item, index) => {
          const card = (
            <div key={item.href ?? `${item.type}-${item.id}`} className="w-[188px] shrink-0 sm:w-[216px] lg:w-[236px]">
              <MediaCard item={item} movieLabel={t("movie")} showLabel={t("show")} />
            </div>
          );
          if (!insertAfter.has(index + 1)) return [card];
          return [
            card,
            <InGridAdCard key={`suggest-ad-${index}`} className="w-[188px] shrink-0 sm:w-[216px] lg:w-[236px]" />,
          ];
        })}
      </div>
    </section>
  );
}
