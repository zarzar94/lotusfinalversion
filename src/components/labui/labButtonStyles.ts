import type { CSSProperties } from 'react';

import {
  brandCyan,
  brandInk,
  brandPink,
  brandPurple,
  colors,
  gradients,
  radius,
  shadows,
  spacing,
  typography,
} from '../styles';

export type LabButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type LabButtonSize = 'sm' | 'md' | 'lg';

const baseVars: CSSProperties = {
  '--lab-btn-radius': `${radius.lg}px`,
  '--lab-btn-font-weight': typography.weight.black,
  '--lab-btn-gap': `${spacing[2]}px`,
  '--lab-btn-spinner': 'currentColor',
  '--lab-btn-spinner-track': colors.border.emphasis,
} as CSSProperties;

const sizeVars: Record<LabButtonSize, CSSProperties> = {
  sm: {
    '--lab-btn-padding': `${spacing[2]}px ${spacing[3]}px`,
    '--lab-btn-font-size': `${typography.size.xs}px`,
    '--lab-btn-height': `${spacing[9]}px`,
    '--lab-btn-gap': `${spacing[1.5]}px`,
  } as CSSProperties,
  md: {
    '--lab-btn-padding': `${spacing[2.5]}px ${spacing[4]}px`,
    '--lab-btn-font-size': `${typography.size.sm}px`,
    '--lab-btn-height': `${spacing[11]}px`,
    '--lab-btn-gap': `${spacing[2]}px`,
  } as CSSProperties,
  lg: {
    '--lab-btn-padding': `${spacing[3]}px ${spacing[5]}px`,
    '--lab-btn-font-size': `${typography.size.base}px`,
    '--lab-btn-height': `${spacing[12]}px`,
    '--lab-btn-gap': `${spacing[2]}px`,
  } as CSSProperties,
};

const variantVars: Record<LabButtonVariant, CSSProperties> = {
  primary: {
    '--lab-btn-bg': gradients.primary,
    '--lab-btn-color': brandInk,
    '--lab-btn-border': 'none',
    '--lab-btn-shadow': shadows.glow.cyan,
    '--lab-btn-shadow-hover': '0 16px 42px rgba(143, 211, 204, 0.35)',
    '--lab-btn-sheen-opacity': 0.15,
    '--lab-btn-sheen-opacity-hover': 0.85,
    '--lab-btn-spinner': brandInk,
    '--lab-btn-spinner-track': 'rgba(0,0,0,0.2)',
  } as CSSProperties,
  secondary: {
    '--lab-btn-bg': gradients.secondary,
    '--lab-btn-color': brandInk,
    '--lab-btn-border': 'none',
    '--lab-btn-shadow': shadows.glow.purple,
    '--lab-btn-shadow-hover': '0 16px 42px rgba(175, 132, 186, 0.35)',
    '--lab-btn-sheen-opacity': 0.12,
    '--lab-btn-sheen-opacity-hover': 0.8,
    '--lab-btn-spinner': brandInk,
    '--lab-btn-spinner-track': 'rgba(0,0,0,0.2)',
  } as CSSProperties,
  ghost: {
    '--lab-btn-bg': colors.surface.card,
    '--lab-btn-color': colors.text.primary,
    '--lab-btn-border': `1px solid ${colors.border.emphasis}`,
    '--lab-btn-shadow': 'none',
    '--lab-btn-shadow-hover': shadows.sm,
    '--lab-btn-sheen-opacity': 0,
    '--lab-btn-sheen-opacity-hover': 0,
  } as CSSProperties,
  danger: {
    '--lab-btn-bg': colors.errorLight,
    '--lab-btn-color': colors.error,
    '--lab-btn-border': `1px solid ${colors.error}55`,
    '--lab-btn-shadow': shadows.sm,
    '--lab-btn-shadow-hover': shadows.md,
    '--lab-btn-sheen-opacity': 0.18,
    '--lab-btn-sheen-opacity-hover': 0.5,
  } as CSSProperties,
};

export const buildLabButtonStyles = ({
  variant,
  size,
  fullWidth,
  style,
}: {
  variant: LabButtonVariant;
  size: LabButtonSize;
  fullWidth?: boolean;
  style?: CSSProperties;
}) => ({
  ...baseVars,
  ...sizeVars[size],
  ...variantVars[variant],
  ...(fullWidth ? { '--lab-btn-width': '100%' } : null),
  ...style,
}) as CSSProperties;
