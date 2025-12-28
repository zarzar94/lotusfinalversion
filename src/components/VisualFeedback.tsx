/**
 * VisualFeedback - Haptic-style visual feedback for interactions
 * Provides satisfying visual responses to user actions
 */

import { memo, useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import {
  brandCyan,
  brandInk,
  brandPurple,
  brandPink,
  colors,
  spacing,
  radius,
} from './styles';
import { renderLabIcon } from './icons/index';

// Context for global feedback system
interface FeedbackContextType {
  showRipple: (x: number, y: number, color?: string) => void;
  showSuccess: (message?: string) => void;
  showError: (message?: string) => void;
  showPulse: (element: HTMLElement) => void;
}

const FeedbackContext = createContext<FeedbackContextType | null>(null);

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedback must be used within FeedbackProvider');
  }
  return context;
};

interface Ripple {
  id: number;
  x: number;
  y: number;
  color: string;
}

interface Toast {
  id: number;
  type: 'success' | 'error';
  message: string;
}

/**
 * FeedbackProvider - Provides global visual feedback capabilities
 */
export const FeedbackProvider = memo(({ children }: { children: ReactNode }) => {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [pulsingElements, setPulsingElements] = useState<Set<HTMLElement>>(new Set());

  // Ripple effect
  const showRipple = useCallback((x: number, y: number, color: string = brandCyan) => {
    const id = Date.now();
    setRipples((prev) => [...prev, { id, x, y, color }]);

    // Remove after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
  }, []);

  // Success feedback
  const showSuccess = useCallback((message: string = 'Success!') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type: 'success', message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2000);
  }, []);

  // Error feedback
  const showError = useCallback((message: string = 'Error occurred') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type: 'error', message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  // Pulse effect on element
  const showPulse = useCallback((element: HTMLElement) => {
    setPulsingElements((prev) => new Set(prev).add(element));

    setTimeout(() => {
      setPulsingElements((prev) => {
        const newSet = new Set(prev);
        newSet.delete(element);
        return newSet;
      });
    }, 500);
  }, []);

  // Global click ripple effect
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Only show ripple on interactive elements
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.dataset.ripple === 'true'
      ) {
        showRipple(e.clientX, e.clientY);
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [showRipple]);

  return (
    <FeedbackContext.Provider value={{ showRipple, showSuccess, showError, showPulse }}>
      {children}

      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          style={{
            position: 'fixed',
            left: ripple.x,
            top: ripple.y,
            width: 0,
            height: 0,
            borderRadius: '50%',
            background: ripple.color,
            opacity: 0.3,
            transform: 'translate(-50%, -50%)',
            animation: 'rippleExpand 0.6s ease-out forwards',
            pointerEvents: 'none',
            zIndex: 9999,
          }}
        />
      ))}

      {/* Toast notifications */}
      <div
        style={{
          position: 'fixed',
          top: spacing[4],
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: spacing[2],
          zIndex: 10000,
          pointerEvents: 'none',
        }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              padding: `${spacing[3]}px ${spacing[5]}px`,
              background:
                toast.type === 'success'
                  ? `linear-gradient(135deg, ${colors.success}20, ${colors.success}10)`
                  : `linear-gradient(135deg, ${colors.error}20, ${colors.error}10)`,
              border: `1px solid ${toast.type === 'success' ? colors.success : colors.error}40`,
              borderRadius: radius.full,
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2],
              animation: 'toastSlide 0.3s ease-out',
            }}
          >
            <span style={{ fontSize: 16 }}>
              {toast.type === 'success'
                ? renderLabIcon('\u2713', { size: 16, tone: 'success' })
                : renderLabIcon('\u2715', { size: 16, tone: 'error' })}
            </span>
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: toast.type === 'success' ? colors.success : colors.error,
              }}
            >
              {toast.message}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes rippleExpand {
          0% {
            width: 0;
            height: 0;
            opacity: 0.4;
          }
          100% {
            width: 200px;
            height: 200px;
            opacity: 0;
          }
        }
        @keyframes toastSlide {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </FeedbackContext.Provider>
  );
});

FeedbackProvider.displayName = 'FeedbackProvider';

/**
 * InteractiveButton - Button with built-in haptic feedback
 */
interface InteractiveButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const InteractiveButton = memo(({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  style = {},
}: InteractiveButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);

  const sizes = {
    sm: { padding: `${spacing[2]}px ${spacing[3]}px`, fontSize: 13 },
    md: { padding: `${spacing[3]}px ${spacing[4]}px`, fontSize: 14 },
    lg: { padding: `${spacing[4]}px ${spacing[6]}px`, fontSize: 16 },
  };

  const variants = {
    primary: {
      background: `linear-gradient(135deg, ${brandCyan}, ${brandPurple})`,
      color: brandInk,
      border: 'none',
    },
    secondary: {
      background: `${brandCyan}15`,
      color: brandCyan,
      border: `1px solid ${brandCyan}30`,
    },
    ghost: {
      background: 'transparent',
      color: colors.text.primary,
      border: `1px solid ${colors.border.default}`,
    },
  };

  const handleClick = useCallback(() => {
    if (!disabled && !loading && onClick) {
      setIsPressed(true);
      setTimeout(() => setIsPressed(false), 150);
      onClick();
    }
  }, [disabled, loading, onClick]);

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      className={className}
      data-ripple="true"
      style={{
        ...sizes[size],
        ...variants[variant],
        borderRadius: radius.lg,
        fontWeight: 700,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transform: isPressed ? 'scale(0.97)' : 'scale(1)',
        transition: 'all 0.15s ease',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing[2],
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      {loading && (
        <span
          style={{
            width: 16,
            height: 16,
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
      )}
      {children}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  );
});

InteractiveButton.displayName = 'InteractiveButton';

/**
 * PressableCard - Card with press feedback
 */
interface PressableCardProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const PressableCard = memo(({
  children,
  onClick,
  className = '',
  style = {},
}: PressableCardProps) => {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => {
        setIsPressed(false);
        setIsHovered(false);
      }}
      onMouseEnter={() => setIsHovered(true)}
      className={className}
      data-ripple="true"
      style={{
        padding: spacing[4],
        background: colors.surface.card,
        border: `1px solid ${isHovered ? brandCyan + '40' : colors.border.default}`,
        borderRadius: radius.xl,
        cursor: onClick ? 'pointer' : 'default',
        transform: isPressed
          ? 'scale(0.98)'
          : isHovered
            ? 'translateY(-2px)'
            : 'scale(1)',
        boxShadow: isHovered
          ? `0 8px 30px ${brandCyan}15`
          : 'none',
        transition: 'all 0.2s ease',
        ...style,
      }}
    >
      {children}
    </div>
  );
});

PressableCard.displayName = 'PressableCard';

/**
 * SwipeIndicator - Visual hint for swipeable elements
 */
export const SwipeIndicator = memo(({ direction = 'horizontal' }: { direction?: 'horizontal' | 'vertical' }) => {
  return (
    <div
      style={{
        position: 'absolute',
        ...(direction === 'horizontal'
          ? { top: '50%', right: spacing[2], transform: 'translateY(-50%)' }
          : { bottom: spacing[2], left: '50%', transform: 'translateX(-50%)' }),
        display: 'flex',
        gap: spacing[1],
        opacity: 0.5,
      }}
    >
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          style={{
            width: direction === 'horizontal' ? 4 : 20,
            height: direction === 'horizontal' ? 20 : 4,
            borderRadius: radius.full,
            background: brandCyan,
            opacity: 0.3 + i * 0.2,
            animation: `swipeHint 1.5s ease-in-out infinite ${i * 0.15}s`,
          }}
        />
      ))}

      <style>{`
        @keyframes swipeHint {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
});

SwipeIndicator.displayName = 'SwipeIndicator';

/**
 * LoadingDots - Animated loading indicator
 */
export const LoadingDots = memo(({ color = brandCyan }: { color?: string }) => {
  return (
    <div style={{ display: 'flex', gap: spacing[1] }}>
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: color,
            animation: `loadingBounce 1.4s ease-in-out infinite ${i * 0.16}s`,
          }}
        />
      ))}

      <style>{`
        @keyframes loadingBounce {
          0%, 80%, 100% {
            transform: scale(0.6);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
});

LoadingDots.displayName = 'LoadingDots';

/**
 * ProgressRing - Circular progress indicator
 */
interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  showPercentage?: boolean;
}

export const ProgressRing = memo(({
  progress,
  size = 60,
  strokeWidth = 4,
  color = brandCyan,
  showPercentage = true,
}: ProgressRingProps) => {
  const normalizedRadius = (size - strokeWidth) / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={normalizedRadius}
          fill="none"
          stroke={colors.border.default}
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={normalizedRadius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      {showPercentage && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: size * 0.25,
            fontWeight: 700,
            color: colors.text.primary,
          }}
        >
          {Math.round(progress)}%
        </div>
      )}
    </div>
  );
});

ProgressRing.displayName = 'ProgressRing';

export default FeedbackProvider;
