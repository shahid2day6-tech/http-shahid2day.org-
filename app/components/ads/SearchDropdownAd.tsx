"use client";

import { useLang } from "../../context/LanguageContext";
import { AdsterraBanner, useAdsterraSlot } from "./AdsterraBanner";

export function SearchDropdownAd() {
  const { t } = useLang();
  const owned = useAdsterraSlot("320x50");
  if (!owned) return null;

  return (
    <div className="border-t border-white/10 px-3 py-2">
      <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-[#a3a3a3]">{t("adLabel")}</p>
      <div className="flex justify-center overflow-hidden">
        <AdsterraBanner size="320x50" skipClaim />
      </div>
    </div>
  );
}
