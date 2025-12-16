import { brandCyan, brandPink, brandPurple } from '../styles';

export type GameResult = 'high' | 'medium' | 'low';
export type TestKey = 'attention' | 'frequency' | 'sequence' | 'questionnaire';

export type TestOutcome = {
  key: TestKey;
  title: string;
  result: GameResult;
  scoreLabel: string;
  message: string;
  metrics: Record<string, number | string | boolean>;
  trials?: unknown[];
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
