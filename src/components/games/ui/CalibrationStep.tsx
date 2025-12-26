import type { CSSProperties, ReactNode } from 'react';

import { LabCard } from '../../labui';
import { colors, spacing, typography } from '../../../styles';

type ModuleCardTone = 'neutral' | 'cyan' | 'purple' | 'pink' | 'success' | 'warning' | 'error';

type CalibrationStepProps = {
  title: ReactNode;
  description?: ReactNode;
  hint?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
  tone?: ModuleCardTone;
  style?: CSSProperties;
};

export default function CalibrationStep({
  title,
  description,
  hint,
  actions,
  children,
  tone = 'cyan',
  style,
}: CalibrationStepProps) {
  return (
    <LabCard
      tone={tone}
      variant="glass"
      padding={spacing[4]}
      style={{
        display: 'grid',
        gap: spacing[3],
        ...style,
      }}
    >
      <div style={{ fontWeight: typography.weight.black, color: colors.text.primary }}>
        {title}
      </div>
      {description ? (
        <div style={{ color: colors.text.secondary, lineHeight: typography.lineHeight.relaxed }}>
          {description}
        </div>
      ) : null}
      {children}
      {hint ? (
        <div style={{
          padding: spacing[2.5],
          borderRadius: 12,
          border: `1px solid ${colors.border.subtle}`,
          background: colors.surface.input,
          color: colors.text.muted,
          fontSize: typography.size.sm,
        }}>
          {hint}
        </div>
      ) : null}
      {actions ? (
        <div style={{ display: 'flex', gap: spacing[2], flexWrap: 'wrap' }}>
          {actions}
        </div>
      ) : null}
    </LabCard>
  );
}
