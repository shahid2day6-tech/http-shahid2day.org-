"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { dict, type DictKey, type Lang } from "../lib/i18n";

type Ctx = {
  lang: Lang;
  isRtl: boolean;
  t: (key: DictKey) => string;
  toggle: () => void;
};

const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("ar");

  useEffect(() => {
    const saved = window.localStorage.getItem("s2d-lang");
    if (saved === "en" || saved === "ar") setLang(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    window.localStorage.setItem("s2d-lang", lang);
  }, [lang]);

  const value = useMemo<Ctx>(
    () => ({
      lang,
      isRtl: lang === "ar",
      t: (key) => dict[lang][key],
      toggle: () => setLang((prev) => (prev === "ar" ? "en" : "ar")),
    }),
    [lang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used inside LanguageProvider");
  return ctx;
}
