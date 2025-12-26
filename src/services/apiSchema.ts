/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * LOTUS SOUND LAB - API Schema
 * Complete API type definitions and endpoint documentation
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════════
// BASE TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, string>;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    hasMore?: boolean;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ═══════════════════════════════════════════════════════════════════════════════
// USER & AUTH TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type UserRole =
  | 'guest'
  | 'patient'
  | 'parent'
  | 'clinician'
  | 'school_admin'
  | 'super_admin';

export interface User {
  id: string;
  email: string;
  name: string;
  nameAr?: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  clinic?: string;
  school?: string;
  children?: string[];
  clinician?: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
  isActive: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresAt: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  nameAr?: string;
  role?: UserRole;
  phone?: string;
}

export interface RegisterResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
  expiresAt: number;
}

export interface UpdateProfileRequest {
  name?: string;
  nameAr?: string;
  phone?: string;
  avatar?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PATIENT TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type PatientStatus =
  | 'intake'
  | 'assessment'
  | 'active'
  | 'maintenance'
  | 'completed'
  | 'archived';

export interface Patient {
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
  audiogram?: {
    leftEar: number[];
    rightEar: number[];
    frequencies: number[];
    date: string;
    notes?: string;
  };
  status: PatientStatus;
  treatmentPlanId?: string;
  clinicianId?: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePatientRequest {
  userId: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  diagnoses?: string[];
  referralSource?: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalHistory?: string;
}

export interface UpdatePatientRequest {
  diagnoses?: string[];
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalHistory?: string;
  status?: PatientStatus;
  audiogram?: {
    leftEar: number[];
    rightEar: number[];
    frequencies: number[];
    date: string;
    notes?: string;
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// ASSESSMENT TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type AssessmentType = 'screening' | 'full' | 'follow_up';
export type AssessmentStatus = 'in_progress' | 'completed' | 'cancelled';
export type RiskLevel = 'low' | 'medium' | 'high';

export interface AttentionResult {
  hits: number;
  misses: number;
  falseAlarms: number;
  correctRejections: number;
  reactionTimes: number[];
  attentionIndex: number;
  consistencyScore: number;
}

export interface FrequencyResult {
  threshold: number;
  justNoticeableDifference: number;
  trialResults: { frequency: number; correct: boolean }[];
}

export interface SequencingResult {
  maxSpan: number;
  accuracy: number;
  trials: { length: number; correct: boolean }[];
}

export interface DichoticResult {
  leftEarAdvantage: number;
  integrationScore: number;
  separationScore: number;
  trials: { target: 'left' | 'right'; response: 'left' | 'right' }[];
}

export interface SNRResult {
  snrThreshold: number;
  wordRecognition: number;
  trials: { snr: number; correct: boolean }[];
}

export interface QuestionnaireResult {
  responses: Record<string, number>;
  categories: Record<string, number>;
  totalScore: number;
}

export interface Assessment {
  id: string;
  patientId: string;
  assessorId: string;
  type: AssessmentType;
  status: AssessmentStatus;
  startedAt: string;
  completedAt?: string;
  modules: {
    attention?: AttentionResult;
    frequency?: FrequencyResult;
    sequencing?: SequencingResult;
    dichotic?: DichoticResult;
    speechInNoise?: SNRResult;
    questionnaire?: QuestionnaireResult;
  };
  composite: {
    overallScore: number;
    riskLevel: RiskLevel;
    recommendation: string;
    recommendationAr: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAssessmentRequest {
  patientId: string;
  type: AssessmentType;
}

export interface UpdateAssessmentRequest {
  modules?: Partial<Assessment['modules']>;
  notes?: string;
}

export interface CompleteAssessmentRequest {
  modules: Assessment['modules'];
  notes?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// TREATMENT TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type ProtocolType = 'berard_ait' | 'modified' | 'maintenance';
export type TreatmentStatus = 'planned' | 'active' | 'paused' | 'completed' | 'cancelled';
export type SessionType = 'listening' | 'assessment' | 'consultation' | 'follow_up';
export type SessionStatus = 'scheduled' | 'in_progress' | 'completed' | 'missed' | 'cancelled';

export interface FrequencyProfile {
  low: { frequencies: number[]; attenuation: number[] };
  mid: { frequencies: number[]; attenuation: number[] };
  high: { frequencies: number[]; attenuation: number[] };
  description?: string;
}

export interface TreatmentGoal {
  id: string;
  description: string;
  descriptionAr: string;
  category: 'auditory' | 'attention' | 'behavioral' | 'academic' | 'social';
  target: number;
  current: number;
  status: 'pending' | 'in_progress' | 'achieved' | 'adjusted';
}

export interface TreatmentPlan {
  id: string;
  patientId: string;
  clinicianId: string;
  protocol: ProtocolType;
  status: TreatmentStatus;
  startDate: string;
  endDate?: string;
  sessions: {
    scheduled: number;
    completed: number;
    missed: number;
  };
  frequencyProfile: FrequencyProfile;
  adjustments: {
    date: string;
    sessionNumber: number;
    description: string;
    reason: string;
  }[];
  goals: TreatmentGoal[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTreatmentPlanRequest {
  patientId: string;
  protocol: ProtocolType;
  startDate: string;
  sessions: { scheduled: number };
  frequencyProfile: FrequencyProfile;
  goals: Omit<TreatmentGoal, 'id' | 'status'>[];
  notes?: string;
}

export interface TreatmentSession {
  id: string;
  treatmentPlanId: string;
  patientId: string;
  clinicianId: string;
  date: string;
  sessionNumber: number;
  dayNumber: number;
  periodNumber: 1 | 2;
  duration: number;
  type: SessionType;
  status: SessionStatus;
  audioSettings: {
    volume: number;
    frequencies: number[];
    musicTrack?: string;
    leftRightBalance: number;
  };
  observations: {
    behavioralNotes: string;
    attentionLevel: 1 | 2 | 3 | 4 | 5;
    cooperationLevel: 1 | 2 | 3 | 4 | 5;
    comfortLevel: 1 | 2 | 3 | 4 | 5;
    physicalReactions?: string[];
    emotionalResponses?: string[];
    clinicianNotes: string;
  };
  patientFeedback?: {
    overallExperience: 1 | 2 | 3 | 4 | 5;
    soundComfort: 1 | 2 | 3 | 4 | 5;
    fatigueLevel: 1 | 2 | 3 | 4 | 5;
    comments?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateSessionRequest {
  treatmentPlanId: string;
  date: string;
  sessionNumber: number;
  dayNumber: number;
  periodNumber: 1 | 2;
  duration: number;
  type: SessionType;
}

// ═══════════════════════════════════════════════════════════════════════════════
// BOOKING TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type BookingType = 'consultation' | 'assessment' | 'treatment' | 'follow_up';
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';

export interface BookingSlot {
  id: string;
  clinicianId: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  available: boolean;
  bookingId?: string;
  type: BookingType;
}

export interface Booking {
  id: string;
  userId: string;
  patientId?: string;
  clinicianId?: string;
  type: BookingType;
  status: BookingStatus;
  scheduledAt: string;
  duration: number;
  location: 'clinic' | 'remote';
  remoteLink?: string;
  notes?: string;
  contactPhone: string;
  contactEmail?: string;
  reminder: {
    sent: boolean;
    sentAt?: string;
    method: 'whatsapp' | 'sms' | 'email';
  };
  cancellation?: {
    reason: string;
    cancelledAt: string;
    cancelledBy: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingRequest {
  type: BookingType;
  clinicianId?: string;
  scheduledAt: string;
  duration: number;
  location: 'clinic' | 'remote';
  notes?: string;
  contactPhone: string;
  contactEmail?: string;
}

export interface GetSlotsRequest {
  clinicianId?: string;
  startDate: string;
  endDate: string;
  type?: BookingType;
}

// ═══════════════════════════════════════════════════════════════════════════════
// REPORT TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type ReportType = 'initial' | 'progress' | 'mid_treatment' | 'final' | 'follow_up';

export interface Report {
  id: string;
  patientId: string;
  treatmentPlanId?: string;
  type: ReportType;
  generatedAt: string;
  generatedBy: string;
  summary: {
    title: string;
    titleAr: string;
    period: { start: string; end: string };
    overallProgress: number;
    keyFindings: string[];
    keyFindingsAr: string[];
  };
  sections: string[];
  format: 'pdf' | 'csv' | 'json';
  fileUrl?: string;
  createdAt: string;
}

export interface GenerateReportRequest {
  patientId: string;
  treatmentPlanId?: string;
  type: ReportType;
  sections: string[];
  format: 'pdf' | 'csv' | 'json';
}

// ═══════════════════════════════════════════════════════════════════════════════
// GAMIFICATION TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface Achievement {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  icon: string;
  points: number;
  category: 'exploration' | 'learning' | 'mastery' | 'engagement' | 'clinical';
  unlocked: boolean;
  unlockedAt?: string;
}

export interface GamificationState {
  userId: string;
  totalPoints: number;
  level: number;
  achievements: string[];
  exploredBrainRegions: string[];
  slidesViewed: number[];
  checklistCompleted: boolean;
  gamesCompleted: string[];
  audioJourneyProgress: number;
  totalTimeSpent: number;
  clinicalSessionsCompleted: number;
  clinicalStreak: number;
  lastClinicalActivity?: string;
  treatmentPhase: 'assessment' | 'active' | 'maintenance' | 'completed';
  updatedAt: string;
}

export interface UpdateGamificationRequest {
  achievements?: string[];
  exploredBrainRegions?: string[];
  slidesViewed?: number[];
  checklistCompleted?: boolean;
  gamesCompleted?: string[];
  audioJourneyProgress?: number;
  totalTimeSpent?: number;
  clinicalSessionsCompleted?: number;
  clinicalStreak?: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SYNC TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface SyncRequest {
  lastSyncTimestamp: number;
  localChanges: {
    gamification?: Partial<GamificationState>;
    clinicalProgress?: Record<string, unknown>;
    userSettings?: Record<string, unknown>;
  };
}

export interface SyncResponse {
  serverTimestamp: number;
  serverChanges: {
    gamification?: GamificationState;
    clinicalProgress?: Record<string, unknown>;
    userSettings?: Record<string, unknown>;
  };
  conflicts?: {
    field: string;
    localValue: unknown;
    serverValue: unknown;
    resolution: 'local' | 'server' | 'merge';
    localUpdatedAt?: number;
    serverUpdatedAt?: number;
  }[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// ANALYTICS TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface SchoolAnalytics {
  schoolId: string;
  period: { start: string; end: string };
  totalStudents: number;
  activeStudents: number;
  completionRate: number;
  averageScore: number;
  weeklyProgress: { week: string; sessions: number; avgScore: number }[];
  gradeDistribution: { grade: string; count: number; avgScore: number }[];
  statusBreakdown: { status: string; count: number }[];
}

export interface CohortAnalytics {
  cohortId: string;
  name: string;
  size: number;
  metrics: {
    attention: { mean: number; stdDev: number };
    frequency: { mean: number; stdDev: number };
    sequencing: { mean: number; stdDev: number };
    dichotic: { mean: number; stdDev: number };
    snr: { mean: number; stdDev: number };
  };
  progressOverTime: { date: string; score: number }[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// API ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════════

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: 'POST /api/auth/login',
    REGISTER: 'POST /api/auth/register',
    LOGOUT: 'POST /api/auth/logout',
    REFRESH: 'POST /api/auth/refresh',
    ME: 'GET /api/auth/me',
    UPDATE_PROFILE: 'PUT /api/auth/profile',
    PASSWORD_RESET: 'POST /api/auth/password/reset',
  },

  // Users
  USERS: {
    LIST: 'GET /api/users',
    GET: 'GET /api/users/:id',
    UPDATE: 'PUT /api/users/:id',
    DELETE: 'DELETE /api/users/:id',
    CHILDREN: 'GET /api/users/:id/children',
    LINK_CHILD: 'POST /api/users/:id/children',
  },

  // Patients
  PATIENTS: {
    LIST: 'GET /api/patients',
    GET: 'GET /api/patients/:id',
    CREATE: 'POST /api/patients',
    UPDATE: 'PUT /api/patients/:id',
    SESSIONS: 'GET /api/patients/:id/sessions',
    PROGRESS: 'GET /api/patients/:id/progress',
  },

  // Assessments
  ASSESSMENTS: {
    CREATE: 'POST /api/assessments',
    UPDATE: 'PUT /api/assessments/:id',
    COMPLETE: 'POST /api/assessments/:id/complete',
    GET: 'GET /api/assessments/:id',
    LIST: 'GET /api/assessments',
    DELETE: 'DELETE /api/assessments/:id',
  },

  // Treatment
  TREATMENT: {
    CREATE_PLAN: 'POST /api/treatment/plans',
    GET_PLAN: 'GET /api/treatment/plans/:id',
    UPDATE_PLAN: 'PUT /api/treatment/plans/:id',
    CREATE_SESSION: 'POST /api/treatment/sessions',
    LIST_SESSIONS: 'GET /api/treatment/sessions',
    UPDATE_SESSION: 'PUT /api/treatment/sessions/:id',
  },

  // Booking
  BOOKING: {
    GET_SLOTS: 'GET /api/booking/slots',
    CREATE: 'POST /api/booking',
    GET: 'GET /api/booking/:id',
    UPDATE: 'PUT /api/booking/:id',
    CANCEL: 'DELETE /api/booking/:id',
    CALENDAR: 'GET /api/booking/calendar',
  },

  // Reports
  REPORTS: {
    PATIENT: 'GET /api/reports/patient/:id',
    SCHOOL: 'GET /api/reports/school/:id',
    COHORT: 'GET /api/reports/cohort',
    EXPORT: 'POST /api/reports/export',
    DOWNLOAD: 'GET /api/reports/download/:id',
  },

  // Gamification
  GAMIFICATION: {
    GET: 'GET /api/gamification',
    UPDATE: 'PUT /api/gamification',
    UNLOCK_ACHIEVEMENT: 'POST /api/gamification/achievements/:id',
  },

  // Sync
  SYNC: {
    FULL: 'POST /api/sync',
    PUSH: 'POST /api/sync/push',
    PULL: 'GET /api/sync/pull',
  },

  // Health
  HEALTH: {
    CHECK: 'GET /api/health',
    VERSION: 'GET /api/version',
  },
} as const;

export default API_ENDPOINTS;
