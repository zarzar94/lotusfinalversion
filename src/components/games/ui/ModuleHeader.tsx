import type { CSSProperties, ReactNode } from 'react';

import { LabPill } from '../../labui';
import {
  brandCyan,
  brandPink,
  brandPurple,
  colors,
  spacing,
  typography,
} from '../../../styles';

type ModuleHeaderTone = 'neutral' | 'cyan' | 'purple' | 'pink' | 'success' | 'warning' | 'error';

type ModuleHeaderProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  tone?: ModuleHeaderTone;
  status?: ReactNode;
  statusTone?: ModuleHeaderTone;
  rightSlot?: ReactNode;
  style?: CSSProperties;
};

const toneMap: Record<ModuleHeaderTone, string> = {
  neutral: colors.text.primary,
  cyan: brandCyan,
  purple: brandPurple,
  pink: brandPink,
  success: colors.success,
  warning: colors.warning,
  error: colors.error,
};

export default function ModuleHeader({
  title,
  subtitle,
  tone = 'cyan',
  status,
  statusTone = 'neutral',
  rightSlot,
  style,
}: ModuleHeaderProps) {
  const showMeta = Boolean(status) || Boolean(rightSlot);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: spacing[3],
        flexWrap: 'wrap',
        ...style,
      }}
    >
      <div style={{ display: 'grid', gap: spacing[1] }}>
        <div style={{
          fontWeight: typography.weight.black,
          color: toneMap[tone],
          fontSize: typography.size.lg,
        }}>
          {title}
        </div>
        {subtitle ? (
          <div style={{ color: colors.text.secondary, fontSize: typography.size.sm }}>
            {subtitle}
          </div>
        ) : null}
      </div>
      {showMeta ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], flexWrap: 'wrap' }}>
          {rightSlot}
          {status ? <LabPill tone={statusTone}>{status}</LabPill> : null}
        </div>
      ) : null}
    </div>
  );
}
