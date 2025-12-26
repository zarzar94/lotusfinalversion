import type { CSSProperties, ReactNode } from 'react';

import {
  brandCyan,
  brandPink,
  brandPurple,
  colors,
  labTech,
  radius,
  shadows,
  spacing,
  transitions,
} from '../styles';

type LabCardTone = 'neutral' | 'cyan' | 'purple' | 'pink' | 'success' | 'warning' | 'error';
type LabCardVariant = 'surface' | 'glass' | 'panel';

type LabCardProps = {
  children: ReactNode;
  tone?: LabCardTone;
  variant?: LabCardVariant;
  padding?: number;
  style?: CSSProperties;
  className?: string;
  onClick?: () => void;
};

const toneColorMap: Record<LabCardTone, string> = {
  neutral: colors.border.default,
  cyan: brandCyan,
  purple: brandPurple,
  pink: brandPink,
  success: colors.success,
  warning: colors.warning,
  error: colors.error,
};

const variantBackground: Record<LabCardVariant, string> = {
  surface: colors.surface.card,
  glass: labTech.backgrounds.glass,
  panel: labTech.backgrounds.card,
};

export default function LabCard({
  children,
  tone = 'neutral',
  variant = 'surface',
  padding = spacing[5],
  style,
  className,
  onClick,
}: LabCardProps) {
  const toneColor = toneColorMap[tone];
  const borderColor = tone === 'neutral' ? colors.border.default : `${toneColor}33`;
  const boxShadow = tone === 'neutral'
    ? shadows.lg
    : `0 18px 48px ${toneColor}1A`;

  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        padding,
        borderRadius: radius.xl,
        background: variantBackground[variant],
        border: `1px solid ${borderColor}`,
        boxShadow,
        backdropFilter: variant === 'glass' ? 'blur(14px)' : 'none',
        transition: transitions.normal,
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
