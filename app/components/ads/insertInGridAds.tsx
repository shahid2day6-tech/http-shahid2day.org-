import { type ReactNode } from "react";
import { isAdsterraBannersEnabled, isAdsterraEnabled } from "../../lib/adsterra";
import { InGridAdCard } from "./InGridAdCard";

export function withInGridAds(cards: ReactNode[], firstAt = 3): ReactNode[] {
  if (!isAdsterraEnabled() || !isAdsterraBannersEnabled() || cards.length < firstAt) {
    return cards;
  }

  const out = [...cards];
  out.splice(firstAt, 0, <InGridAdCard key="grid-ad-1" />);
  return out;
}
