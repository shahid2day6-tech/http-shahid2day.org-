"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "../context/LanguageContext";
import Logo from "./Logo";
import SearchBox from "./SearchBox";
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
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const active =
    pathname === href || groups.some((item) => pathname === catalogHref(kind, item.group));

  useEffect(() => {
    function onPointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, []);

  return (
    <div
      ref={rootRef}
      className="relative shrink-0"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-[13px] font-bold sm:px-4 sm:text-base ${
          active ? "text-white" : "text-white/80 hover:text-white"
        }`}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {t(labelKey)}
        <span className="text-[10px]">▼</span>
      </button>
      {open ? (
        <div className="absolute top-full start-0 z-[80] min-w-[230px] overflow-hidden rounded-b-lg bg-[#1e2130] py-1 shadow-2xl">
          <Link
            href={href}
            onClick={() => setOpen(false)}
            className={`block border-b border-white/10 px-4 py-2.5 text-sm font-bold ${
              pathname === href ? "bg-white/10 text-white" : "text-white hover:bg-white/5"
            }`}
          >
            {t(labelKey)}
          </Link>
          {groups.map((item) => {
            const to = catalogHref(kind, item.group);
            const current = pathname === to;
            return (
              <Link
                key={item.group}
                href={to}
                onClick={() => setOpen(false)}
                className={`block border-b border-white/10 px-4 py-2.5 text-sm font-bold last:border-b-0 ${
                  current ? "bg-white/10 text-white" : "text-white hover:bg-white/5"
                }`}
              >
                {t(item.label)}
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export default function Navbar() {
  const { t, toggle } = useLang();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-[#9d0b12]">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-2 py-2 sm:gap-3 sm:px-6 sm:py-3">
          <nav className="flex min-w-0 flex-1 items-center gap-0.5 overflow-visible sm:gap-2">
            <Link
              href="/"
              className={`shrink-0 px-2.5 py-1.5 text-[13px] font-bold sm:px-4 sm:text-base ${
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
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-3 py-2 sm:gap-5 sm:px-6 sm:py-3 md:py-4">
          <Link href="/" className="shrink-0">
            <span className="md:hidden">
              <Logo size="md" />
            </span>
            <span className="hidden md:inline-flex lg:hidden">
              <Logo size="lg" />
            </span>
            <span className="hidden lg:inline-flex">
              <Logo size="xl" />
            </span>
          </Link>
          <SearchBox />
        </div>
      </div>
    </header>
  );
}
