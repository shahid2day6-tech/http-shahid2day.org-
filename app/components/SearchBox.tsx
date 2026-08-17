"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLang } from "../context/LanguageContext";

function SearchBoxInner() {
  const { t } = useLang();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const rootRef = useRef<HTMLFormElement>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (pathname === "/search") {
      setQuery(searchParams.get("q") ?? "");
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) return;
    const href = `/search?q=${encodeURIComponent(q)}`;
    const timer = window.setTimeout(() => {
      if (pathname === "/search") router.replace(href);
      else router.push(href);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [pathname, query, router]);

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q.length < 2) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <form ref={rootRef} onSubmit={onSearch} className="relative ms-auto w-full min-w-0 sm:max-w-xl">
      <div className="flex items-center rounded-full bg-[#1a1a1a] p-1.5">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("searchHint")}
          className="min-w-0 flex-1 bg-transparent px-4 py-2 text-sm text-white outline-none placeholder:text-[#6b6b6b]"
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="me-1 flex h-7 w-7 items-center justify-center rounded-full text-lg text-[#9a9a9a] hover:text-white"
            aria-label="clear"
          >
            ×
          </button>
        )}
        <button
          type="submit"
          className="shrink-0 rounded-full bg-[#d8d8d8] px-4 py-1.5 text-sm font-black text-[#a34316]"
        >
          {t("searchBtn")}
        </button>
      </div>
    </form>
  );
}

export default function SearchBox() {
  return (
    <Suspense fallback={<div className="ms-auto h-11 w-full min-w-0 sm:max-w-xl" />}>
      <SearchBoxInner />
    </Suspense>
  );
}
