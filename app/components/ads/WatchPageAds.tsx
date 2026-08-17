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
        <AdsterraBanner size="728x90" skipClaim label={t("adLabel")} wrapClassName="flex max-w-full flex-col items-center overflow-x-auto" />
      ) : null}
      {showBox && boxOwned ? (
        <AdsterraBanner size="300x250" skipClaim label={t("adLabel")} wrapClassName="flex flex-col items-center overflow-hidden" />
      ) : null}
      {altOwned ? (
        <AdsterraBanner size="320x50" skipClaim label={t("adLabel")} wrapClassName="flex max-w-full flex-col items-center overflow-x-auto" />
      ) : null}
    </div>
  );
}
