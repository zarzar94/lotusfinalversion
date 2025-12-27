/**
 * WelcomeModal - First-time visitor onboarding experience
 * Guides users to choose their path and understand the platform
 */

import { memo, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useVisitorMode, type VisitorMode } from '../context/VisitorModeContext';
import {
  brandCyan,
  brandPurple,
  brandPink,
  brandInk,
  colors,
  typography,
  spacing,
  radius,
  shadows,
  transitions,
} from './styles';
import { renderLabIcon, BrainCircuitIcon, SparklesIcon } from './icons/index';

const WELCOME_STORAGE_KEY = 'lotus_welcome_shown';

interface WelcomeModalProps {
  forceShow?: boolean;
  onClose?: () => void;
}

const WelcomeModal = memo(({ forceShow = false, onClose }: WelcomeModalProps) => {
  const { isArabic, t } = useLanguage();
  const { setMode } = useVisitorMode();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState<'welcome' | 'choose-path' | 'complete'>('welcome');
  const [selectedPath, setSelectedPath] = useState<VisitorMode | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Check if this is the first visit
  useEffect(() => {
    if (forceShow) {
      setIsVisible(true);
      return;
    }

    const hasSeenWelcome = localStorage.getItem(WELCOME_STORAGE_KEY);
    if (!hasSeenWelcome) {
      // Delay showing modal to let page load first
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [forceShow]);

  const handleClose = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsVisible(false);
      localStorage.setItem(WELCOME_STORAGE_KEY, 'true');
      onClose?.();
    }, 300);
  }, [onClose]);

  const handlePathSelect = useCallback((path: VisitorMode) => {
    setSelectedPath(path);
    setMode(path);
  }, [setMode]);

  const handleContinue = useCallback(() => {
    if (step === 'welcome') {
      setStep('choose-path');
    } else if (step === 'choose-path' && selectedPath) {
      setStep('complete');
      // Auto-close after showing completion message
      setTimeout(() => {
        handleClose();
        // Navigate to recommended page based on path
        const routes: Record<VisitorMode, string> = {
          school: '/assessment',
          parent: '/program',
          clinician: '/science',
        };
        navigate(routes[selectedPath]);
      }, 2000);
    }
  }, [step, selectedPath, handleClose, navigate]);

  const handleSkip = useCallback(() => {
    handleClose();
  }, [handleClose]);

  if (!isVisible) return null;

  const paths = [
    {
      id: 'school' as VisitorMode,
      icon: '🏫',
      title: isArabic ? 'مدرسة / مؤسسة' : 'School / Institution',
      description: isArabic
        ? 'ابحث عن حلول للطلاب وبرامج الشراكة'
        : 'Looking for student solutions and partnership programs',
      color: 'colors.warning',
      recommended: isArabic ? 'التقييم' : 'Assessment',
    },
    {
      id: 'parent' as VisitorMode,
      icon: '👨‍👩‍👧',
      title: isArabic ? 'ولي أمر / عائلة' : 'Parent / Family',
      description: isArabic
        ? 'أريد مساعدة طفلي في التحديات السمعية'
        : 'I want to help my child with auditory challenges',
      color: brandPurple,
      recommended: isArabic ? 'البرنامج' : 'Program',
    },
    {
      id: 'clinician' as VisitorMode,
      icon: '👨‍⚕️',
      title: isArabic ? 'أخصائي / متخصص' : 'Clinician / Professional',
      description: isArabic
        ? 'مهتم بالأبحاث والبروتوكولات السريرية'
        : 'Interested in research and clinical protocols',
      color: brandPink,
      recommended: isArabic ? 'العلم' : 'Science',
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleSkip}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: spacing[4],
          opacity: isAnimating ? 0 : 1,
          transition: 'opacity 0.3s ease',
        }}
      >
        {/* Modal */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: `linear-gradient(180deg, ${brandInk} 0%, #0a0d15 100%)`,
            borderRadius: radius['2xl'],
            border: `1px solid ${colors.border.emphasis}`,
            maxWidth: 560,
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative',
            boxShadow: `${shadows['2xl']}, 0 0 100px ${brandCyan}15`,
            transform: isAnimating ? 'scale(0.95)' : 'scale(1)',
            opacity: isAnimating ? 0 : 1,
            transition: 'all 0.3s ease',
            direction: isArabic ? 'rtl' : 'ltr',
          }}
        >
          {/* Top glow bar */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              background: `linear-gradient(90deg, ${brandCyan}, ${brandPurple}, ${brandPink})`,
              borderRadius: `${radius['2xl']}px ${radius['2xl']}px 0 0`,
            }}
          />

          {/* Content */}
          <div style={{ padding: spacing[8] }}>
            {/* Welcome Step */}
            {step === 'welcome' && (
              <div style={{ textAlign: 'center' }}>
                {/* Logo/Icon */}
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${brandCyan}20, ${brandPurple}20)`,
                    border: `2px solid ${brandCyan}30`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    marginBottom: spacing[6],
                  }}
                >
                  <BrainCircuitIcon size={40} tone="cyan" />
                </div>

                {/* Title */}
                <h2
                  style={{
                    margin: 0,
                    fontSize: typography.size['3xl'],
                    fontWeight: typography.weight.black,
                    color: colors.text.primary,
                    marginBottom: spacing[3],
                    background: `linear-gradient(135deg, ${colors.text.primary}, ${brandCyan})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {isArabic ? 'مرحباً بك في لوتس' : 'Welcome to Lotus'}
                </h2>

                {/* Subtitle */}
                <p
                  style={{
                    margin: 0,
                    fontSize: typography.size.lg,
                    color: colors.text.secondary,
                    marginBottom: spacing[6],
                    lineHeight: typography.lineHeight.relaxed,
                  }}
                >
                  {isArabic
                    ? 'مركز بيرار للتكامل السمعي - نساعدك في رحلتك نحو التحسن'
                    : 'Bérard Auditory Integration Training - We guide your journey to improvement'}
                </p>

                {/* Feature highlights */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: spacing[4],
                    marginBottom: spacing[8],
                  }}
                >
                  {[
                    { icon: '🎯', label: isArabic ? 'تقييم ذاتي' : 'Self-Assessment' },
                    { icon: '📊', label: isArabic ? 'نتائج مثبتة' : 'Proven Results' },
                    { icon: '🔬', label: isArabic ? 'علم متقدم' : 'Advanced Science' },
                  ].map((feature) => (
                    <div
                      key={feature.label}
                      style={{
                        padding: spacing[3],
                        background: `${brandCyan}08`,
                        borderRadius: radius.lg,
                        border: `1px solid ${brandCyan}15`,
                      }}
                    >
                      <div style={{ fontSize: 24, marginBottom: spacing[2] }}>
                        {renderLabIcon(feature.icon, { size: 24, style: { color: brandCyan } })}
                      </div>
                      <div
                        style={{
                          fontSize: typography.size.sm,
                          color: colors.text.secondary,
                          fontWeight: typography.weight.medium,
                        }}
                      >
                        {feature.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  onClick={handleContinue}
                  style={{
                    width: '100%',
                    padding: `${spacing[4]}px ${spacing[6]}px`,
                    background: `linear-gradient(135deg, ${brandCyan}, ${brandPurple})`,
                    border: 'none',
                    borderRadius: radius.lg,
                    color: brandInk,
                    fontSize: typography.size.lg,
                    fontWeight: typography.weight.black,
                    cursor: 'pointer',
                    transition: transitions.bounce,
                    boxShadow: shadows.glow.cyan,
                  }}
                >
                  {isArabic ? 'هيا نبدأ' : "Let's Get Started"}
                </button>

                {/* Skip link */}
                <button
                  onClick={handleSkip}
                  style={{
                    marginTop: spacing[4],
                    background: 'none',
                    border: 'none',
                    color: colors.text.muted,
                    fontSize: typography.size.sm,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  {isArabic ? 'تخطي والاستكشاف' : 'Skip and explore'}
                </button>
              </div>
            )}

            {/* Choose Path Step */}
            {step === 'choose-path' && (
              <div>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: spacing[6] }}>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: typography.size['2xl'],
                      fontWeight: typography.weight.black,
                      color: colors.text.primary,
                      marginBottom: spacing[2],
                    }}
                  >
                    {isArabic ? 'من أنت؟' : 'Who are you?'}
                  </h2>
                  <p
                    style={{
                      margin: 0,
                      fontSize: typography.size.base,
                      color: colors.text.secondary,
                    }}
                  >
                    {isArabic
                      ? 'سنخصص تجربتك بناءً على احتياجاتك'
                      : "We'll personalize your experience based on your needs"}
                  </p>
                </div>

                {/* Path Cards */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: spacing[3],
                    marginBottom: spacing[6],
                  }}
                >
                  {paths.map((path) => (
                    <button
                      key={path.id}
                      onClick={() => handlePathSelect(path.id)}
                      style={{
                        width: '100%',
                        padding: spacing[5],
                        background:
                          selectedPath === path.id
                            ? `linear-gradient(135deg, ${path.color}15, ${path.color}08)`
                            : colors.surface.card,
                        border: `2px solid ${selectedPath === path.id ? path.color : colors.border.default}`,
                        borderRadius: radius.xl,
                        cursor: 'pointer',
                        textAlign: isArabic ? 'right' : 'left',
                        transition: transitions.bounce,
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      {/* Selection indicator */}
                      {selectedPath === path.id && (
                        <div
                          style={{
                            position: 'absolute',
                            top: spacing[3],
                            [isArabic ? 'left' : 'right']: spacing[3],
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            background: path.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: 14,
                          }}
                        >
                          {renderLabIcon('\u2713', { size: 14, tone: 'success' })}
                        </div>
                      )}

                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: spacing[4] }}>
                        {/* Icon */}
                        <div
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: radius.lg,
                            background: `${path.color}20`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          {renderLabIcon(path.icon, { size: 24, style: { color: path.color } })}
                        </div>

                        {/* Text */}
                        <div style={{ flex: 1 }}>
                          <h3
                            style={{
                              margin: 0,
                              fontSize: typography.size.lg,
                              fontWeight: typography.weight.bold,
                              color: selectedPath === path.id ? path.color : colors.text.primary,
                              marginBottom: spacing[1],
                            }}
                          >
                            {path.title}
                          </h3>
                          <p
                            style={{
                              margin: 0,
                              fontSize: typography.size.sm,
                              color: colors.text.secondary,
                              lineHeight: typography.lineHeight.relaxed,
                            }}
                          >
                            {path.description}
                          </p>
                        </div>
                      </div>

                      {/* Recommended badge */}
                      {selectedPath === path.id && (
                        <div
                          style={{
                            marginTop: spacing[3],
                            padding: `${spacing[1]}px ${spacing[3]}px`,
                            background: `${path.color}15`,
                            borderRadius: radius.full,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: spacing[1],
                          }}
                        >
                          <span style={{ fontSize: 12 }}>
                            <SparklesIcon size={12} tone="cyan" />
                          </span>
                          <span
                            style={{
                              fontSize: typography.size.xs,
                              color: path.color,
                              fontWeight: typography.weight.bold,
                            }}
                          >
                            {isArabic ? `نوصي بـ: ${path.recommended}` : `Recommended: ${path.recommended}`}
                          </span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Continue Button */}
                <button
                  onClick={handleContinue}
                  disabled={!selectedPath}
                  style={{
                    width: '100%',
                    padding: `${spacing[4]}px ${spacing[6]}px`,
                    background: selectedPath
                      ? `linear-gradient(135deg, ${brandCyan}, ${brandPurple})`
                      : colors.border.default,
                    border: 'none',
                    borderRadius: radius.lg,
                    color: selectedPath ? brandInk : colors.text.muted,
                    fontSize: typography.size.lg,
                    fontWeight: typography.weight.black,
                    cursor: selectedPath ? 'pointer' : 'not-allowed',
                    transition: transitions.bounce,
                    boxShadow: selectedPath ? shadows.glow.cyan : 'none',
                  }}
                >
                  {isArabic ? 'متابعة' : 'Continue'}
                </button>
              </div>
            )}

            {/* Complete Step */}
            {step === 'complete' && selectedPath && (
              <div style={{ textAlign: 'center' }}>
                {/* Success animation */}
                <div
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${brandCyan}20, ${brandPurple}20)`,
                    border: `3px solid ${brandCyan}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    marginBottom: spacing[6],
                    fontSize: 50,
                    animation: 'successPop 0.5s ease-out',
                  }}
                >
                  {renderLabIcon('\u2713', { size: 40, tone: 'success' })}
                </div>

                <h2
                  style={{
                    margin: 0,
                    fontSize: typography.size['2xl'],
                    fontWeight: typography.weight.black,
                    color: colors.text.primary,
                    marginBottom: spacing[3],
                  }}
                >
                  {isArabic ? 'تم تخصيص تجربتك!' : 'Your experience is personalized!'}
                </h2>

                <p
                  style={{
                    margin: 0,
                    fontSize: typography.size.base,
                    color: colors.text.secondary,
                    marginBottom: spacing[4],
                  }}
                >
                  {isArabic
                    ? 'جاري توجيهك إلى الصفحة الموصى بها...'
                    : 'Redirecting you to the recommended page...'}
                </p>

                {/* Loading indicator */}
                <div
                  style={{
                    width: 200,
                    height: 4,
                    background: colors.border.default,
                    borderRadius: radius.full,
                    margin: '0 auto',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      background: `linear-gradient(90deg, ${brandCyan}, ${brandPurple})`,
                      borderRadius: radius.full,
                      animation: 'loadingProgress 2s ease-out forwards',
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Step indicator */}
          {step !== 'complete' && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: spacing[2],
                paddingBottom: spacing[6],
              }}
            >
              {['welcome', 'choose-path'].map((s, i) => (
                <div
                  key={s}
                  style={{
                    width: step === s ? 24 : 8,
                    height: 8,
                    borderRadius: radius.full,
                    background: step === s ? brandCyan : colors.border.emphasis,
                    transition: transitions.normal,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes successPop {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes loadingProgress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </>
  );
});

WelcomeModal.displayName = 'WelcomeModal';

export default WelcomeModal;
