"use client";

import { ageBadgeClass, formatAgeBadge } from "../lib/tmdbAge";
import { useTmdbAgeCode } from "../lib/useTmdbAgeCode";

export function CoverAgeBadge({
  tmdbId,
  tmdbType,
  className,
  forceCode,
}: {
  tmdbId: number;
  tmdbType: "movie" | "tv";
  className?: string;
  forceCode?: "7" | "13" | "17" | "18";
}) {
  const live = useTmdbAgeCode(tmdbType, tmdbId);
  const code = forceCode ?? live ?? "13";

  return (
    <span
      className={`pointer-events-none absolute top-2 right-2 z-20 rounded-md px-1.5 py-0.5 text-[10px] font-black tracking-wide text-white shadow rtl:right-auto rtl:left-2 ${ageBadgeClass(code)} ${className ?? ""}`}
    >
      <span dir="ltr">{formatAgeBadge(code)}</span>
    </span>
  );
}
