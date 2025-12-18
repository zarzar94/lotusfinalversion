/**
 * StatCard - Flexible statistics card component
 * Supports multiple variants and layouts for dashboard metrics
 */

import { memo, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  brandCyan,
  brandPurple,
  colors,
  typography,
  spacing,
  radius,
  shadows,
  transitions,
} from '../styles';

interface StatCardProps {
  /** Icon to display (emoji or component) */
  icon: string;
  /** The main value to display */
  value: string | number;
  /** Label in English */
  label: string;
  /** Label in Arabic (optional - uses label if not provided) */
  labelAr?: string;
  /** Optional subtitle/description */
  subtitle?: string;
  /** Subtitle in Arabic */
  subtitleAr?: string;
  /** Accent color for the card */
  color?: string;
  /** Trend indicator */
  trend?: { value: number; isPositive: boolean };
  /** Layout variant */
  variant?: 'default' | 'compact' | 'horizontal' | 'centered';
  /** Click handler for interactive cards */
  onClick?: () => void;
}

function StatCard({
  icon,
  value,
  label,
  labelAr,
  subtitle,
  subtitleAr,
  color = brandCyan,
  trend,
  variant = 'default',
  onClick,
}: StatCardProps) {
  const { isArabic } = useLanguage();

  const displayLabel = isArabic ? (labelAr || label) : label;
  const displaySubtitle = subtitle ? (isArabic ? (subtitleAr || subtitle) : subtitle) : undefined;

  // Responsive hover CSS
  const hoverCss = useMemo(() => onClick ? `
    .stat-card-${color.replace('#', '')}:hover {
      transform: translateY(-2px);
      border-color: ${color}40;
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    }
  ` : '', [color, onClick]);

  // Centered variant (used in ParentDashboard)
  if (variant === 'centered') {
    return (
      <>
        {hoverCss && <style>{hoverCss}</style>}
        <div
          className={onClick ? `stat-card-${color.replace('#', '')}` : undefined}
          onClick={onClick}
          style={{
            padding: spacing[4],
            background: `linear-gradient(135deg, ${color}10, transparent)`,
            border: `1px solid ${color}25`,
            borderRadius: radius.lg,
            textAlign: 'center',
            cursor: onClick ? 'pointer' : 'default',
            transition: transitions.fast,
          }}
        >
          <div style={{ fontSize: 24, marginBottom: spacing[2] }}>{icon}</div>
          <div
            style={{
              fontSize: typography.size['2xl'],
              fontWeight: typography.weight.black,
              color: colors.text.primary,
            }}
          >
            {value}
          </div>
          <div
            style={{
              fontSize: typography.size.xs,
              color: colors.text.muted,
              marginTop: spacing[1],
            }}
          >
            {displayLabel}
          </div>
          {trend && (
            <div
              style={{
                marginTop: spacing[2],
                fontSize: typography.size.xs,
                fontWeight: typography.weight.bold,
                color: trend.isPositive ? '#22c55e' : '#ef4444',
              }}
            >
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </div>
          )}
        </div>
      </>
    );
  }

  // Horizontal variant (used in ClinicianDashboard)
  if (variant === 'horizontal') {
    return (
      <>
        {hoverCss && <style>{hoverCss}</style>}
        <div
          className={onClick ? `stat-card-${color.replace('#', '')}` : undefined}
          onClick={onClick}
          style={{
            padding: spacing[4],
            background: `linear-gradient(135deg, ${color}10, transparent)`,
            border: `1px solid ${color}25`,
            borderRadius: radius.lg,
            cursor: onClick ? 'pointer' : 'default',
            transition: transitions.fast,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: radius.md,
                background: `${color}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                flexShrink: 0,
              }}
            >
              {icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: typography.size['2xl'],
                  fontWeight: typography.weight.black,
                  color: colors.text.primary,
                  lineHeight: 1,
                }}
              >
                {value}
              </div>
              <div
                style={{
                  fontSize: typography.size.xs,
                  color: colors.text.muted,
                  marginTop: 2,
                }}
              >
                {displayLabel}
              </div>
            </div>
            {trend && (
              <div
                style={{
                  fontSize: typography.size.xs,
                  fontWeight: typography.weight.bold,
                  color: trend.isPositive ? '#22c55e' : '#ef4444',
                  flexShrink: 0,
                }}
              >
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <>
        {hoverCss && <style>{hoverCss}</style>}
        <div
          className={onClick ? `stat-card-${color.replace('#', '')}` : undefined}
          onClick={onClick}
          style={{
            padding: spacing[3],
            background: `${color}08`,
            border: `1px solid ${color}20`,
            borderRadius: radius.lg,
            cursor: onClick ? 'pointer' : 'default',
            transition: transitions.fast,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
            <span style={{ fontSize: 18 }}>{icon}</span>
            <span
              style={{
                fontSize: typography.size.lg,
                fontWeight: typography.weight.black,
                color: colors.text.primary,
              }}
            >
              {value}
            </span>
          </div>
          <div
            style={{
              fontSize: typography.size.xs,
              color: colors.text.muted,
              marginTop: spacing[1],
            }}
          >
            {displayLabel}
          </div>
        </div>
      </>
    );
  }

  // Default variant (with subtitle support for SchoolDashboard MetricCard style)
  return (
    <>
      {hoverCss && <style>{hoverCss}</style>}
      <div
        className={onClick ? `stat-card-${color.replace('#', '')}` : undefined}
        onClick={onClick}
        style={{
          padding: spacing[5],
          background: `linear-gradient(135deg, ${color}08, transparent)`,
          border: `1px solid ${color}25`,
          borderRadius: radius.xl,
          position: 'relative',
          overflow: 'hidden',
          cursor: onClick ? 'pointer' : 'default',
          transition: transitions.fast,
        }}
      >
        {/* Decorative gradient */}
        <div
          style={{
            position: 'absolute',
            top: -30,
            right: -30,
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${color}15, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: typography.size.xs,
                fontWeight: typography.weight.bold,
                color: colors.text.muted,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                marginBottom: spacing[2],
              }}
            >
              {displayLabel}
            </div>
            <div
              style={{
                fontSize: typography.size['3xl'],
                fontWeight: typography.weight.black,
                color: colors.text.primary,
                lineHeight: 1,
              }}
            >
              {value}
            </div>
            {displaySubtitle && (
              <div
                style={{
                  fontSize: typography.size.sm,
                  color: colors.text.secondary,
                  marginTop: spacing[1],
                }}
              >
                {displaySubtitle}
              </div>
            )}
            {trend && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: spacing[1],
                  marginTop: spacing[2],
                  padding: `${spacing[1]}px ${spacing[2]}px`,
                  background: trend.isPositive ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                  borderRadius: radius.full,
                  fontSize: typography.size.xs,
                  fontWeight: typography.weight.bold,
                  color: trend.isPositive ? '#22c55e' : '#ef4444',
                }}
              >
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </div>
            )}
          </div>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: radius.lg,
              background: `${color}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
        </div>
      </div>
    </>
  );
}

export default memo(StatCard);
