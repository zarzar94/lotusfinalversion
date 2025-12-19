/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LANGUAGE GUARD COMPONENT
 * Ensures strict language consistency throughout the application
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { memo, type ReactNode, type CSSProperties } from 'react';
import { useLanguage } from '../context/LanguageContext';

// ─────────────────────────────────────────────────────────────────────────────
// LOCALIZED TEXT COMPONENT
// Renders text only in the current language - no bilingual mixing
// ─────────────────────────────────────────────────────────────────────────────

interface LocalizedTextProps {
  /** Arabic text */
  ar: string;
  /** English text */
  en: string;
  /** Optional tag name (default: span) */
  as?: keyof JSX.IntrinsicElements;
  /** Optional style */
  style?: CSSProperties;
  /** Optional className */
  className?: string;
}

export const LocalizedText = memo(function LocalizedText({
  ar,
  en,
  as: Tag = 'span',
  style,
  className,
}: LocalizedTextProps) {
  const { isArabic } = useLanguage();
  return <Tag style={style} className={className}>{isArabic ? ar : en}</Tag>;
});

// ─────────────────────────────────────────────────────────────────────────────
// LOCALIZED CONTENT COMPONENT
// Renders different content (not just text) based on language
// ─────────────────────────────────────────────────────────────────────────────

interface LocalizedContentProps {
  /** Arabic content */
  ar: ReactNode;
  /** English content */
  en: ReactNode;
}

export const LocalizedContent = memo(function LocalizedContent({
  ar,
  en,
}: LocalizedContentProps) {
  const { isArabic } = useLanguage();
  return <>{isArabic ? ar : en}</>;
});

// ─────────────────────────────────────────────────────────────────────────────
// LANGUAGE-AWARE CONTAINER
// Provides direction-aware layout and styling
// ─────────────────────────────────────────────────────────────────────────────

interface LanguageAwareContainerProps {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
  /** Apply text alignment based on language direction */
  alignText?: boolean;
  /** Apply flex direction based on language direction */
  flexReverse?: boolean;
}

export const LanguageAwareContainer = memo(function LanguageAwareContainer({
  children,
  style,
  className,
  alignText = false,
  flexReverse = false,
}: LanguageAwareContainerProps) {
  const { direction, isArabic } = useLanguage();

  const containerStyle: CSSProperties = {
    ...style,
    ...(alignText && { textAlign: isArabic ? 'right' : 'left' }),
    ...(flexReverse && { flexDirection: isArabic ? 'row-reverse' : 'row' }),
    direction,
  };

  return (
    <div style={containerStyle} className={className}>
      {children}
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// ARABIC ONLY COMPONENT
// Only renders content when Arabic is selected
// ─────────────────────────────────────────────────────────────────────────────

interface LanguageOnlyProps {
  children: ReactNode;
}

export const ArabicOnly = memo(function ArabicOnly({ children }: LanguageOnlyProps) {
  const { isArabic } = useLanguage();
  if (!isArabic) return null;
  return <>{children}</>;
});

// ─────────────────────────────────────────────────────────────────────────────
// ENGLISH ONLY COMPONENT
// Only renders content when English is selected
// ─────────────────────────────────────────────────────────────────────────────

export const EnglishOnly = memo(function EnglishOnly({ children }: LanguageOnlyProps) {
  const { isEnglish } = useLanguage();
  if (!isEnglish) return null;
  return <>{children}</>;
});

// ─────────────────────────────────────────────────────────────────────────────
// DIRECTIONAL MARGIN/PADDING UTILITIES
// Utility components for RTL-aware spacing
// ─────────────────────────────────────────────────────────────────────────────

interface DirectionalSpacerProps {
  /** Value in pixels */
  value: number;
  /** Type: margin or padding */
  type?: 'margin' | 'padding';
  /** Direction: start or end (relative to reading direction) */
  direction: 'start' | 'end';
  children?: ReactNode;
  style?: CSSProperties;
}

export const DirectionalSpacer = memo(function DirectionalSpacer({
  value,
  type = 'margin',
  direction,
  children,
  style,
}: DirectionalSpacerProps) {
  const { isArabic } = useLanguage();

  const getStyle = (): CSSProperties => {
    const isStart = direction === 'start';
    const property = type === 'margin'
      ? isStart
        ? (isArabic ? 'marginRight' : 'marginLeft')
        : (isArabic ? 'marginLeft' : 'marginRight')
      : isStart
        ? (isArabic ? 'paddingRight' : 'paddingLeft')
        : (isArabic ? 'paddingLeft' : 'paddingRight');

    return { ...style, [property]: value };
  };

  return <span style={getStyle()}>{children}</span>;
});

// ─────────────────────────────────────────────────────────────────────────────
// BILINGUAL DATA INTERFACE
// Type-safe interface for bilingual content
// ─────────────────────────────────────────────────────────────────────────────

export interface BilingualContent {
  ar: string;
  en: string;
}

export interface BilingualNode {
  ar: ReactNode;
  en: ReactNode;
}

// ─────────────────────────────────────────────────────────────────────────────
// HOOK: useBilingual
// Returns the correct value from a bilingual object
// ─────────────────────────────────────────────────────────────────────────────

export function useBilingual<T extends { ar: unknown; en: unknown }>(
  content: T
): T['ar'] | T['en'] {
  const { isArabic } = useLanguage();
  return isArabic ? content.ar : content.en;
}

// ─────────────────────────────────────────────────────────────────────────────
// HOOK: useDirectionalValue
// Returns left/right values based on RTL direction
// ─────────────────────────────────────────────────────────────────────────────

export function useDirectionalValue<T>(rtlValue: T, ltrValue: T): T {
  const { isArabic } = useLanguage();
  return isArabic ? rtlValue : ltrValue;
}

// ─────────────────────────────────────────────────────────────────────────────
// LANGUAGE BADGE COMPONENT
// Visual indicator of current language for debugging/development
// ─────────────────────────────────────────────────────────────────────────────

interface LanguageBadgeProps {
  showInProduction?: boolean;
}

export const LanguageBadge = memo(function LanguageBadge({
  showInProduction = false,
}: LanguageBadgeProps) {
  const { language, direction } = useLanguage();

  // Hide in production unless explicitly shown
  if (!showInProduction && import.meta.env.PROD) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 16,
        left: direction === 'ltr' ? 16 : 'auto',
        right: direction === 'rtl' ? 16 : 'auto',
        padding: '6px 12px',
        background: 'rgba(143,211,204,0.15)',
        border: '1px solid rgba(143,211,204,0.3)',
        borderRadius: 8,
        fontSize: 11,
        fontWeight: 700,
        color: '#8FD3CC',
        zIndex: 9998,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontFamily: 'monospace',
      }}
    >
      <span style={{ fontSize: 14 }}>{language === 'ar' ? '🇸🇦' : '🇬🇧'}</span>
      <span>{language.toUpperCase()}</span>
      <span style={{ opacity: 0.5 }}>|</span>
      <span>{direction.toUpperCase()}</span>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

export default {
  LocalizedText,
  LocalizedContent,
  LanguageAwareContainer,
  ArabicOnly,
  EnglishOnly,
  DirectionalSpacer,
  LanguageBadge,
};
