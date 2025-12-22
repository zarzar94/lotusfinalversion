/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * LOTUS SOUND LAB - Virtual Assessment Flow
 * Complete guided assessment experience from intake to results
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useCallback, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  brand,
  gradients,
  shadows,
  spacing,
  radius,
  typography,
  transitions,
  cards,
  buttons,
} from '../styles';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

type AssessmentStage =
  | 'welcome'
  | 'environment_check'
  | 'headphone_check'
  | 'questionnaire'
  | 'attention_test'
  | 'frequency_test'
  | 'sequencing_test'
  | 'results'
  | 'recommendations';

interface StageConfig {
  id: AssessmentStage;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  icon: string;
  duration: string;
  durationAr: string;
}

interface AssessmentResult {
  stage: AssessmentStage;
  score: number;
  maxScore: number;
  metrics: Record<string, number>;
  timestamp: number;
}

interface VirtualAssessmentFlowProps {
  patientName?: string;
  onComplete?: (results: AssessmentResult[]) => void;
  onExit?: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════════
// STAGE CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const stages: StageConfig[] = [
  {
    id: 'welcome',
    title: 'Welcome to Your Assessment',
    titleAr: 'مرحباً بك في التقييم',
    description: 'This comprehensive assessment will help us understand your auditory processing abilities.',
    descriptionAr: 'سيساعدنا هذا التقييم الشامل على فهم قدراتك على المعالجة السمعية.',
    icon: '👋',
    duration: '1 min',
    durationAr: '1 دقيقة',
  },
  {
    id: 'environment_check',
    title: 'Environment Check',
    titleAr: 'فحص البيئة',
    description: 'Let\'s make sure you\'re in a quiet environment for accurate results.',
    descriptionAr: 'دعنا نتأكد من أنك في بيئة هادئة للحصول على نتائج دقيقة.',
    icon: '🏠',
    duration: '2 min',
    durationAr: '2 دقيقة',
  },
  {
    id: 'headphone_check',
    title: 'Headphone Calibration',
    titleAr: 'معايرة سماعة الرأس',
    description: 'We\'ll verify your headphones are working correctly.',
    descriptionAr: 'سنتحقق من أن سماعاتك تعمل بشكل صحيح.',
    icon: '🎧',
    duration: '2 min',
    durationAr: '2 دقيقة',
  },
  {
    id: 'questionnaire',
    title: 'Background Questionnaire',
    titleAr: 'استبيان الخلفية',
    description: 'Answer some questions about your hearing and listening experiences.',
    descriptionAr: 'أجب عن بعض الأسئلة حول تجاربك السمعية.',
    icon: '📋',
    duration: '5 min',
    durationAr: '5 دقائق',
  },
  {
    id: 'attention_test',
    title: 'Attention Test',
    titleAr: 'اختبار الانتباه',
    description: 'Test your ability to focus on specific sounds.',
    descriptionAr: 'اختبر قدرتك على التركيز على أصوات محددة.',
    icon: '🎯',
    duration: '5 min',
    durationAr: '5 دقائق',
  },
  {
    id: 'frequency_test',
    title: 'Frequency Discrimination',
    titleAr: 'تمييز التردد',
    description: 'Test your ability to distinguish between different pitches.',
    descriptionAr: 'اختبر قدرتك على التمييز بين النغمات المختلفة.',
    icon: '〰️',
    duration: '5 min',
    durationAr: '5 دقائق',
  },
  {
    id: 'sequencing_test',
    title: 'Auditory Sequencing',
    titleAr: 'التسلسل السمعي',
    description: 'Test your ability to remember sound patterns.',
    descriptionAr: 'اختبر قدرتك على تذكر أنماط الأصوات.',
    icon: '📊',
    duration: '5 min',
    durationAr: '5 دقائق',
  },
  {
    id: 'results',
    title: 'Your Results',
    titleAr: 'نتائجك',
    description: 'Review your assessment results and scores.',
    descriptionAr: 'راجع نتائج ودرجات تقييمك.',
    icon: '📈',
    duration: '3 min',
    durationAr: '3 دقائق',
  },
  {
    id: 'recommendations',
    title: 'Recommendations',
    titleAr: 'التوصيات',
    description: 'Personalized recommendations based on your results.',
    descriptionAr: 'توصيات مخصصة بناءً على نتائجك.',
    icon: '💡',
    duration: '2 min',
    durationAr: '2 دقيقة',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const styles = {
  container: {
    minHeight: '100vh',
    background: brand.ink,
    display: 'flex',
    flexDirection: 'column' as const,
  } as React.CSSProperties,

  progressBar: {
    height: '4px',
    background: '#333',
    position: 'sticky' as const,
    top: 0,
    zIndex: 100,
  } as React.CSSProperties,

  progressFill: {
    height: '100%',
    background: gradients.cyanPurple,
    transition: 'width 0.5s ease',
  } as React.CSSProperties,

  header: {
    padding: `${spacing[4]} ${spacing[6]}`,
    borderBottom: '1px solid #333',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  } as React.CSSProperties,

  logo: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    background: gradients.primary,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
  } as React.CSSProperties,

  exitButton: {
    ...buttons.ghost,
    padding: `${spacing[2]} ${spacing[4]}`,
    borderRadius: radius.full,
  } as React.CSSProperties,

  main: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing[6],
  } as React.CSSProperties,

  stageContainer: {
    maxWidth: '700px',
    width: '100%',
    textAlign: 'center' as const,
  } as React.CSSProperties,

  stageIcon: {
    fontSize: '5rem',
    marginBottom: spacing[4],
  } as React.CSSProperties,

  stageTitle: {
    fontSize: typography.size['3xl'],
    fontWeight: typography.weight.bold,
    color: '#fff',
    marginBottom: spacing[3],
  } as React.CSSProperties,

  stageDescription: {
    fontSize: typography.size.lg,
    color: '#888',
    marginBottom: spacing[8],
    lineHeight: 1.6,
    maxWidth: '500px',
    margin: '0 auto',
    marginBottom: spacing[8],
  } as React.CSSProperties,

  stageCard: {
    ...cards.glass,
    padding: spacing[8],
    marginBottom: spacing[6],
  } as React.CSSProperties,

  environmentChecks: {
    display: 'grid',
    gap: spacing[4],
    marginBottom: spacing[6],
    textAlign: 'left' as const,
  } as React.CSSProperties,

  checkItem: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[3],
    padding: spacing[4],
    background: `${brand.panel}`,
    borderRadius: radius.lg,
    cursor: 'pointer',
    transition: transitions.fast,
  } as React.CSSProperties,

  checkItemChecked: {
    background: `${brand.cyan}15`,
    border: `1px solid ${brand.cyan}40`,
  } as React.CSSProperties,

  checkbox: {
    width: '28px',
    height: '28px',
    borderRadius: radius.md,
    border: `2px solid #444`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: typography.size.base,
    transition: transitions.fast,
    flexShrink: 0,
  } as React.CSSProperties,

  checkboxChecked: {
    background: brand.cyan,
    borderColor: brand.cyan,
    color: brand.ink,
  } as React.CSSProperties,

  checkLabel: {
    flex: 1,
  } as React.CSSProperties,

  checkTitle: {
    fontSize: typography.size.base,
    color: '#fff',
    marginBottom: spacing[1],
  } as React.CSSProperties,

  checkDescription: {
    fontSize: typography.size.sm,
    color: '#888',
  } as React.CSSProperties,

  testArea: {
    background: `${brand.ink}`,
    borderRadius: radius.xl,
    padding: spacing[8],
    marginBottom: spacing[6],
    minHeight: '300px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    border: `2px dashed ${brand.cyan}30`,
  } as React.CSSProperties,

  testButton: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    background: gradients.cyanPurple,
    border: 'none',
    cursor: 'pointer',
    fontSize: '3rem',
    color: '#fff',
    transition: transitions.fast,
    boxShadow: shadows.glow.cyan,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as React.CSSProperties,

  testInstructions: {
    marginTop: spacing[4],
    fontSize: typography.size.base,
    color: '#888',
  } as React.CSSProperties,

  questionnaire: {
    textAlign: 'left' as const,
    display: 'grid',
    gap: spacing[4],
  } as React.CSSProperties,

  questionCard: {
    background: `${brand.panel}`,
    padding: spacing[4],
    borderRadius: radius.lg,
  } as React.CSSProperties,

  questionText: {
    fontSize: typography.size.base,
    color: '#fff',
    marginBottom: spacing[3],
  } as React.CSSProperties,

  optionsGrid: {
    display: 'flex',
    gap: spacing[2],
    flexWrap: 'wrap' as const,
  } as React.CSSProperties,

  optionButton: {
    padding: `${spacing[2]} ${spacing[4]}`,
    borderRadius: radius.full,
    background: '#333',
    color: '#888',
    border: 'none',
    cursor: 'pointer',
    fontSize: typography.size.sm,
    transition: transitions.fast,
  } as React.CSSProperties,

  optionButtonSelected: {
    background: brand.cyan,
    color: brand.ink,
  } as React.CSSProperties,

  resultsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: spacing[4],
    marginBottom: spacing[6],
  } as React.CSSProperties,

  resultCard: {
    ...cards.glass,
    padding: spacing[4],
    textAlign: 'center' as const,
  } as React.CSSProperties,

  resultScore: {
    fontSize: typography.size['3xl'],
    fontWeight: typography.weight.bold,
    marginBottom: spacing[1],
  } as React.CSSProperties,

  resultLabel: {
    fontSize: typography.size.sm,
    color: '#888',
  } as React.CSSProperties,

  resultIndicator: {
    width: '100%',
    height: '6px',
    background: '#333',
    borderRadius: radius.full,
    marginTop: spacing[2],
    overflow: 'hidden',
  } as React.CSSProperties,

  resultFill: {
    height: '100%',
    borderRadius: radius.full,
    transition: 'width 0.5s ease',
  } as React.CSSProperties,

  recommendationCard: {
    ...cards.glass,
    padding: spacing[5],
    marginBottom: spacing[4],
    textAlign: 'left' as const,
    display: 'flex',
    gap: spacing[4],
  } as React.CSSProperties,

  recommendationIcon: {
    width: '50px',
    height: '50px',
    borderRadius: radius.lg,
    background: `${brand.cyan}20`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    flexShrink: 0,
  } as React.CSSProperties,

  recommendationContent: {
    flex: 1,
  } as React.CSSProperties,

  recommendationTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: '#fff',
    marginBottom: spacing[1],
  } as React.CSSProperties,

  recommendationText: {
    fontSize: typography.size.sm,
    color: '#888',
    lineHeight: 1.5,
  } as React.CSSProperties,

  footer: {
    padding: `${spacing[4]} ${spacing[6]}`,
    borderTop: '1px solid #333',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  } as React.CSSProperties,

  stageIndicator: {
    display: 'flex',
    gap: spacing[2],
    alignItems: 'center',
  } as React.CSSProperties,

  stageDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: '#333',
    transition: transitions.fast,
  } as React.CSSProperties,

  stageDotActive: {
    background: brand.cyan,
    boxShadow: `0 0 10px ${brand.cyan}`,
  } as React.CSSProperties,

  stageDotComplete: {
    background: brand.purple,
  } as React.CSSProperties,

  navButtons: {
    display: 'flex',
    gap: spacing[3],
  } as React.CSSProperties,

  backButton: {
    ...buttons.ghost,
    padding: `${spacing[3]} ${spacing[6]}`,
    borderRadius: radius.full,
  } as React.CSSProperties,

  nextButton: {
    ...buttons.primary,
    padding: `${spacing[3]} ${spacing[6]}`,
    borderRadius: radius.full,
    background: gradients.cyanPurple,
  } as React.CSSProperties,

  duration: {
    fontSize: typography.size.sm,
    color: '#666',
    display: 'flex',
    alignItems: 'center',
    gap: spacing[1],
  } as React.CSSProperties,
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const VirtualAssessmentFlow: React.FC<VirtualAssessmentFlowProps> = ({
  patientName = 'Patient',
  onComplete,
  onExit,
}) => {
  const { isArabic } = useLanguage();
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [environmentChecks, setEnvironmentChecks] = useState<Record<string, boolean>>({
    quiet: false,
    headphones: false,
    comfortable: false,
    noInterruptions: false,
  });
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState<Record<string, number>>({});
  const [results, setResults] = useState<AssessmentResult[]>([]);

  const currentStage = stages[currentStageIndex];
  const progress = ((currentStageIndex + 1) / stages.length) * 100;

  const questions = useMemo(() => [
    {
      id: 'q1',
      text: isArabic ? 'هل تجد صعوبة في فهم الكلام في الأماكن الصاخبة؟' : 'Do you have difficulty understanding speech in noisy places?',
      options: [
        { value: 1, label: isArabic ? 'أبداً' : 'Never' },
        { value: 2, label: isArabic ? 'نادراً' : 'Rarely' },
        { value: 3, label: isArabic ? 'أحياناً' : 'Sometimes' },
        { value: 4, label: isArabic ? 'غالباً' : 'Often' },
        { value: 5, label: isArabic ? 'دائماً' : 'Always' },
      ],
    },
    {
      id: 'q2',
      text: isArabic ? 'هل تحتاج إلى تكرار ما يُقال لك؟' : 'Do you often need things repeated to you?',
      options: [
        { value: 1, label: isArabic ? 'أبداً' : 'Never' },
        { value: 2, label: isArabic ? 'نادراً' : 'Rarely' },
        { value: 3, label: isArabic ? 'أحياناً' : 'Sometimes' },
        { value: 4, label: isArabic ? 'غالباً' : 'Often' },
        { value: 5, label: isArabic ? 'دائماً' : 'Always' },
      ],
    },
    {
      id: 'q3',
      text: isArabic ? 'هل أنت حساس للأصوات العالية؟' : 'Are you sensitive to loud sounds?',
      options: [
        { value: 1, label: isArabic ? 'أبداً' : 'Never' },
        { value: 2, label: isArabic ? 'نادراً' : 'Rarely' },
        { value: 3, label: isArabic ? 'أحياناً' : 'Sometimes' },
        { value: 4, label: isArabic ? 'غالباً' : 'Often' },
        { value: 5, label: isArabic ? 'دائماً' : 'Always' },
      ],
    },
  ], [isArabic]);

  const mockResults = useMemo((): AssessmentResult[] => [
    {
      stage: 'attention_test',
      score: 78,
      maxScore: 100,
      metrics: { hits: 45, misses: 5, falseAlarms: 3, reactionTime: 320 },
      timestamp: Date.now(),
    },
    {
      stage: 'frequency_test',
      score: 85,
      maxScore: 100,
      metrics: { threshold: 15, accuracy: 0.85 },
      timestamp: Date.now(),
    },
    {
      stage: 'sequencing_test',
      score: 72,
      maxScore: 100,
      metrics: { maxSpan: 5, accuracy: 0.72 },
      timestamp: Date.now(),
    },
  ], []);

  const recommendations = useMemo(() => [
    {
      icon: '🎧',
      title: isArabic ? 'تقييم Bérard AIT' : 'Bérard AIT Evaluation',
      text: isArabic
        ? 'بناءً على نتائجك، قد تستفيد من تقييم شامل لتدريب التكامل السمعي.'
        : 'Based on your results, you may benefit from a comprehensive auditory integration training evaluation.',
    },
    {
      icon: '📅',
      title: isArabic ? 'حجز استشارة' : 'Book a Consultation',
      text: isArabic
        ? 'تحدث مع أخصائي لمناقشة نتائجك وخيارات العلاج المتاحة.'
        : 'Speak with a specialist to discuss your results and available treatment options.',
    },
    {
      icon: '📊',
      title: isArabic ? 'تمارين منزلية' : 'Home Exercises',
      text: isArabic
        ? 'ابدأ بتمارين الاستماع المركز لتحسين مهاراتك السمعية.'
        : 'Start with focused listening exercises to improve your auditory skills.',
    },
  ], [isArabic]);

  const allEnvironmentChecksComplete = Object.values(environmentChecks).every(Boolean);

  const handleEnvironmentCheck = useCallback((key: string) => {
    setEnvironmentChecks(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleQuestionAnswer = useCallback((questionId: string, value: number) => {
    setQuestionnaireAnswers(prev => ({ ...prev, [questionId]: value }));
  }, []);

  const handleNext = useCallback(() => {
    if (currentStageIndex < stages.length - 1) {
      if (currentStage.id === 'sequencing_test') {
        setResults(mockResults);
      }
      setCurrentStageIndex(prev => prev + 1);
    } else {
      onComplete?.(results);
    }
  }, [currentStageIndex, currentStage.id, mockResults, results, onComplete]);

  const handleBack = useCallback(() => {
    if (currentStageIndex > 0) {
      setCurrentStageIndex(prev => prev - 1);
    }
  }, [currentStageIndex]);

  const canProceed = useMemo(() => {
    switch (currentStage.id) {
      case 'environment_check':
        return allEnvironmentChecksComplete;
      case 'questionnaire':
        return Object.keys(questionnaireAnswers).length >= questions.length;
      default:
        return true;
    }
  }, [currentStage.id, allEnvironmentChecksComplete, questionnaireAnswers, questions.length]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return brand.cyan;
    if (score >= 60) return brand.purple;
    return brand.pink;
  };

  const renderStageContent = () => {
    switch (currentStage.id) {
      case 'welcome':
        return (
          <div style={styles.stageCard}>
            <p style={{ color: '#aaa', fontSize: typography.size.base, marginBottom: spacing[4] }}>
              {isArabic ? `مرحباً ${patientName}!` : `Hello ${patientName}!`}
            </p>
            <p style={{ color: '#888', fontSize: typography.size.sm, lineHeight: 1.6 }}>
              {isArabic
                ? 'سيستغرق هذا التقييم حوالي 25 دقيقة. تأكد من أنك في مكان هادئ ومرتاح مع سماعات رأس جيدة.'
                : 'This assessment will take approximately 25 minutes. Make sure you are in a quiet, comfortable place with good headphones.'}
            </p>
          </div>
        );

      case 'environment_check':
        return (
          <div style={styles.environmentChecks}>
            {[
              { key: 'quiet', icon: '🤫', title: isArabic ? 'مكان هادئ' : 'Quiet Environment', desc: isArabic ? 'أنا في مكان هادئ بعيداً عن الضوضاء' : 'I am in a quiet place away from noise' },
              { key: 'headphones', icon: '🎧', title: isArabic ? 'سماعات رأس' : 'Headphones Ready', desc: isArabic ? 'لدي سماعات رأس موصولة' : 'I have headphones connected' },
              { key: 'comfortable', icon: '🪑', title: isArabic ? 'وضع مريح' : 'Comfortable Position', desc: isArabic ? 'أنا جالس بشكل مريح' : 'I am seated comfortably' },
              { key: 'noInterruptions', icon: '📵', title: isArabic ? 'بدون مقاطعات' : 'No Interruptions', desc: isArabic ? 'لن تتم مقاطعتي خلال الـ 25 دقيقة القادمة' : 'I won\'t be interrupted for the next 25 minutes' },
            ].map(check => (
              <div
                key={check.key}
                style={{
                  ...styles.checkItem,
                  ...(environmentChecks[check.key] ? styles.checkItemChecked : {}),
                }}
                onClick={() => handleEnvironmentCheck(check.key)}
              >
                <div
                  style={{
                    ...styles.checkbox,
                    ...(environmentChecks[check.key] ? styles.checkboxChecked : {}),
                  }}
                >
                  {environmentChecks[check.key] ? '✓' : ''}
                </div>
                <span style={{ fontSize: '1.5rem' }}>{check.icon}</span>
                <div style={styles.checkLabel}>
                  <div style={styles.checkTitle}>{check.title}</div>
                  <div style={styles.checkDescription}>{check.desc}</div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'headphone_check':
        return (
          <div style={styles.testArea}>
            <button style={styles.testButton}>
              🔊
            </button>
            <p style={styles.testInstructions}>
              {isArabic
                ? 'اضغط للاستماع إلى صوت تجريبي. تأكد من أنك تسمعه بوضوح في كلتا الأذنين.'
                : 'Click to play a test sound. Make sure you can hear it clearly in both ears.'}
            </p>
          </div>
        );

      case 'questionnaire':
        return (
          <div style={styles.questionnaire}>
            {questions.map((q, idx) => (
              <div key={q.id} style={styles.questionCard}>
                <div style={styles.questionText}>
                  {idx + 1}. {q.text}
                </div>
                <div style={styles.optionsGrid}>
                  {q.options.map(opt => (
                    <button
                      key={opt.value}
                      style={{
                        ...styles.optionButton,
                        ...(questionnaireAnswers[q.id] === opt.value ? styles.optionButtonSelected : {}),
                      }}
                      onClick={() => handleQuestionAnswer(q.id, opt.value)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      case 'attention_test':
      case 'frequency_test':
      case 'sequencing_test':
        return (
          <div style={styles.testArea}>
            <button style={styles.testButton}>
              {currentStage.id === 'attention_test' ? '🎯' :
               currentStage.id === 'frequency_test' ? '〰️' : '🔢'}
            </button>
            <p style={styles.testInstructions}>
              {isArabic
                ? 'اضغط لبدء الاختبار. اتبع التعليمات على الشاشة.'
                : 'Click to start the test. Follow the on-screen instructions.'}
            </p>
          </div>
        );

      case 'results':
        return (
          <div>
            <div style={styles.resultsGrid}>
              {results.map(result => {
                const stageConfig = stages.find(s => s.id === result.stage);
                return (
                  <div key={result.stage} style={styles.resultCard}>
                    <div style={{ ...styles.resultScore, color: getScoreColor(result.score) }}>
                      {result.score}%
                    </div>
                    <div style={styles.resultLabel}>
                      {stageConfig && (isArabic ? stageConfig.titleAr : stageConfig.title)}
                    </div>
                    <div style={styles.resultIndicator}>
                      <div
                        style={{
                          ...styles.resultFill,
                          width: `${result.score}%`,
                          background: getScoreColor(result.score),
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <p style={{ color: '#888', textAlign: 'center', marginTop: spacing[4] }}>
              {isArabic
                ? 'درجتك الإجمالية تشير إلى فرصة للتحسين من خلال تدريب التكامل السمعي.'
                : 'Your overall scores indicate an opportunity for improvement through auditory integration training.'}
            </p>
          </div>
        );

      case 'recommendations':
        return (
          <div>
            {recommendations.map((rec, idx) => (
              <div key={idx} style={styles.recommendationCard}>
                <div style={styles.recommendationIcon}>{rec.icon}</div>
                <div style={styles.recommendationContent}>
                  <div style={styles.recommendationTitle}>{rec.title}</div>
                  <div style={styles.recommendationText}>{rec.text}</div>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      {/* Progress Bar */}
      <div style={styles.progressBar}>
        <div style={{ ...styles.progressFill, width: `${progress}%` }} />
      </div>

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logo}>
          🎧 LOTUS SOUND LAB
        </div>
        <button style={styles.exitButton} onClick={onExit}>
          ✕ {isArabic ? 'خروج' : 'Exit'}
        </button>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        <div style={styles.stageContainer}>
          <div style={styles.stageIcon}>{currentStage.icon}</div>
          <h1 style={styles.stageTitle}>
            {isArabic ? currentStage.titleAr : currentStage.title}
          </h1>
          <p style={styles.stageDescription}>
            {isArabic ? currentStage.descriptionAr : currentStage.description}
          </p>
          {renderStageContent()}
        </div>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.stageIndicator}>
          {stages.map((stage, idx) => (
            <div
              key={stage.id}
              style={{
                ...styles.stageDot,
                ...(idx === currentStageIndex ? styles.stageDotActive : {}),
                ...(idx < currentStageIndex ? styles.stageDotComplete : {}),
              }}
            />
          ))}
        </div>

        <div style={styles.duration}>
          ⏱️ {isArabic ? currentStage.durationAr : currentStage.duration}
        </div>

        <div style={styles.navButtons}>
          {currentStageIndex > 0 && (
            <button style={styles.backButton} onClick={handleBack}>
              ← {isArabic ? 'رجوع' : 'Back'}
            </button>
          )}
          <button
            style={{
              ...styles.nextButton,
              opacity: canProceed ? 1 : 0.5,
              cursor: canProceed ? 'pointer' : 'not-allowed',
            }}
            onClick={handleNext}
            disabled={!canProceed}
          >
            {currentStageIndex === stages.length - 1
              ? (isArabic ? 'إنهاء' : 'Finish')
              : (isArabic ? 'التالي →' : 'Next →')}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default VirtualAssessmentFlow;
