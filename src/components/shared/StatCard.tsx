/**
 * StatCard - Reusable statistics card
 */

import { memo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { brandCyan, brandPurple, colors, typography, spacing, radius, shadows } from '../styles';

interface StatCardProps {
  icon: string;
  value: string | number;
  label: string;
  labelAr: string;
  color?: string;
  trend?: { value: number; isPositive: boolean };
}

function StatCard({ icon, value, label, labelAr, color = brandCyan, trend }: StatCardProps) {
  const { isArabic } = useLanguage();

  return (
    <div
      style={{
        padding: spacing[4],
        background: `linear-gradient(135deg, ${color}08, ${brandPurple}05)`,
        border: `1px solid ${colors.border.default}`,
        borderRadius: radius.xl,
        boxShadow: shadows.sm,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing[2] }}>
        <div
          style={{
            width: 40, height: 40, borderRadius: radius.md,
            background: `${color}20`, display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: 20,
          }}
        >
          {icon}
        </div>
        {trend && (
          <span style={{
            fontSize: typography.size.xs, fontWeight: typography.weight.bold,
            color: trend.isPositive ? '#22c55e' : '#ef4444',
            display: 'flex', alignItems: 'center', gap: 2,
          }}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
        )}
      </div>
      <div style={{ fontSize: typography.size['2xl'], fontWeight: typography.weight.black, color: colors.text.primary, marginBottom: spacing[0.5] }}>
        {value}
      </div>
      <div style={{ fontSize: typography.size.xs, color: colors.text.muted, fontWeight: typography.weight.medium }}>
        {isArabic ? labelAr : label}
      </div>
    </div>
  );
}

export default memo(StatCard);
