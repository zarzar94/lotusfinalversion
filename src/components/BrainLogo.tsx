import { memo } from 'react';
import { brandCyan, brandPurple } from './styles';

interface BrainLogoProps {
  size?: number;
  showText?: boolean;
  textSize?: number;
}

// Realistic brain SVG with neurons and electrical signals
export const BrainLogoSVG = memo(({ size = 50, animated = false }: { size?: number; animated?: boolean }) => {
  const uniqueId = `brain-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <svg width={size} height={size * 0.85} viewBox="0 0 120 102" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Brain gradient - soft purple/lavender */}
        <radialGradient id={`${uniqueId}-brainGrad`} cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#D4B8DC" />
          <stop offset="40%" stopColor="#B896C4" />
          <stop offset="100%" stopColor="#9A72AC" />
        </radialGradient>

        {/* Glow filter for electrical signals */}
        <filter id={`${uniqueId}-glow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        {/* Electric pulse filter */}
        <filter id={`${uniqueId}-electric`} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="1.5" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Brain shadow */}
      <ellipse cx="60" cy="90" rx="35" ry="6" fill="rgba(0,0,0,0.2)" />

      {/* Left Hemisphere */}
      <path
        d="M58 10
           C40 8 25 18 20 32
           C15 46 18 58 22 68
           C26 78 38 85 50 84
           C55 84 58 82 58 82
           L58 10Z"
        fill={`url(#${uniqueId}-brainGrad)`}
      />

      {/* Right Hemisphere */}
      <path
        d="M62 10
           C80 8 95 18 100 32
           C105 46 102 58 98 68
           C94 78 82 85 70 84
           C65 84 62 82 62 82
           L62 10Z"
        fill={`url(#${uniqueId}-brainGrad)`}
      />

      {/* Brain folds/gyri - Left side */}
      <g stroke="#8B6B9A" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7">
        <path d="M25 30 Q35 25 45 28 Q52 30 55 35" />
        <path d="M22 42 Q32 38 42 40 Q50 42 55 48" />
        <path d="M23 54 Q33 50 43 52 Q52 54 56 60" />
        <path d="M28 66 Q38 62 48 65 Q54 68 57 72" />
      </g>

      {/* Brain folds/gyri - Right side */}
      <g stroke="#8B6B9A" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7">
        <path d="M95 30 Q85 25 75 28 Q68 30 65 35" />
        <path d="M98 42 Q88 38 78 40 Q70 42 65 48" />
        <path d="M97 54 Q87 50 77 52 Q68 54 64 60" />
        <path d="M92 66 Q82 62 72 65 Q66 68 63 72" />
      </g>

      {/* Central fissure */}
      <path
        d="M60 12 L60 80"
        stroke="#7A5A8A"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />

      {/* Cerebellum (back of brain) */}
      <ellipse cx="85" cy="75" rx="12" ry="8" fill="#9A72AC" />
      <g stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none">
        <path d="M75 73 Q80 71 85 73 Q90 71 95 73" />
        <path d="M76 76 Q81 74 85 76 Q89 74 94 76" />
        <path d="M77 79 Q82 77 85 79 Q88 77 93 79" />
      </g>

      {/* Brain stem */}
      <path
        d="M55 78 Q60 88 60 95 Q60 88 65 78"
        fill="#9A72AC"
        stroke="#8B6B9A"
        strokeWidth="1"
      />

      {/* NEURON NETWORK - electrical signals */}
      <g filter={`url(#${uniqueId}-electric)`}>
        {/* Left hemisphere neurons */}
        <g stroke={brandCyan} strokeWidth="1.5" fill="none" opacity="0.9">
          {/* Neuron paths with electricity */}
          <path d="M30 35 Q38 32 46 36 L50 40">
            {animated && <animate attributeName="stroke-dasharray" from="0,100" to="100,0" dur="2s" repeatCount="indefinite" />}
          </path>
          <path d="M28 50 Q40 45 48 52 L54 55">
            {animated && <animate attributeName="stroke-dasharray" from="0,100" to="100,0" dur="1.8s" repeatCount="indefinite" />}
          </path>
          <path d="M35 65 Q45 60 52 66 L56 70">
            {animated && <animate attributeName="stroke-dasharray" from="0,100" to="100,0" dur="2.2s" repeatCount="indefinite" />}
          </path>
        </g>

        {/* Right hemisphere neurons */}
        <g stroke={brandCyan} strokeWidth="1.5" fill="none" opacity="0.9">
          <path d="M90 35 Q82 32 74 36 L70 40">
            {animated && <animate attributeName="stroke-dasharray" from="0,100" to="100,0" dur="1.9s" repeatCount="indefinite" />}
          </path>
          <path d="M92 50 Q80 45 72 52 L66 55">
            {animated && <animate attributeName="stroke-dasharray" from="0,100" to="100,0" dur="2.1s" repeatCount="indefinite" />}
          </path>
          <path d="M85 65 Q75 60 68 66 L64 70">
            {animated && <animate attributeName="stroke-dasharray" from="0,100" to="100,0" dur="1.7s" repeatCount="indefinite" />}
          </path>
        </g>

        {/* Cross-brain connections */}
        <path d="M48 42 Q60 38 72 42" stroke={brandCyan} strokeWidth="1.5" fill="none" opacity="0.8">
          {animated && <animate attributeName="stroke-dasharray" from="0,60" to="60,0" dur="1.5s" repeatCount="indefinite" />}
        </path>
        <path d="M52 58 Q60 54 68 58" stroke={brandCyan} strokeWidth="1.5" fill="none" opacity="0.8">
          {animated && <animate attributeName="stroke-dasharray" from="0,60" to="60,0" dur="1.6s" repeatCount="indefinite" />}
        </path>
      </g>

      {/* Neuron nodes (synapses) with electric glow */}
      <g filter={`url(#${uniqueId}-glow)`}>
        {/* Left side nodes */}
        <circle cx="30" cy="35" r="3" fill={brandCyan}>
          {animated && <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite" />}
        </circle>
        <circle cx="28" cy="50" r="2.5" fill={brandCyan}>
          {animated && <animate attributeName="opacity" values="0.4;1;0.4" dur="1.8s" repeatCount="indefinite" />}
        </circle>
        <circle cx="35" cy="65" r="2" fill={brandCyan}>
          {animated && <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />}
        </circle>

        {/* Right side nodes */}
        <circle cx="90" cy="35" r="3" fill={brandCyan}>
          {animated && <animate attributeName="opacity" values="0.5;1;0.5" dur="1.6s" repeatCount="indefinite" />}
        </circle>
        <circle cx="92" cy="50" r="2.5" fill={brandCyan}>
          {animated && <animate attributeName="opacity" values="1;0.4;1" dur="1.9s" repeatCount="indefinite" />}
        </circle>
        <circle cx="85" cy="65" r="2" fill={brandCyan}>
          {animated && <animate attributeName="opacity" values="0.4;1;0.4" dur="1.7s" repeatCount="indefinite" />}
        </circle>

        {/* Central auditory processing nodes */}
        <circle cx="50" cy="40" r="4" fill={brandCyan}>
          {animated && <animate attributeName="r" values="4;5;4" dur="1s" repeatCount="indefinite" />}
        </circle>
        <circle cx="70" cy="40" r="4" fill={brandCyan}>
          {animated && <animate attributeName="r" values="4;5;4" dur="1.1s" repeatCount="indefinite" />}
        </circle>
        <circle cx="60" cy="55" r="5" fill={brandCyan}>
          {animated && <animate attributeName="r" values="5;6;5" dur="0.9s" repeatCount="indefinite" />}
        </circle>
      </g>

      {/* Electric sparks/pulses */}
      <g fill={brandCyan} opacity="0.7">
        <circle cx="42" cy="38" r="1.5">
          {animated && <animate attributeName="opacity" values="0;1;0" dur="0.8s" repeatCount="indefinite" />}
        </circle>
        <circle cx="78" cy="38" r="1.5">
          {animated && <animate attributeName="opacity" values="0;1;0" dur="0.9s" repeatCount="indefinite" begin="0.3s" />}
        </circle>
        <circle cx="55" cy="48" r="1.5">
          {animated && <animate attributeName="opacity" values="0;1;0" dur="0.7s" repeatCount="indefinite" begin="0.1s" />}
        </circle>
        <circle cx="65" cy="48" r="1.5">
          {animated && <animate attributeName="opacity" values="0;1;0" dur="0.85s" repeatCount="indefinite" begin="0.2s" />}
        </circle>
        <circle cx="60" cy="68" r="1.5">
          {animated && <animate attributeName="opacity" values="0;1;0" dur="0.75s" repeatCount="indefinite" begin="0.4s" />}
        </circle>
      </g>

      {/* Highlight on top of brain */}
      <ellipse cx="45" cy="22" rx="15" ry="8" fill="rgba(255,255,255,0.15)" />
      <ellipse cx="75" cy="22" rx="15" ry="8" fill="rgba(255,255,255,0.15)" />
    </svg>
  );
});
BrainLogoSVG.displayName = 'BrainLogoSVG';

const BrainLogo = memo(({ size = 50, showText = true, textSize = 22 }: BrainLogoProps) => {
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
        <BrainLogoSVG size={size * 0.85} animated />
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
});
BrainLogo.displayName = 'BrainLogo';

export default BrainLogo;
