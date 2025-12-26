import type { CSSProperties, ReactNode } from 'react';

import { LabCard } from '../../labui';
import {
  brandCyan,
  brandPink,
  brandPurple,
  colors,
  radius,
  spacing,
  typography,
} from '../../../styles';

type ModuleCardTone = 'neutral' | 'cyan' | 'purple' | 'pink' | 'success' | 'warning' | 'error';

type MetricItem = {
  label: ReactNode;
  value: ReactNode;
};

type MetricsSummaryPanelProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  metrics?: MetricItem[];
  footer?: ReactNode;
  tone?: ModuleCardTone;
  style?: CSSProperties;
};

const toneMap: Record<ModuleCardTone, string> = {
  neutral: colors.text.primary,
  cyan: brandCyan,
  purple: brandPurple,
  pink: brandPink,
  success: colors.success,
  warning: colors.warning,
  error: colors.error,
};

export default function MetricsSummaryPanel({
  title,
  subtitle,
  metrics = [],
  footer,
  tone = 'neutral',
  style,
}: MetricsSummaryPanelProps) {
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
      <div style={{ fontWeight: typography.weight.black, color: toneMap[tone] }}>
        {title}
      </div>
      {subtitle ? (
        <div style={{ color: colors.text.secondary, fontSize: typography.size.sm }}>
          {subtitle}
        </div>
      ) : null}
      {metrics.length ? (
        <div style={{
          display: 'grid',
          gap: spacing[2],
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        }}>
          {metrics.map((item, index) => (
            <div
              key={`metric-${index}`}
              style={{
                padding: spacing[2.5],
                borderRadius: radius.lg,
                border: `1px solid ${colors.border.subtle}`,
                background: colors.surface.input,
              }}
            >
              <div style={{ fontSize: typography.size.xs, color: colors.text.muted }}>
                {item.label}
              </div>
              <div style={{ fontWeight: typography.weight.extrabold, marginTop: spacing[1] }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      ) : null}
      {footer ? (
        <div style={{ color: colors.text.muted, fontSize: typography.size.sm }}>
          {footer}
        </div>
      ) : null}
    </LabCard>
  );
}
