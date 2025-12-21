import type { Language } from '../context/LanguageContext';
import { safeStorage } from './storage';

export const LANGUAGE_STORAGE_KEY = 'lotus_language';

export const getStoredLanguage = (): Language | null => {
  const stored = safeStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (stored === 'ar' || stored === 'en') return stored;
  return null;
};

export const detectPreferredLanguage = (): Language => {
  if (typeof window === 'undefined') return 'ar';

  const stored = getStoredLanguage();
  if (stored) return stored;

  const browserLang = window.navigator?.language?.toLowerCase() ?? '';
  if (browserLang.startsWith('ar')) return 'ar';
  if (browserLang.startsWith('en')) return 'en';

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const gccTimezones = [
    'Asia/Dubai',
    'Asia/Riyadh',
    'Asia/Qatar',
    'Asia/Kuwait',
    'Asia/Bahrain',
    'Asia/Muscat',
  ];
  if (gccTimezones.some((tz) => timezone.includes(tz))) return 'ar';

  return 'ar';
};
