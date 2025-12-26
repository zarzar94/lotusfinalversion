import type { CSSProperties, ReactNode } from 'react';

import {
  colors,
  labTech,
  labTechStyles,
  labTechAnimations,
  spacing,
  typography,
} from '../styles';

type LabShellVariant = 'primary' | 'hero';

type LabShellProps = {
  children: ReactNode;
  variant?: LabShellVariant;
  scanline?: boolean;
  style?: CSSProperties;
  className?: string;
};

type LabShellContentProps = {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
};

const shellBaseStyle: CSSProperties = {
  minHeight: '100vh',
  color: colors.text.primary,
  fontFamily: typography.fontFamily,
  position: 'relative',
  overflowX: 'hidden',
};

const gridOverlayStyle: CSSProperties = {
  ...labTechStyles.gridPattern,
  zIndex: 0,
};

const scanlineStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  background: `linear-gradient(90deg, transparent, ${labTech.borders.glow}, transparent)`,
  opacity: 0.25,
  animation: 'scanLine 8s linear infinite',
  pointerEvents: 'none',
  zIndex: 0,
};

const contentBaseStyle: CSSProperties = {
  maxWidth: 1180,
  margin: '0 auto',
  padding: `${spacing[6]}px ${spacing[4]}px ${spacing[20]}px`,
  position: 'relative',
  zIndex: 1,
};

export function LabShellContent({ children, style, className }: LabShellContentProps) {
  return (
    <main style={{ ...contentBaseStyle, ...style }} className={className}>
      {children}
    </main>
  );
}

export function LabShell({
  children,
  variant = 'primary',
  scanline = false,
  style,
  className,
}: LabShellProps) {
  const background = variant === 'hero' ? labTech.backgrounds.hero : labTech.backgrounds.primary;

  return (
    <div
      className={className}
      style={{
        ...shellBaseStyle,
        background,
        ...style,
      }}
    >
      <style>{labTechAnimations}</style>
      <div aria-hidden="true" style={gridOverlayStyle} />
      {scanline ? <div aria-hidden="true" style={scanlineStyle} /> : null}
      {children}
    </div>
  );
}

export default LabShell;
