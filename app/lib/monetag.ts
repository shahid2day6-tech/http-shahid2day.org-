export function getMonetagTagZone() {
  return process.env.NEXT_PUBLIC_MONETAG_TAG_ZONE?.trim() || "270517";
}

export function getMonetagVignetteZone() {
  return process.env.NEXT_PUBLIC_MONETAG_VIGNETTE_ZONE?.trim() || "11587548";
}

export function getMonetagOnclickZone() {
  return process.env.NEXT_PUBLIC_MONETAG_ONCLICK_ZONE?.trim() || "11587549";
}

export const MONETAG_TAG_SRC = "https://quge5.com/88/tag.min.js";
export const MONETAG_VIGNETTE_SRC = "https://n6wxm.com/vignette.min.js";
export const MONETAG_ONCLICK_SRC = "https://zovidree.com/tag.min.js";
