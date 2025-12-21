import { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { colors, radius, shadows, spacing, transitions } from './styles';
import { XIcon } from './Icons';
import TestimonialsSection from './TestimonialsSection';

export default function TestimonialsModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { isArabic, t } = useLanguage();

  useEffect(() => {
    if (!open) return undefined;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    const previousOverflow = document.body.style.overflow;
    window.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const css = `
    @keyframes testimonialsModalFade {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes testimonialsModalSlide {
      from { opacity: 0; transform: translateY(16px) scale(0.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
  `;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t('auto.TestimonialsModal.k1', "Testimonials")}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(5,6,13,0.88)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1200,
        padding: spacing[4],
        animation: 'testimonialsModalFade 0.3s ease-out',
      }}
    >
      <style>{css}</style>
      <div
        onClick={(event) => event.stopPropagation()}
        dir={isArabic ? 'rtl' : 'ltr'}
        style={{
          background: colors.surface.overlay,
          borderRadius: radius.xl,
          maxWidth: 1200,
          width: '100%',
          maxHeight: '88vh',
          overflow: 'auto',
          position: 'relative',
          border: `1px solid ${colors.border.emphasis}`,
          boxShadow: shadows['2xl'],
          padding: spacing[4],
          animation: 'testimonialsModalSlide 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <button
          onClick={onClose}
          aria-label={t('auto.TestimonialsModal.k2', "Close")}
          style={{
            position: 'absolute',
            top: spacing[3],
            [isArabic ? 'left' : 'right']: spacing[3],
            width: 40,
            height: 40,
            borderRadius: radius.md,
            border: `1px solid ${colors.border.subtle}`,
            background: 'rgba(255,255,255,0.06)',
            display: 'grid',
            placeItems: 'center',
            color: colors.text.muted,
            cursor: 'pointer',
            transition: transitions.fast,
            zIndex: 2,
          }}
        >
          <XIcon size={18} />
        </button>
        <div style={{ paddingTop: spacing[6] }}>
          <TestimonialsSection />
        </div>
      </div>
    </div>
  );
}
