"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLang } from "../context/LanguageContext";
import Logo from "./Logo";
import {
  MOVIE_GROUPS,
  RAMADAN_GROUPS,
  SERIES_GROUPS,
  catalogHref,
  type CatalogGroup,
  type CatalogKind,
} from "../lib/catalog";
import type { DictKey } from "../lib/i18n";

function CatalogMenu({
  kind,
  href,
  labelKey,
  groups,
}: {
  kind: CatalogKind;
  href: string;
  labelKey: DictKey;
  groups: { group: CatalogGroup; label: DictKey }[];
}) {
  const { t } = useLang();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const active =
    pathname === href || groups.some((item) => pathname === catalogHref(kind, item.group));

  return (
    <div
      className="relative shrink-0"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        href={href}
        className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm font-bold sm:px-4 sm:text-base ${
          active ? "text-white" : "text-white/80 hover:text-white"
        }`}
        onClick={() => setOpen((value) => !value)}
      >
        {t(labelKey)}
        <span className="text-[10px]">▼</span>
      </Link>
      {open && (
        <div className="absolute top-full start-0 z-50 min-w-[230px] overflow-hidden rounded-b-lg bg-[#1e2130] py-1 shadow-2xl">
          {groups.map((item) => {
            const to = catalogHref(kind, item.group);
            const current = pathname === to;
            return (
              <Link
                key={item.group}
                href={to}
                className={`block border-b border-white/10 px-4 py-2.5 text-sm font-bold last:border-b-0 ${
                  current ? "bg-white/10 text-white" : "text-white hover:bg-white/5"
                }`}
              >
                {t(item.label)}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const { t, toggle } = useLang();
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState("");

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q.length < 2) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-[#9d0b12]">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-3 py-3 sm:px-6 sm:py-3.5">
          <nav className="flex min-w-0 flex-1 items-center gap-1 overflow-visible sm:gap-2">
            <Link
              href="/"
              className={`shrink-0 px-3 py-1.5 text-sm font-bold sm:px-4 sm:text-base ${
                pathname === "/" ? "text-white" : "text-white/80 hover:text-white"
              }`}
            >
              {t("home")}
            </Link>
            <CatalogMenu kind="movie" href="/movies" labelKey="movies" groups={MOVIE_GROUPS} />
            <CatalogMenu kind="tv" href="/series" labelKey="series" groups={SERIES_GROUPS} />
            <CatalogMenu
              kind="tv"
              href="/series/ramadan"
              labelKey="ramadanSeries"
              groups={RAMADAN_GROUPS}
            />
          </nav>
          <button
            type="button"
            onClick={toggle}
            className="shrink-0 rounded-full bg-black/35 px-3.5 py-1.5 text-sm font-bold text-white"
          >
            {t("language")}
          </button>
        </div>
      </div>

      <div className="border-b border-[#1a1a1a] bg-[#0a0a0a]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:gap-6 sm:px-6 sm:py-5">
          <Link href="/" className="shrink-0 self-start sm:self-center">
            <Logo size="xl" />
          </Link>

          <form onSubmit={onSearch} className="ms-auto w-full min-w-0 sm:max-w-xl">
            <div className="flex items-center rounded-full bg-[#1a1a1a] p-1.5">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("searchHint")}
                className="min-w-0 flex-1 bg-transparent px-4 py-2 text-sm text-white outline-none placeholder:text-[#6b6b6b]"
              />
              <button
                type="submit"
                className="shrink-0 rounded-full bg-[#d8d8d8] px-4 py-1.5 text-sm font-black text-[#e50914]"
              >
                {t("searchBtn")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </header>
  );
}
