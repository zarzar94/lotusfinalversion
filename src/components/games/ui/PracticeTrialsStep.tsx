import type { CSSProperties, ReactNode } from 'react';

import { LabCard, LabPill } from '../../labui';
import { colors, spacing, typography } from '../../../styles';

type ModuleCardTone = 'neutral' | 'cyan' | 'purple' | 'pink' | 'success' | 'warning' | 'error';

type PracticeTrialsStepProps = {
  title: ReactNode;
  description?: ReactNode;
  status?: ReactNode;
  statusTone?: ModuleCardTone;
  actions?: ReactNode;
  children?: ReactNode;
  tone?: ModuleCardTone;
  style?: CSSProperties;
};

export default function PracticeTrialsStep({
  title,
  description,
  status,
  statusTone = 'neutral',
  actions,
  children,
  tone = 'neutral',
  style,
}: PracticeTrialsStepProps) {
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
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: spacing[2], flexWrap: 'wrap' }}>
        <div style={{ fontWeight: typography.weight.black, color: colors.text.primary }}>
          {title}
        </div>
        {status ? <LabPill tone={statusTone}>{status}</LabPill> : null}
      </div>
      {description ? (
        <div style={{ color: colors.text.secondary, fontSize: typography.size.sm }}>
          {description}
        </div>
      ) : null}
      {children}
      {actions ? (
        <div style={{ display: 'flex', gap: spacing[2], flexWrap: 'wrap' }}>
          {actions}
        </div>
      ) : null}
    </LabCard>
  );
}
