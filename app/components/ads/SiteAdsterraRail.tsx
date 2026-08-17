"use client";

import { isAdsterraBannersEnabled } from "../../lib/adsterra";
import { useLang } from "../../context/LanguageContext";
import { AdsterraBanner, useAdsterraSlot } from "./AdsterraBanner";

type Props = {
  variant?: "primary" | "alt" | "box";
  className?: string;
};

export function SiteAdsterraRail({ variant = "primary", className = "" }: Props) {
  const { t } = useLang();
  const bannerSize = variant === "box" ? "300x250" : variant === "alt" ? "320x50" : "728x90";
  const owned = useAdsterraSlot(bannerSize);

  if (!isAdsterraBannersEnabled() || !owned) return null;

  return (
    <AdsterraBanner
      size={bannerSize}
      skipClaim
      label={t("adLabel")}
      wrapClassName={`flex max-w-full flex-col items-center overflow-x-auto ${className}`}
    />
  );
}
