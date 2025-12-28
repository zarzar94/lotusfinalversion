import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode, type CSSProperties } from 'react';
import { translations } from '../i18n/translations';
import { detectPreferredLanguage, LANGUAGE_STORAGE_KEY, LANGUAGE_UPDATED_AT_KEY } from '../utils/language';
import { safeStorage } from '../utils/storage';
import { notifyLocalChange } from '../utils/sync';
import { brandCyan, brandInk, brandPurpleDark, colors } from '../components/styles';
import { BrainCircuitIcon } from '../components/icons/index';

export type Language = 'ar' | 'en';
export type Direction = 'rtl' | 'ltr';

interface LanguageContextType {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: <T = string>(key: string | T, fallback?: T) => T;
  isArabic: boolean;
  isEnglish: boolean;
  // Language-aware utilities
  fontFamily: string;
  textAlign: 'right' | 'left';
  flexDirection: 'row' | 'row-reverse';
  marginStart: (value: number) => CSSProperties;
  marginEnd: (value: number) => CSSProperties;
  paddingStart: (value: number) => CSSProperties;
  paddingEnd: (value: number) => CSSProperties;
  borderStart: (border: string) => CSSProperties;
  borderEnd: (border: string) => CSSProperties;
  // Bilingual content selector - picks the right content based on language
  select: <T>(arContent: T, enContent: T) => T;
  // Language enforcement - warns in dev mode if using wrong pattern
  enforceLanguage: boolean;
}

const FIRST_VISIT_KEY = 'lotus_first_visit';

const LanguageContext = createContext<LanguageContextType | null>(null);

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  if (typeof path !== 'string') return undefined;
  const keys = path.split('.');
  let current: unknown = obj;

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }

  return current;
}

// Detect if this is the user's first visit
function isFirstVisit(): boolean {
  if (!safeStorage.isAvailable()) return false;
  const visited = safeStorage.getItem(FIRST_VISIT_KEY);
  if (visited) return false;
  safeStorage.setItem(FIRST_VISIT_KEY, 'true');
  return true;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(detectPreferredLanguage);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  const direction: Direction = language === 'ar' ? 'rtl' : 'ltr';
  const isArabic = language === 'ar';
  const isEnglish = language === 'en';

  // Check first visit and show language selector
  useEffect(() => {
    if (isFirstVisit()) {
      setShowLanguageSelector(true);
    }
    setIsInitialized(true);
  }, []);

  // Save to localStorage and update document attributes
  useEffect(() => {
    safeStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
    document.documentElement.dataset.lang = language;
    document.body.style.direction = direction;
    document.body.style.textAlign = direction === 'rtl' ? 'right' : 'left';

    // Update font preferences based on language
    if (isArabic) {
      document.documentElement.style.setProperty('--font-primary', 'Cairo, system-ui, -apple-system, sans-serif');
      document.documentElement.style.setProperty('--letter-spacing', '0');
    } else {
      document.documentElement.style.setProperty('--font-primary', 'Cairo, system-ui, -apple-system, sans-serif');
      document.documentElement.style.setProperty('--letter-spacing', '0.5px');
    }
  }, [language, direction, isArabic]);

  const markLanguageUpdated = useCallback(() => {
    safeStorage.setItem(LANGUAGE_UPDATED_AT_KEY, Date.now().toString());
    notifyLocalChange();
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    setShowLanguageSelector(false);
    markLanguageUpdated();
  }, [markLanguageUpdated]);

  const toggleLanguage = useCallback(() => {
    setLanguageState(prev => prev === 'ar' ? 'en' : 'ar');
    markLanguageUpdated();
  }, [markLanguageUpdated]);

  const t = useCallback(<T,>(key: string | T, fallback?: T): T => {
    if (typeof key !== 'string') {
      return key as T;
    }
    const langTranslations = translations[language];
    const value = getNestedValue(langTranslations as Record<string, unknown>, key);
    if (value === undefined) {
      return fallback ?? (key as unknown as T);
    }
    return value as T;
  }, [language]);

  // Language-aware CSS utilities
  const fontFamily = 'Cairo, system-ui, -apple-system, sans-serif';
  const textAlign: 'right' | 'left' = isArabic ? 'right' : 'left';
  const flexDirection: 'row' | 'row-reverse' = isArabic ? 'row-reverse' : 'row';

  const marginStart = useCallback((value: number): CSSProperties =>
    isArabic ? { marginRight: value } : { marginLeft: value }, [isArabic]);

  const marginEnd = useCallback((value: number): CSSProperties =>
    isArabic ? { marginLeft: value } : { marginRight: value }, [isArabic]);

  const paddingStart = useCallback((value: number): CSSProperties =>
    isArabic ? { paddingRight: value } : { paddingLeft: value }, [isArabic]);

  const paddingEnd = useCallback((value: number): CSSProperties =>
    isArabic ? { paddingLeft: value } : { paddingRight: value }, [isArabic]);

  const borderStart = useCallback((border: string): CSSProperties =>
    isArabic ? { borderRight: border } : { borderLeft: border }, [isArabic]);

  const borderEnd = useCallback((border: string): CSSProperties =>
    isArabic ? { borderLeft: border } : { borderRight: border }, [isArabic]);

  // Bilingual content selector - always picks the right content based on current language
  const select = useCallback(<T,>(arContent: T, enContent: T): T =>
    isArabic ? arContent : enContent, [isArabic]);

  const contextValue = useMemo(() => ({
    language,
    direction,
    setLanguage,
    toggleLanguage,
    t,
    isArabic,
    isEnglish,
    fontFamily,
    textAlign,
    flexDirection,
    marginStart,
    marginEnd,
    paddingStart,
    paddingEnd,
    borderStart,
    borderEnd,
    select,
    enforceLanguage: true,
  }), [language, direction, setLanguage, toggleLanguage, t, isArabic, isEnglish, fontFamily,
      textAlign, flexDirection, marginStart, marginEnd, paddingStart, paddingEnd, borderStart,
      borderEnd, select]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {showLanguageSelector && isInitialized ? (
        <LanguageSelectionOverlay
          onSelect={setLanguage}
          currentLanguage={language}
        />
      ) : null}
      {children}
    </LanguageContext.Provider>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// LANGUAGE SELECTION OVERLAY - First-visit experience
// ═══════════════════════════════════════════════════════════════════════════

interface LanguageSelectionOverlayProps {
  onSelect: (lang: Language) => void;
  currentLanguage: Language;
}

function LanguageSelectionOverlay({ onSelect, currentLanguage }: LanguageSelectionOverlayProps) {
  const [selectedLang, setSelectedLang] = useState<Language>(currentLanguage);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSelect = (lang: Language) => {
    setSelectedLang(lang);
  };

  const handleConfirm = () => {
    onSelect(selectedLang);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(180deg, ${colors.surface.elevated} 0%, ${colors.surface.base} 100%)`,
        opacity: isAnimating ? 0 : 1,
        transition: 'opacity 0.5s ease',
      }}
    >
      {/* Background effects */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          radial-gradient(ellipse at 30% 20%, rgba(143,211,204,0.15) 0%, transparent 50%),
          radial-gradient(ellipse at 70% 80%, rgba(175,132,186,0.12) 0%, transparent 50%)
        `,
        pointerEvents: 'none',
      }} />

      {/* Grid pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.03,
        backgroundImage: `
          linear-gradient(rgba(143,211,204,0.3) 1px, transparent 1px),
          linear-gradient(90deg, rgba(143,211,204,0.3) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'relative',
        maxWidth: 500,
        width: '90%',
        padding: 40,
        background: 'rgba(13,17,23,0.9)',
        borderRadius: 24,
        border: '1px solid rgba(143,211,204,0.2)',
        boxShadow: '0 30px 80px rgba(0,0,0,0.5), 0 0 60px rgba(143,211,204,0.1)',
        textAlign: 'center',
      }}>
        {/* Lab status header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          marginBottom: 24,
        }}>
          <div style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: colors.success,
            boxShadow: `0 0 10px ${colors.success}`,
            animation: 'pulse 2s ease-in-out infinite',
          }} />
          <span style={{
            fontSize: 11,
            fontWeight: 800,
            color: brandCyan,
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}>
            LOTUS LAB • INITIALIZING
          </span>
        </div>

        {/* Logo */}
        <div style={{
          fontSize: 48,
          marginBottom: 16,
          filter: 'drop-shadow(0 0 20px rgba(143,211,204,0.4))',
        }}>
          <BrainCircuitIcon size={48} tone="cyan" />
        </div>

        <h1 style={{
          fontSize: 24,
          fontWeight: 800,
          color: colors.text.primary,
          marginBottom: 8,
          fontFamily: 'Cairo, sans-serif',
        }}>
          {selectedLang === 'ar' ? 'اختر اللغة' : 'Select Language'}
        </h1>

        <p style={{
          fontSize: 14,
          color: 'rgba(255,255,255,0.6)',
          marginBottom: 32,
          fontFamily: 'Cairo, sans-serif',
        }}>
          {selectedLang === 'ar'
            ? 'سيتم عرض جميع المحتوى بلغتك المختارة'
            : 'All content will be displayed in your chosen language'}
        </p>

        {/* Language Options */}
        <div style={{
          display: 'flex',
          gap: 16,
          marginBottom: 32,
          justifyContent: 'center',
        }}>
          <button
            onClick={() => handleSelect('ar')}
            style={{
              flex: 1,
              maxWidth: 180,
              padding: '20px 24px',
              borderRadius: 16,
              border: selectedLang === 'ar'
                ? `2px solid ${brandCyan}`
                : '1px solid rgba(255,255,255,0.1)',
              background: selectedLang === 'ar'
                ? 'linear-gradient(135deg, rgba(143,211,204,0.15), rgba(175,132,186,0.1))'
                : 'rgba(255,255,255,0.02)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: selectedLang === 'ar' ? '0 0 30px rgba(143,211,204,0.2)' : 'none',
            }}
          >
            <div style={{
              fontSize: 32,
              marginBottom: 8,
            }}>🇸🇦</div>
            <div style={{
              fontSize: 18,
              fontWeight: 700,
              color: selectedLang === 'ar' ? brandCyan : colors.text.primary,
              fontFamily: 'Cairo, sans-serif',
            }}>
              العربية
            </div>
            <div style={{
              fontSize: 12,
              color: 'rgba(255,255,255,0.5)',
              marginTop: 4,
            }}>
              Arabic
            </div>
          </button>

          <button
            onClick={() => handleSelect('en')}
            style={{
              flex: 1,
              maxWidth: 180,
              padding: '20px 24px',
              borderRadius: 16,
              border: selectedLang === 'en'
                ? `2px solid ${brandCyan}`
                : '1px solid rgba(255,255,255,0.1)',
              background: selectedLang === 'en'
                ? 'linear-gradient(135deg, rgba(143,211,204,0.15), rgba(175,132,186,0.1))'
                : 'rgba(255,255,255,0.02)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: selectedLang === 'en' ? '0 0 30px rgba(143,211,204,0.2)' : 'none',
            }}
          >
            <div style={{
              fontSize: 32,
              marginBottom: 8,
            }}>🇬🇧</div>
            <div style={{
              fontSize: 18,
              fontWeight: 700,
              color: selectedLang === 'en' ? brandCyan : colors.text.primary,
              fontFamily: 'Cairo, sans-serif',
            }}>
              English
            </div>
            <div style={{
              fontSize: 12,
              color: 'rgba(255,255,255,0.5)',
              marginTop: 4,
            }}>
              الإنجليزية
            </div>
          </button>
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          style={{
            width: '100%',
            padding: '16px 32px',
            borderRadius: 14,
            border: 'none',
            background: `linear-gradient(135deg, ${brandPurpleDark}, ${brandCyan})`,
            color: brandInk,
            fontSize: 16,
            fontWeight: 800,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 30px rgba(143,211,204,0.25)',
            fontFamily: 'Cairo, sans-serif',
          }}
        >
          {selectedLang === 'ar' ? 'تأكيد واستمرار' : 'Confirm & Continue'}
        </button>

        {/* Note */}
        <p style={{
          fontSize: 12,
          color: 'rgba(255,255,255,0.4)',
          marginTop: 20,
          fontFamily: 'Cairo, sans-serif',
        }}>
          {selectedLang === 'ar'
            ? 'يمكنك تغيير اللغة لاحقاً من القائمة العلوية'
            : 'You can change the language later from the top menu'}
        </p>

        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.1); }
          }
        `}</style>
      </div>
    </div>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY HOOK - Get localized content from bilingual data
// ═══════════════════════════════════════════════════════════════════════════

export function useLocalizedContent<T extends { ar: string; en: string }>(content: T): string {
  const { isArabic } = useLanguage();
  return isArabic ? content.ar : content.en;
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY HOOK - Get direction-aware styles
// ═══════════════════════════════════════════════════════════════════════════

export function useDirectionalStyles() {
  const { direction, isArabic } = useLanguage();

  return useMemo(() => {
    const textAlign: 'right' | 'left' = isArabic ? 'right' : 'left';
    const flexDirection: 'row' | 'row-reverse' = isArabic ? 'row-reverse' : 'row';

    return {
      textAlign,
      flexDirection,
      transformOrigin: isArabic ? 'right center' : 'left center',
      gradientDirection: isArabic ? 'to left' : 'to right',
      iconPosition: isArabic ? 'right' : 'left',
      marginInlineStart: (value: number) => (isArabic ? { marginRight: value } : { marginLeft: value }),
      marginInlineEnd: (value: number) => (isArabic ? { marginLeft: value } : { marginRight: value }),
      paddingInlineStart: (value: number) => (isArabic ? { paddingRight: value } : { paddingLeft: value }),
      paddingInlineEnd: (value: number) => (isArabic ? { paddingLeft: value } : { paddingRight: value }),
      borderInlineStart: (border: string) => (isArabic ? { borderRight: border } : { borderLeft: border }),
      borderInlineEnd: (border: string) => (isArabic ? { borderLeft: border } : { borderRight: border }),
      direction,
    };
  }, [direction, isArabic]);
}
