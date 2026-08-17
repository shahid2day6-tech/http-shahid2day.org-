"use client";

import { useState } from "react";
import { isAdsterraBannersEnabled } from "../../lib/adsterra";
import { isHilltopBannersEnabled } from "../../lib/hilltop";
import { AdsterraBanner } from "./AdsterraBanner";
import { HilltopBanner300 } from "./HilltopBanner300";

/**
 * 300×250: Adsterra first (in-flow). If it stays empty, swap to Hilltop.
 * Never request both at once.
 */
export function Banner300Waterfall({
  skipClaim = false,
  nativeSize = false,
}: {
  skipClaim?: boolean;
  nativeSize?: boolean;
}) {
  const adsterraOn = isAdsterraBannersEnabled();
  const hilltopOn = isHilltopBannersEnabled();
  const [useHilltop, setUseHilltop] = useState(!adsterraOn && hilltopOn);

  if (useHilltop && hilltopOn) {
    return <HilltopBanner300 />;
  }

  if (adsterraOn) {
    return (
      <AdsterraBanner
        size="300x250"
        skipClaim={skipClaim}
        nativeSize={nativeSize}
        onEmpty={hilltopOn ? () => setUseHilltop(true) : undefined}
      />
    );
  }

  return null;
}
