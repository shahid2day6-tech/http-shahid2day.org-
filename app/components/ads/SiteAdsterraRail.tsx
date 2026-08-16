"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { isAdsterraBannersEnabled, type AdsterraBannerSize } from "../../lib/adsterra";
import { useLang } from "../../context/LanguageContext";
import { AdsterraBanner, useAdsterraSlot } from "./AdsterraBanner";

export function SiteAdsterraRail() {
  const pathname = usePathname();
  const { t } = useLang();
  const [wide, setWide] = useState<boolean | null>(null);
  const onWatch = pathname === "/watch";
  const bannerSize: AdsterraBannerSize | null =
    onWatch || wide === null ? null : wide ? "728x90" : "320x50";
  const owned = useAdsterraSlot(bannerSize);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  if (onWatch || !isAdsterraBannersEnabled() || !owned || !bannerSize) return null;

  return (
    <div className="mb-4 flex flex-col items-center overflow-hidden">
      <span className="mb-1 text-[10px] font-bold uppercase tracking-wide text-[#a3a3a3]">
        {t("adLabel")}
      </span>
      <AdsterraBanner size={bannerSize} skipClaim />
    </div>
  );
}
