"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLang } from "../context/LanguageContext";
import Logo from "./Logo";

const links = [
  { href: "/", key: "home" as const },
  { href: "/movies", key: "movies" as const },
  { href: "/series", key: "series" as const },
  { href: "/anime", key: "anime" as const },
  { href: "/arabic", key: "arabic" as const },
  { href: "/turkish", key: "turkish" as const },
  { href: "/asian", key: "asian" as const },
];

export default function Navbar() {
  const { t, toggle } = useLang();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q.length < 2) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#262626] bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5 sm:px-6 sm:py-3">
        <Link href="/" className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3 py-1.5 text-sm font-bold ${
                  active ? "bg-[#e50914] text-white" : "text-[#d4d4d4] hover:text-white"
                }`}
              >
                {t(link.key)}
              </Link>
            );
          })}
        </nav>

        <form onSubmit={onSearch} className="ms-auto hidden min-w-0 flex-1 max-w-sm md:block">
          <input
            ref={searchRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("search")}
            className="w-full rounded-full border border-[#2a2a2a] bg-[#141414] px-4 py-2 text-sm outline-none ring-[#e50914] placeholder:text-[#777] focus:ring-2"
          />
        </form>

        <button type="button" onClick={toggle} className="btn-light hidden px-3 py-1.5 text-xs sm:inline-flex">
          {t("language")}
        </button>

        <button
          type="button"
          className="ms-auto rounded-lg border border-[#2a2a2a] px-3 py-2 text-sm font-bold lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="menu"
        >
          ☰
        </button>
      </div>

      {open && (
        <div className="border-t border-[#262626] bg-black px-4 py-4 lg:hidden">
          <form onSubmit={onSearch} className="mb-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("search")}
              className="w-full rounded-full border border-[#2a2a2a] bg-[#141414] px-4 py-2 text-sm outline-none"
            />
          </form>
          <div className="grid grid-cols-2 gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl bg-[#141414] px-3 py-2 text-sm font-bold"
              >
                {t(link.key)}
              </Link>
            ))}
          </div>
          <button type="button" onClick={toggle} className="btn-light mt-3 w-full py-2 text-sm">
            {t("language")}
          </button>
        </div>
      )}
    </header>
  );
}
