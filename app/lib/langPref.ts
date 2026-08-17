import type { Lang } from "./i18n";

export const UI_LANG_KEY = "s2d-ui-lang";
export const LEGACY_LANG_KEY = "s2d-lang";
export const DEFAULT_LANG: Lang = "en";
export const LANG_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 * 5;

export function isValidLang(value: string | null | undefined): value is Lang {
  return value === "en" || value === "ar";
}

export function parseUiLang(raw: string | null | undefined): Lang {
  const value = raw?.trim().toLowerCase();
  return isValidLang(value) ? value : DEFAULT_LANG;
}

export function htmlLangDir(lang: Lang): { htmlLang: string; dir: "rtl" | "ltr" } {
  return { htmlLang: lang, dir: lang === "ar" ? "rtl" : "ltr" };
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

/** Ignore legacy Arabic — it was the old default, not a user choice. */
export function readBrowserLang(): Lang | null {
  if (typeof window === "undefined") return null;
  try {
    const ui = localStorage.getItem(UI_LANG_KEY);
    if (isValidLang(ui)) return ui;
  } catch {
    /* ignore */
  }
  const cookie = readCookie(UI_LANG_KEY);
  if (isValidLang(cookie)) return cookie;
  try {
    const legacy = localStorage.getItem(LEGACY_LANG_KEY);
    if (legacy === "en") return "en";
  } catch {
    /* ignore */
  }
  return null;
}

export function persistLang(lang: Lang) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(UI_LANG_KEY, lang);
    localStorage.setItem(LEGACY_LANG_KEY, lang);
  } catch {
    /* ignore */
  }
  const secure = window.location.protocol === "https:" ? ";secure" : "";
  document.cookie = `${UI_LANG_KEY}=${lang};path=/;max-age=${LANG_COOKIE_MAX_AGE};samesite=lax${secure}`;
}
