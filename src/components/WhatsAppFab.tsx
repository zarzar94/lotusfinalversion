import { memo, useState, useCallback } from 'react';
import { CLINIC } from '../data/clinic';
import { handleWhatsApp } from '../utils/whatsapp';
import { useLanguage } from '../context/LanguageContext';
import { positionInlineStart } from '../utils/rtl';
import { keyframes } from '../utils/animations';
import { radius, brandColors, transitions } from './styles';

// WhatsApp brand colors
const WHATSAPP_GREEN = brandColors.whatsapp;
const WHATSAPP_DARK = '#128C7E';

const WhatsAppFab = memo(() => {
  const { isArabic } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

  // Bilingual WhatsApp message
  const getMessage = useCallback(() => {
    if (isArabic) {
      return `مرحباً، أود الاستفسار عن Berard AIT داخل ${CLINIC.city}.`;
    }
    return `Hello, I would like to inquire about Berard AIT in ${CLINIC.city}.`;
  }, [isArabic]);

  // Bilingual tooltip & aria-label
  const label = isArabic ? 'تواصل عبر واتساب' : 'Chat on WhatsApp';

  const handleClick = useCallback(() => {
    handleWhatsApp(getMessage());
  }, [getMessage]);

  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      aria-label={label}
      title={label}
      style={{
        position: 'fixed',
        bottom: 140,
        ...positionInlineStart(isArabic, 24),
        width: 56,
        height: 56,
        borderRadius: radius.full,
        background: isHovered
          ? `linear-gradient(135deg, ${WHATSAPP_GREEN}, ${WHATSAPP_DARK})`
          : WHATSAPP_GREEN,
        border: 'none',
        color: '#fff',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 28,
        boxShadow: isHovered
          ? `0 8px 30px ${brandColors.whatsappLight.replace('0.12', '0.5')}`
          : `0 4px 20px ${brandColors.whatsappLight.replace('0.12', '0.3')}`,
        transition: transitions.spring,
        transform: isHovered ? 'scale(1.1) rotate(-5deg)' : 'scale(1) rotate(0)',
        zIndex: 100,
      }}
    >
      {/* WhatsApp Icon */}
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>

      {/* Pulse effect - only when not hovered/focused */}
      {!isHovered && (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: -4,
            borderRadius: radius.full,
            border: `2px solid ${WHATSAPP_GREEN}`,
            animation: 'whatsappPulse 2s ease-out infinite',
            pointerEvents: 'none',
          }}
        />
      )}

      <style>{`
        ${keyframes.pulseRing.replace('pulseRing', 'whatsappPulse').replace('scale(2)', 'scale(1.4)')}
        @media (prefers-reduced-motion: reduce) {
          @keyframes whatsappPulse {
            0%, 100% { transform: scale(1); opacity: 0.4; }
          }
        }
      `}</style>
    </button>
  );
});

WhatsAppFab.displayName = 'WhatsAppFab';

export default WhatsAppFab;
