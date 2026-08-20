"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { dict, type DictKey, type Lang } from "../lib/i18n";
import { DEFAULT_LANG, persistLang, readBrowserLang } from "../lib/langPref";
import { switchTitleSlugLang } from "../lib/slug";

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
  const router = useRouter();
  const pathname = usePathname();

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
        const switched = switchTitleSlugLang(pathname, next);
        if (switched && switched !== pathname) {
          router.replace(switched);
        }
      },
    }),
    [lang, pathname, router]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used inside LanguageProvider");
  return ctx;
}
