import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { cs, type Translations } from './cs';
import { en } from './en';

export type Lang = 'cs' | 'en';

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Translations;
}

const translations: Record<Lang, Translations> = { cs, en };

const STORAGE_KEY = 'auxology.lang';

function loadLang(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'cs') return stored;
  } catch {}
  return 'cs';
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'cs',
  setLang: () => {},
  t: cs,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(loadLang);

  const setLang = useCallback((l: Lang) => {
    localStorage.setItem(STORAGE_KEY, l);
    setLangState(l);
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useT() {
  return useContext(LanguageContext);
}
