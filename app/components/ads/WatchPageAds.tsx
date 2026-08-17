"use client";

import { useEffect, useState } from "react";
import { isAdsterraBannersEnabled, type AdsterraBannerSize } from "../../lib/adsterra";
import { isHilltopBannersEnabled } from "../../lib/hilltop";
import { useLang } from "../../context/LanguageContext";
import { AdsterraBanner, useAdsterraSlot } from "./AdsterraBanner";
import { Banner300Waterfall } from "./Banner300Waterfall";

export function WatchPageAds({ showBox = false }: { showBox?: boolean }) {
  const { t } = useLang();
  const [wide, setWide] = useState<boolean | null>(null);
  const railSize: AdsterraBannerSize | null = wide === null ? null : wide ? "728x90" : "320x50";
  const altSize: AdsterraBannerSize | null = wide === null ? null : wide ? "320x50" : "728x90";
  const railOwned = useAdsterraSlot(railSize);
  const altOwned = useAdsterraSlot(altSize);
  const boxOwned = useAdsterraSlot(showBox && isAdsterraBannersEnabled() ? "300x250" : null);
  const showHilltopOnly = showBox && !isAdsterraBannersEnabled() && isHilltopBannersEnabled();

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  if (!isAdsterraBannersEnabled() && !showHilltopOnly) return null;

  return (
    <div className="mt-4 flex w-full flex-col items-stretch gap-3">
      {railOwned && railSize ? (
        <div className="flex flex-col items-center overflow-x-auto">
          <span className="mb-1 text-[10px] font-bold uppercase tracking-wide text-[#a3a3a3]">
            {t("adLabel")}
          </span>
          <AdsterraBanner size={railSize} skipClaim />
        </div>
      ) : null}
      {showBox && (boxOwned || showHilltopOnly) ? (
        <div className="flex flex-col items-center overflow-hidden">
          <span className="mb-1 text-[10px] font-bold uppercase tracking-wide text-[#a3a3a3]">
            {t("adLabel")}
          </span>
          <Banner300Waterfall skipClaim />
        </div>
      ) : null}
      {altOwned && altSize ? (
        <div className="flex flex-col items-center overflow-x-auto">
          <span className="mb-1 text-[10px] font-bold uppercase tracking-wide text-[#a3a3a3]">
            {t("adLabel")}
          </span>
          <AdsterraBanner size={altSize} skipClaim />
        </div>
      ) : null}
    </div>
  );
}
