"use client";

import { ageBadgeClass, formatAgeBadge } from "../lib/tmdbAge";
import { useTmdbAgeCode } from "../lib/useTmdbAgeCode";

export function CoverAgeBadge({
  tmdbId,
  tmdbType,
  className,
}: {
  tmdbId: number;
  tmdbType: "movie" | "tv";
  className?: string;
}) {
  const code = useTmdbAgeCode(tmdbType, tmdbId);
  if (!code) return null;

  return (
    <span
      dir="ltr"
      className={`pointer-events-none absolute end-2 top-2 z-20 rounded-md px-1.5 py-0.5 text-[10px] font-black tracking-wide text-white shadow ${ageBadgeClass(code)} ${className ?? ""}`}
    >
      {formatAgeBadge(code)}
    </span>
  );
}
