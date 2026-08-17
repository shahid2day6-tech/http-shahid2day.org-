"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLang } from "../context/LanguageContext";
import {
  FILTER_GENRES,
  FILTER_SECTIONS,
  FILTER_YEARS,
  SORT_MODES,
  type CatalogSort,
} from "../lib/filters";
import type { DictKey } from "../lib/i18n";

function FilterMenu({
  label,
  valueLabel,
  open,
  onToggle,
  children,
}: {
  label: string;
  valueLabel: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-w-[160px] flex-1">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between rounded-lg bg-[#0b0d16] px-3 py-2.5 text-sm font-bold text-white"
      >
        <span className="text-[#9aa0b5]">{open ? label : valueLabel}</span>
        <span className="text-xs text-white/80">▼</span>
      </button>
      {open && (
        <div className="absolute inset-x-0 top-full z-40 mt-2 max-h-80 overflow-auto rounded-xl bg-[#0b0d16] p-2 shadow-2xl">
          {children}
        </div>
      )}
    </div>
  );
}

function CheckRow({
  label,
  checked,
  href,
}: {
  label: string;
  checked: boolean;
  href: string;
}) {
  return (
    <Link
      href={href}
      prefetch={false}
      className="mb-1 flex w-full items-center gap-3 rounded-lg bg-[#151a2b] px-3 py-2.5 text-sm font-bold text-white last:mb-0 hover:bg-[#1c2338]"
    >
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border ${
          checked ? "border-[#e50914] bg-[#e50914]" : "border-white"
        }`}
      >
        {checked ? <span className="text-[10px] leading-none">✓</span> : null}
      </span>
      <span className="flex-1 text-start">{label}</span>
    </Link>
  );
}

export default function CatalogToolbar({
  sort = "latest",
  section = "all",
  genre = "",
  year = "all",
}: {
  sort?: CatalogSort;
  section?: string;
  genre?: string;
  year?: string;
}) {
  const { t } = useLang();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<"section" | "genre" | "year" | null>(null);

  useEffect(() => {
    function onPointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(null);
    }
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, []);

  function hrefFor(next: { sort?: CatalogSort; section?: string; genre?: string; year?: string }) {
    const params = new URLSearchParams();
    let nextSort = next.sort ?? sort;
    let nextSection = next.section ?? section;
    const nextGenre = Object.prototype.hasOwnProperty.call(next, "genre") ? next.genre ?? "" : genre;
    const nextYear = next.year ?? year;
    if (next.sort === "new-movies" && nextSection.startsWith("tv-")) nextSection = "all";
    if (next.sort === "new-episodes" && nextSection.startsWith("movie-")) nextSection = "all";
    if (next.sort === "trending-anime") nextSection = "all";
    if (nextYear && nextYear !== "all" && (nextSort === "new-movies" || nextSort === "new-episodes")) {
      nextSort = "latest";
    }
    params.set("sort", nextSort);
    if (nextSection && nextSection !== "all") params.set("section", nextSection);
    if (nextGenre) params.set("genre", nextGenre);
    if (nextYear && nextYear !== "all") params.set("year", nextYear);
    return `/browse?${params.toString()}`;
  }

  const sectionLabel =
    section === "all"
      ? t("filterSections")
      : t((FILTER_SECTIONS.find((item) => item.id === section)?.labelKey ?? "filterSections") as DictKey);
  const genreLabel = genre
    ? t((FILTER_GENRES.find((item) => item.id === genre)?.labelKey ?? "filterGenres") as DictKey)
    : t("filterGenres");
  const yearLabel = year && year !== "all" ? year : t("filterYears");

  return (
    <div ref={rootRef} className="mb-8">
      <div className="mb-3 flex flex-wrap gap-2">
        {SORT_MODES.map((mode) => {
          const active = sort === mode.id;
          return (
            <Link
              key={mode.id}
              href={hrefFor({ sort: mode.id })}
              prefetch={false}
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-white ${
                active ? "bg-[#e50914]" : "bg-[#151a2b] hover:bg-[#1c2338]"
              }`}
            >
              <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs ${mode.tone}`}>
                {mode.icon}
              </span>
              {t(mode.labelKey)}
            </Link>
          );
        })}
      </div>

      <div className="flex flex-col gap-2 rounded-xl bg-[#101322] p-3 sm:flex-row sm:items-center">
        <span className="shrink-0 px-1 text-sm font-black text-white">{t("filterLabel")}</span>
        <FilterMenu
          label={t("filterSections")}
          valueLabel={sectionLabel}
          open={open === "section"}
          onToggle={() => setOpen(open === "section" ? null : "section")}
        >
          {FILTER_SECTIONS.map((item) => (
            <CheckRow
              key={item.id}
              label={t(item.labelKey)}
              checked={section === item.id}
              href={hrefFor({ section: item.id })}
            />
          ))}
        </FilterMenu>
        <FilterMenu
          label={t("filterGenres")}
          valueLabel={genreLabel}
          open={open === "genre"}
          onToggle={() => setOpen(open === "genre" ? null : "genre")}
        >
          <CheckRow
            label={t("filterAll")}
            checked={!genre}
            href={hrefFor({ genre: "" })}
          />
          {FILTER_GENRES.map((item) => (
            <CheckRow
              key={item.id}
              label={t(item.labelKey)}
              checked={genre === item.id}
              href={hrefFor({ genre: item.id })}
            />
          ))}
        </FilterMenu>
        <FilterMenu
          label={t("filterYears")}
          valueLabel={yearLabel}
          open={open === "year"}
          onToggle={() => setOpen(open === "year" ? null : "year")}
        >
          {FILTER_YEARS.map((item) => (
            <CheckRow
              key={item}
              label={item === "all" ? t("filterAll") : item}
              checked={(year || "all") === item}
              href={hrefFor({ year: item })}
            />
          ))}
        </FilterMenu>
      </div>
    </div>
  );
}
