import type { ButtonHTMLAttributes, CSSProperties } from 'react';

import {
  brandInk,
  brandCyan,
  brandPurple,
  colors,
  gradients,
  radius,
  shadows,
  spacing,
  transitions,
  typography,
} from '../styles';

type LabButtonVariant = 'primary' | 'secondary' | 'ghost';
type LabButtonSize = 'sm' | 'md' | 'lg';

type LabButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: LabButtonVariant;
  size?: LabButtonSize;
  style?: CSSProperties;
};

const sizeStyles: Record<LabButtonSize, CSSProperties> = {
  sm: {
    padding: `${spacing[2]}px ${spacing[3]}px`,
    fontSize: typography.size.xs,
  },
  md: {
    padding: `${spacing[2.5]}px ${spacing[4]}px`,
    fontSize: typography.size.sm,
  },
  lg: {
    padding: `${spacing[3]}px ${spacing[5]}px`,
    fontSize: typography.size.base,
  },
};

const variantStyles: Record<LabButtonVariant, CSSProperties> = {
  primary: {
    background: gradients.cyanPurple,
    color: brandInk,
    border: 'none',
    boxShadow: shadows.glow.cyan,
  },
  secondary: {
    background: gradients.purplePink,
    color: brandInk,
    border: 'none',
    boxShadow: shadows.glow.purple,
  },
  ghost: {
    background: 'rgba(255,255,255,0.03)',
    color: colors.text.primary,
    border: `1px solid ${colors.border.emphasis}`,
    boxShadow: 'none',
  },
};

export default function LabButton({
  variant = 'primary',
  size = 'md',
  type = 'button',
  style,
  disabled,
  ...rest
}: LabButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      style={{
        borderRadius: radius.lg,
        fontWeight: typography.weight.black,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: transitions.normal,
        opacity: disabled ? 0.7 : 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing[2],
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...style,
      }}
      {...rest}
    />
  );
}
