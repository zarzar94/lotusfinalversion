import type { CSSProperties, ReactNode } from 'react';

import {
  brandCyan,
  brandPink,
  brandPurple,
  colors,
  radius,
  spacing,
  typography,
} from '../styles';

type LabPillTone = 'neutral' | 'cyan' | 'purple' | 'pink' | 'success' | 'warning' | 'error';

type LabPillProps = {
  children: ReactNode;
  tone?: LabPillTone;
  style?: CSSProperties;
  className?: string;
};

const toneMap: Record<LabPillTone, { color: string; background: string; border: string }> = {
  neutral: {
    color: colors.text.secondary,
    background: 'rgba(255,255,255,0.05)',
    border: colors.border.subtle,
  },
  cyan: {
    color: brandCyan,
    background: `${brandCyan}1A`,
    border: `${brandCyan}33`,
  },
  purple: {
    color: brandPurple,
    background: `${brandPurple}1A`,
    border: `${brandPurple}33`,
  },
  pink: {
    color: brandPink,
    background: `${brandPink}1A`,
    border: `${brandPink}33`,
  },
  success: {
    color: colors.success,
    background: colors.successSubtle,
    border: `${colors.success}33`,
  },
  warning: {
    color: colors.warning,
    background: colors.warningSubtle,
    border: `${colors.warning}33`,
  },
  error: {
    color: colors.error,
    background: colors.errorSubtle,
    border: `${colors.error}33`,
  },
};

export default function LabPill({
  children,
  tone = 'neutral',
  style,
  className,
}: LabPillProps) {
  const toneStyle = toneMap[tone];

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: spacing[1.5],
        padding: `${spacing[1]}px ${spacing[2.5]}px`,
        borderRadius: radius.full,
        fontSize: typography.size.xs,
        fontWeight: typography.weight.extrabold,
        color: toneStyle.color,
        background: toneStyle.background,
        border: `1px solid ${toneStyle.border}`,
        letterSpacing: typography.letterSpacing.wide,
        textTransform: 'uppercase',
        ...style,
      }}
    >
      {children}
    </span>
  );
}
