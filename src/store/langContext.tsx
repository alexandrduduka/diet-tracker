import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { getSettings } from './settings';
import { getTranslations, type Translations } from '../lib/i18n';
import type { AppLanguage } from '../types';

interface LangContextValue {
  t: Translations;
  lang: AppLanguage;
  setLang: (lang: AppLanguage) => void;
}

const LangContext = createContext<LangContextValue>({
  t: getTranslations('en'),
  lang: 'en',
  setLang: () => {},
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<AppLanguage>(() => getSettings().language ?? 'en');

  useEffect(() => {
    const handler = () => {
      setLangState(getSettings().language ?? 'en');
    };
    window.addEventListener('dtk:settings-changed', handler);
    return () => window.removeEventListener('dtk:settings-changed', handler);
  }, []);

  function setLang(l: AppLanguage) {
    setLangState(l);
  }

  return (
    <LangContext.Provider value={{ t: getTranslations(lang), lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
