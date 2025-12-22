/**
 * KeyboardShortcuts - Global keyboard navigation and shortcuts
 * Provides power-user features and accessibility improvements
 */

import { memo, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useVisitorMode } from '../context/VisitorModeContext';
import {
  brandCyan,
  brandPurple,
  brandPink,
  brandInk,
  colors,
  typography,
  spacing,
  radius,
  shadows,
  transitions,
} from './styles';

interface Shortcut {
  key: string;
  modifiers?: ('ctrl' | 'alt' | 'shift' | 'meta')[];
  action: () => void;
  label: { ar: string; en: string };
  category: 'navigation' | 'action' | 'accessibility';
}

const KeyboardShortcuts = memo(() => {
  const { isArabic, toggleLanguage } = useLanguage();
  const { mode, setMode } = useVisitorMode();
  const navigate = useNavigate();
  const location = useLocation();
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [lastKey, setLastKey] = useState<string | null>(null);

  // Define shortcuts
  const shortcuts: Shortcut[] = [
    // Navigation shortcuts
    {
      key: 'h',
      modifiers: ['alt'],
      action: () => navigate('/'),
      label: { ar: 'الرئيسية', en: 'Go to Home' },
      category: 'navigation',
    },
    {
      key: 'a',
      modifiers: ['alt'],
      action: () => navigate('/assessment'),
      label: { ar: 'التقييم', en: 'Go to Assessment' },
      category: 'navigation',
    },
    {
      key: 'p',
      modifiers: ['alt'],
      action: () => navigate('/program'),
      label: { ar: 'البرنامج', en: 'Go to Program' },
      category: 'navigation',
    },
    {
      key: 's',
      modifiers: ['alt'],
      action: () => navigate('/science'),
      label: { ar: 'العلم', en: 'Go to Science' },
      category: 'navigation',
    },
    {
      key: 'r',
      modifiers: ['alt'],
      action: () => navigate('/results'),
      label: { ar: 'النتائج', en: 'Go to Results' },
      category: 'navigation',
    },
    {
      key: 'c',
      modifiers: ['alt'],
      action: () => navigate('/contact'),
      label: { ar: 'تواصل', en: 'Go to Contact' },
      category: 'navigation',
    },
    // Action shortcuts
    {
      key: 'l',
      modifiers: ['alt'],
      action: () => toggleLanguage(),
      label: { ar: 'تغيير اللغة', en: 'Toggle Language' },
      category: 'action',
    },
    {
      key: '1',
      modifiers: ['alt'],
      action: () => setMode('school'),
      label: { ar: 'وضع المدرسة', en: 'School Mode' },
      category: 'action',
    },
    {
      key: '2',
      modifiers: ['alt'],
      action: () => setMode('parent'),
      label: { ar: 'وضع الأهل', en: 'Parent Mode' },
      category: 'action',
    },
    {
      key: '3',
      modifiers: ['alt'],
      action: () => setMode('clinician'),
      label: { ar: 'وضع الأخصائي', en: 'Clinician Mode' },
      category: 'action',
    },
    // Accessibility shortcuts
    {
      key: '/',
      modifiers: ['shift'],
      action: () => setIsHelpOpen(true),
      label: { ar: 'إظهار الاختصارات', en: 'Show Shortcuts' },
      category: 'accessibility',
    },
    {
      key: 'Escape',
      modifiers: [],
      action: () => setIsHelpOpen(false),
      label: { ar: 'إغلاق', en: 'Close Dialog' },
      category: 'accessibility',
    },
  ];

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      for (const shortcut of shortcuts) {
        const modifiersMatch =
          (!shortcut.modifiers || shortcut.modifiers.length === 0) ||
          shortcut.modifiers.every((mod) => {
            switch (mod) {
              case 'ctrl':
                return e.ctrlKey;
              case 'alt':
                return e.altKey;
              case 'shift':
                return e.shiftKey;
              case 'meta':
                return e.metaKey;
              default:
                return false;
            }
          });

        if (modifiersMatch && e.key.toLowerCase() === shortcut.key.toLowerCase()) {
          e.preventDefault();
          shortcut.action();
          setLastKey(shortcut.key);
          setTimeout(() => setLastKey(null), 500);
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);

  // Group shortcuts by category
  const groupedShortcuts = {
    navigation: shortcuts.filter((s) => s.category === 'navigation'),
    action: shortcuts.filter((s) => s.category === 'action'),
    accessibility: shortcuts.filter((s) => s.category === 'accessibility'),
  };

  const formatShortcut = (shortcut: Shortcut): string => {
    const modifierSymbols: Record<string, string> = {
      ctrl: '⌃',
      alt: '⌥',
      shift: '⇧',
      meta: '⌘',
    };

    const parts = (shortcut.modifiers || []).map((m) => modifierSymbols[m] || m);
    parts.push(shortcut.key.toUpperCase());
    return parts.join(' + ');
  };

  return (
    <>
      {/* Keyboard shortcut help modal */}
      {isHelpOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: spacing[4],
            animation: 'fadeIn 0.2s ease-out',
          }}
          onClick={() => setIsHelpOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: colors.surface.overlay,
              borderRadius: radius['2xl'],
              border: `1px solid ${colors.border.emphasis}`,
              maxWidth: 500,
              width: '100%',
              maxHeight: '80vh',
              overflow: 'auto',
              boxShadow: shadows['2xl'],
              direction: isArabic ? 'rtl' : 'ltr',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: spacing[5],
                borderBottom: `1px solid ${colors.border.default}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
                <span style={{ fontSize: 24 }}>⌨️</span>
                <h2
                  style={{
                    margin: 0,
                    fontSize: typography.size.xl,
                    fontWeight: typography.weight.bold,
                    color: colors.text.primary,
                  }}
                >
                  {isArabic ? 'اختصارات لوحة المفاتيح' : 'Keyboard Shortcuts'}
                </h2>
              </div>
              <button
                onClick={() => setIsHelpOpen(false)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: radius.lg,
                  background: colors.border.default,
                  border: 'none',
                  color: colors.text.primary,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ✕
              </button>
            </div>

            {/* Shortcuts list */}
            <div style={{ padding: spacing[5] }}>
              {Object.entries(groupedShortcuts).map(([category, items]) => (
                <div key={category} style={{ marginBottom: spacing[6] }}>
                  <h3
                    style={{
                      margin: 0,
                      marginBottom: spacing[3],
                      fontSize: typography.size.sm,
                      fontWeight: typography.weight.bold,
                      color: brandCyan,
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                    }}
                  >
                    {category === 'navigation'
                      ? isArabic
                        ? 'التنقل'
                        : 'Navigation'
                      : category === 'action'
                        ? isArabic
                          ? 'الإجراءات'
                          : 'Actions'
                        : isArabic
                          ? 'إمكانية الوصول'
                          : 'Accessibility'}
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
                    {items.map((shortcut) => (
                      <div
                        key={shortcut.key}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: `${spacing[2]}px ${spacing[3]}px`,
                          background: colors.surface.card,
                          borderRadius: radius.lg,
                        }}
                      >
                        <span
                          style={{
                            fontSize: typography.size.sm,
                            color: colors.text.secondary,
                          }}
                        >
                          {isArabic ? shortcut.label.ar : shortcut.label.en}
                        </span>
                        <kbd
                          style={{
                            padding: `${spacing[1]}px ${spacing[2]}px`,
                            background: brandInk,
                            border: `1px solid ${colors.border.emphasis}`,
                            borderRadius: radius.md,
                            fontSize: typography.size.xs,
                            fontFamily: 'monospace',
                            color: colors.text.primary,
                          }}
                        >
                          {formatShortcut(shortcut)}
                        </kbd>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer tip */}
            <div
              style={{
                padding: spacing[4],
                background: `${brandCyan}08`,
                borderTop: `1px solid ${colors.border.subtle}`,
                display: 'flex',
                alignItems: 'center',
                gap: spacing[2],
              }}
            >
              <span style={{ fontSize: 14 }}>💡</span>
              <span
                style={{
                  fontSize: typography.size.sm,
                  color: colors.text.muted,
                }}
              >
                {isArabic
                  ? 'اضغط Shift + ? في أي وقت لعرض هذه القائمة'
                  : 'Press Shift + ? anytime to show this menu'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Visual feedback for shortcut activation */}
      {lastKey && (
        <div
          style={{
            position: 'fixed',
            bottom: spacing[6],
            left: '50%',
            transform: 'translateX(-50%)',
            padding: `${spacing[2]}px ${spacing[4]}px`,
            background: colors.surface.overlay,
            border: `1px solid ${brandCyan}30`,
            borderRadius: radius.full,
            boxShadow: shadows.lg,
            zIndex: 1000,
            animation: 'shortcutFeedback 0.5s ease-out forwards',
          }}
        >
          <span
            style={{
              fontSize: typography.size.sm,
              color: brandCyan,
              fontWeight: typography.weight.medium,
            }}
          >
            ⌨️ {lastKey.toUpperCase()}
          </span>
        </div>
      )}

      {/* Styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes shortcutFeedback {
          0% { opacity: 0; transform: translateX(-50%) translateY(10px); }
          20% { opacity: 1; transform: translateX(-50%) translateY(0); }
          80% { opacity: 1; transform: translateX(-50%) translateY(0); }
          100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
        }
      `}</style>
    </>
  );
});

KeyboardShortcuts.displayName = 'KeyboardShortcuts';

/**
 * SkipToContent - Accessibility skip link for keyboard users
 */
export const SkipToContent = memo(() => {
  const { isArabic } = useLanguage();

  return (
    <a
      href="#main-content"
      style={{
        position: 'fixed',
        top: -100,
        left: '50%',
        transform: 'translateX(-50%)',
        padding: `${spacing[3]}px ${spacing[5]}px`,
        background: brandCyan,
        color: brandInk,
        fontSize: typography.size.sm,
        fontWeight: typography.weight.bold,
        borderRadius: radius.lg,
        textDecoration: 'none',
        zIndex: 10000,
        transition: 'top 0.2s ease',
      }}
      onFocus={(e) => {
        e.currentTarget.style.top = `${spacing[4]}px`;
      }}
      onBlur={(e) => {
        e.currentTarget.style.top = '-100px';
      }}
    >
      {isArabic ? 'تخطي إلى المحتوى الرئيسي' : 'Skip to main content'}
    </a>
  );
});

SkipToContent.displayName = 'SkipToContent';

/**
 * FocusIndicator - Visual focus ring that follows focused element
 */
export const FocusIndicator = memo(() => {
  const [focusRect, setFocusRect] = useState<DOMRect | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.matches(':focus-visible')) {
        const rect = target.getBoundingClientRect();
        setFocusRect(rect);
        setIsVisible(true);
      }
    };

    const handleBlur = () => {
      setIsVisible(false);
    };

    document.addEventListener('focusin', handleFocus);
    document.addEventListener('focusout', handleBlur);

    return () => {
      document.removeEventListener('focusin', handleFocus);
      document.removeEventListener('focusout', handleBlur);
    };
  }, []);

  if (!isVisible || !focusRect) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: focusRect.top - 4,
        left: focusRect.left - 4,
        width: focusRect.width + 8,
        height: focusRect.height + 8,
        border: `2px solid ${brandCyan}`,
        borderRadius: radius.lg,
        pointerEvents: 'none',
        zIndex: 9999,
        boxShadow: `0 0 0 4px ${brandCyan}20`,
        transition: 'all 0.15s ease',
      }}
    />
  );
});

FocusIndicator.displayName = 'FocusIndicator';

export default KeyboardShortcuts;
