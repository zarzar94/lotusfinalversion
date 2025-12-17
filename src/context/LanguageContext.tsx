import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

export type Language = 'ar' | 'en';
export type Direction = 'rtl' | 'ltr';

interface LanguageContextType {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
  isArabic: boolean;
  isEnglish: boolean;
}

const STORAGE_KEY = 'lotus_language';

const LanguageContext = createContext<LanguageContextType | null>(null);

// Import translations
import { translations } from '../i18n/translations';

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.');
  let current: unknown = obj;

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path; // Return key if not found
    }
  }

  return typeof current === 'string' ? current : path;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'ar';
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'ar' || saved === 'en') return saved;
    // Check browser language
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('en')) return 'en';
    return 'ar'; // Default to Arabic
  });

  const direction: Direction = language === 'ar' ? 'rtl' : 'ltr';
  const isArabic = language === 'ar';
  const isEnglish = language === 'en';

  // Save to localStorage and update document attributes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
    document.body.style.direction = direction;
    document.body.style.textAlign = direction === 'rtl' ? 'right' : 'left';
  }, [language, direction]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState(prev => prev === 'ar' ? 'en' : 'ar');
  }, []);

  const t = useCallback((key: string): string => {
    const langTranslations = translations[language];
    return getNestedValue(langTranslations as Record<string, unknown>, key);
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        direction,
        setLanguage,
        toggleLanguage,
        t,
        isArabic,
        isEnglish,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
