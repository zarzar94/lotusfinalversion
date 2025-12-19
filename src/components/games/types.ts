import { brandCyan, brandPink, brandPurple } from '../styles';

export type GameResult = 'high' | 'medium' | 'low';
export type TestKey = 'attention' | 'frequency' | 'sequence' | 'questionnaire';

// Base metrics that can have additional properties
export interface BaseMetrics {
  [key: string]: number | string | boolean | undefined;
}

// Attention test metrics
export interface AttentionMetrics extends BaseMetrics {
  trials: number;
  targets: number;
  hits: number;
  falseAlarms: number;
  impulsiveTaps: number;
  hitRate: string;
  falseAlarmRate: string;
  dPrime: string;
  avgReactionMs: number;
  impulsePenaltyPoints: number;
  fatigueIndex?: 'low' | 'moderate' | 'high';
  fatigueScore?: number;
  sustainedAttention?: 'strong' | 'moderate' | 'weak';
  rtVariability?: number;
  gamePoints?: number;
  starRating?: number;
  maxComboStreak?: number;
}

// Frequency discrimination test metrics
export interface FrequencyMetrics extends BaseMetrics {
  referenceHz: number;
  trials: number;
  accuracyPct: number;
  thresholdHz: number;
  thresholdPercent: number;
  consistencyStdHz: number;
  avgReactionMs: number;
  gamePoints: number;
  starRating: number;
  note: string;
}

// Sequencing test metrics
export interface SequenceMetrics extends BaseMetrics {
  rounds: number;
  correctRounds: number;
  accuracyPct: number;
  maxSpan: number;
  avgReactionMs: number;
  maxNoiseLevel: string;
  replayPolicy: string;
  gamePoints: number;
  starRating: number;
  workingMemorySpan: number;
  note?: string;
}

// Questionnaire metrics
export interface QuestionnaireMetrics extends BaseMetrics {
  totalQuestions: number;
  totalScore: number;
  note: string;
}

// Union of all metric types - allows indexed access while providing specific types
export type TestMetrics = AttentionMetrics | FrequencyMetrics | SequenceMetrics | QuestionnaireMetrics;

// Trial types for each test
export interface AttentionTrial {
  i: number;
  isTarget?: boolean;
  target?: boolean; // Legacy property name
  freq: number;
  noise: number;
  responded: boolean;
  responseType?: 'hit' | 'fa' | 'miss' | 'cr';
  rtMs?: number | null;
}

export interface FrequencyTrial {
  i: number;
  deltaHz: number;
  order: 'ref-first' | 'hi-first';
  correct: boolean;
  answer: 1 | 2;
  rtMs: number;
}

export interface SequenceTrial {
  round: number;
  length: number;
  target: string[];
  chosen: string[];
  correct: boolean;
  noiseLevel: number;
  replayCount: number;
  rtMs: number[];
}

export interface QuestionnaireTrial {
  question: string;
  answer: string;
  value: number;
}

// Union of all trial types
export type TestTrial = AttentionTrial | FrequencyTrial | SequenceTrial | QuestionnaireTrial;

export type TestOutcome = {
  key: TestKey;
  title: string;
  result: GameResult;
  scoreLabel: string;
  message: string;
  metrics: TestMetrics;
  trials?: TestTrial[];
};

export type AssessmentSession = {
  id: string;
  startedAt: number;
  headphoneCheck?: {
    supported: boolean;
    passed: boolean;
    correct: number;
    total: number;
  };
  outcomes: Partial<Record<TestKey, TestOutcome>>;
};

export const resultMeta: Record<GameResult, { label: string; color: string; hint: string }> = {
  high: {
    label: 'مؤشرات منخفضة / أداء قوي',
    color: brandCyan,
    hint: 'نتائج قوية ضمن هذا الفحص التفاعلي. إذا بقيت المشكلة يومياً، استشر مختصاً.',
  },
  medium: {
    label: 'مؤشرات متوسطة',
    color: brandPurple,
    hint: 'قد تظهر صعوبات مع الضوضاء أو سرعة المعالجة. ينصح بتجربة الاختبارات الأخرى أو استشارة مختص.',
  },
  low: {
    label: 'مؤشرات مرتفعة / يحتاج متابعة',
    color: brandPink,
    hint: 'إذا كانت الأعراض مستمرة في المنزل/المدرسة، يفضل تقييم متخصص. هذا ليس تشخيصاً طبياً.',
  },
};
