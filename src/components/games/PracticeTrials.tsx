/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * LOTUS SOUND LAB - Practice Trials Component
 * Guided introduction to assessment modules with instruction flow
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useCallback, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  brand,
  colors,
  gradients,
  shadows,
  spacing,
  radius,
  typography,
  transitions,
  cards,
  buttons,
  instructionFlow,
} from '../../styles';
import { renderLabIcon } from '../icons/index';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface PracticeStep {
  id: string;
  type: 'instruction' | 'practice' | 'feedback';
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  icon: string;
  action?: 'tap' | 'listen' | 'watch' | 'respond';
  duration?: number; // seconds
}

interface PracticeModule {
  id: string;
  name: string;
  nameAr: string;
  icon: string;
  color: string;
  steps: PracticeStep[];
  targetSkill: string;
  targetSkillAr: string;
}

interface PracticeTrialsProps {
  moduleId: string;
  onComplete: (results: PracticeResults) => void;
  onSkip?: () => void;
}

interface PracticeResults {
  moduleId: string;
  stepsCompleted: number;
  totalSteps: number;
  practiceScores: number[];
  readyForAssessment: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════════════════

const practiceModules: Record<string, PracticeModule> = {
  attention: {
    id: 'attention',
    name: 'Attention Practice',
    nameAr: 'تدريب الانتباه',
    icon: '🎯',
    color: brand.cyan,
    targetSkill: 'Selective Attention',
    targetSkillAr: 'الانتباه الانتقائي',
    steps: [
      {
        id: 'attention-intro',
        type: 'instruction',
        title: 'Welcome to Attention Training',
        titleAr: 'مرحباً بك في تدريب الانتباه',
        description: 'This exercise helps measure your ability to focus on specific sounds while ignoring distractions.',
        descriptionAr: 'يساعد هذا التمرين في قياس قدرتك على التركيز على أصوات معينة مع تجاهل المشتتات.',
        icon: '👋',
      },
      {
        id: 'attention-explain',
        type: 'instruction',
        title: 'How It Works',
        titleAr: 'كيف يعمل',
        description: 'You will hear different sounds. Tap the button ONLY when you hear the target sound (a bell). Don\'t tap for other sounds.',
        descriptionAr: 'ستسمع أصواتاً مختلفة. اضغط على الزر فقط عندما تسمع الصوت المستهدف (الجرس). لا تضغط للأصوات الأخرى.',
        icon: '🔔',
        action: 'tap',
      },
      {
        id: 'attention-demo',
        type: 'practice',
        title: 'Let\'s Practice',
        titleAr: 'لنتدرب',
        description: 'Try it now! Tap when you hear the bell sound.',
        descriptionAr: 'جربها الآن! اضغط عندما تسمع صوت الجرس.',
        icon: '🎮',
        action: 'tap',
        duration: 15,
      },
      {
        id: 'attention-feedback',
        type: 'feedback',
        title: 'Great Job!',
        titleAr: 'عمل رائع!',
        description: 'You\'ve got the idea! Remember: quick and accurate responses are key.',
        descriptionAr: 'لقد فهمت الفكرة! تذكر: الاستجابات السريعة والدقيقة هي المفتاح.',
        icon: '⭐',
      },
    ],
  },
  frequency: {
    id: 'frequency',
    name: 'Frequency Practice',
    nameAr: 'تدريب التردد',
    icon: '〰️',
    color: brand.purple,
    targetSkill: 'Pitch Discrimination',
    targetSkillAr: 'تمييز النغمة',
    steps: [
      {
        id: 'freq-intro',
        type: 'instruction',
        title: 'Frequency Discrimination',
        titleAr: 'تمييز التردد',
        description: 'This exercise measures how well you can tell the difference between high and low sounds.',
        descriptionAr: 'يقيس هذا التمرين مدى قدرتك على التمييز بين الأصوات العالية والمنخفضة.',
        icon: '🎵',
      },
      {
        id: 'freq-explain',
        type: 'instruction',
        title: 'High vs Low',
        titleAr: 'عالي مقابل منخفض',
        description: 'You\'ll hear two sounds. Tell us which one is higher in pitch by pressing the correct button.',
        descriptionAr: 'ستسمع صوتين. أخبرنا أيهما أعلى نغمة بالضغط على الزر الصحيح.',
        icon: '📊',
        action: 'listen',
      },
      {
        id: 'freq-demo',
        type: 'practice',
        title: 'Practice Round',
        titleAr: 'جولة تدريبية',
        description: 'Listen carefully to both sounds, then select which one was higher.',
        descriptionAr: 'استمع بعناية لكلا الصوتين، ثم اختر أيهما كان أعلى.',
        icon: '🎧',
        action: 'respond',
        duration: 20,
      },
      {
        id: 'freq-feedback',
        type: 'feedback',
        title: 'Well Done!',
        titleAr: 'أحسنت!',
        description: 'You\'re ready for the full assessment. The actual test will gradually get more challenging.',
        descriptionAr: 'أنت جاهز للتقييم الكامل. سيصبح الاختبار الفعلي أكثر صعوبة تدريجياً.',
        icon: '🏆',
      },
    ],
  },
  sequencing: {
    id: 'sequencing',
    name: 'Sequencing Practice',
    nameAr: 'تدريب التسلسل',
    icon: '📋',
    color: brand.pink,
    targetSkill: 'Auditory Memory',
    targetSkillAr: 'الذاكرة السمعية',
    steps: [
      {
        id: 'seq-intro',
        type: 'instruction',
        title: 'Auditory Sequencing',
        titleAr: 'التسلسل السمعي',
        description: 'This exercise tests your ability to remember and repeat sound patterns in the correct order.',
        descriptionAr: 'يختبر هذا التمرين قدرتك على تذكر أنماط الأصوات وتكرارها بالترتيب الصحيح.',
        icon: '🧠',
      },
      {
        id: 'seq-explain',
        type: 'instruction',
        title: 'Remember the Pattern',
        titleAr: 'تذكر النمط',
        description: 'Listen to a sequence of tones, then tap them back in the same order. The sequences will get longer as you progress.',
        descriptionAr: 'استمع إلى سلسلة من النغمات، ثم أعد تكرارها بنفس الترتيب. ستصبح التسلسلات أطول كلما تقدمت.',
        icon: '🔢',
        action: 'listen',
      },
      {
        id: 'seq-demo',
        type: 'practice',
        title: 'Try a Simple Pattern',
        titleAr: 'جرب نمطاً بسيطاً',
        description: 'Let\'s start with just 3 tones. Listen carefully, then tap them back.',
        descriptionAr: 'لنبدأ بـ 3 نغمات فقط. استمع بعناية، ثم أعد تكرارها.',
        icon: '🎹',
        action: 'tap',
        duration: 25,
      },
      {
        id: 'seq-feedback',
        type: 'feedback',
        title: 'Excellent!',
        titleAr: 'ممتاز!',
        description: 'You understand the task. The assessment will measure your maximum memory span.',
        descriptionAr: 'أنت تفهم المهمة. سيقيس التقييم أقصى مدى لذاكرتك.',
        icon: '💫',
      },
    ],
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const styles = {
  container: {
    ...instructionFlow.instructionOverlay,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[4],
  } as React.CSSProperties,

  card: {
    ...instructionFlow.instructionCard,
    maxWidth: '500px',
    width: '100%',
    position: 'relative' as const,
  } as React.CSSProperties,

  header: {
    textAlign: 'center' as const,
    marginBottom: spacing[6],
  } as React.CSSProperties,

  moduleIcon: {
    fontSize: '3rem',
    marginBottom: spacing[2],
  } as React.CSSProperties,

  moduleName: {
    fontSize: typography.size.sm,
    color: colors.text.muted,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  } as React.CSSProperties,

  stepIndicator: {
    ...instructionFlow.stepIndicator,
    marginBottom: spacing[6],
  } as React.CSSProperties,

  stepDot: {
    ...instructionFlow.stepDot,
  } as React.CSSProperties,

  stepDotActive: {
    ...instructionFlow.stepDotActive,
  } as React.CSSProperties,

  stepDotComplete: {
    ...instructionFlow.stepDotComplete,
    background: brand.cyan,
  } as React.CSSProperties,

  stepContent: {
    textAlign: 'center' as const,
    marginBottom: spacing[6],
  } as React.CSSProperties,

  stepIcon: {
    ...instructionFlow.instructionIcon,
  } as React.CSSProperties,

  stepTitle: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    marginBottom: spacing[3],
  } as React.CSSProperties,

  stepDescription: {
    fontSize: typography.size.base,
    color: colors.text.secondary,
    lineHeight: 1.7,
    maxWidth: '400px',
    margin: '0 auto',
  } as React.CSSProperties,

  practiceArea: {
    background: `${brand.ink}`,
    borderRadius: radius.xl,
    padding: spacing[8],
    marginBottom: spacing[6],
    textAlign: 'center' as const,
    border: `2px dashed ${brand.cyan}40`,
  } as React.CSSProperties,

  practiceButton: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    background: gradients.cyanPurple,
    border: 'none',
    cursor: 'pointer',
    fontSize: '2rem',
    color: colors.text.primary,
    transition: transitions.fast,
    boxShadow: shadows.glow.cyan,
  } as React.CSSProperties,

  practiceTimer: {
    marginTop: spacing[4],
    fontSize: typography.size.lg,
    color: brand.cyan,
    fontFamily: 'monospace',
  } as React.CSSProperties,

  practiceHint: {
    ...instructionFlow.practiceLabel,
    marginTop: spacing[4],
  } as React.CSSProperties,

  actions: {
    ...instructionFlow.actionButtons,
  } as React.CSSProperties,

  skipButton: {
    ...instructionFlow.skipButton,
  } as React.CSSProperties,

  continueButton: {
    ...instructionFlow.continueButton,
  } as React.CSSProperties,

  progressBar: {
    height: '4px',
    background: colors.surface.input,
    borderRadius: radius.full,
    overflow: 'hidden',
    marginBottom: spacing[4],
  } as React.CSSProperties,

  progressFill: {
    height: '100%',
    background: gradients.cyanPurple,
    transition: 'width 0.3s ease',
  } as React.CSSProperties,
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const PracticeTrials: React.FC<PracticeTrialsProps> = ({
  moduleId,
  onComplete,
  onSkip,
}) => {
  const { isArabic } = useLanguage();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [practiceScores, setPracticeScores] = useState<number[]>([]);
  const [isPracticing, setIsPracticing] = useState(false);
  const [practiceTimeLeft, setPracticeTimeLeft] = useState(0);

  const module = practiceModules[moduleId] || practiceModules.attention;
  const currentStep = module.steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / module.steps.length) * 100;

  const handleNextStep = useCallback(() => {
    if (currentStepIndex < module.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      // Complete practice
      onComplete({
        moduleId: module.id,
        stepsCompleted: module.steps.length,
        totalSteps: module.steps.length,
        practiceScores,
        readyForAssessment: true,
      });
    }
  }, [currentStepIndex, module, practiceScores, onComplete]);

  const handleStartPractice = useCallback(() => {
    setIsPracticing(true);
    const duration = currentStep.duration || 15;
    setPracticeTimeLeft(duration);

    const interval = setInterval(() => {
      setPracticeTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsPracticing(false);
          setPracticeScores(scores => [...scores, Math.floor(Math.random() * 40) + 60]);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [currentStep]);

  const handlePracticeResponse = useCallback(() => {
    if (isPracticing) {
      // Simulate response feedback
      setPracticeScores(scores => [...scores, Math.floor(Math.random() * 30) + 70]);
    }
  }, [isPracticing]);

  const handleSkip = useCallback(() => {
    onSkip?.();
  }, [onSkip]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div style={{ ...styles.moduleIcon, color: module.color }}>{module.icon}</div>
          <p style={styles.moduleName}>
            {isArabic ? module.nameAr : module.name}
          </p>
        </div>

        {/* Progress Bar */}
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${progress}%` }} />
        </div>

        {/* Step Indicator */}
        <div style={styles.stepIndicator}>
          {module.steps.map((step, idx) => (
            <div
              key={step.id}
              style={{
                ...styles.stepDot,
                ...(idx === currentStepIndex
                  ? styles.stepDotActive
                  : idx < currentStepIndex
                  ? styles.stepDotComplete
                  : {}),
              }}
            />
          ))}
        </div>

        {/* Step Content */}
        <div style={styles.stepContent}>
          <div style={styles.stepIcon}>{currentStep.icon}</div>
          <h2 style={styles.stepTitle}>
            {isArabic ? currentStep.titleAr : currentStep.title}
          </h2>
          <p style={styles.stepDescription}>
            {isArabic ? currentStep.descriptionAr : currentStep.description}
          </p>
        </div>

        {/* Practice Area (for practice steps) */}
        {currentStep.type === 'practice' && (
          <div style={styles.practiceArea}>
            {!isPracticing ? (
              <button
                style={styles.practiceButton}
                onClick={handleStartPractice}
              >
                {renderLabIcon('\U0001F3AC', { size: 18, tone: 'cyan' })}
              </button>
            ) : (
              <>
                <button
                  style={{
                    ...styles.practiceButton,
                    transform: 'scale(1.1)',
                    animation: 'pulse 0.5s infinite',
                  }}
                  onClick={handlePracticeResponse}
                >
                  {renderLabIcon('\U0001F3AF', { size: 22, tone: 'cyan' })}
                </button>
                <div style={styles.practiceTimer}>
                  {practiceTimeLeft}s
                </div>
              </>
            )}
            <p style={styles.practiceHint}>
              {isPracticing ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: spacing[1] }}>
                  {renderLabIcon('\U0001F3A7', { size: 16, tone: 'cyan' })}
                  <span>{isArabic ? 'استمع واضغط!' : 'Listen and tap!'}</span>
                </span>
              ) : (
                isArabic ? 'اضغط للبدء' : 'Tap to start'
              )}
            </p>
          </div>
        )}

        {/* Actions */}
        <div style={styles.actions}>
          {onSkip && currentStepIndex === 0 && (
            <button style={styles.skipButton} onClick={handleSkip}>
              {isArabic ? 'تخطي التدريب' : 'Skip Practice'}
            </button>
          )}
          <button
            style={{
              ...styles.continueButton,
              opacity: isPracticing ? 0.5 : 1,
              cursor: isPracticing ? 'not-allowed' : 'pointer',
            }}
            onClick={handleNextStep}
            disabled={isPracticing}
          >
            {currentStepIndex === module.steps.length - 1
              ? isArabic ? 'ابدأ التقييم' : 'Start Assessment'
              : isArabic ? 'التالي →' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PracticeTrials;
