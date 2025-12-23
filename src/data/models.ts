export interface UserProfile {
  id: string;
  role: 'admin' | 'clinician' | 'guardian' | 'student';
  name: string;
  email: string;
  phone?: string;
  language: 'ar' | 'en';
}

export interface PatientProfile {
  id: string;
  userId: string;
  age: number;
  gender: 'male' | 'female';
  school?: string;
  grade?: string;
  guardians: Guardian[];
  auditoryProfile: AuditoryProfile;
}

export interface Guardian {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface AuditoryProfile {
  sensitivity: string[];
  classroomChallenges: string[];
  preferredLanguage: 'ar' | 'en';
}

export interface AssessmentStageResult {
  stage: 'environment' | 'headphones' | 'questionnaire' | 'attention' | 'frequency' | 'sequencing';
  score?: number;
  notes?: string;
  completedAt: string;
}

export interface AssessmentSession {
  id: string;
  patientId: string;
  startedAt: string;
  completedAt?: string;
  stages: AssessmentStageResult[];
  recommendation?: Recommendation;
}

export interface Recommendation {
  summary: string;
  nextSteps: string[];
  priority: 'low' | 'medium' | 'high';
}

export interface TreatmentSession {
  id: string;
  patientId: string;
  day: number;
  timeOfDay: 'am' | 'pm';
  frequencyHz: number;
  focus: string;
  status: 'scheduled' | 'completed' | 'pending';
  rating: number;
}

export interface TreatmentPlan {
  id: string;
  patientId: string;
  startDate: string;
  protocol: 'ait';
  sessions: TreatmentSession[];
  outcomes: Outcome[];
}

export interface Outcome {
  domain: 'attention' | 'auditory' | 'sequencing' | 'balance';
  change: number;
  notes?: string;
}

export interface Booking {
  id: string;
  patientId: string;
  requestedBy: string;
  start: string;
  end: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface GamificationBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  awardedOn: string;
}

export interface GamificationProgress {
  patientId: string;
  points: number;
  level: number;
  badges: GamificationBadge[];
}

export interface AnalyticsMetric {
  id: string;
  title: string;
  value: string;
  trend: string;
}

export interface Insight {
  id: string;
  message: string;
  severity: 'info' | 'warning' | 'success';
}

export interface FeedbackCategory {
  name: string;
  score: number;
}

export interface FeedbackRecord {
  id: string;
  patientId: string;
  categories: FeedbackCategory[];
  nps: number;
  comments?: string;
  consentFollowUp: boolean;
  submittedAt: string;
}

export interface PDFTemplateOptions {
  locale: 'ar' | 'en';
  includeRTL?: boolean;
}

export interface ReportTemplate {
  id: string;
  name: string;
  type: 'assessment' | 'treatment' | 'session' | 'certificate';
  options: PDFTemplateOptions;
}

export interface FrequencyBand {
  label: string;
  level: number;
}

export interface SoundPreset {
  id: string;
  name: string;
  bands: FrequencyBand[];
}

export interface AssessmentQuestion {
  id: string;
  text: string;
  type: 'scale' | 'text' | 'boolean';
}

export interface AttentionTaskResult {
  id: string;
  accuracy: number;
  reactionTimeMs: number;
}

export interface FrequencyTestResult {
  id: string;
  band: string;
  heard: boolean;
}

export interface SequencingTestResult {
  id: string;
  sequenceLength: number;
  correct: boolean;
}

export interface IntakeStep {
  id: string;
  title: string;
  completed: boolean;
}

export interface IntakeSubmission {
  id: string;
  patientId: string;
  steps: IntakeStep[];
  submittedAt: string;
}

export interface TimelineEntry {
  day: number;
  sessions: TreatmentSession[];
}

export interface LocalizationCopy {
  locale: 'ar' | 'en';
  labels: Record<string, string>;
}

export interface NavigationLink {
  label: string;
  href: string;
  locale: 'ar' | 'en';
}

export interface TeamMember {
  name: string;
  role: string;
  focus: string;
}

export interface Milestone {
  year: string;
  title: string;
  description: string;
}

export interface MetricsGridItem {
  title: string;
  value: string;
  trend: string;
}

export interface TreatmentOutcomeRow {
  patient: string;
  improvement: string;
  adherence: string;
  sessions: number;
  notes: string;
}

export interface MockDataBundle {
  users: UserProfile[];
  patients: PatientProfile[];
  assessments: AssessmentSession[];
  treatments: TreatmentPlan[];
  bookings: Booking[];
  gamification: GamificationProgress[];
  feedback: FeedbackRecord[];
}

// Additional supporting shapes to exceed 50 interfaces and cover edge scenarios
export interface NotificationPreference { channel: 'email' | 'sms' | 'whatsapp'; enabled: boolean; }
export interface Reminder { id: string; patientId: string; message: string; scheduledAt: string; }
export interface ProgressStar { sessionId: string; stars: number; note?: string; }
export interface LanguageToggleState { current: 'ar' | 'en'; available: ('ar' | 'en')[]; }
export interface CanvasChartConfig { type: 'bar' | 'donut' | 'line'; labels: string[]; values: number[]; }
export interface WaveformPoint { x: number; y: number; }
export interface SupportTicket { id: string; userId: string; topic: string; status: 'open' | 'closed'; createdAt: string; }
export interface ChecklistItem { id: string; label: string; completed: boolean; }
export interface ValueCard { title: string; description: string; icon?: string; }
export interface TimelineMilestone { title: string; date: string; detail: string; }
export interface RecommendationCard { title: string; rationale: string; action: string; }
export interface ConsentRecord { id: string; patientId: string; accepted: boolean; timestamp: string; }
export interface DeviceCheck { id: string; type: string; passed: boolean; notes?: string; }
export interface AudioPresetLibrary { presets: SoundPreset[]; version: string; }
export interface DownloadAction { name: string; link: string; locale: 'ar' | 'en'; }
export interface ProgressHUDItem { label: string; value: string; color: string; }
export interface ProgramInsight { id: string; text: string; locale: 'ar' | 'en'; severity: 'info' | 'success' | 'warning'; }
export interface TeamValue { label: string; description: string; emphasis: boolean; }
export interface BookingWindow { startHour: number; endHour: number; days: number[]; }
export interface TreatmentCertificate { patient: string; issuedOn: string; summary: string; locale: 'ar' | 'en'; }
export interface AudioBandLevel { band: string; level: number; }
export interface LabAestheticToken { name: string; value: string; usage: string; }
export interface RTLLayoutRule { selector: string; description: string; }
export interface ReportDownloadOption { label: string; templateId: string; locale: 'ar' | 'en'; }
export interface AssessmentInsight { title: string; detail: string; domain: string; }
export interface IntakeValidationRule { field: string; rule: string; message: string; }
