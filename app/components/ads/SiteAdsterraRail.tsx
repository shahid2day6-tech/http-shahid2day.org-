"use client";

import { usePathname } from "next/navigation";
import { isAdsterraBannersEnabled } from "../../lib/adsterra";
import { useLang } from "../../context/LanguageContext";
import { AdsterraBanner, useAdsterraSlot } from "./AdsterraBanner";

type Props = {
  variant?: "primary" | "alt";
  className?: string;
};

export function SiteAdsterraRail({ variant = "primary", className = "" }: Props) {
  const pathname = usePathname();
  const { t } = useLang();
  const onWatch = pathname === "/watch";
  const bannerSize = onWatch ? null : variant === "alt" ? "320x50" : "728x90";
  const owned = useAdsterraSlot(bannerSize);

  if (onWatch || !isAdsterraBannersEnabled() || !owned || !bannerSize) return null;

  return (
    <div className={`flex flex-col items-center overflow-x-auto ${className}`}>
      <span className="mb-1 text-[10px] font-bold uppercase tracking-wide text-[#a3a3a3]">
        {t("adLabel")}
      </span>
      <AdsterraBanner size={bannerSize} skipClaim />
    </div>
  );
}
