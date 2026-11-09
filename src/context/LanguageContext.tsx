import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { fr, formatTranslation, resolveLanguage, toggleLanguageHelper } from '../locales/fr.ts';
import { en } from '../locales/en.ts';

export type Language = 'fr' | 'en';

export const STORAGE_KEY = 'yt_extractor_language_v4';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  isFrench: boolean;
  isEnglish: boolean;
  t: (key: string, params?: Record<string, string | number>) => string;
}

// Re-export dictionaries and helpers for zero-DOM usage
export { fr, en, formatTranslation, resolveLanguage, toggleLanguageHelper };

const LanguageContext = createContext<LanguageContextType>({
  language: 'fr',
  setLanguage: () => {},
  toggleLanguage: () => {},
  isFrench: true,
  isEnglish: false,
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = typeof window !== 'undefined' && window.localStorage ? localStorage.getItem(STORAGE_KEY) : null;
      const browserLang = typeof navigator !== 'undefined' ? navigator.language : null;
      return resolveLanguage(saved, browserLang);
    } catch {
      return 'fr';
    }
  });

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(STORAGE_KEY, language);
      }
    } catch {
      // ignore
    }

    if (typeof document !== 'undefined' && document.documentElement) {
      document.documentElement.lang = language;
    }
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => toggleLanguageHelper(prev));
  }, []);

  const currentDict = useMemo(() => (language === 'en' ? en : fr), [language]);
  const fallbackDict = useMemo(() => (language === 'en' ? fr : en), [language]);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      const translated = formatTranslation(currentDict, key, params);
      if (translated !== key) {
        return translated;
      }
      // Fallback dictionary lookup
      const fallback = formatTranslation(fallbackDict, key, params);
      if (fallback !== key) {
        return fallback;
      }
      return key;
    },
    [currentDict, fallbackDict]
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      isFrench: language === 'fr',
      isEnglish: language === 'en',
      t,
    }),
    [language, setLanguage, toggleLanguage, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => useContext(LanguageContext);
export { LanguageContext };
