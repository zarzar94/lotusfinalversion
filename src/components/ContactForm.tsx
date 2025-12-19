import React, { FormEvent, useMemo, useState, useEffect, useCallback, memo, useRef } from 'react';

import { CLINIC } from '../data/clinic';
import { handleWhatsApp } from '../utils/whatsapp';
import { brandCyan, brandPurple, brandPurpleDark, brandColors, transitions } from './styles';
import { BrainLogoSVG } from './BrainLogo';
import { useVisitorMode, type VisitorMode } from '../context/VisitorModeContext';
import { useLanguage } from '../context/LanguageContext';

// Role-specific contact configurations
interface RoleContactConfig {
  quickMessageEn: string;
  quickMessageAr: string;
  placeholderEn: string;
  placeholderAr: string;
  badgesEn: string[];
  badgesAr: string[];
  headerSubtitleEn: string;
  headerSubtitleAr: string;
}

const ROLE_CONTACT_CONFIG: Record<VisitorMode, RoleContactConfig> = {
  school: {
    quickMessageEn: 'Hello, I would like to inquire about school partnership and screening programs for Berard AIT',
    quickMessageAr: 'مرحباً، أود الاستفسار عن شراكة المدارس وبرامج الفحص لـ Berard AIT',
    placeholderEn: 'Write about partnership inquiry, demo request, or screening program for students...',
    placeholderAr: 'اكتب عن طلب شراكة، عرض تجريبي، أو برنامج فحص للطلاب...',
    badgesEn: ['School Partnership', 'Group Screening'],
    badgesAr: ['شراكة مدرسية', 'فحص جماعي'],
    headerSubtitleEn: 'Ready for school partnerships and group screening coordination',
    headerSubtitleAr: 'جاهزون لشراكات المدارس وتنسيق برامج الفحص الجماعي',
  },
  parent: {
    quickMessageEn: 'Hello, I would like to book a screening for my child for Berard AIT program',
    quickMessageAr: 'مرحباً، أود حجز موعد فحص لطفلي لبرنامج Berard AIT',
    placeholderEn: 'Write about your child\'s condition, goals, or questions...',
    placeholderAr: 'اكتب نبذة عن حالة طفلك، الأهداف، أو استفساراتك...',
    badgesEn: ['Free Consultation', 'Child Assessment'],
    badgesAr: ['استشارة مجانية', 'تقييم الطفل'],
    headerSubtitleEn: 'Ready to support families with personalized care',
    headerSubtitleAr: 'جاهزون لدعم العائلات برعاية شخصية',
  },
  clinician: {
    quickMessageEn: 'Hello, I am a healthcare professional interested in Berard AIT protocols and referral partnership',
    quickMessageAr: 'مرحباً، أنا متخصص في الرعاية الصحية ومهتم ببروتوكولات Berard AIT وشراكة الإحالة',
    placeholderEn: 'Write about professional inquiry, referral process, or clinical collaboration...',
    placeholderAr: 'اكتب عن استفسار مهني، عملية الإحالة، أو التعاون السريري...',
    badgesEn: ['Professional Network', 'Clinical Referrals'],
    badgesAr: ['شبكة مهنية', 'إحالات سريرية'],
    headerSubtitleEn: 'Professional collaboration and clinical referrals',
    headerSubtitleAr: 'تعاون مهني وإحالات سريرية',
  },
};

const normaliseDigits = (value: string) => value.replace(/\D/g, '');

const isValidPhone = (value: string) => {
  const digits = normaliseDigits(value);
  return digits.length >= 9 && digits.length <= 15;
};

const MAX_MESSAGE_LENGTH = 1000;
const MAX_NAME_LENGTH = 100;

// Static styles moved outside component to prevent recreation
const dynamicIslandStyle: React.CSSProperties = {
  position: 'absolute',
  top: 12,
  left: '50%',
  transform: 'translateX(-50%)',
  width: 126,
  height: 37,
  background: '#000',
  borderRadius: 22,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  paddingRight: 12,
  gap: 8,
};

const cameraDotStyle: React.CSSProperties = {
  width: 12,
  height: 12,
  borderRadius: '50%',
  background: 'radial-gradient(circle at 30% 30%, #2a2a3a, #0a0a12)',
  border: '1px solid #1a1a2a',
};

const statusBarStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '8px 28px',
  fontSize: 14,
  fontWeight: 600,
  color: '#fff',
};

const batteryOuterStyle: React.CSSProperties = {
  width: 24,
  height: 11,
  borderRadius: 3,
  border: '1px solid rgba(255,255,255,0.5)',
  padding: 1,
};

const batteryInnerStyle: React.CSSProperties = {
  width: '80%',
  height: '100%',
  background: brandColors.success,
  borderRadius: 1.5,
};

const batteryCapStyle: React.CSSProperties = {
  width: 2,
  height: 5,
  background: 'rgba(255,255,255,0.5)',
  borderRadius: '0 1px 1px 0',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px 16px',
  borderRadius: 12,
  border: 'none',
  background: 'rgba(255,255,255,0.08)',
  color: '#fff',
  fontSize: 16,
  outline: 'none',
};

const textareaStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px 16px',
  borderRadius: 12,
  border: 'none',
  background: 'rgba(255,255,255,0.08)',
  color: '#fff',
  fontSize: 16,
  outline: 'none',
  resize: 'none',
  direction: 'rtl',
  fontFamily: 'inherit',
};

const callWaveCss = `
  @keyframes callWave {
    0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.4; }
    100% { transform: translate(-50%, -50%) scale(1.3); opacity: 0; }
  }
`;

// iOS-style scroll container CSS
const iosScrollCss = `
  .ios-scroll-container {
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
    scrollbar-width: thin;
    scrollbar-color: rgba(255,255,255,0.3) transparent;
  }
  .ios-scroll-container::-webkit-scrollbar {
    width: 4px;
  }
  .ios-scroll-container::-webkit-scrollbar-track {
    background: transparent;
  }
  .ios-scroll-container::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.3);
    border-radius: 4px;
  }
  .ios-scroll-container::-webkit-scrollbar-thumb:hover {
    background: rgba(255,255,255,0.5);
  }
  @keyframes scrollHint {
    0%, 100% { transform: translateY(0); opacity: 0.6; }
    50% { transform: translateY(8px); opacity: 1; }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  @keyframes iphoneGlow {
    0%, 100% { box-shadow: 0 0 0 2px #1a1a1a, 0 50px 100px rgba(0,0,0,0.5), inset 0 0 30px rgba(255,255,255,0.02), 0 0 40px ${brandCyan}15; }
    50% { box-shadow: 0 0 0 2px #1a1a1a, 0 50px 100px rgba(0,0,0,0.5), inset 0 0 30px rgba(255,255,255,0.02), 0 0 60px ${brandCyan}25; }
  }
  @keyframes scanLineContact {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100%); }
  }
  .iphone-frame {
    animation: iphoneGlow 4s ease-in-out infinite;
  }
  .iphone-frame::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 30%;
    background: linear-gradient(180deg, transparent, ${brandCyan}05, transparent);
    animation: scanLineContact 6s linear infinite;
    pointer-events: none;
    border-radius: inherit;
  }
  .contact-input:focus {
    border-color: ${brandCyan} !important;
    box-shadow: 0 0 15px ${brandCyan}30 !important;
  }
  .contact-submit-btn {
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  .contact-submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.3), 0 0 25px ${brandCyan}30;
  }
  .contact-submit-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%);
    transform: translateX(-100%);
  }
  .contact-submit-btn:hover::after {
    animation: scanLineContact 0.8s ease-out;
  }
  @media (max-width: 420px) {
    .iphone-frame {
      max-width: 100% !important;
      min-height: 580px !important;
      border-radius: 44px !important;
      border-width: 6px !important;
    }
    .iphone-screen {
      border-radius: 38px !important;
    }
    .contact-header-text {
      font-size: 20px !important;
    }
    .contact-subtext {
      font-size: 13px !important;
    }
  }
  @media (max-width: 360px) {
    .iphone-frame {
      min-height: 520px !important;
      border-radius: 36px !important;
      border-width: 5px !important;
    }
    .iphone-screen {
      border-radius: 32px !important;
    }
  }
  @media (min-width: 768px) and (max-width: 1023px) {
    .iphone-frame {
      max-width: 360px !important;
      min-height: 700px !important;
    }
  }
  @media (min-width: 1280px) {
    .iphone-frame {
      max-width: 420px !important;
      min-height: 780px !important;
    }
    .contact-header-text {
      font-size: 28px !important;
    }
    .contact-subtext {
      font-size: 16px !important;
    }
  }
`;

// Memoized sub-components
const DynamicIsland = memo(() => (
  <div style={dynamicIslandStyle}>
    <div style={cameraDotStyle} />
  </div>
));
DynamicIsland.displayName = 'DynamicIsland';

const IOSStatusBar = memo(({ time }: { time: string }) => (
  <div style={statusBarStyle}>
    <span>{time}</span>
    <div style={{ width: 126 }} />
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
        <rect x="0" y="8" width="3" height="4" rx="1" fill="#fff" />
        <rect x="4.5" y="5" width="3" height="7" rx="1" fill="#fff" />
        <rect x="9" y="2" width="3" height="10" rx="1" fill="#fff" />
        <rect x="13.5" y="0" width="3" height="12" rx="1" fill="#fff" />
      </svg>
      <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
        <path d="M8 3C10.8 3 13.3 4.1 15 6L13.5 7.5C12.2 6.2 10.2 5.3 8 5.3C5.8 5.3 3.8 6.2 2.5 7.5L1 6C2.7 4.1 5.2 3 8 3Z" fill="#fff"/>
        <path d="M8 6.5C9.9 6.5 11.6 7.2 12.8 8.4L11.3 9.9C10.5 9.1 9.3 8.6 8 8.6C6.7 8.6 5.5 9.1 4.7 9.9L3.2 8.4C4.4 7.2 6.1 6.5 8 6.5Z" fill="#fff"/>
        <circle cx="8" cy="11" r="1.5" fill="#fff"/>
      </svg>
      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <div style={batteryOuterStyle}>
          <div style={batteryInnerStyle} />
        </div>
        <div style={batteryCapStyle} />
      </div>
    </div>
  </div>
));
IOSStatusBar.displayName = 'IOSStatusBar';

const CallActionButton = memo(({
  icon,
  label,
  color = 'rgba(255,255,255,0.1)',
  onClick,
  disabled = false,
}: {
  icon: React.ReactNode;
  label: string;
  color?: string;
  onClick?: () => void;
  disabled?: boolean;
}) => {
  const buttonStyle = useMemo<React.CSSProperties>(() => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    background: 'transparent',
    border: 'none',
    cursor: disabled ? 'default' : 'pointer',
    opacity: disabled ? 0.5 : 1,
  }), [disabled]);

  const iconContainerStyle = useMemo<React.CSSProperties>(() => ({
    width: 60,
    height: 60,
    borderRadius: '50%',
    background: color,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    transition: 'transform 0.2s ease',
  }), [color]);

  return (
    <button onClick={onClick} disabled={disabled} style={buttonStyle}>
      <div style={iconContainerStyle}>{icon}</div>
      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{label}</span>
    </button>
  );
});
CallActionButton.displayName = 'CallActionButton';

const IOSInput = memo(({
  value,
  onChange,
  placeholder,
  type = 'text',
  dir = 'rtl',
  maxLength,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  dir?: 'rtl' | 'ltr';
  maxLength?: number;
}) => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(maxLength ? e.target.value.slice(0, maxLength) : e.target.value);
  }, [onChange, maxLength]);

  const style = useMemo<React.CSSProperties>(() => ({
    ...inputStyle,
    direction: dir,
  }), [dir]);

  return (
    <input
      type={type}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      dir={dir}
      maxLength={maxLength}
      style={style}
    />
  );
});
IOSInput.displayName = 'IOSInput';

const IOSTextarea = memo(({
  value,
  onChange,
  placeholder,
  maxLength,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  maxLength?: number;
}) => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(maxLength ? e.target.value.slice(0, maxLength) : e.target.value);
  }, [onChange, maxLength]);

  return (
    <div style={{ position: 'relative' }}>
      <textarea
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={4}
        style={textareaStyle}
      />
      {maxLength && (
        <span style={{ position: 'absolute', bottom: 8, left: 12, fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
          {value.length}/{maxLength}
        </span>
      )}
    </div>
  );
});
IOSTextarea.displayName = 'IOSTextarea';

const CallWaves = memo(() => {
  const waves = useMemo(() => [1, 2, 3].map((i) => ({
    key: i,
    style: {
      position: 'absolute' as const,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 120 + i * 40,
      height: 120 + i * 40,
      borderRadius: '50%',
      border: `2px solid ${brandCyan}`,
      opacity: 0.3 - i * 0.08,
      animation: `callWave ${1.5 + i * 0.3}s ease-out infinite`,
    },
  })), []);

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {waves.map((wave) => <div key={wave.key} style={wave.style} />)}
      <style>{callWaveCss}</style>
    </div>
  );
});
CallWaves.displayName = 'CallWaves';

// SVG Icons as memoized components to prevent recreation
const EmailIcon = memo(() => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
  </svg>
));
EmailIcon.displayName = 'EmailIcon';

const PhoneIcon = memo(() => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff">
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
  </svg>
));
PhoneIcon.displayName = 'PhoneIcon';

const WhatsAppIcon = memo(({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
));
WhatsAppIcon.displayName = 'WhatsAppIcon';

const MessageIcon = memo(() => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
  </svg>
));
MessageIcon.displayName = 'MessageIcon';

const BackIcon = memo(() => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
  </svg>
));
BackIcon.displayName = 'BackIcon';

const InstagramIcon = memo(() => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
));
InstagramIcon.displayName = 'InstagramIcon';

const LinkedInIcon = memo(() => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
));
LinkedInIcon.displayName = 'LinkedInIcon';

// Scroll progress indicator
const ScrollProgressIndicator = memo(({ progress }: { progress: number }) => (
  <div style={{
    position: 'absolute',
    right: 8,
    top: 70,
    bottom: 60,
    width: 3,
    background: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
    zIndex: 10,
  }}>
    <div style={{
      width: '100%',
      height: `${Math.max(20, 100 - progress * 0.8)}%`,
      background: `linear-gradient(180deg, ${brandCyan}, ${brandPurple})`,
      borderRadius: 2,
      transform: `translateY(${progress}%)`,
      transition: 'transform 0.1s ease-out',
      boxShadow: `0 0 8px ${brandCyan}50`,
    }} />
  </div>
));
ScrollProgressIndicator.displayName = 'ScrollProgressIndicator';

// Scroll hint arrow
const ScrollHintArrow = memo(({ show }: { show: boolean }) => {
  if (!show) return null;
  return (
    <div style={{
      position: 'absolute',
      bottom: 50,
      left: '50%',
      transform: 'translateX(-50%)',
      animation: 'scrollHint 2s ease-in-out infinite',
      zIndex: 10,
      pointerEvents: 'none',
    }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M7 10l5 5 5-5" stroke={brandCyan} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
});
ScrollHintArrow.displayName = 'ScrollHintArrow';

// Form field with animation
const AnimatedFormField = memo(({
  children,
  delay,
}: {
  children: React.ReactNode;
  delay: number;
}) => (
  <div style={{
    animation: `fadeInUp 0.5s ease-out ${delay}s both`,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  }}>
    {children}
  </div>
));
AnimatedFormField.displayName = 'AnimatedFormField';

const ContactForm = () => {
  const { mode: visitorMode, config: visitorConfig } = useVisitorMode();
  const { isArabic } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const scrollRef = useRef<HTMLFormElement>(null);

  // Get role-specific contact config
  const roleConfig = ROLE_CONTACT_CONFIG[visitorMode];

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }));
    };
    updateTime();
    // Update every minute instead of every second for performance
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Scroll tracking for progress indicator
  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const maxScroll = scrollHeight - clientHeight;
      const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
      setScrollProgress(progress);
      if (scrollTop > 10) {
        setShowScrollHint(false);
      }
    }
  }, []);

  // Reset scroll hint when form opens
  useEffect(() => {
    if (showForm) {
      setShowScrollHint(true);
      setScrollProgress(0);
    }
  }, [showForm]);

  const requiredValid = useMemo(() =>
    name.trim().length > 1 &&
    name.trim().length <= MAX_NAME_LENGTH &&
    message.trim().length > 4 &&
    message.length <= MAX_MESSAGE_LENGTH &&
    isValidPhone(phone),
  [name, message, phone]);

  const onSubmit = useCallback((event: FormEvent) => {
    event.preventDefault();
    if (!requiredValid) return;
    const details = `الاسم: ${name}\nرقم الهاتف: ${phone}\nالبريد الإلكتروني: ${email || '—'}\n\nالرسالة:\n${message}`;
    handleWhatsApp(details);
    setSubmitted(true);
  }, [requiredValid, name, phone, email, message]);

  const handleQuickWhatsApp = useCallback(() => {
    const quickMessage = isArabic ? roleConfig.quickMessageAr : roleConfig.quickMessageEn;
    handleWhatsApp(quickMessage);
    setSubmitted(true);
  }, [isArabic, roleConfig]);

  const handleEmailClick = useCallback(() => {
    window.open(`mailto:${CLINIC.email}`);
  }, []);

  const handleInstagramClick = useCallback(() => {
    window.open(CLINIC.socials.instagram, '_blank');
  }, []);

  const handleReset = useCallback(() => setSubmitted(false), []);
  const handleShowForm = useCallback(() => setShowForm(true), []);
  const handleHideForm = useCallback(() => setShowForm(false), []);

  // Memoized styles
  const sectionStyle = useMemo<React.CSSProperties>(() => ({
    scrollMarginTop: 92,
    marginBottom: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 20,
  }), []);

  const headerStyle = useMemo<React.CSSProperties>(() => ({
    margin: '0 0 8px',
    fontSize: 24,
    background: `linear-gradient(135deg, ${brandPurple}, ${brandCyan})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  }), []);

  const iPhoneFrameStyle = useMemo<React.CSSProperties>(() => ({
    width: '100%',
    maxWidth: 390,
    aspectRatio: '390/844',
    minHeight: 640,
    background: 'linear-gradient(180deg, #1c1c1e 0%, #000000 100%)',
    borderRadius: 55,
    border: '8px solid #2c2c2e',
    boxShadow: '0 0 0 2px #1a1a1a, 0 50px 100px rgba(0,0,0,0.5), inset 0 0 30px rgba(255,255,255,0.02)',
    position: 'relative',
    overflow: 'hidden',
  }), []);

  const screenStyle = useMemo<React.CSSProperties>(() => ({
    position: 'absolute',
    inset: 4,
    borderRadius: 48,
    overflow: 'hidden',
    background: submitted
      ? `linear-gradient(180deg, ${brandPurpleDark} 0%, #1a1a2e 50%, #0a0a14 100%)`
      : 'linear-gradient(180deg, #2d2d35 0%, #1c1c1e 30%, #0a0a0e 100%)',
  }), [submitted]);

  const submitButtonStyle = useMemo<React.CSSProperties>(() => ({
    width: '100%',
    padding: '16px',
    borderRadius: 14,
    border: 'none',
    background: requiredValid ? brandColors.whatsapp : 'rgba(255,255,255,0.1)',
    color: requiredValid ? '#fff' : 'rgba(255,255,255,0.4)',
    fontSize: 17,
    fontWeight: 600,
    cursor: requiredValid ? 'pointer' : 'not-allowed',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  }), [requiredValid]);

  return (
    <section id="contact" style={sectionStyle}>
      <style>{iosScrollCss}</style>
      <div style={{ textAlign: 'center', maxWidth: 500, padding: '0 16px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 12px',
          background: `${visitorConfig.color}15`,
          border: `1px solid ${visitorConfig.color}30`,
          borderRadius: 20,
          marginBottom: 12,
          fontSize: 11,
          fontWeight: 700,
          color: visitorConfig.color,
        }}>
          {visitorConfig.icon} {isArabic ? visitorConfig.labelAr : visitorConfig.label}
        </div>
        <h2 className="contact-header-text" style={headerStyle}>{isArabic ? 'تواصل معنا' : 'Contact Us'}</h2>
        <p className="contact-subtext" style={{ margin: 0, opacity: 0.7, fontSize: 14, lineHeight: 1.6 }}>
          {isArabic ? roleConfig.headerSubtitleAr : roleConfig.headerSubtitleEn}
        </p>
      </div>

      <div className="iphone-frame" style={iPhoneFrameStyle}>
        <div className="iphone-screen" style={screenStyle}>
          <DynamicIsland />
          <IOSStatusBar time={currentTime} />

          {submitted ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', height: 'calc(100% - 50px)', padding: '60px 20px 40px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                <div style={{ position: 'relative', width: 120, height: 120 }}>
                  <CallWaves />
                  <div style={{ width: 120, height: 120, borderRadius: '50%', background: `linear-gradient(135deg, ${brandPurple}, ${brandCyan})`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
                    <BrainLogoSVG size={80} />
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <h3 style={{ margin: '0 0 4px', fontSize: 28, fontWeight: 400, color: '#fff' }}>Berard AIT</h3>
                  <p style={{ margin: 0, fontSize: 18, color: brandCyan }}>جاري الاتصال عبر WhatsApp...</p>
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 16, padding: '16px 24px', textAlign: 'center', width: '100%', maxWidth: 300 }}>
                <p style={{ margin: '0 0 8px', fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>تم فتح WhatsApp</p>
                <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.5)', direction: 'ltr' }}>{CLINIC.whatsapp}</p>
              </div>

              <div style={{ display: 'flex', gap: 40, marginTop: 20 }}>
                <CallActionButton icon={<EmailIcon />} label="البريد" onClick={handleEmailClick} />
                <CallActionButton icon={<PhoneIcon />} label="إعادة" color={brandColors.success} onClick={handleReset} />
                <CallActionButton icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.55 0 1-.45 1-1v-1c0-.35-.19-.68-.49-.86-.31-.18-.69-.2-1.01-.05-1.09.52-2.37.75-3.71.51-2.73-.5-4.93-2.72-5.42-5.45C1.84 9.32 5.12 5 10 5c3.87 0 7 3.13 7 7-1.1 0-2 .9-2 2v2.5c0 .27.22.5.5.5s.5-.22.5-.5V14c0-.55.45-1 1-1h2c.55 0 1-.45 1-1 0-5.52-4.48-10-10-10z"/></svg>} label="Instagram" onClick={handleInstagramClick} />
              </div>

              <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
                إذا لم يُفتح التطبيق، تأكد من السماح بالنوافذ المنبثقة
              </p>
            </div>
          ) : showForm ? (
            <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100% - 50px)', position: 'relative' }}>

              {/* Header with back button */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '60px 16px 16px',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                background: 'linear-gradient(180deg, rgba(45,45,53,0.95) 0%, rgba(28,28,30,0.95) 100%)',
                backdropFilter: 'blur(10px)',
                position: 'relative',
                zIndex: 5,
              }}>
                <button onClick={handleHideForm} style={{ background: 'transparent', border: 'none', color: brandCyan, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <BackIcon />رجوع
                </button>
                <span style={{ fontSize: 17, fontWeight: 600 }}>رسالة جديدة</span>
                <div style={{ width: 60 }} />
              </div>

              {/* Scroll progress indicator */}
              <ScrollProgressIndicator progress={scrollProgress} />

              {/* Scroll hint */}
              <ScrollHintArrow show={showScrollHint} />

              {/* Scrollable form */}
              <form
                ref={scrollRef}
                onSubmit={onSubmit}
                onScroll={handleScroll}
                className="ios-scroll-container"
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '20px 16px 16px',
                  gap: 16,
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  position: 'relative',
                }}
              >
                {/* Top fade gradient */}
                <div style={{
                  position: 'sticky',
                  top: -20,
                  left: 0,
                  right: 0,
                  height: 20,
                  background: 'linear-gradient(180deg, rgba(28,28,30,1) 0%, transparent 100%)',
                  marginTop: -20,
                  marginBottom: 4,
                  pointerEvents: 'none',
                  zIndex: 2,
                }} />

                <AnimatedFormField delay={0}>
                  <label style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', paddingRight: 4 }}>الاسم الكامل *</label>
                  <IOSInput value={name} onChange={setName} placeholder="أدخل اسمك" maxLength={MAX_NAME_LENGTH} />
                </AnimatedFormField>

                <AnimatedFormField delay={0.1}>
                  <label style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', paddingRight: 4 }}>رقم WhatsApp *</label>
                  <IOSInput value={phone} onChange={setPhone} placeholder="+971 XX XXX XXXX" type="tel" dir="ltr" />
                  {phone && !isValidPhone(phone) && (
                    <span style={{ fontSize: 12, color: brandColors.error, paddingRight: 4 }}>أدخل رقم صحيح (9–15 رقم)</span>
                  )}
                </AnimatedFormField>

                <AnimatedFormField delay={0.2}>
                  <label style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', paddingRight: 4 }}>البريد الإلكتروني (اختياري)</label>
                  <IOSInput value={email} onChange={setEmail} placeholder="email@example.com" type="email" dir="ltr" />
                </AnimatedFormField>

                <AnimatedFormField delay={0.3}>
                  <label style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', paddingRight: 4 }}>{isArabic ? 'الرسالة *' : 'Message *'}</label>
                  <IOSTextarea value={message} onChange={setMessage} placeholder={isArabic ? roleConfig.placeholderAr : roleConfig.placeholderEn} maxLength={MAX_MESSAGE_LENGTH} />
                </AnimatedFormField>

                {/* Spacer to ensure scrollability */}
                <div style={{ flex: 1, minHeight: 20 }} />

                {/* Submit button with animation */}
                <div style={{
                  animation: 'fadeInUp 0.5s ease-out 0.4s both',
                  position: 'sticky',
                  bottom: 0,
                  background: 'linear-gradient(180deg, transparent 0%, rgba(10,10,14,0.95) 20%)',
                  paddingTop: 16,
                  paddingBottom: 8,
                  marginBottom: -16,
                }}>
                  <button
                    type="submit"
                    disabled={!requiredValid}
                    style={{
                      ...submitButtonStyle,
                      animation: requiredValid ? 'pulse 2s ease-in-out infinite' : 'none',
                    }}
                  >
                    <WhatsAppIcon size={22} />
                    إرسال عبر WhatsApp
                  </button>

                  {/* Progress indicator text */}
                  <p style={{
                    textAlign: 'center',
                    fontSize: 11,
                    color: 'rgba(255,255,255,0.4)',
                    marginTop: 8,
                    marginBottom: 0,
                  }}>
                    {requiredValid ? '✓ جاهز للإرسال' : 'أكمل الحقول المطلوبة للمتابعة'}
                  </p>
                </div>
              </form>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', height: 'calc(100% - 50px)', padding: '60px 20px 40px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 100, height: 100, borderRadius: '50%', background: `linear-gradient(135deg, ${brandPurple}, ${brandCyan})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 40px ${brandPurple}50` }}>
                  <BrainLogoSVG size={70} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <h3 style={{ margin: '0 0 4px', fontSize: 26, fontWeight: 400, color: '#fff' }}>Berard AIT</h3>
                  <p style={{ margin: 0, fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>{isArabic ? 'معمل الصوت' : 'Sound Lab'} • {CLINIC.city}</p>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                  <span style={{ background: brandColors.whatsappLight, color: brandColors.whatsapp, padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>WhatsApp {isArabic ? 'متاح' : 'Available'}</span>
                  {(isArabic ? roleConfig.badgesAr : roleConfig.badgesEn).map((badge, idx) => (
                    <span key={idx} style={{
                      background: `${visitorConfig.color}15`,
                      color: visitorConfig.color,
                      padding: '6px 12px',
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 600,
                    }}>{badge}</span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: 30, width: '100%' }}>
                <CallActionButton icon={<MessageIcon />} label="رسالة" color="rgba(255,255,255,0.12)" onClick={handleShowForm} />
                <CallActionButton icon={<WhatsAppIcon />} label="WhatsApp" color={brandColors.whatsapp} onClick={handleQuickWhatsApp} />
                <CallActionButton icon={<EmailIcon />} label="البريد" color="rgba(255,255,255,0.12)" onClick={handleEmailClick} />
              </div>

              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: 16, width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={brandCyan}><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>الهاتف</p>
                    <p style={{ margin: 0, fontSize: 15, direction: 'ltr', textAlign: 'right' }}>{CLINIC.whatsapp}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={brandCyan}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>الموقع</p>
                    <p style={{ margin: 0, fontSize: 15 }}>{CLINIC.city}</p>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 16 }}>
                <a href={CLINIC.socials.instagram} target="_blank" rel="noreferrer" style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                  <InstagramIcon />
                </a>
                <a href={CLINIC.socials.linkedin} target="_blank" rel="noreferrer" style={{ width: 44, height: 44, borderRadius: '50%', background: brandColors.linkedin, display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                  <LinkedInIcon />
                </a>
              </div>

              <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.35)', textAlign: 'center' }}>
                اضغط على "رسالة" لتعبئة نموذج مفصل
              </p>
            </div>
          )}

          <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', width: 134, height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.3)' }} />
        </div>
      </div>
    </section>
  );
};

export default memo(ContactForm);
