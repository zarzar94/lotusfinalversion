/**
 * BrandedSkeleton - Consistent loading placeholder with brand styling
 * Provides shimmer animation with brand colors
 */

import { memo, CSSProperties } from 'react';
import { brandCyan, brandPurple, radius as radiusTokens } from './styles';

interface BrandedSkeletonProps {
  /** Width of skeleton (number for px, string for any CSS value) */
  width?: number | string;
  /** Height of skeleton (number for px, string for any CSS value) */
  height?: number | string;
  /** Border radius variant */
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  /** Additional CSS styles */
  style?: CSSProperties;
  /** Number of skeleton lines to render */
  count?: number;
  /** Gap between multiple skeletons */
  gap?: number;
  /** Whether to show as a circle */
  circle?: boolean;
  /** Animation variant */
  variant?: 'shimmer' | 'pulse' | 'wave';
}

const css = `
  @keyframes skeletonShimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
  @keyframes skeletonPulse {
    0%, 100% {
      opacity: 0.4;
    }
    50% {
      opacity: 0.8;
    }
  }
  @keyframes skeletonWave {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`;

function BrandedSkeleton({
  width = '100%',
  height = 20,
  radius = 'md',
  style,
  count = 1,
  gap = 8,
  circle = false,
  variant = 'shimmer',
}: BrandedSkeletonProps) {
  const radiusValue = circle ? '50%' : radiusTokens[radius];
  const size = circle ? (typeof height === 'number' ? height : 40) : undefined;

  const getAnimation = () => {
    switch (variant) {
      case 'pulse':
        return 'skeletonPulse 1.5s ease-in-out infinite';
      case 'wave':
        return 'none'; // Wave uses pseudo-element
      case 'shimmer':
      default:
        return 'skeletonShimmer 2s ease-in-out infinite';
    }
  };

  const getBackground = () => {
    if (variant === 'pulse') {
      return `linear-gradient(135deg, ${brandCyan}15, ${brandPurple}10)`;
    }
    // Shimmer gradient
    return `linear-gradient(
      90deg,
      rgba(143,211,204,0.08) 0%,
      rgba(175,132,186,0.15) 25%,
      rgba(143,211,204,0.08) 50%,
      rgba(175,132,186,0.15) 75%,
      rgba(143,211,204,0.08) 100%
    )`;
  };

  const skeletonStyle: CSSProperties = {
    width: circle ? size : width,
    height: circle ? size : height,
    borderRadius: radiusValue,
    background: getBackground(),
    backgroundSize: variant === 'shimmer' ? '400% 100%' : undefined,
    animation: getAnimation(),
    position: 'relative',
    overflow: 'hidden',
    ...style,
  };

  // Wave variant needs pseudo-element effect
  const waveOverlay = variant === 'wave' && (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(90deg, transparent, ${brandCyan}20, transparent)`,
        animation: 'skeletonWave 1.5s ease-in-out infinite',
      }}
    />
  );

  if (count === 1) {
    return (
      <>
        <style>{css}</style>
        <div style={skeletonStyle} aria-hidden="true">
          {waveOverlay}
        </div>
      </>
    );
  }

  return (
    <>
      <style>{css}</style>
      <div style={{ display: 'flex', flexDirection: 'column', gap }} aria-hidden="true">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            style={{
              ...skeletonStyle,
              // Vary width slightly for natural look
              width: index === count - 1 ? '70%' : width,
            }}
          >
            {waveOverlay}
          </div>
        ))}
      </div>
    </>
  );
}

// Pre-built skeleton variants for common use cases
export const SkeletonText = memo(({ lines = 3, ...props }: Omit<BrandedSkeletonProps, 'count'> & { lines?: number }) => (
  <BrandedSkeleton height={16} count={lines} gap={10} {...props} />
));
SkeletonText.displayName = 'SkeletonText';

export const SkeletonAvatar = memo(({ size = 48, ...props }: Omit<BrandedSkeletonProps, 'circle' | 'width' | 'height'> & { size?: number }) => (
  <BrandedSkeleton circle width={size} height={size} {...props} />
));
SkeletonAvatar.displayName = 'SkeletonAvatar';

export const SkeletonCard = memo(({ ...props }: Omit<BrandedSkeletonProps, 'height' | 'radius'>) => (
  <BrandedSkeleton height={180} radius="xl" {...props} />
));
SkeletonCard.displayName = 'SkeletonCard';

export const SkeletonButton = memo(({ width = 120, ...props }: Omit<BrandedSkeletonProps, 'height' | 'radius'>) => (
  <BrandedSkeleton width={width} height={44} radius="lg" {...props} />
));
SkeletonButton.displayName = 'SkeletonButton';

export default memo(BrandedSkeleton);
