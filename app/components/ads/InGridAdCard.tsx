"use client";

import { useEffect, useRef, useState } from "react";
import { getAdsterraDims, isAdsterraBannersEnabled, isAdsterraEnabled } from "../../lib/adsterra";
import { useLang } from "../../context/LanguageContext";
import { AdsterraBanner, useAdsterraSlot } from "./AdsterraBanner";

const BANNER = getAdsterraDims("300x250");

export function InGridAdCard() {
  const { t } = useLang();
  const owned = useAdsterraSlot("300x250");
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = frameRef.current;
    if (!el || !owned) return;
    const sync = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (w < 8 || h < 8) return;
      setScale(Math.max(w / BANNER.width, h / BANNER.height));
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, [owned]);

  if (!isAdsterraEnabled() || !isAdsterraBannersEnabled() || !owned) return null;

  return (
    <div>
      <div className="relative overflow-hidden rounded-xl border border-[#262626] bg-[#141414]">
        <div ref={frameRef} className="relative aspect-[2/3] w-full">
          <span className="absolute start-2 top-2 z-10 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] font-black text-white">
            {t("adLabel")}
          </span>
          <div
            className="absolute left-1/2 top-1/2 origin-center"
            style={{
              width: BANNER.width,
              height: BANNER.height,
              transform: `translate(-50%, -50%) scale(${scale})`,
            }}
          >
            <AdsterraBanner size="300x250" skipClaim nativeSize />
          </div>
        </div>
      </div>
      <p className="mt-2 line-clamp-2 text-sm font-bold text-[#a3a3a3]">{t("adSponsored")}</p>
    </div>
  );
}
