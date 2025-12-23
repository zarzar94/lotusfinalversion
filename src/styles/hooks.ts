/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * LOTUS SOUND LAB - STYLE HOOKS
 * React hooks for optimized, memoized style generation
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { useMemo, type CSSProperties } from 'react';
import { coreAnimations, animationPresets, createStaggerDelay } from './animations';
import { brand, transitions } from './tokens';
import { hud, cards, badges, buttons } from './components';

/**
 * Hook to inject global animations once per app
 * Use this in App.tsx or a top-level component
 */
export function useGlobalAnimations(): string {
  return useMemo(() => coreAnimations, []);
}

/**
 * Hook for generating HUD corner bracket styles
 */
export function useHudBrackets(size = 12): {
  topLeft: CSSProperties;
  topRight: CSSProperties;
  bottomLeft: CSSProperties;
  bottomRight: CSSProperties;
} {
  return useMemo(() => ({
    topLeft: {
      ...hud.cornerBracket,
      top: 4,
      left: 4,
      width: size,
      height: size,
      borderWidth: '2px 0 0 2px',
    },
    topRight: {
      ...hud.cornerBracket,
      top: 4,
      right: 4,
      width: size,
      height: size,
      borderWidth: '2px 2px 0 0',
    },
    bottomLeft: {
      ...hud.cornerBracket,
      bottom: 4,
      left: 4,
      width: size,
      height: size,
      borderWidth: '0 0 2px 2px',
    },
    bottomRight: {
      ...hud.cornerBracket,
      bottom: 4,
      right: 4,
      width: size,
      height: size,
      borderWidth: '0 2px 2px 0',
    },
  }), [size]);
}

/**
 * Hook for generating staggered animation styles
 */
export function useStaggeredAnimation(
  count: number,
  animationName: keyof typeof animationPresets = 'fadeInUp',
  baseDelay = 0.1
): CSSProperties[] {
  return useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      animation: animationPresets[animationName],
      animationDelay: createStaggerDelay(i, baseDelay),
      animationFillMode: 'backwards' as const,
    }));
  }, [count, animationName, baseDelay]);
}

/**
 * Hook for interactive card hover states
 */
export function useCardHover(isHovered: boolean): CSSProperties {
  return useMemo(() => {
    if (!isHovered) return {};
    return {
      transform: 'translateY(-8px) scale(1.02)',
      boxShadow: `0 20px 40px rgba(0, 0, 0, 0.3), 0 0 60px ${brand.cyan}22`,
      borderColor: `${brand.cyan}44`,
    };
  }, [isHovered]);
}

/**
 * Hook for generating lab panel styles with optional variants
 */
export function useLabPanel(variant: 'default' | 'glass' | 'soundLab' = 'default'): CSSProperties {
  return useMemo(() => {
    switch (variant) {
      case 'glass':
        return cards.glass;
      case 'soundLab':
        return cards.soundLab;
      default:
        return hud.panel;
    }
  }, [variant]);
}

/**
 * Hook for status badge with color
 */
export function useStatusBadge(status: 'online' | 'warning' | 'error' | 'info' = 'online'): CSSProperties {
  return useMemo(() => {
    const statusColors = {
      online: { bg: 'rgba(34,197,94,0.15)', color: brand.success },
      warning: { bg: 'rgba(245,158,11,0.15)', color: brand.warning },
      error: { bg: 'rgba(239,68,68,0.15)', color: brand.error },
      info: { bg: 'rgba(59,130,246,0.15)', color: brand.info },
    };

    const { bg, color } = statusColors[status];

    return {
      ...badges.live,
      background: bg,
      color,
    };
  }, [status]);
}

/**
 * Hook for button with loading state
 */
export function useButtonStyle(
  variant: 'primary' | 'ghost' | 'neon' = 'primary',
  isLoading = false,
  isDisabled = false
): CSSProperties {
  return useMemo(() => {
    if (isDisabled) {
      return buttons.disabled;
    }

    const baseStyle = buttons[variant] || buttons.primary;

    if (isLoading) {
      return {
        ...baseStyle,
        opacity: 0.7,
        cursor: 'wait',
        pointerEvents: 'none' as const,
      };
    }

    return baseStyle;
  }, [variant, isLoading, isDisabled]);
}

/**
 * Hook for responsive container max-width
 */
export function useContainerStyle(maxWidth = 1180): CSSProperties {
  return useMemo(() => ({
    maxWidth,
    margin: '0 auto',
    padding: '0 16px',
    position: 'relative' as const,
    zIndex: 1,
  }), [maxWidth]);
}

/**
 * Hook for generating frequency color based on Hz value
 */
export function useFrequencyColor(hz: number): string {
  return useMemo(() => {
    if (hz < 250) return '#FF6B6B';      // Bass - red
    if (hz < 1000) return '#F59E0B';     // Mid-low - orange
    if (hz < 3000) return '#4ECDC4';     // Mid - teal
    if (hz < 8000) return '#A855F7';     // Mid-high - purple
    return '#F472B6';                      // Treble - pink
  }, [hz]);
}

/**
 * Hook for generating gradient based on level/progress
 */
export function useProgressGradient(progress: number): string {
  return useMemo(() => {
    // Interpolate between cyan and purple based on progress
    if (progress < 0.5) {
      return `linear-gradient(90deg, ${brand.cyan}, ${brand.purple})`;
    }
    return `linear-gradient(90deg, ${brand.cyan}, ${brand.purple}, ${brand.pink})`;
  }, [progress]);
}

/**
 * Hook for scrolled header state
 */
export function useScrolledHeader(isScrolled: boolean): CSSProperties {
  return useMemo(() => ({
    padding: isScrolled ? '10px 0' : '16px 0',
    background: isScrolled
      ? 'linear-gradient(180deg, rgba(26,31,46,0.98) 0%, rgba(13,17,23,0.95) 100%)'
      : 'linear-gradient(180deg, rgba(26,31,46,0.95) 0%, rgba(13,17,23,0.85) 70%, transparent 100%)',
    backdropFilter: 'blur(16px)',
    borderBottom: isScrolled ? `1px solid ${brand.cyan}22` : 'none',
    boxShadow: isScrolled ? `0 4px 30px rgba(0,0,0,0.3), 0 0 40px ${brand.cyan}08` : 'none',
    transition: transitions.smooth,
  }), [isScrolled]);
}

/**
 * Hook for RTL-aware positioning
 */
export function useRtlPosition(isRtl: boolean): {
  start: 'left' | 'right';
  end: 'left' | 'right';
  marginStart: 'marginLeft' | 'marginRight';
  marginEnd: 'marginLeft' | 'marginRight';
} {
  return useMemo(() => ({
    start: isRtl ? 'right' : 'left',
    end: isRtl ? 'left' : 'right',
    marginStart: isRtl ? 'marginRight' : 'marginLeft',
    marginEnd: isRtl ? 'marginLeft' : 'marginRight',
  }), [isRtl]);
}

/**
 * Hook for active nav link styling
 */
export function useNavLinkStyle(isActive: boolean, isPriority = false, color?: string): CSSProperties {
  return useMemo(() => {
    const baseStyle: CSSProperties = {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '8px 12px',
      fontSize: 13,
      fontWeight: 700,
      textDecoration: 'none',
      borderRadius: 10,
      transition: transitions.smooth,
    };

    if (isActive) {
      return {
        ...baseStyle,
        color: brand.cyan,
        background: `linear-gradient(135deg, ${brand.cyan}15, ${brand.purple}10)`,
        border: `1px solid ${brand.cyan}35`,
        boxShadow: `0 0 12px ${brand.cyan}15`,
        animation: 'energyPulse 2s ease-in-out infinite',
      };
    }

    if (isPriority && color) {
      return {
        ...baseStyle,
        color,
        background: `${color}10`,
        border: `1px solid ${color}30`,
      };
    }

    return {
      ...baseStyle,
      color: '#f7f8fb',
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid transparent',
    };
  }, [isActive, isPriority, color]);
}
