"use client";

import { isAdsterraBannersEnabled } from "../../lib/adsterra";
import { useLang } from "../../context/LanguageContext";
import { AdsterraBanner, useAdsterraSlot } from "./AdsterraBanner";

export function WatchPageAds({ showBox = true }: { showBox?: boolean }) {
  const { t } = useLang();
  const railOwned = useAdsterraSlot(isAdsterraBannersEnabled() ? "728x90" : null);
  const altOwned = useAdsterraSlot(isAdsterraBannersEnabled() ? "320x50" : null);
  const boxOwned = useAdsterraSlot(showBox && isAdsterraBannersEnabled() ? "300x250" : null);

  if (!isAdsterraBannersEnabled()) return null;

  return (
    <div className="mt-4 flex w-full flex-col items-stretch gap-3">
      {railOwned ? (
        <div className="flex max-w-full flex-col items-center overflow-x-auto">
          <span className="mb-1 text-[10px] font-bold uppercase tracking-wide text-[#a3a3a3]">
            {t("adLabel")}
          </span>
          <AdsterraBanner size="728x90" skipClaim />
        </div>
      ) : null}
      {showBox && boxOwned ? (
        <div className="flex flex-col items-center overflow-hidden">
          <span className="mb-1 text-[10px] font-bold uppercase tracking-wide text-[#a3a3a3]">
            {t("adLabel")}
          </span>
          <AdsterraBanner size="300x250" skipClaim />
        </div>
      ) : null}
      {altOwned ? (
        <div className="flex max-w-full flex-col items-center overflow-x-auto">
          <span className="mb-1 text-[10px] font-bold uppercase tracking-wide text-[#a3a3a3]">
            {t("adLabel")}
          </span>
          <AdsterraBanner size="320x50" skipClaim />
        </div>
      ) : null}
    </div>
  );
}
