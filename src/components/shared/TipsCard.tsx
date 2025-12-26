/**
 * TipsCard - Guidance and tips display components
 * Shows helpful tips, recommendations, and guidance for users
 */

import { memo, useState, useCallback, type ReactNode } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  brandCyan,
  brandPurple,
  brandPink,
  colors,
  typography,
  spacing,
  radius,
  transitions,
} from '../styles';
import {
  BrainCircuitIcon,
  ReportIcon,
  ShieldMedicalIcon,
  CheckCircleIcon,
  WaveformIcon,
} from '../icons/index';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface Tip {
  id: string;
  title: string;
  titleAr?: string;
  content: string;
  contentAr?: string;
  icon?: ReactNode;
  category?: 'info' | 'warning' | 'success' | 'tip';
  priority?: number;
}

interface TipsCardProps {
  tips: Tip[];
  title?: string;
  titleAr?: string;
  icon?: ReactNode;
  variant?: 'default' | 'compact' | 'carousel';
  color?: string;
  isArabic?: boolean;
  maxDisplay?: number;
  showBullets?: boolean;
}

interface InfoCardProps {
  title: string;
  titleAr?: string;
  content: string;
  contentAr?: string;
  icon?: ReactNode;
  variant?: 'info' | 'warning' | 'success' | 'tip' | 'clinical';
  isArabic?: boolean;
  actions?: {
    label: string;
    labelAr?: string;
    onClick: () => void;
  }[];
}

interface GuidanceStepsProps {
  steps: {
    title: string;
    titleAr?: string;
    description: string;
    descriptionAr?: string;
    icon?: ReactNode;
    completed?: boolean;
  }[];
  title?: string;
  titleAr?: string;
  currentStep?: number;
  isArabic?: boolean;
  variant?: 'numbered' | 'icon' | 'progress';
}

// ═══════════════════════════════════════════════════════════════════════════
// TIPS CARD
// ═══════════════════════════════════════════════════════════════════════════

export const TipsCard = memo(({
  tips,
  title,
  titleAr,
  icon = <BrainCircuitIcon size={20} tone="cyan" />,
  variant = 'default',
  color = brandCyan,
  isArabic = false,
  maxDisplay = 5,
  showBullets = true,
}: TipsCardProps) => {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const displayTips = tips.slice(0, maxDisplay);

  const nextTip = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % displayTips.length);
  }, [displayTips.length]);

  const prevTip = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + displayTips.length) % displayTips.length);
  }, [displayTips.length]);

  if (variant === 'carousel') {
    const currentTip = displayTips[currentIndex];
    return (
      <div style={{
        padding: spacing[5],
        background: `linear-gradient(135deg, ${color}08, ${color}03)`,
        border: `1px solid ${color}20`,
        borderRadius: radius.xl,
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: spacing[3],
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing[2],
          }}>
            <span style={{ display: 'flex', alignItems: 'center', fontSize: 20 }}>{icon}</span>
            <h3 style={{
              margin: 0,
              fontSize: typography.size.lg,
              fontWeight: typography.weight.bold,
              color,
            }}>
              {isArabic ? titleAr || title : title}
            </h3>
          </div>

          {/* Navigation */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing[2],
          }}>
            <button
              onClick={prevTip}
              style={{
                width: 28,
                height: 28,
                borderRadius: radius.full,
                background: 'rgba(255,255,255,0.05)',
                border: `1px solid ${colors.border.subtle}`,
                color: colors.text.secondary,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: transitions.fast,
              }}
            >
              {isArabic ? '→' : '←'}
            </button>
            <span style={{
              fontSize: typography.size.xs,
              color: colors.text.muted,
            }}>
              {currentIndex + 1}/{displayTips.length}
            </span>
            <button
              onClick={nextTip}
              style={{
                width: 28,
                height: 28,
                borderRadius: radius.full,
                background: 'rgba(255,255,255,0.05)',
                border: `1px solid ${colors.border.subtle}`,
                color: colors.text.secondary,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: transitions.fast,
              }}
            >
              {isArabic ? '←' : '→'}
            </button>
          </div>
        </div>

        {/* Current tip */}
        {currentTip && (
          <div style={{
            padding: spacing[4],
            background: 'rgba(255,255,255,0.03)',
            borderRadius: radius.lg,
          }}>
            {currentTip.title && (
              <h4 style={{
                margin: `0 0 ${spacing[2]}px`,
                fontSize: typography.size.sm,
                fontWeight: typography.weight.bold,
                color: colors.text.primary,
                display: 'flex',
                alignItems: 'center',
                gap: spacing[2],
              }}>
                {currentTip.icon && (
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    {currentTip.icon}
                  </span>
                )}
                {isArabic ? currentTip.titleAr || currentTip.title : currentTip.title}
              </h4>
            )}
            <p style={{
              margin: 0,
              fontSize: typography.size.sm,
              color: colors.text.secondary,
              lineHeight: typography.lineHeight.relaxed,
            }}>
              {isArabic ? currentTip.contentAr || currentTip.content : currentTip.content}
            </p>
          </div>
        )}

        {/* Dots indicator */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: spacing[1],
          marginTop: spacing[3],
        }}>
          {displayTips.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              style={{
                width: 8,
                height: 8,
                borderRadius: radius.full,
                background: i === currentIndex ? color : colors.border.default,
                border: 'none',
                cursor: 'pointer',
                transition: transitions.fast,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div style={{
        padding: spacing[3],
        background: `${color}10`,
        border: `1px solid ${color}20`,
        borderRadius: radius.lg,
        display: 'flex',
        alignItems: 'flex-start',
        gap: spacing[2],
      }}>
        <span style={{ display: 'flex', alignItems: 'center', fontSize: 18, flexShrink: 0 }}>{icon}</span>
        <p style={{
          margin: 0,
          fontSize: typography.size.sm,
          color: colors.text.secondary,
          lineHeight: typography.lineHeight.relaxed,
        }}>
          {isArabic ? displayTips[0]?.contentAr || displayTips[0]?.content : displayTips[0]?.content}
        </p>
      </div>
    );
  }

  // Default variant
  return (
    <div style={{
      padding: spacing[5],
      background: `linear-gradient(135deg, ${color}08, ${color}03)`,
      border: `1px solid ${color}20`,
      borderRadius: radius.xl,
    }}>
      <h3 style={{
        margin: `0 0 ${spacing[3]}px`,
        fontSize: typography.size.lg,
        fontWeight: typography.weight.bold,
        color,
        display: 'flex',
        alignItems: 'center',
        gap: spacing[2],
      }}>
        <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>
        {isArabic ? titleAr || title : title}
      </h3>
      <ul style={{
        margin: 0,
        padding: showBullets ? `0 ${spacing[5]}px` : 0,
        listStyle: showBullets ? 'disc' : 'none',
      }}>
        {displayTips.map((tip) => (
          <li
            key={tip.id}
            style={{
              marginBottom: spacing[2],
              fontSize: typography.size.sm,
              color: colors.text.secondary,
              lineHeight: typography.lineHeight.relaxed,
            }}
          >
            {tip.icon && !showBullets && (
              <span style={{ display: 'flex', alignItems: 'center', marginRight: spacing[2] }}>
                {tip.icon}
              </span>
            )}
            {isArabic ? tip.contentAr || tip.content : tip.content}
          </li>
        ))}
      </ul>
    </div>
  );
});
TipsCard.displayName = 'TipsCard';

// ═══════════════════════════════════════════════════════════════════════════
// INFO CARD
// ═══════════════════════════════════════════════════════════════════════════

export const InfoCard = memo(({
  title,
  titleAr,
  content,
  contentAr,
  icon,
  variant = 'info',
  isArabic = false,
  actions,
}: InfoCardProps) => {
  const { t } = useLanguage();
  const variants = {
    info: { color: brandCyan, icon: icon ?? <ReportIcon size={18} tone="cyan" />, bgOpacity: '08' },
    warning: { color: '#f59e0b', icon: icon ?? <ShieldMedicalIcon size={18} tone="warning" />, bgOpacity: '10' },
    success: { color: '#22c55e', icon: icon ?? <CheckCircleIcon size={18} tone="success" />, bgOpacity: '08' },
    tip: { color: brandPurple, icon: icon ?? <BrainCircuitIcon size={18} tone="purple" />, bgOpacity: '08' },
    clinical: { color: brandPink, icon: icon ?? <WaveformIcon size={18} tone="pink" />, bgOpacity: '08' },
  };

  const config = variants[variant];

  return (
    <div style={{
      padding: spacing[4],
      background: `${config.color}${config.bgOpacity}`,
      border: `1px solid ${config.color}30`,
      borderRadius: radius.lg,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: spacing[3],
      }}>
        <div style={{
          width: 36,
          height: 36,
          borderRadius: radius.md,
          background: `${config.color}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          flexShrink: 0,
        }}>
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {config.icon}
          </span>
        </div>
        <div style={{ flex: 1 }}>
          <h4 style={{
            margin: `0 0 ${spacing[1]}px`,
            fontSize: typography.size.sm,
            fontWeight: typography.weight.bold,
            color: colors.text.primary,
          }}>
            {isArabic ? titleAr || title : title}
          </h4>
          <p style={{
            margin: 0,
            fontSize: typography.size.sm,
            color: colors.text.secondary,
            lineHeight: typography.lineHeight.relaxed,
          }}>
            {isArabic ? contentAr || content : content}
          </p>
          {actions && actions.length > 0 && (
            <div style={{
              display: 'flex',
              gap: spacing[2],
              marginTop: spacing[3],
            }}>
              {actions.map((action, i) => (
                <button
                  key={i}
                  onClick={action.onClick}
                  style={{
                    padding: `${spacing[2]}px ${spacing[3]}px`,
                    background: i === 0 ? config.color : 'transparent',
                    border: `1px solid ${config.color}`,
                    borderRadius: radius.md,
                    color: i === 0 ? colors.surface.base : config.color,
                    fontSize: typography.size.xs,
                    fontWeight: typography.weight.bold,
                    cursor: 'pointer',
                    transition: transitions.fast,
                  }}
                >
                  {isArabic ? action.labelAr || action.label : action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
InfoCard.displayName = 'InfoCard';

// ═══════════════════════════════════════════════════════════════════════════
// GUIDANCE STEPS
// ═══════════════════════════════════════════════════════════════════════════

export const GuidanceSteps = memo(({
  steps,
  title,
  titleAr,
  currentStep = 0,
  isArabic = false,
  variant = 'numbered',
}: GuidanceStepsProps) => {
  const { t } = useLanguage();
  return (
    <div style={{
      padding: spacing[5],
      background: colors.surface.card,
      border: `1px solid ${colors.border.default}`,
      borderRadius: radius.xl,
    }}>
      {(title || titleAr) && (
        <h3 style={{
          margin: `0 0 ${spacing[4]}px`,
          fontSize: typography.size.lg,
          fontWeight: typography.weight.bold,
          color: colors.text.primary,
        }}>
          {isArabic ? t(titleAr, title) : title}
        </h3>
      )}

      {variant === 'progress' && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing[2],
          marginBottom: spacing[4],
        }}>
          {steps.map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 4,
                borderRadius: radius.full,
                background: i <= currentStep
                  ? `linear-gradient(90deg, ${brandCyan}, ${brandPurple})`
                  : colors.border.default,
                transition: transitions.normal,
              }}
            />
          ))}
        </div>
      )}

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: spacing[3],
      }}>
        {steps.map((step, i) => {
          const isActive = i === currentStep;
          const isCompleted = step.completed || i < currentStep;
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: spacing[3],
                padding: spacing[3],
                background: isActive ? `${brandCyan}10` : 'transparent',
                borderRadius: radius.lg,
                opacity: isCompleted || isActive ? 1 : 0.5,
                transition: transitions.fast,
              }}
            >
              {/* Step indicator */}
              <div style={{
                width: 32,
                height: 32,
                borderRadius: variant === 'numbered' ? radius.md : radius.full,
                background: isCompleted
                  ? `linear-gradient(135deg, ${brandCyan}, ${brandPurple})`
                  : isActive
                  ? `${brandCyan}20`
                  : colors.border.default,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: variant === 'numbered' ? typography.size.sm : 16,
                fontWeight: typography.weight.bold,
                color: isCompleted
                  ? colors.surface.base
                  : isActive
                  ? brandCyan
                  : colors.text.muted,
                flexShrink: 0,
              }}>
                {isCompleted ? '✓' : variant === 'numbered' ? i + 1 : step.icon || '○'}
              </div>

              {/* Content */}
              <div>
                <h4 style={{
                  margin: `0 0 ${spacing[1]}px`,
                  fontSize: typography.size.sm,
                  fontWeight: typography.weight.bold,
                  color: isActive ? brandCyan : isCompleted ? colors.text.primary : colors.text.muted,
                }}>
                  {isArabic ? step.titleAr || step.title : step.title}
                </h4>
                <p style={{
                  margin: 0,
                  fontSize: typography.size.xs,
                  color: colors.text.secondary,
                  lineHeight: typography.lineHeight.relaxed,
                }}>
                  {isArabic ? step.descriptionAr || step.description : step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});
GuidanceSteps.displayName = 'GuidanceSteps';

// ═══════════════════════════════════════════════════════════════════════════
// QUICK ACTIONS CARD
// ═══════════════════════════════════════════════════════════════════════════

interface QuickAction {
  id: string;
  label: string;
  labelAr?: string;
  icon: ReactNode;
  onClick: () => void;
  color?: string;
}

interface QuickActionsCardProps {
  actions: QuickAction[];
  title?: string;
  titleAr?: string;
  isArabic?: boolean;
  columns?: number;
}

export const QuickActionsCard = memo(({
  actions,
  title,
  titleAr,
  isArabic = false,
  columns = 2,
}: QuickActionsCardProps) => {
  const { t } = useLanguage();
  return (
    <div style={{
      padding: spacing[4],
      background: colors.surface.card,
      border: `1px solid ${colors.border.default}`,
      borderRadius: radius.xl,
    }}>
      {(title || titleAr) && (
        <h3 style={{
          margin: `0 0 ${spacing[3]}px`,
          fontSize: typography.size.sm,
          fontWeight: typography.weight.bold,
          color: colors.text.primary,
        }}>
          {isArabic ? t(titleAr, title) : title}
        </h3>
      )}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: spacing[2],
      }}>
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            style={{
              padding: spacing[3],
              background: `${action.color || brandCyan}10`,
              border: `1px solid ${action.color || brandCyan}20`,
              borderRadius: radius.lg,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: spacing[2],
              transition: transitions.fast,
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', fontSize: 24 }}>{action.icon}</span>
            <span style={{
              fontSize: typography.size.xs,
              fontWeight: typography.weight.semibold,
              color: action.color || brandCyan,
              textAlign: 'center',
            }}>
              {isArabic ? action.labelAr || action.label : action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
});
QuickActionsCard.displayName = 'QuickActionsCard';

export default TipsCard;
