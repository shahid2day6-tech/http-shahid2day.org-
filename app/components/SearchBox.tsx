"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MediaItem } from "../lib/tmdb";
import { titleHref } from "../lib/slug";
import { useLang } from "../context/LanguageContext";
import { SearchDropdownAd } from "./ads/SearchDropdownAd";

export default function SearchBox() {
  const { t, lang } = useLang();
  const router = useRouter();
  const rootRef = useRef<HTMLFormElement>(null);
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<MediaItem[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setItems([]);
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    const timer = window.setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(q)}&lang=${lang}`, {
        signal: controller.signal,
      })
        .then((res) => (res.ok ? res.json() : { results: [] }))
        .then((data) => {
          setItems((data.results ?? []).slice(0, 8));
          setOpen(true);
        })
        .catch((error: unknown) => {
          if (error instanceof DOMException && error.name === "AbortError") return;
          setItems([]);
        })
        .finally(() => setLoading(false));
    }, 250);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query, lang]);

  useEffect(() => {
    function onPointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q.length < 2) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  const showPanel = open;
  const q = query.trim();

  return (
    <form ref={rootRef} onSubmit={onSearch} className="relative ms-auto w-full min-w-0 sm:max-w-xl">
      <div className="flex items-center rounded-full bg-[#1a1a1a] p-1.5">
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={t("searchHint")}
          className="min-w-0 flex-1 bg-transparent px-4 py-2 text-sm text-white outline-none placeholder:text-[#6b6b6b]"
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setItems([]);
              setOpen(false);
            }}
            className="me-1 flex h-7 w-7 items-center justify-center rounded-full text-lg text-[#9a9a9a] hover:text-white"
            aria-label="clear"
          >
            ×
          </button>
        )}
        <button
          type="submit"
          className="shrink-0 rounded-full bg-[#d8d8d8] px-4 py-1.5 text-sm font-black text-[#e50914]"
        >
          {t("searchBtn")}
        </button>
      </div>

      {showPanel && (
        <div className="absolute inset-x-0 top-[calc(100%+8px)] z-[60] overflow-hidden rounded-2xl border border-white/10 bg-[#1a1612] shadow-2xl">
          {q.length < 2 ? (
            <p className="px-4 py-4 text-sm text-[#a3a3a3]">{t("searchHint")}</p>
          ) : loading && items.length === 0 ? (
            <p className="px-4 py-6 text-sm text-[#a3a3a3]">{t("loading")}</p>
          ) : items.length === 0 ? (
            <p className="px-4 py-6 text-sm text-[#a3a3a3]">{t("noResults")}</p>
          ) : (
            <ul>
              {items.map((item) => (
                <li key={`${item.type}-${item.id}`}>
                  <Link
                    href={titleHref(item)}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 border-b border-white/5 px-3 py-3 last:border-b-0 hover:bg-white/5"
                  >
                    <div className="relative h-[72px] w-[50px] shrink-0 overflow-hidden rounded-md bg-[#2a2a2a]">
                      {item.poster ? (
                        <Image
                          src={item.poster}
                          alt={item.title}
                          fill
                          sizes="50px"
                          className="object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start gap-2">
                        {item.originalLanguage && item.originalLanguage !== "ar" ? (
                          <span className="mt-0.5 shrink-0 text-sm font-bold text-[#f08a24]">
                            {t("subtitled")}
                          </span>
                        ) : null}
                        <p className="min-w-0 flex-1 text-[15px] font-bold leading-snug text-white" dir="auto">
                          {item.title}
                        </p>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-white">
                        <span
                          className={`rounded-md px-2 py-0.5 text-xs font-black text-white ${
                            item.type === "movie" ? "bg-[#e67e22]" : "bg-[#3d4a63]"
                          }`}
                        >
                          {item.type === "tv" ? t("show") : t("movie")}
                        </span>
                        {item.year ? <span>{item.year}</span> : null}
                        {Number(item.rating) > 0 ? (
                          <span className="inline-flex items-center gap-1">
                            <span className="text-[#f08a24]">★</span>
                            {item.rating}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <SearchDropdownAd />
        </div>
      )}
    </form>
  );
}
