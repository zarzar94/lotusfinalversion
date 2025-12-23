import type {
  AssessmentSession,
  Booking,
  FeedbackRecord,
  GamificationProgress,
  MockDataBundle,
  PatientProfile,
  TreatmentPlan,
  UserProfile,
} from './models';

const users: UserProfile[] = [
  { id: 'u1', role: 'guardian', name: 'أم سارة', email: 'mom@example.com', language: 'ar' },
  { id: 'u2', role: 'clinician', name: 'Dr. Laila', email: 'laila@example.com', language: 'en' },
];

const patients: PatientProfile[] = [
  {
    id: 'p1',
    userId: 'u1',
    age: 10,
    gender: 'female',
    school: 'Future School',
    grade: '4',
    guardians: [{ id: 'g1', name: 'أم سارة', relationship: 'mother', phone: '+9715', email: 'mom@example.com' }],
    auditoryProfile: { sensitivity: ['ضوضاء'], classroomChallenges: ['التركيز'], preferredLanguage: 'ar' },
  },
];

const assessments: AssessmentSession[] = [
  {
    id: 'a1',
    patientId: 'p1',
    startedAt: new Date().toISOString(),
    stages: [
      { stage: 'environment', completedAt: new Date().toISOString(), notes: 'Quiet room' },
      { stage: 'headphones', completedAt: new Date().toISOString(), notes: 'Calibrated' },
      { stage: 'attention', completedAt: new Date().toISOString(), score: 76 },
    ],
    recommendation: { summary: 'ابدأ بروتوكول 10 أيام', nextSteps: ['حجز الجلسات'], priority: 'medium' },
  },
];

const treatments: TreatmentPlan[] = [
  {
    id: 't1',
    patientId: 'p1',
    startDate: new Date().toISOString(),
    protocol: 'ait',
    sessions: Array.from({ length: 4 }).map((_, idx) => ({
      id: `s${idx}`,
      patientId: 'p1',
      day: Math.floor(idx / 2) + 1,
      timeOfDay: idx % 2 === 0 ? 'am' : 'pm',
      frequencyHz: 350 + idx * 20,
      focus: idx % 2 === 0 ? 'انتباه' : 'توازن',
      status: 'scheduled',
      rating: 4,
    })),
    outcomes: [
      { domain: 'attention', change: 12, notes: 'تحسن ملحوظ' },
    ],
  },
];

const bookings: Booking[] = [
  { id: 'b1', patientId: 'p1', requestedBy: 'u1', start: new Date().toISOString(), end: new Date().toISOString(), status: 'confirmed' },
];

const gamification: GamificationProgress[] = [
  { patientId: 'p1', points: 220, level: 4, badges: [{ id: 'badge1', name: 'مستمع نشط', description: 'حضور 5 جلسات', icon: '⭐', awardedOn: new Date().toISOString() }] },
];

const feedback: FeedbackRecord[] = [
  {
    id: 'f1',
    patientId: 'p1',
    categories: [
      { name: 'التجربة العامة', score: 5 },
      { name: 'جودة الصوت', score: 4 },
    ],
    nps: 9,
    comments: 'ممتع وواضح',
    consentFollowUp: true,
    submittedAt: new Date().toISOString(),
  },
];

export const mockData: MockDataBundle = {
  users,
  patients,
  assessments,
  treatments,
  bookings,
  gamification,
  feedback,
};

export const createMockPatient = (overrides: Partial<PatientProfile> = {}): PatientProfile => ({
  ...patients[0],
  ...overrides,
  id: overrides.id ?? `p-${Math.random().toString(36).slice(2, 6)}`,
});
