import type { CSSProperties, ReactNode } from 'react';
import { brandCyan, brandPurple, brandPink, colors } from '../../styles';

export type IconTone = 'cyan' | 'purple' | 'pink' | 'muted' | 'success' | 'warning' | 'error';

export type IconProps = {
  size?: number;
  stroke?: number;
  tone?: IconTone;
  glow?: boolean;
  className?: string;
  style?: CSSProperties;
  title?: string;
  children?: ReactNode;
};

const toneColorMap: Record<IconTone, string> = {
  cyan: brandCyan,
  purple: brandPurple,
  pink: brandPink,
  muted: colors.text.muted,
  success: colors.success,
  warning: colors.warning,
  error: colors.error,
};

export function Icon({
  size = 24,
  stroke = 2,
  tone = 'cyan',
  glow = false,
  className,
  style,
  title,
  children,
}: IconProps) {
  const color = toneColorMap[tone];
  const mergedStyle: CSSProperties = { color, display: 'block', ...style };
  const svg = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={mergedStyle}
      role={title ? 'img' : 'presentation'}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );

  if (!glow) return svg;

  return (
    <span
      style={{
        display: 'inline-flex',
        filter: `drop-shadow(0 0 ${Math.max(8, size * 0.35)}px ${color})`,
      }}
    >
      {svg}
    </span>
  );
}
