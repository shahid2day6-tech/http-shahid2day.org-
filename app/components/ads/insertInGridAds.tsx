import { type ReactNode } from "react";
import { isAdsterraBannersEnabled, isAdsterraEnabled } from "../../lib/adsterra";
import { isHilltopBannersEnabled } from "../../lib/hilltop";
import { InGridAdCard } from "./InGridAdCard";
import { pickRandomInsertAfter } from "./randomInGridSlots";

export function withInGridAds(cards: ReactNode[], firstAt = 1): ReactNode[] {
  const adsOn =
    (isAdsterraEnabled() && isAdsterraBannersEnabled()) || isHilltopBannersEnabled();
  if (!adsOn || cards.length < firstAt) {
    return cards;
  }

  const maxAds = cards.length >= 8 ? 2 : 1;
  const insertAfter = pickRandomInsertAfter(cards.length, maxAds, 6, `grid-${cards.length}`);
  const out: ReactNode[] = [];
  let ads = 0;

  cards.forEach((card, index) => {
    out.push(card);
    if (insertAfter.has(index + 1) && ads < maxAds) {
      ads += 1;
      out.push(<InGridAdCard key={`grid-ad-${ads}`} />);
    }
  });

  return out;
}
