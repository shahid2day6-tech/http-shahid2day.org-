export function getMonetagTagZone() {
  return process.env.NEXT_PUBLIC_MONETAG_TAG_ZONE?.trim() || "";
}

export function getMonetagVignetteZone() {
  return process.env.NEXT_PUBLIC_MONETAG_VIGNETTE_ZONE?.trim() || "";
}

export const MONETAG_TAG_SRC = "https://quge5.com/88/tag.min.js";
export const MONETAG_VIGNETTE_SRC = "https://n6wxm.com/vignette.min.js";
