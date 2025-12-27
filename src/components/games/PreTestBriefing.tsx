/**
 * PreTestBriefing - Medical-style briefing modal before starting tests
 * Shows protocol information, requirements, and what to expect
 */

import { memo, useMemo, useCallback, useState, useEffect } from 'react';
import { useVisitorMode } from '../../context/VisitorModeContext';
import { useLanguage } from '../../context/LanguageContext';
import { brandCyan, brandPink, brandPurple, colors, radius, spacing, typography, transitions, shadows, modalScale } from '../styles';
import { renderLabIcon } from '../icons/index';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface TestBriefing {
  id: string;
  icon: string;
  titleEn: string;
  titleAr: string;
  durationEn: string;
  durationAr: string;
  descriptionEn: string;
  descriptionAr: string;
  protocolEn: string[];
  protocolAr: string[];
  requirementsEn: string[];
  requirementsAr: string[];
  whatToExpectEn: string[];
  whatToExpectAr: string[];
  color: string;
}

interface PreTestBriefingProps {
  testType: 'suite' | 'attention' | 'focused_attention' | 'frequency' | 'sequence' | 'dichotic_listening' | 'speech_in_noise' | 'questionnaire';
  open: boolean;
  onClose: () => void;
  onStart: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// TEST BRIEFINGS DATA
// ═══════════════════════════════════════════════════════════════════════════

const TEST_BRIEFINGS: Record<string, TestBriefing> = {
  suite: {
    id: 'suite',
    icon: '🧪',
    titleEn: 'Complete Auditory Screening Suite',
    titleAr: 'auto.PreTestBriefing.k8',
    durationEn: '15-20 minutes',
    durationAr: 'auto.PreTestBriefing.k9',
    descriptionEn: 'A comprehensive 6-test battery measuring attention, frequency discrimination, sequencing, dichotic listening, and speech in noise.',
    descriptionAr: 'auto.PreTestBriefing.k10',
    protocolEn: [
      'Standardized adaptive testing methodology',
      'Results calibrated against normative data',
      'Non-diagnostic screening indicators',
      'Generates PDF/CSV report for clinician review',
    ],
    protocolAr: [
      'منهجية اختبار تكيفية موحدة',
      'نتائج معايرة مقابل بيانات معيارية',
      'مؤشرات فحص غير تشخيصية',
      'تقرير PDF/CSV للمراجعة من الأخصائي',
    ],
    requirementsEn: [
      'Quality headphones (over-ear recommended)',
      'Quiet environment (minimal distractions)',
      'Comfortable volume level',
      'Uninterrupted time to complete',
    ],
    requirementsAr: [
      'سماعات عالية الجودة (يُفضل المغطية للأذن)',
      'بيئة هادئة (أقل ما يمكن من المشتتات)',
      'مستوى صوت مريح',
      'وقت كافٍ دون انقطاع',
    ],
    whatToExpectEn: [
      'Listen to audio stimuli and respond',
      'Tests adapt to your performance',
      'Progress bar shows completion',
      'Results displayed after each test',
    ],
    whatToExpectAr: [
      'استمع للمحفزات الصوتية واستجب',
      'الاختبارات تتكيف مع أدائك',
      'شريط التقدم يظهر الإنجاز',
      'النتائج تظهر بعد كل اختبار',
    ],
    color: colors.success,
  },
  attention: {
    id: 'attention',
    icon: '🎯',
    titleEn: 'Auditory Attention Test',
    titleAr: 'auto.PreTestBriefing.k11',
    durationEn: '5-7 minutes',
    durationAr: 'auto.PreTestBriefing.k12',
    descriptionEn: 'Measures selective attention and impulse control under auditory noise conditions using Go/No-Go paradigm.',
    descriptionAr: 'auto.PreTestBriefing.k13',
    protocolEn: [
      'Go/No-Go response paradigm',
      'Background noise conditions',
      'Reaction time measurement',
      'Commission/omission error tracking',
    ],
    protocolAr: [
      'نموذج استجب/لا تستجب',
      'ظروف ضوضاء خلفية',
      'قياس وقت الاستجابة',
      'تتبع أخطاء العمولة والإغفال',
    ],
    requirementsEn: [
      'Headphones required',
      'Quiet room',
      'Full attention (no multitasking)',
      'Comfortable seating position',
    ],
    requirementsAr: [
      'السماعات مطلوبة',
      'غرفة هادئة',
      'انتباه كامل (بدون مهام متعددة)',
      'وضع جلوس مريح',
    ],
    whatToExpectEn: [
      'Listen for target sounds',
      'Press button for targets only',
      'Ignore distractor sounds',
      'Test gets progressively harder',
    ],
    whatToExpectAr: [
      'استمع للأصوات المستهدفة',
      'اضغط الزر للأهداف فقط',
      'تجاهل الأصوات المشتتة',
      'الاختبار يصبح أصعب تدريجياً',
    ],
    color: '#3B82F6',
  },
  frequency: {
    id: 'frequency',
    icon: '🎚️',
    titleEn: 'Frequency Discrimination Test',
    titleAr: 'auto.PreTestBriefing.k14',
    durationEn: '4-6 minutes',
    durationAr: 'auto.PreTestBriefing.k15',
    descriptionEn: 'Estimates your frequency discrimination threshold using adaptive 2-interval forced choice (2IFC) methodology.',
    descriptionAr: 'auto.PreTestBriefing.k16',
    protocolEn: [
      'Adaptive 2IFC methodology',
      'Staircase threshold estimation',
      'Multiple frequency bands tested',
      'Results in Hz difference threshold',
    ],
    protocolAr: [
      'منهجية 2IFC التكيفية',
      'تقدير العتبة بالسلم',
      'اختبار نطاقات تردد متعددة',
      'النتائج بفرق العتبة بالهرتز',
    ],
    requirementsEn: [
      'High-quality headphones essential',
      'Very quiet environment',
      'No hearing aids during test',
      'Focus on subtle pitch differences',
    ],
    requirementsAr: [
      'سماعات عالية الجودة ضرورية',
      'بيئة هادئة جداً',
      'بدون سماعات طبية أثناء الاختبار',
      'التركيز على فروقات النغمة الدقيقة',
    ],
    whatToExpectEn: [
      'Hear two tones in sequence',
      'Identify which is higher pitched',
      'Difficulty adapts to performance',
      'Some pairs will sound very similar',
    ],
    whatToExpectAr: [
      'سماع نغمتين متتاليتين',
      'تحديد أيهما أعلى',
      'الصعوبة تتكيف مع الأداء',
      'بعض الأزواج ستبدو متشابهة جداً',
    ],
    color: '#8B5CF6',
  },
  sequence: {
    id: 'sequence',
    icon: '🏫',
    titleEn: 'Classroom Simulation Test',
    titleAr: 'auto.PreTestBriefing.k17',
    durationEn: '5-8 minutes',
    durationAr: 'auto.PreTestBriefing.k18',
    descriptionEn: 'Simulates classroom conditions to assess auditory memory and sequencing under increasing noise levels.',
    descriptionAr: 'auto.PreTestBriefing.k19',
    protocolEn: [
      'Multi-step verbal instructions',
      'Progressive background noise',
      'Sequence recall assessment',
      'Working memory evaluation',
    ],
    protocolAr: [
      'تعليمات لفظية متعددة الخطوات',
      'ضوضاء خلفية متزايدة',
      'تقييم استدعاء التسلسل',
      'تقييم الذاكرة العاملة',
    ],
    requirementsEn: [
      'Headphones required',
      'Quiet room',
      'Arabic language comprehension',
      'Ready to follow verbal commands',
    ],
    requirementsAr: [
      'السماعات مطلوبة',
      'غرفة هادئة',
      'فهم اللغة العربية',
      'جاهز لاتباع الأوامر اللفظية',
    ],
    whatToExpectEn: [
      'Listen to multi-step instructions',
      'Complete actions in correct order',
      'Background noise increases',
      'More complex sequences over time',
    ],
    whatToExpectAr: [
      'استمع لتعليمات متعددة الخطوات',
      'أكمل الإجراءات بالترتيب الصحيح',
      'الضوضاء الخلفية تزداد',
      'تسلسلات أكثر تعقيداً مع الوقت',
    ],
    color: '#F59E0B',
  },
  focused_attention: {
    id: 'focused_attention',
    icon: '🎯',
    titleEn: 'Focused Attention (CPT)',
    titleAr: 'اختبار الانتباه المركز (CPT)',
    durationEn: '4-6 minutes',
    durationAr: '4-6 دقائق',
    descriptionEn: 'Continuous performance task measuring sustained attention and response consistency.',
    descriptionAr: 'مهمة أداء مستمرة تقيس الانتباه المستمر واتساق الاستجابة.',
    protocolEn: [
      'Continuous performance (CPT) paradigm',
      'Target detection among distractors',
      'Reaction time and lapse tracking',
      'Non-diagnostic screening indicators',
    ],
    protocolAr: [
      'نموذج الأداء المستمر (CPT)',
      'اكتشاف الهدف بين المشتتات',
      'تتبع زمن الاستجابة وفترات التشتت',
      'مؤشرات فحص غير تشخيصية',
    ],
    requirementsEn: [
      'Headphones recommended',
      'Quiet environment',
      'Respond only to the target symbol',
      'Stay focused and still',
    ],
    requirementsAr: [
      'يُنصح بسماعات',
      'بيئة هادئة',
      'استجب للرمز الهدف فقط',
      'حافظ على التركيز والثبات',
    ],
    whatToExpectEn: [
      'Symbols appear in a rapid stream',
      'Respond to the target only',
      'Practice trials first',
      'Summary shown at the end',
    ],
    whatToExpectAr: [
      'ظهور رموز في تسلسل سريع',
      'استجب للهدف فقط',
      'تجارب تدريبية أولاً',
      'عرض ملخص في النهاية',
    ],
    color: '#0EA5E9',
  },
  dichotic_listening: {
    id: 'dichotic_listening',
    icon: '🎧',
    titleEn: 'Dichotic Listening (Integration + Separation)',
    titleAr: 'اختبار الاستماع الثنائي (التكامل + الفصل)',
    durationEn: '6-8 minutes',
    durationAr: '6-8 دقائق',
    descriptionEn: 'Different syllables or numbers are presented to each ear to assess binaural integration and separation.',
    descriptionAr: 'تُعرض مقاطع لفظية أو أرقام مختلفة على كل أذن لقياس التكامل والفصل السمعي الثنائي.',
    protocolEn: [
      'Simultaneous left/right stimuli',
      'Integration and separation blocks',
      'Ear-specific accuracy tracking',
      'Balance index calculation',
    ],
    protocolAr: [
      'منبهات متزامنة لليسار/اليمين',
      'كتل تكامل وفصل',
      'تتبع الدقة لكل أذن',
      'حساب مؤشر التوازن',
    ],
    requirementsEn: [
      'Stereo headphones required',
      'Confirm left/right orientation',
      'Quiet room',
      'Follow focus ear prompts',
    ],
    requirementsAr: [
      'سماعات ستيريو مطلوبة',
      'تأكد من اتجاه اليسار/اليمين',
      'غرفة هادئة',
      'اتبع توجيهات الأذن المستهدفة',
    ],
    whatToExpectEn: [
      'Two sounds at the same time',
      'Report both ears or focus one',
      'Short practice set',
      'Results after completion',
    ],
    whatToExpectAr: [
      'صوتان في الوقت نفسه',
      'أبلغ عن الأذنين أو ركّز على واحدة',
      'مجموعة تدريب قصيرة',
      'النتائج بعد الانتهاء',
    ],
    color: '#10B981',
  },
  speech_in_noise: {
    id: 'speech_in_noise',
    icon: '🔊',
    titleEn: 'Speech in Noise (Adaptive SNR)',
    titleAr: 'اختبار الكلام وسط الضجيج (SNR تكيفي)',
    durationEn: '5-7 minutes',
    durationAr: '5-7 دقائق',
    descriptionEn: 'Adaptive speech-in-noise task estimating your SNR threshold.',
    descriptionAr: 'مهمة كلام وسط الضجيج تكيفية لتقدير عتبة نسبة الإشارة إلى الضجيج (SNR).',
    protocolEn: [
      'Speech with multitalker noise',
      'Adaptive SNR adjustment',
      'Word recognition scoring',
      'Non-diagnostic screening indicators',
    ],
    protocolAr: [
      'كلام مع ضجيج متعدد المتحدثين',
      'تعديل تكيفي لنسبة الإشارة إلى الضجيج',
      'تقييم التعرف على الكلمات',
      'مؤشرات فحص غير تشخيصية',
    ],
    requirementsEn: [
      'Good headphones',
      'Quiet environment',
      'Set a comfortable volume',
      'Listen to the full sentence',
    ],
    requirementsAr: [
      'سماعات جيدة',
      'بيئة هادئة',
      'اضبط مستوى صوت مريح',
      'استمع للجملة كاملة',
    ],
    whatToExpectEn: [
      'Sentences in background noise',
      'Select the words you heard',
      'Noise adapts to performance',
      'Summary shown at the end',
    ],
    whatToExpectAr: [
      'جُمل مع ضجيج خلفي',
      'اختر الكلمات التي سمعتها',
      'يتكيف الضجيج مع الأداء',
      'عرض ملخص في النهاية',
    ],
    color: '#F97316',
  },
  questionnaire: {
    id: 'questionnaire',
    icon: '📝',
    titleEn: 'Parent/Caregiver Questionnaire',
    titleAr: 'auto.PreTestBriefing.k20',
    durationEn: '3-5 minutes',
    durationAr: 'auto.PreTestBriefing.k21',
    descriptionEn: 'Structured questionnaire to gather behavioral observations and history relevant to auditory processing.',
    descriptionAr: 'auto.PreTestBriefing.k22',
    protocolEn: [
      'Standardized screening questions',
      'Behavioral observation prompts',
      'History and context gathering',
      'Complements objective test results',
    ],
    protocolAr: [
      'أسئلة فحص موحدة',
      'محفزات الملاحظة السلوكية',
      'جمع التاريخ والسياق',
      'يُكمل نتائج الاختبارات الموضوعية',
    ],
    requirementsEn: [
      'Familiar with child\'s behavior',
      'Honest, thoughtful responses',
      'Consider typical behavior',
      'No right or wrong answers',
    ],
    requirementsAr: [
      'معرفة بسلوك الطفل',
      'إجابات صادقة ومدروسة',
      'النظر في السلوك النموذجي',
      'لا توجد إجابات صحيحة أو خاطئة',
    ],
    whatToExpectEn: [
      'Multiple choice questions',
      'Rate frequency of behaviors',
      'Covers various listening situations',
      'Takes about 3-5 minutes',
    ],
    whatToExpectAr: [
      'أسئلة اختيار من متعدد',
      'تقييم تكرار السلوكيات',
      'تغطي مواقف استماع متنوعة',
      'تستغرق حوالي ٣-٥ دقائق',
    ],
    color: brandPink,
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// VISITOR MODE MESSAGES
// ═══════════════════════════════════════════════════════════════════════════

const VISITOR_MESSAGES = {
  school: {
    noteEn: 'For school screening programs, results can be aggregated for classroom-level insights.',
    noteAr: 'auto.PreTestBriefing.k23',
    ctaEn: 'Ideal for identifying students who may benefit from further evaluation.',
    ctaAr: 'auto.PreTestBriefing.k24',
  },
  parent: {
    noteEn: 'This screening helps identify areas that may warrant professional evaluation.',
    noteAr: 'auto.PreTestBriefing.k25',
    ctaEn: 'Results do not replace clinical diagnosis but provide valuable indicators.',
    ctaAr: 'auto.PreTestBriefing.k26',
  },
  clinician: {
    noteEn: 'Protocol documentation and raw data available for clinical interpretation.',
    noteAr: 'auto.PreTestBriefing.k27',
    ctaEn: 'Export options include PDF reports and CSV data for integration with clinical records.',
    ctaAr: 'auto.PreTestBriefing.k28',
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const PreTestBriefing = memo(function PreTestBriefing({
  testType,
  open,
  onClose,
  onStart,
}: PreTestBriefingProps) {
  const { mode, config, isSchool, isParent, isClinician } = useVisitorMode();
  const { isArabic, t } = useLanguage();
  const [isReady, setIsReady] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

  const briefing = TEST_BRIEFINGS[testType];
  const visitorMessage = VISITOR_MESSAGES[mode];
  const resolveArText = useCallback((value: string) => (
    value.startsWith('auto.') ? t(value, value) : value
  ), [t]);
  const resolveArList = useCallback(
    (values: string[]) => values.map(resolveArText),
    [resolveArText],
  );

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setIsReady(false);
      setCheckedItems(new Set());
    }
  }, [open]);

  const requirements = isArabic ? resolveArList(briefing.requirementsAr) : briefing.requirementsEn;

  // Check if all requirements are checked
  useEffect(() => {
    setIsReady(checkedItems.size === requirements.length);
  }, [checkedItems, requirements.length]);

  const handleCheckItem = useCallback((index: number) => {
    setCheckedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  }, []);

  const handleStart = useCallback(() => {
    onStart();
    onClose();
  }, [onStart, onClose]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  const css = useMemo(() => `
    .briefing-enter {
      animation: briefingSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    @keyframes briefingSlideIn {
      from { opacity: 0; transform: translateY(24px) scale(0.96); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .requirement-item {
      transition: all 0.2s ease;
    }
    .requirement-item:hover {
      background: rgba(255,255,255,0.06) !important;
    }
    .requirement-item.checked {
      background: ${briefing.color}15 !important;
      border-color: ${briefing.color}40 !important;
    }
    .start-btn:hover:not(:disabled) {
      transform: scale(1.02);
      box-shadow: 0 8px 30px ${briefing.color}40 !important;
    }
    .start-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `, [briefing.color]);

  if (!open) return null;

  return (
    <>
      <style>{css}</style>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={isArabic ? resolveArText(briefing.titleAr) : briefing.titleEn}
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.88)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: spacing[4],
          zIndex: 1000,
        }}
      >
        <div style={{ width: '100%', maxWidth: 700, transform: `scale(${modalScale})`, transformOrigin: 'center' }}>
          <div
            className="briefing-enter"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              background: colors.surface.overlay,
              borderRadius: radius['2xl'],
              border: `1px solid ${briefing.color}30`,
              boxShadow: `0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px ${briefing.color}10`,
            }}
          >
          {/* Header */}
          <div style={{
            padding: `${spacing[5]}px ${spacing[5]}px ${spacing[4]}px`,
            borderBottom: `1px solid ${colors.border.subtle}`,
            background: `linear-gradient(135deg, ${briefing.color}10, transparent)`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing[4] }}>
              <div style={{
                width: 64,
                height: 64,
                borderRadius: radius.xl,
                background: `${briefing.color}20`,
                border: `2px solid ${briefing.color}40`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 32,
              }}>
                {briefing.icon}
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{
                  margin: 0,
                  fontSize: typography.size['2xl'],
                  fontWeight: typography.weight.black,
                  color: colors.text.primary,
                }}>
                  {isArabic ? resolveArText(briefing.titleAr) : briefing.titleEn}
                </h2>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing[3],
                  marginTop: spacing[2],
                }}>
                  <span style={{
                    padding: `${spacing[1]}px ${spacing[2.5]}px`,
                    background: `${briefing.color}20`,
                    borderRadius: radius.md,
                    fontSize: typography.size.xs,
                    fontWeight: typography.weight.bold,
                    color: briefing.color,
                  }}>
                    ⏱ {isArabic ? resolveArText(briefing.durationAr) : briefing.durationEn}
                  </span>
                  <span style={{
                    padding: `${spacing[1]}px ${spacing[2.5]}px`,
                    background: `${config.color}20`,
                    borderRadius: radius.md,
                    fontSize: typography.size.xs,
                    fontWeight: typography.weight.bold,
                    color: config.color,
                  }}>
                    {config.icon} {isArabic ? t(config.labelAr, config.label) : config.label}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label={t('auto.PreTestBriefing.k1', "Close")}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: radius.lg,
                  background: 'rgba(255,255,255,0.06)',
                  border: `1px solid ${colors.border.default}`,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  color: colors.text.muted,
                  transition: transitions.fast,
                }}
              >
                {renderLabIcon('\u2715', { size: 16, tone: 'muted' })}
              </button>
            </div>

            <p style={{
              margin: `${spacing[3]}px 0 0`,
              fontSize: typography.size.base,
              color: colors.text.secondary,
              lineHeight: typography.lineHeight.relaxed,
              direction: isArabic ? 'rtl' : 'ltr',
            }}>
              {isArabic ? resolveArText(briefing.descriptionAr) : briefing.descriptionEn}
            </p>
          </div>

          {/* Content */}
          <div style={{ padding: spacing[5], direction: isArabic ? 'rtl' : 'ltr' }}>
            {/* Protocol Section */}
            <div style={{ marginBottom: spacing[5] }}>
              <h3 style={{
                margin: `0 0 ${spacing[3]}px`,
                fontSize: typography.size.sm,
                fontWeight: typography.weight.black,
                color: briefing.color,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: spacing[1] }}>
                  {renderLabIcon('\U0001F4CB', { size: 16, tone: 'cyan' })}
                  <span>{t('auto.PreTestBriefing.k2', "PROTOCOL")}</span>
                </span>
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: spacing[2],
              }}>
                {(isArabic ? resolveArList(briefing.protocolAr) : briefing.protocolEn).map((item, i) => (
                  <div key={i} style={{
                    padding: spacing[3],
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: radius.lg,
                    fontSize: typography.size.sm,
                    color: colors.text.secondary,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: spacing[2],
                  }}>
                    <span style={{ color: briefing.color }}>•</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements Checklist */}
            <div style={{ marginBottom: spacing[5] }}>
              <h3 style={{
                margin: `0 0 ${spacing[3]}px`,
                fontSize: typography.size.sm,
                fontWeight: typography.weight.black,
                color: colors.success,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: spacing[1] }}>
                  {renderLabIcon('\u2713', { size: 16, tone: 'success' })}
                  <span>{t('auto.PreTestBriefing.k3', "REQUIREMENTS (Click to confirm)")}</span>
                </span>
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
                {requirements.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => handleCheckItem(i)}
                    className={`requirement-item ${checkedItems.has(i) ? 'checked' : ''}`}
                    style={{
                      padding: spacing[3],
                      background: 'rgba(255,255,255,0.03)',
                      border: `1px solid ${colors.border.subtle}`,
                      borderRadius: radius.lg,
                      fontSize: typography.size.sm,
                      color: checkedItems.has(i) ? colors.text.primary : colors.text.secondary,
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing[3],
                      cursor: 'pointer',
                      textAlign: isArabic ? 'right' : 'left',
                    }}
                  >
                    <div style={{
                      width: 24,
                      height: 24,
                      borderRadius: radius.md,
                      background: checkedItems.has(i) ? colors.success : 'rgba(255,255,255,0.1)',
                      border: `2px solid ${checkedItems.has(i) ? colors.success : colors.border.default}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: 14,
                      fontWeight: typography.weight.bold,
                      flexShrink: 0,
                      transition: transitions.fast,
                    }}>
                      {checkedItems.has(i) ? renderLabIcon('\u2713', { size: 14, tone: 'success' }) : null}
                    </div>
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* What to Expect */}
            <div style={{ marginBottom: spacing[5] }}>
              <h3 style={{
                margin: `0 0 ${spacing[3]}px`,
                fontSize: typography.size.sm,
                fontWeight: typography.weight.black,
                color: brandPurple,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: spacing[1] }}>
                  {renderLabIcon('\U0001F441', { size: 16, tone: 'cyan' })}
                  <span>{t('auto.PreTestBriefing.k4', "WHAT TO EXPECT")}</span>
                </span>
              </h3>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: spacing[2],
              }}>
                {(isArabic ? resolveArList(briefing.whatToExpectAr) : briefing.whatToExpectEn).map((item, i) => (
                  <div key={i} style={{
                    padding: `${spacing[2]}px ${spacing[3]}px`,
                    background: `${brandPurple}15`,
                    border: `1px solid ${brandPurple}30`,
                    borderRadius: radius.full,
                    fontSize: typography.size.xs,
                    fontWeight: typography.weight.semibold,
                    color: colors.text.secondary,
                  }}>
                    {i + 1}. {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Visitor Mode Note */}
            <div style={{
              padding: spacing[4],
              background: `${config.color}10`,
              border: `1px solid ${config.color}25`,
              borderRadius: radius.xl,
              marginBottom: spacing[5],
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: spacing[3],
              }}>
                <span style={{ fontSize: 24 }}>{config.icon}</span>
                <div>
                  <div style={{
                    fontSize: typography.size.sm,
                    fontWeight: typography.weight.bold,
                    color: config.color,
                    marginBottom: spacing[1],
                  }}>
                    {isArabic ? `ملاحظة لـ${config.labelAr}` : `Note for ${config.label}`}
                  </div>
                  <p style={{
                    margin: 0,
                    fontSize: typography.size.sm,
                    color: colors.text.secondary,
                    lineHeight: typography.lineHeight.relaxed,
                  }}>
                    {isArabic ? resolveArText(visitorMessage.noteAr) : visitorMessage.noteEn}
                  </p>
                  <p style={{
                    margin: `${spacing[2]}px 0 0`,
                    fontSize: typography.size.xs,
                    color: colors.text.muted,
                  }}>
                    {isArabic ? resolveArText(visitorMessage.ctaAr) : visitorMessage.ctaEn}
                  </p>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div style={{
              padding: spacing[3],
              background: 'rgba(255,255,255,0.03)',
              borderRadius: radius.lg,
              marginBottom: spacing[5],
              display: 'flex',
              alignItems: 'center',
              gap: spacing[3],
            }}>
              <span style={{ fontSize: 20 }}>{renderLabIcon('\u2695', { size: 18, tone: 'muted' })}</span>
              <p style={{
                margin: 0,
                fontSize: typography.size.xs,
                color: colors.text.muted,
                lineHeight: typography.lineHeight.relaxed,
              }}>
                {t('auto.PreTestBriefing.k5', "This is a non-diagnostic screening and does not replace professional clinical evaluation. Consult a qualified specialist for diagnosis.")}
              </p>
            </div>

            {/* Actions */}
            <div style={{
              display: 'flex',
              gap: spacing[3],
              justifyContent: 'flex-end',
            }}>
              <button
                onClick={onClose}
                style={{
                  padding: `${spacing[3]}px ${spacing[5]}px`,
                  background: 'rgba(255,255,255,0.06)',
                  border: `1px solid ${colors.border.default}`,
                  borderRadius: radius.lg,
                  fontSize: typography.size.sm,
                  fontWeight: typography.weight.bold,
                  color: colors.text.secondary,
                  cursor: 'pointer',
                  transition: transitions.fast,
                }}
              >
                {t('auto.PreTestBriefing.k6', "Cancel")}
              </button>
              <button
                onClick={handleStart}
                disabled={!isReady}
                className="start-btn"
                style={{
                  padding: `${spacing[3]}px ${spacing[6]}px`,
                  background: isReady
                    ? `linear-gradient(135deg, ${briefing.color}, ${briefing.color}cc)`
                    : 'rgba(255,255,255,0.1)',
                  border: 'none',
                  borderRadius: radius.lg,
                  fontSize: typography.size.sm,
                  fontWeight: typography.weight.black,
                  color: isReady ? '#fff' : colors.text.muted,
                  cursor: isReady ? 'pointer' : 'not-allowed',
                  transition: transitions.bounce,
                  boxShadow: isReady ? `0 4px 20px ${briefing.color}30` : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing[2],
                }}
              >
                {isReady ? '▶' : '○'}
                {t('auto.PreTestBriefing.k7', "Start Test")}
              </button>
            </div>
          </div>
          </div>
        </div>
      </div>
    </>
  );
});

export default PreTestBriefing;
