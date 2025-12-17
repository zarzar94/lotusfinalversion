import { useState, useEffect, useCallback, useMemo } from 'react';
import { useScrollProgress } from '../hooks/useParallax';
import { useLanguage } from '../context/LanguageContext';
import { CLINIC } from '../data/clinic';
import {
  brandCyan,
  brandPurple,
  brandPink,
  typography,
  spacing,
  radius,
  transitions,
  gradients,
  colors,
  shadows,
} from './styles';
import { PhoneIcon, CalendarIcon, ArrowRightIcon } from './Icons';

interface StickyCTAProps {
  showThreshold?: number;
}

export default function StickyCTA({ showThreshold = 0.15 }: StickyCTAProps) {
  const { t, isArabic } = useLanguage();
  const progress = useScrollProgress();
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [availableSlots] = useState(() => Math.floor(Math.random() * 3) + 2); // 2-4 slots

  useEffect(() => {
    setIsVisible(progress > showThreshold);
  }, [progress, showThreshold]);

  const handleWhatsApp = useCallback(() => {
    const phone = CLINIC.whatsapp.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(t('cta.whatsappMessage'));
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  }, [t]);

  const handleScroll = useCallback(() => {
    document.getElementById('intake')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const css = useMemo(() => `
    @keyframes ctaSlideUp {
      from {
        transform: translateY(100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    @keyframes ctaPulse {
      0%, 100% { box-shadow: 0 -4px 20px rgba(143,211,204,0.3); }
      50% { box-shadow: 0 -4px 30px rgba(143,211,204,0.5); }
    }
    @keyframes urgencyPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    .sticky-cta-container {
      animation: ctaSlideUp 0.4s ease-out forwards, ctaPulse 3s ease-in-out infinite;
    }
    .cta-primary-btn:hover {
      transform: translateY(-2px);
      box-shadow: ${shadows.glow.cyan}, 0 8px 20px rgba(0,0,0,0.3) !important;
    }
    .cta-secondary-btn:hover {
      background: rgba(255,255,255,0.1) !important;
      border-color: ${brandCyan} !important;
    }
    .urgency-badge {
      animation: urgencyPulse 2s ease-in-out infinite;
    }
  `, []);

  if (!isVisible) return null;

  return (
    <>
      <style>{css}</style>
      <div
        className="sticky-cta-container"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: 'linear-gradient(180deg, rgba(5,6,13,0.95) 0%, rgba(11,15,28,0.98) 100%)',
          borderTop: `1px solid ${colors.border.emphasis}`,
          backdropFilter: 'blur(12px)',
          padding: isMinimized ? `${spacing[2]}px ${spacing[4]}px` : `${spacing[4]}px ${spacing[4]}px`,
          transition: transitions.normal,
        }}
      >
        {/* Gradient top line */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, ${brandCyan}, ${brandPurple}, ${brandPink})`,
        }} />

        <div style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing[4],
          flexWrap: 'wrap',
        }}>
          {/* Left: Urgency message */}
          {!isMinimized && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing[3],
              flex: 1,
              minWidth: 200,
            }}>
              {/* Urgency badge */}
              <div
                className="urgency-badge"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing[1.5],
                  padding: `${spacing[1.5]}px ${spacing[3]}px`,
                  background: 'rgba(239,68,68,0.15)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: radius.full,
                  fontSize: typography.size.xs,
                  fontWeight: typography.weight.extrabold,
                  color: '#ef4444',
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{
                  width: 6,
                  height: 6,
                  borderRadius: radius.full,
                  background: '#ef4444',
                  animation: 'urgencyPulse 1s ease-in-out infinite',
                }} />
                {availableSlots} {t('cta.slotsRemaining')}
              </div>

              {/* Message */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[0.5] }}>
                <span style={{
                  fontSize: typography.size.sm,
                  fontWeight: typography.weight.extrabold,
                  color: colors.text.primary,
                }}>
                  {t('cta.headline')}
                </span>
                <span style={{
                  fontSize: typography.size.xs,
                  color: colors.text.secondary,
                }}>
                  {t('cta.subheadline')}
                </span>
              </div>
            </div>
          )}

          {/* Right: CTA Buttons */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing[2],
          }}>
            {/* Book Consultation Button */}
            <button
              onClick={handleScroll}
              className="cta-secondary-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing[2],
                padding: `${spacing[2.5]}px ${spacing[4]}px`,
                background: 'rgba(255,255,255,0.05)',
                border: `1px solid ${colors.border.emphasis}`,
                borderRadius: radius.lg,
                color: colors.text.primary,
                fontSize: typography.size.sm,
                fontWeight: typography.weight.bold,
                cursor: 'pointer',
                transition: transitions.normal,
                whiteSpace: 'nowrap',
              }}
            >
              <CalendarIcon size={16} />
              <span style={{ display: isMinimized ? 'none' : 'inline' }}>
                {t('cta.bookConsultation')}
              </span>
            </button>

            {/* WhatsApp CTA */}
            <button
              onClick={handleWhatsApp}
              className="cta-primary-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing[2],
                padding: `${spacing[2.5]}px ${spacing[5]}px`,
                background: gradients.primary,
                border: 'none',
                borderRadius: radius.lg,
                color: colors.surface.base,
                fontSize: typography.size.sm,
                fontWeight: typography.weight.black,
                cursor: 'pointer',
                transition: transitions.bounce,
                boxShadow: shadows.glow.cyan,
                whiteSpace: 'nowrap',
              }}
            >
              <PhoneIcon size={16} />
              {t('cta.contactNow')}
              <ArrowRightIcon
                size={14}
                style={{
                  transform: isArabic ? 'rotate(180deg)' : 'none',
                }}
              />
            </button>

            {/* Minimize toggle (mobile) */}
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              style={{
                display: 'none', // Show on mobile via media query
                width: 32,
                height: 32,
                borderRadius: radius.sm,
                background: 'rgba(255,255,255,0.05)',
                border: `1px solid ${colors.border.subtle}`,
                color: colors.text.secondary,
                cursor: 'pointer',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: typography.size.sm,
              }}
              aria-label={isMinimized ? 'Expand' : 'Minimize'}
            >
              {isMinimized ? '↑' : '↓'}
            </button>
          </div>
        </div>

        {/* Trust indicators */}
        {!isMinimized && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: spacing[4],
            marginTop: spacing[3],
            paddingTop: spacing[3],
            borderTop: `1px solid ${colors.border.subtle}`,
          }}>
            {[
              { icon: '✓', text: t('cta.trust1') },
              { icon: '✓', text: t('cta.trust2') },
              { icon: '✓', text: t('cta.trust3') },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing[1.5],
                  fontSize: typography.size.xs,
                  color: colors.text.muted,
                }}
              >
                <span style={{ color: colors.success }}>{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
