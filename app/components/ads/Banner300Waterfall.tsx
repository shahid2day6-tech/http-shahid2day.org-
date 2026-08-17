"use client";

import { isAdsterraBannersEnabled } from "../../lib/adsterra";
import { isHilltopBannersEnabled } from "../../lib/hilltop";
import { AdsterraBanner } from "./AdsterraBanner";
import { HilltopBanner300 } from "./HilltopBanner300";

/** 300×250 Adsterra in-flow. Keep the slot reserved — swapping away kills fill. */
export function Banner300Waterfall({
  skipClaim = false,
  nativeSize = false,
}: {
  skipClaim?: boolean;
  nativeSize?: boolean;
}) {
  const adsterraOn = isAdsterraBannersEnabled();
  const hilltopOn = isHilltopBannersEnabled();

  if (adsterraOn) {
    return <AdsterraBanner size="300x250" skipClaim={skipClaim} nativeSize={nativeSize} />;
  }

  if (hilltopOn) {
    return <HilltopBanner300 />;
  }

  return null;
}
