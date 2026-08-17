export const HILLTOP_ZONE_300x250 = "7328725";

/** Official MultiTag Banner 300×250 GET CODE host for shahid2day.org zone 7328725. */
export const HILLTOP_BANNER_300x250_SRC =
  process.env.NEXT_PUBLIC_HILLTOP_BANNER_300x250_SRC?.trim() ||
  "https://conventionalresponse.com/blXXV.sfdPG/lL0GY/Wtcx/AeXmQ9hu-ZkUal/kDPqTRc/zWMMj/gU3tMKj/U-tpNOzKMNyfOPD_cUyEOoQj";

export function isHilltopBannersEnabled() {
  const flag = process.env.NEXT_PUBLIC_HILLTOP_BANNERS?.trim().toLowerCase();
  if (flag === "false" || flag === "0") return false;
  return Boolean(HILLTOP_BANNER_300x250_SRC);
}

let claimed300 = false;

export function claimHilltop300() {
  if (claimed300) return false;
  claimed300 = true;
  return true;
}

export function releaseHilltop300() {
  claimed300 = false;
}
