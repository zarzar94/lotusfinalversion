/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * LOTUS SOUND LAB - Treatment Protocol Types
 * Complete type definitions for Bérard AIT treatment management
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TREATMENT PHASES
// ═══════════════════════════════════════════════════════════════════════════════

export type TreatmentPhase =
  | 'intake'
  | 'assessment'
  | 'active'
  | 'rest'
  | 'maintenance'
  | 'completed'
  | 'follow_up';

export type ProtocolType = 'berard_ait' | 'modified' | 'maintenance';

export type SessionType = 'listening' | 'assessment' | 'consultation' | 'follow_up';

// ═══════════════════════════════════════════════════════════════════════════════
// PATIENT PROFILE
// ═══════════════════════════════════════════════════════════════════════════════

export interface PatientProfile {
  id: string;
  userId: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  diagnoses: string[];
  referralSource?: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalHistory?: string;
  audiogram?: AudiogramData;
  status: TreatmentPhase;
  treatmentPlanId?: string;
  clinicianId?: string;
  parentId?: string;
  createdAt: number;
  updatedAt: number;
}

export interface AudiogramData {
  leftEar: number[];      // dB HL at standard frequencies
  rightEar: number[];
  frequencies: number[];  // [250, 500, 1000, 2000, 4000, 8000]
  date: number;
  notes?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// TREATMENT PLAN
// ═══════════════════════════════════════════════════════════════════════════════

export interface TreatmentPlan {
  id: string;
  patientId: string;
  clinicianId: string;
  protocol: ProtocolType;
  status: 'planned' | 'active' | 'paused' | 'completed' | 'cancelled';
  startDate: number;
  endDate?: number;
  sessions: {
    scheduled: number;
    completed: number;
    missed: number;
  };
  frequencyProfile: FrequencyProfile;
  adjustments: FrequencyAdjustment[];
  goals: TreatmentGoal[];
  notes: string;
  createdAt: number;
  updatedAt: number;
}

export interface FrequencyProfile {
  low: { frequencies: number[]; attenuation: number[] };
  mid: { frequencies: number[]; attenuation: number[] };
  high: { frequencies: number[]; attenuation: number[] };
  description?: string;
}

export interface FrequencyAdjustment {
  date: number;
  sessionNumber: number;
  description: string;
  descriptionAr: string;
  previousProfile: FrequencyProfile;
  newProfile: FrequencyProfile;
  reason: string;
  clinicianId: string;
}

export interface TreatmentGoal {
  id: string;
  description: string;
  descriptionAr: string;
  category: 'auditory' | 'attention' | 'behavioral' | 'academic' | 'social';
  target: number;       // 0-100 progress target
  current: number;      // 0-100 current progress
  status: 'pending' | 'in_progress' | 'achieved' | 'adjusted';
  milestones: GoalMilestone[];
  createdAt: number;
  updatedAt: number;
}

export interface GoalMilestone {
  id: string;
  description: string;
  descriptionAr: string;
  targetDate: number;
  completedDate?: number;
  status: 'pending' | 'completed' | 'missed';
}

// ═══════════════════════════════════════════════════════════════════════════════
// TREATMENT SESSIONS
// ═══════════════════════════════════════════════════════════════════════════════

export interface TreatmentSession {
  id: string;
  treatmentPlanId: string;
  patientId: string;
  clinicianId: string;
  date: number;
  sessionNumber: number;     // 1-20 for standard 10-day protocol
  dayNumber: number;         // 1-10 treatment day
  periodNumber: 1 | 2;       // AM or PM session
  duration: number;          // minutes (typically 30)
  type: SessionType;
  status: 'scheduled' | 'in_progress' | 'completed' | 'missed' | 'cancelled';
  audioSettings: AudioSettings;
  observations: SessionObservations;
  patientFeedback?: PatientFeedback;
  metrics?: SessionMetrics;
  createdAt: number;
  updatedAt: number;
}

export interface AudioSettings {
  volume: number;            // 0-100
  frequencies: number[];     // Active filter frequencies
  musicTrack?: string;       // Track identifier
  filterProfile: FrequencyProfile;
  leftRightBalance: number;  // -50 to +50 (0 = balanced)
}

export interface SessionObservations {
  behavioralNotes: string;
  attentionLevel: 1 | 2 | 3 | 4 | 5;
  cooperationLevel: 1 | 2 | 3 | 4 | 5;
  comfortLevel: 1 | 2 | 3 | 4 | 5;
  physicalReactions?: string[];
  emotionalResponses?: string[];
  clinicianNotes: string;
}

export interface PatientFeedback {
  overallExperience: 1 | 2 | 3 | 4 | 5;
  soundComfort: 1 | 2 | 3 | 4 | 5;
  fatigueLevel: 1 | 2 | 3 | 4 | 5;
  comments?: string;
  reportedChanges?: string[];
}

export interface SessionMetrics {
  // Calculated during assessment sessions
  attentionIndex?: number;
  reactionTimeAvg?: number;
  reactionTimeVariance?: number;
  accuracyRate?: number;
  fatigueSlope?: number;
  consistencyScore?: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROGRESS TRACKING
// ═══════════════════════════════════════════════════════════════════════════════

export interface TreatmentProgress {
  patientId: string;
  treatmentPlanId: string;
  overallProgress: number;   // 0-100
  phaseProgress: number;     // Progress within current phase
  currentPhase: TreatmentPhase;
  sessionsCompleted: number;
  totalSessions: number;
  streak: number;            // Consecutive days with sessions
  lastSessionDate?: number;
  goalProgress: GoalProgress[];
  milestones: MilestoneRecord[];
  weeklyTrends: WeeklyTrend[];
  updatedAt: number;
}

export interface GoalProgress {
  goalId: string;
  startValue: number;
  currentValue: number;
  targetValue: number;
  changeFromBaseline: number;
  trend: 'improving' | 'stable' | 'declining';
  lastUpdated: number;
}

export interface MilestoneRecord {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  achievedAt: number;
  category: 'treatment' | 'behavioral' | 'academic' | 'milestone';
  icon: string;
}

export interface WeeklyTrend {
  weekStart: number;
  sessionsCompleted: number;
  averageAttention: number;
  averageCooperation: number;
  goalProgressDelta: number;
  highlights: string[];
  concerns: string[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// FOLLOW-UP & MAINTENANCE
// ═══════════════════════════════════════════════════════════════════════════════

export interface FollowUpSchedule {
  id: string;
  patientId: string;
  treatmentPlanId: string;
  intervals: FollowUpInterval[];
  createdAt: number;
}

export interface FollowUpInterval {
  id: string;
  daysAfterTreatment: number;  // 30, 90, 180, 365
  scheduledDate: number;
  status: 'scheduled' | 'completed' | 'missed' | 'rescheduled';
  completedDate?: number;
  assessmentId?: string;
  notes?: string;
}

export interface MaintenanceRecommendation {
  id: string;
  category: 'auditory_exercises' | 'environmental' | 'academic_support' | 'behavioral' | 'lifestyle';
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'as_needed';
  priority: 'essential' | 'recommended' | 'optional';
  resources?: string[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// REPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export interface TreatmentReport {
  id: string;
  patientId: string;
  treatmentPlanId: string;
  type: 'initial' | 'progress' | 'mid_treatment' | 'final' | 'follow_up';
  generatedAt: number;
  generatedBy: string;
  summary: ReportSummary;
  assessmentResults?: AssessmentSummary;
  sessionSummary: SessionSummary;
  goalAnalysis: GoalAnalysis[];
  recommendations: Recommendation[];
  nextSteps: string[];
  nextStepsAr: string[];
  pdfUrl?: string;
}

export interface ReportSummary {
  title: string;
  titleAr: string;
  period: { start: number; end: number };
  overallProgress: number;
  keyFindings: string[];
  keyFindingsAr: string[];
  highlights: string[];
  highlightsAr: string[];
  concerns: string[];
  concernsAr: string[];
}

export interface AssessmentSummary {
  preAssessment?: AssessmentSnapshot;
  postAssessment?: AssessmentSnapshot;
  comparison?: AssessmentComparison;
}

export interface AssessmentSnapshot {
  date: number;
  attention: { score: number; rating: string };
  frequency: { threshold: number; rating: string };
  sequencing: { maxSpan: number; rating: string };
  dichotic: { integration: number; separation: number; rating: string };
  speechInNoise: { snrThreshold: number; rating: string };
  composite: { score: number; riskLevel: string };
}

export interface AssessmentComparison {
  attention: { change: number; significance: string };
  frequency: { change: number; significance: string };
  sequencing: { change: number; significance: string };
  dichotic: { change: number; significance: string };
  speechInNoise: { change: number; significance: string };
  composite: { change: number; significance: string };
}

export interface SessionSummary {
  totalSessions: number;
  completedSessions: number;
  missedSessions: number;
  averageAttention: number;
  averageCooperation: number;
  averageComfort: number;
  adherenceRate: number;
  frequencyAdjustments: number;
}

export interface GoalAnalysis {
  goalId: string;
  goal: string;
  goalAr: string;
  baseline: number;
  current: number;
  target: number;
  progress: number;        // percentage
  trend: 'improving' | 'stable' | 'declining';
  status: 'achieved' | 'on_track' | 'at_risk' | 'not_achieved';
  notes: string;
  notesAr: string;
}

export interface Recommendation {
  category: 'clinical' | 'home' | 'school' | 'follow_up';
  priority: 'high' | 'medium' | 'low';
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  timeframe: string;
  responsible: 'clinician' | 'parent' | 'teacher' | 'patient';
}

// ═══════════════════════════════════════════════════════════════════════════════
// BOOKING & SCHEDULING
// ═══════════════════════════════════════════════════════════════════════════════

export interface BookingSlot {
  id: string;
  clinicianId: string;
  date: number;
  startTime: string;       // HH:mm format
  endTime: string;
  duration: number;        // minutes
  available: boolean;
  bookingId?: string;
  type: 'consultation' | 'assessment' | 'treatment' | 'follow_up';
}

export interface Booking {
  id: string;
  userId: string;
  patientId?: string;
  clinicianId?: string;
  type: 'consultation' | 'assessment' | 'treatment' | 'follow_up';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  scheduledAt: number;
  duration: number;
  location: 'clinic' | 'remote';
  remoteLink?: string;
  notes?: string;
  contactPhone: string;
  contactEmail?: string;
  reminder: {
    sent: boolean;
    sentAt?: number;
    method: 'whatsapp' | 'sms' | 'email';
  };
  cancellation?: {
    reason: string;
    cancelledAt: number;
    cancelledBy: string;
  };
  createdAt: number;
  updatedAt: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SUCCESS STORIES & TESTIMONIALS
// ═══════════════════════════════════════════════════════════════════════════════

export interface SuccessStory {
  id: string;
  type: 'video' | 'written' | 'case_study';
  title: string;
  titleAr: string;
  summary: string;
  summaryAr: string;
  content: string;
  contentAr: string;
  patientProfile: {
    ageRange: string;
    condition: string;
    conditionAr: string;
    anonymous: boolean;
    initials?: string;
  };
  outcomes: {
    category: string;
    categoryAr: string;
    improvement: string;
    improvementAr: string;
  }[];
  timeline: {
    treatment: string;
    followUp: string;
  };
  media?: {
    type: 'video' | 'image';
    url: string;
    thumbnail?: string;
  };
  testimonial?: {
    quote: string;
    quoteAr: string;
    author: string;
    authorAr: string;
    relationship: 'parent' | 'patient' | 'clinician' | 'teacher';
  };
  metrics?: {
    before: Record<string, number>;
    after: Record<string, number>;
  };
  featured: boolean;
  publishedAt: number;
  createdAt: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CERTIFICATIONS & CREDENTIALS
// ═══════════════════════════════════════════════════════════════════════════════

export interface Certification {
  id: string;
  type: 'practitioner' | 'training' | 'affiliation' | 'continuing_education';
  name: string;
  nameAr: string;
  issuingBody: string;
  issuingBodyAr: string;
  issueDate: number;
  expiryDate?: number;
  credentialId?: string;
  verificationUrl?: string;
  logo?: string;
  description: string;
  descriptionAr: string;
}

export interface Partner {
  id: string;
  type: 'school' | 'clinic' | 'research' | 'organization';
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  logo: string;
  website?: string;
  partnerSince: number;
  featured: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DEMO MODE
// ═══════════════════════════════════════════════════════════════════════════════

export interface DemoConfiguration {
  enabled: boolean;
  features: {
    assessment: boolean;
    treatment: boolean;
    reports: boolean;
    booking: boolean;
  };
  limits: {
    assessmentModules: number;   // e.g., 2 of 6
    reportPreview: boolean;      // Show limited report
    bookingEnabled: boolean;     // Allow demo booking
  };
  prompts: {
    upgradeAfterGames: boolean;
    upgradeAfterResults: boolean;
    showContactCTA: boolean;
  };
  demoPatient: Partial<PatientProfile>;
  demoProgress: Partial<TreatmentProgress>;
}
