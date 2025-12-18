/**
 * Skeleton - Loading placeholder components
 * Provides smooth shimmer animations while content loads
 */

import { memo } from 'react';
import { brandCyan, brandPurple, colors, spacing, radius } from '../styles';

// Shared shimmer animation
const shimmerCss = `
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  .skeleton-shimmer {
    background: linear-gradient(
      90deg,
      rgba(255,255,255,0.03) 0%,
      rgba(255,255,255,0.08) 50%,
      rgba(255,255,255,0.03) 100%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite ease-in-out;
  }
`;

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: number;
  style?: React.CSSProperties;
}

/**
 * Basic skeleton element with shimmer animation
 */
export const Skeleton = memo(({
  width = '100%',
  height = 20,
  borderRadius = radius.md,
  style,
}: SkeletonProps) => (
  <>
    <style>{shimmerCss}</style>
    <div
      className="skeleton-shimmer"
      style={{
        width,
        height,
        borderRadius,
        background: `linear-gradient(90deg, ${colors.border.subtle} 0%, rgba(255,255,255,0.08) 50%, ${colors.border.subtle} 100%)`,
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite ease-in-out',
        ...style,
      }}
    />
  </>
));
Skeleton.displayName = 'Skeleton';

/**
 * Skeleton for stat cards
 */
export const StatCardSkeleton = memo(({ variant = 'default' }: { variant?: 'default' | 'centered' | 'horizontal' }) => {
  if (variant === 'centered') {
    return (
      <>
        <style>{shimmerCss}</style>
        <div
          style={{
            padding: spacing[4],
            background: colors.surface.card,
            border: `1px solid ${colors.border.default}`,
            borderRadius: radius.lg,
            textAlign: 'center',
          }}
        >
          <Skeleton width={40} height={40} borderRadius={radius.md} style={{ margin: '0 auto', marginBottom: spacing[2] }} />
          <Skeleton width={60} height={28} style={{ margin: '0 auto', marginBottom: spacing[2] }} />
          <Skeleton width={80} height={14} style={{ margin: '0 auto' }} />
        </div>
      </>
    );
  }

  if (variant === 'horizontal') {
    return (
      <>
        <style>{shimmerCss}</style>
        <div
          style={{
            padding: spacing[4],
            background: colors.surface.card,
            border: `1px solid ${colors.border.default}`,
            borderRadius: radius.lg,
            display: 'flex',
            alignItems: 'center',
            gap: spacing[3],
          }}
        >
          <Skeleton width={44} height={44} borderRadius={radius.md} />
          <div style={{ flex: 1 }}>
            <Skeleton width={60} height={24} style={{ marginBottom: spacing[1] }} />
            <Skeleton width={100} height={14} />
          </div>
        </div>
      </>
    );
  }

  // Default variant
  return (
    <>
      <style>{shimmerCss}</style>
      <div
        style={{
          padding: spacing[5],
          background: colors.surface.card,
          border: `1px solid ${colors.border.default}`,
          borderRadius: radius.xl,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ flex: 1 }}>
            <Skeleton width={80} height={12} style={{ marginBottom: spacing[2] }} />
            <Skeleton width={100} height={32} style={{ marginBottom: spacing[1] }} />
            <Skeleton width={120} height={14} />
          </div>
          <Skeleton width={48} height={48} borderRadius={radius.lg} />
        </div>
      </div>
    </>
  );
});
StatCardSkeleton.displayName = 'StatCardSkeleton';

/**
 * Skeleton for table rows
 */
export const TableRowSkeleton = memo(({ columns = 4 }: { columns?: number }) => (
  <>
    <style>{shimmerCss}</style>
    <tr>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} style={{ padding: spacing[3] }}>
          <Skeleton width={i === 0 ? '80%' : '60%'} height={16} />
        </td>
      ))}
    </tr>
  </>
));
TableRowSkeleton.displayName = 'TableRowSkeleton';

/**
 * Skeleton for chart/panel areas
 */
export const ChartSkeleton = memo(({ height = 200 }: { height?: number }) => (
  <>
    <style>{shimmerCss}</style>
    <div
      style={{
        padding: spacing[5],
        background: colors.surface.card,
        border: `1px solid ${colors.border.default}`,
        borderRadius: radius.xl,
      }}
    >
      <Skeleton width={150} height={20} style={{ marginBottom: spacing[4] }} />
      <div
        style={{
          height,
          display: 'flex',
          alignItems: 'flex-end',
          gap: spacing[2],
          paddingTop: spacing[4],
        }}
      >
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton
            key={i}
            width="100%"
            height={`${30 + Math.random() * 60}%`}
            borderRadius={radius.sm}
          />
        ))}
      </div>
    </div>
  </>
));
ChartSkeleton.displayName = 'ChartSkeleton';

/**
 * Skeleton for navigation pills
 */
export const NavPillsSkeleton = memo(({ count = 5 }: { count?: number }) => (
  <>
    <style>{shimmerCss}</style>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing[2] }}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} width={100 + Math.random() * 40} height={36} borderRadius={radius.full} />
      ))}
    </div>
  </>
));
NavPillsSkeleton.displayName = 'NavPillsSkeleton';

/**
 * Full page loading skeleton
 */
export const PageSkeleton = memo(() => (
  <>
    <style>{shimmerCss}</style>
    <div style={{ padding: `${spacing[10]}px ${spacing[4]}px`, maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3], marginBottom: spacing[8] }}>
        <Skeleton width={48} height={48} borderRadius={radius.lg} />
        <div>
          <Skeleton width={200} height={28} style={{ marginBottom: spacing[2] }} />
          <Skeleton width={150} height={16} />
        </div>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: spacing[4],
          marginBottom: spacing[8],
        }}
      >
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      {/* Charts */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: spacing[6],
        }}
      >
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
    </div>
  </>
));
PageSkeleton.displayName = 'PageSkeleton';

export default Skeleton;
