import { memo } from 'react';
import { brandCyan, brandPurple, logoPalette } from './styles';
import { useLanguage } from '../context/LanguageContext';
import { assetUrl } from '../utils/asset';

interface BrainLogoProps {
  size?: number;
  showText?: boolean;
  textSize?: number;
}

// Half organic brain, half circuit board - AI brain design
export const BrainLogoSVG = memo(({ size = 50, animated = false }: { size?: number; animated?: boolean }) => {
  const uniqueId = `brain-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Glow filter for circuit nodes */}
        <filter id={`${uniqueId}-glow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        {/* Clip path for left hemisphere */}
        <clipPath id={`${uniqueId}-leftClip`}>
          <rect x="0" y="0" width="50" height="100" />
        </clipPath>

        {/* Clip path for right hemisphere */}
        <clipPath id={`${uniqueId}-rightClip`}>
          <rect x="50" y="0" width="50" height="100" />
        </clipPath>
      </defs>

      {/* ========== LEFT HEMISPHERE - ORGANIC BRAIN ========== */}
      <g clipPath={`url(#${uniqueId}-leftClip)`}>
        {/* Brain shape - left side */}
        <path
          d="M50 12
             C42 10 32 12 25 18
             C18 24 14 32 12 42
             C10 52 12 62 16 70
             C20 78 28 84 38 86
             C44 87 48 86 50 85
             L50 12Z"
          fill={brandCyan}
        />

        {/* Organic brain folds/gyri */}
        <g stroke={logoPalette.circuitStroke} strokeWidth="2" fill="none" strokeLinecap="round">
          {/* Top lobe curves */}
          <path d="M18 28 Q28 22 38 26 Q46 28 50 32" />
          <path d="M16 38 Q26 34 36 36 Q44 38 50 42" />

          {/* Middle curves */}
          <path d="M14 50 Q24 46 34 48 Q42 50 50 54" />
          <path d="M16 62 Q26 58 36 60 Q44 62 50 66" />

          {/* Bottom curves */}
          <path d="M22 74 Q32 70 42 73 Q47 76 50 78" />
        </g>

        {/* Detailed fold accents */}
        <g stroke={logoPalette.circuitStroke} strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.6">
          <path d="M22 32 Q30 30 38 33" />
          <path d="M20 44 Q28 42 36 44" />
          <path d="M18 56 Q26 54 34 56" />
          <path d="M24 68 Q32 66 40 68" />
        </g>

        {/* Highlight on organic brain */}
        <ellipse cx="32" cy="35" rx="10" ry="6" fill="rgba(255,255,255,0.15)" />
      </g>

      {/* ========== RIGHT HEMISPHERE - CIRCUIT BOARD ========== */}
      <g clipPath={`url(#${uniqueId}-rightClip)`}>
        {/* Brain shape - right side (slightly darker for contrast) */}
        <path
          d="M50 12
             C58 10 68 12 75 18
             C82 24 86 32 88 42
             C90 52 88 62 84 70
             C80 78 72 84 62 86
             C56 87 52 86 50 85
             L50 12Z"
          fill={logoPalette.circuitFill}
        />

        {/* Circuit board grid lines */}
        <g stroke={brandCyan} strokeWidth="0.5" fill="none" opacity="0.3">
          {/* Horizontal lines */}
          <line x1="50" y1="20" x2="85" y2="20" />
          <line x1="50" y1="30" x2="88" y2="30" />
          <line x1="50" y1="40" x2="89" y2="40" />
          <line x1="50" y1="50" x2="90" y2="50" />
          <line x1="50" y1="60" x2="89" y2="60" />
          <line x1="50" y1="70" x2="86" y2="70" />
          <line x1="50" y1="80" x2="78" y2="80" />

          {/* Vertical lines */}
          <line x1="60" y1="15" x2="60" y2="85" />
          <line x1="70" y1="18" x2="70" y2="82" />
          <line x1="80" y1="25" x2="80" y2="75" />
        </g>

        {/* Main circuit traces */}
        <g stroke={brandCyan} strokeWidth="1.5" fill="none" strokeLinecap="round">
          {/* Primary data paths */}
          <path d="M50 25 L62 25 L62 35 L75 35">
            {animated && <animate attributeName="stroke-dasharray" values="0,100;50,50;100,0" dur="2s" repeatCount="indefinite" />}
          </path>
          <path d="M50 45 L58 45 L58 55 L70 55 L70 45 L82 45">
            {animated && <animate attributeName="stroke-dasharray" values="0,100;50,50;100,0" dur="2.5s" repeatCount="indefinite" />}
          </path>
          <path d="M50 65 L65 65 L65 75 L78 75">
            {animated && <animate attributeName="stroke-dasharray" values="0,100;50,50;100,0" dur="1.8s" repeatCount="indefinite" />}
          </path>

          {/* Secondary paths */}
          <path d="M75 35 L75 50 L85 50" strokeWidth="1">
            {animated && <animate attributeName="stroke-dasharray" values="0,60;30,30;60,0" dur="1.5s" repeatCount="indefinite" />}
          </path>
          <path d="M70 55 L70 68 L58 68" strokeWidth="1">
            {animated && <animate attributeName="stroke-dasharray" values="0,60;30,30;60,0" dur="1.7s" repeatCount="indefinite" />}
          </path>
        </g>

        {/* Circuit nodes/chips with glow */}
        <g filter={`url(#${uniqueId}-glow)`}>
          {/* Main processor nodes */}
          <rect x="72" y="32" width="6" height="6" rx="1" fill={brandCyan}>
            {animated && <animate attributeName="opacity" values="1;0.5;1" dur="1.2s" repeatCount="indefinite" />}
          </rect>
          <rect x="79" y="47" width="8" height="6" rx="1" fill={brandCyan}>
            {animated && <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite" />}
          </rect>
          <rect x="75" y="72" width="6" height="6" rx="1" fill={brandCyan}>
            {animated && <animate attributeName="opacity" values="1;0.6;1" dur="1.3s" repeatCount="indefinite" />}
          </rect>

          {/* Junction nodes */}
          <circle cx="62" cy="25" r="2.5" fill={brandCyan}>
            {animated && <animate attributeName="r" values="2.5;3;2.5" dur="1s" repeatCount="indefinite" />}
          </circle>
          <circle cx="62" cy="35" r="2" fill={brandCyan}>
            {animated && <animate attributeName="opacity" values="1;0.4;1" dur="0.8s" repeatCount="indefinite" />}
          </circle>
          <circle cx="58" cy="45" r="2" fill={brandCyan}>
            {animated && <animate attributeName="opacity" values="0.4;1;0.4" dur="1.1s" repeatCount="indefinite" />}
          </circle>
          <circle cx="70" cy="55" r="2.5" fill={brandCyan}>
            {animated && <animate attributeName="r" values="2.5;3;2.5" dur="1.2s" repeatCount="indefinite" />}
          </circle>
          <circle cx="65" cy="65" r="2" fill={brandCyan}>
            {animated && <animate attributeName="opacity" values="1;0.5;1" dur="0.9s" repeatCount="indefinite" />}
          </circle>
          <circle cx="65" cy="75" r="2" fill={brandCyan}>
            {animated && <animate attributeName="opacity" values="0.5;1;0.5" dur="1.4s" repeatCount="indefinite" />}
          </circle>
        </g>

        {/* Small connector dots */}
        <g fill={brandCyan} opacity="0.6">
          <circle cx="55" cy="25" r="1" />
          <circle cx="68" cy="35" r="1" />
          <circle cx="82" cy="45" r="1" />
          <circle cx="55" cy="55" r="1" />
          <circle cx="75" cy="65" r="1" />
          <circle cx="58" cy="75" r="1" />
        </g>

        {/* Data flow pulses */}
        {animated && (
          <g fill={brandCyan}>
            <circle cx="58" cy="25" r="1.5">
              <animate attributeName="cx" values="50;62;75" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="54" cy="45" r="1.5">
              <animate attributeName="cx" values="50;70;82" dur="2.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;1;0" dur="2.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="56" cy="65" r="1.5">
              <animate attributeName="cx" values="50;65;78" dur="1.8s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;1;0" dur="1.8s" repeatCount="indefinite" />
            </circle>
          </g>
        )}
      </g>

      {/* ========== CENTER DIVIDING LINE ========== */}
      <line
        x1="50" y1="12" x2="50" y2="85"
        stroke="rgba(143,211,204,0.4)"
        strokeWidth="1"
      />

      {/* Connection points between organic and digital */}
      <g filter={`url(#${uniqueId}-glow)`}>
        <circle cx="50" cy="25" r="2.5" fill={brandCyan}>
          {animated && <animate attributeName="opacity" values="1;0.4;1" dur="1s" repeatCount="indefinite" />}
        </circle>
        <circle cx="50" cy="45" r="3" fill={brandCyan}>
          {animated && <animate attributeName="r" values="3;4;3" dur="1.2s" repeatCount="indefinite" />}
        </circle>
        <circle cx="50" cy="65" r="2.5" fill={brandCyan}>
          {animated && <animate attributeName="opacity" values="0.5;1;0.5" dur="0.9s" repeatCount="indefinite" />}
        </circle>
      </g>

      {/* Brain stem at bottom */}
      <path
        d="M44 82 Q50 92 50 96 Q50 92 56 82"
        fill={logoPalette.circuitStroke}
        stroke={brandCyan}
        strokeWidth="0.5"
      />
    </svg>
  );
});
BrainLogoSVG.displayName = 'BrainLogoSVG';

const BrainLogo = memo(({ size = 50, showText = true, textSize = 22 }: BrainLogoProps) => {
  const { isArabic, direction, t } = useLanguage();
  const logoSrc = assetUrl('assets/images/sound_lab_logo.png');

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, direction }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: 14,
          background: 'rgba(11,15,28,0.8)',
          border: '1px solid rgba(143,211,204,0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        <img
          src={logoSrc}
          alt={t('auto.BrainLogo.k1', "Sound Lab logo")}
          width={size}
          height={size}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            filter: 'drop-shadow(0 0 12px rgba(143,211,204,0.25))',
          }}
        />
      </div>
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <div style={{
            fontSize: textSize,
            fontWeight: 900,
            letterSpacing: 1,
            lineHeight: 1.1,
          }}>
            <span style={{ color: brandPurple }}>Berard</span>{' '}
            <span style={{ color: brandCyan }}>AIT</span>
          </div>
          <div style={{
            fontSize: textSize * 0.45,
            color: 'rgba(255,255,255,0.5)',
            letterSpacing: 0.5,
          }}>
            {t('auto.BrainLogo.k2', "Sound Lab")}
          </div>
        </div>
      )}
    </div>
  );
});
BrainLogo.displayName = 'BrainLogo';

export default BrainLogo;
