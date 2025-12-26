import type { CSSProperties, ReactNode } from 'react';

import { LabCard } from '../../labui';
import { colors, spacing, typography } from '../../../styles';

type ModuleCardTone = 'neutral' | 'cyan' | 'purple' | 'pink' | 'success' | 'warning' | 'error';

type CTAResultPanelProps = {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  tone?: ModuleCardTone;
  style?: CSSProperties;
};

export default function CTAResultPanel({
  title,
  description,
  actions,
  tone = 'neutral',
  style,
}: CTAResultPanelProps) {
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
        <div style={{ color: colors.text.secondary, fontSize: typography.size.sm }}>
          {description}
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
