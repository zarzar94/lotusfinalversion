import { brandCyan, brandPurple } from './styles';

interface BrainLogoProps {
  size?: number;
  showText?: boolean;
  textSize?: number;
}

// SVG Brain Logo matching the exact design - purple brain with cyan auditory center
export const BrainLogoSVG = ({ size = 50 }: { size?: number }) => (
  <svg width={size} height={size * 0.75} viewBox="0 0 100 75" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Brain gradient */}
    <defs>
      <radialGradient id="logoGradient" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stopColor="#C9A8D2" />
        <stop offset="50%" stopColor="#AF84BA" />
        <stop offset="100%" stopColor="#9A6FA8" />
      </radialGradient>
      <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="1" result="glow"/>
        <feMerge>
          <feMergeNode in="glow"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    {/* Main brain shape */}
    <path
      d="M20 37
         Q15 25 25 17 Q35 10 45 12 Q50 13 50 13
         Q50 13 55 12 Q65 10 75 17 Q85 25 80 37
         Q88 45 80 55 Q73 65 60 62 Q50 61 50 61
         Q50 61 40 62 Q27 65 20 55 Q12 45 20 37Z"
      fill="url(#logoGradient)"
      filter="url(#logoGlow)"
    />

    {/* Neural lines - white */}
    <g stroke="rgba(255,255,255,0.8)" strokeWidth="1" fill="none" strokeLinecap="round">
      <path d="M23 32 Q30 27 38 28 Q42 28 44 34" />
      <path d="M22 40 Q30 36 40 38 Q44 39 46 45" />
      <path d="M25 50 Q35 46 42 50 Q47 53 48 57" />
      <path d="M77 32 Q70 27 62 28 Q58 28 56 34" />
      <path d="M78 40 Q70 36 60 38 Q56 39 54 45" />
      <path d="M75 50 Q65 46 58 50 Q53 53 52 57" />
    </g>

    {/* Cerebellum */}
    <ellipse cx="73" cy="58" rx="9" ry="6" fill="#9A6FA8" opacity="0.9" />
    <g stroke="rgba(255,255,255,0.7)" strokeWidth="0.7" fill="none">
      <path d="M65 57 Q69 55 73 57 Q77 55 81 57" />
      <path d="M66 60 Q70 58 73 60 Q76 58 80 60" />
    </g>

    {/* Auditory center - cyan */}
    <rect x="48" y="10" width="4" height="20" rx="2" fill={brandCyan} />
    <circle cx="50" cy="36" r="10" fill={brandCyan} />
    <circle cx="50" cy="36" r="7" fill="rgba(255,255,255,0.2)" />
    <circle cx="50" cy="36" r="4" fill="rgba(255,255,255,0.15)" />
    <circle cx="50" cy="36" r="12" stroke={brandCyan} strokeWidth="1" fill="none" opacity="0.4" />
  </svg>
);

const BrainLogo = ({ size = 50, showText = true, textSize = 22 }: BrainLogoProps) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: 14,
          background: 'rgba(11,15,28,0.6)',
          border: '1px solid rgba(143,211,204,0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        <BrainLogoSVG size={size * 0.8} />
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
            Sound Lab
          </div>
        </div>
      )}
    </div>
  );
};

export default BrainLogo;
