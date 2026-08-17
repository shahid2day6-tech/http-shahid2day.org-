"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { dict, type DictKey, type Lang } from "../lib/i18n";
import { DEFAULT_LANG, persistLang, readBrowserLang } from "../lib/langPref";

type Ctx = {
  lang: Lang;
  isRtl: boolean;
  t: (key: DictKey) => string;
  toggle: () => void;
};

const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({
  children,
  initialLang = DEFAULT_LANG,
}: {
  children: React.ReactNode;
  initialLang?: Lang;
}) {
  const [lang, setLang] = useState<Lang>(initialLang);

  useEffect(() => {
    const stored = readBrowserLang();
    if (stored && stored !== lang) {
      setLang(stored);
      persistLang(stored);
    }
    // Restore a saved choice after first paint; default stays English.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const value = useMemo<Ctx>(
    () => ({
      lang,
      isRtl: lang === "ar",
      t: (key) => dict[lang][key],
      toggle: () => {
        const next = lang === "ar" ? "en" : "ar";
        setLang(next);
        persistLang(next);
      },
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
