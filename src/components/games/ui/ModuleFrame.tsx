import type { CSSProperties, ReactNode } from 'react';

import { LabCard } from '../../labui';
import { spacing } from '../../../styles';

type ModuleCardTone = 'neutral' | 'cyan' | 'purple' | 'pink' | 'success' | 'warning' | 'error';
type ModuleCardVariant = 'surface' | 'glass' | 'panel';

type ModuleFrameProps = {
  children: ReactNode;
  tone?: ModuleCardTone;
  variant?: ModuleCardVariant;
  padding?: number;
  style?: CSSProperties;
  className?: string;
};

export default function ModuleFrame({
  children,
  tone = 'neutral',
  variant = 'panel',
  padding = spacing[5],
  style,
  className,
}: ModuleFrameProps) {
  return (
    <LabCard
      tone={tone}
      variant={variant}
      padding={padding}
      className={className}
      style={{
        display: 'grid',
        gap: spacing[4],
        ...style,
      }}
    >
      {children}
    </LabCard>
  );
}
