import { type ReactNode } from "react";
import { isAdsterraBannersEnabled, isAdsterraEnabled } from "../../lib/adsterra";
import { isHilltopBannersEnabled } from "../../lib/hilltop";
import { InGridAdCard } from "./InGridAdCard";

export function withInGridAds(cards: ReactNode[], firstAt = 1): ReactNode[] {
  const adsOn =
    (isAdsterraEnabled() && isAdsterraBannersEnabled()) || isHilltopBannersEnabled();
  if (!adsOn || cards.length < firstAt) {
    return cards;
  }

  const out = [...cards];
  out.splice(firstAt, 0, <InGridAdCard key="grid-ad-1" />);
  const secondAt = firstAt + 6;
  if (out.length > secondAt) {
    out.splice(secondAt, 0, <InGridAdCard key="grid-ad-2" />);
  }
  return out;
}
