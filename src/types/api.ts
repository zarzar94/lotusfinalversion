/**
 * API Types - Backend integration types for Lotus AIT Platform
 */

// ═══════════════════════════════════════════════════════════════════════════
// AUTH TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user: ApiUser | null;
  token: string | null;
  refreshToken: string | null;
  error?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  nameAr?: string;
  role?: UserRole;
}

export interface RegisterResponse {
  success: boolean;
  user: ApiUser | null;
  token: string | null;
  error?: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  token: string | null;
  error?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// USER TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type UserRole = 'guest' | 'patient' | 'parent' | 'clinician' | 'school_admin' | 'super_admin';

export interface ApiUser {
  id: string;
  email: string;
  name: string;
  nameAr?: string;
  role: UserRole;
  avatar?: string;
  clinic?: string;
  school?: string;
  children?: string[];
  createdAt: number;
  lastLogin: number;
}

export interface UpdateProfileRequest {
  name?: string;
  nameAr?: string;
  avatar?: string;
}

export interface UpdateProfileResponse {
  success: boolean;
  user: ApiUser | null;
  error?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// CLINICAL PROGRESS TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface ClinicalProgress {
  userId: string;
  sessionsCompleted: number;
  sessionDates: number[];
  hearingProfile?: {
    leftEar: number[];
    rightEar: number[];
    updatedAt: number;
  };
  attentionScore: number;
  processingSpeed: number;
  auditoryDiscrimination: number;
  weeklyGoalsMet: number;
  treatmentPhase: 'assessment' | 'active' | 'maintenance' | 'completed';
  streak: number;
  lastActivityDate: number;
  updatedAt: number;
}

export interface UpdateClinicalProgressRequest {
  sessionsCompleted?: number;
  sessionDates?: number[];
  hearingProfile?: {
    leftEar: number[];
    rightEar: number[];
  };
  attentionScore?: number;
  processingSpeed?: number;
  auditoryDiscrimination?: number;
  weeklyGoalsMet?: number;
  treatmentPhase?: 'assessment' | 'active' | 'maintenance' | 'completed';
  streak?: number;
}

export interface ClinicalProgressResponse {
  success: boolean;
  progress: ClinicalProgress | null;
  error?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// GAMIFICATION TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface Achievement {
  id: string;
  unlocked: boolean;
  unlockedAt?: number;
  points: number;
}

export interface GamificationState {
  userId: string;
  achievements: Achievement[];
  totalPoints: number;
  level: number;
  exploredBrainRegions: string[];
  slidesViewed: number[];
  checklistCompleted: boolean;
  gamesCompleted: string[];
  audioJourneyProgress: number;
  totalTimeSpent: number;
  maxScrollProgress: number;
  videosWatched: string[];
  clinicalSessionsCompleted: number;
  clinicalStreak: number;
  lastClinicalActivity: number;
  treatmentPhase: 'assessment' | 'active' | 'maintenance' | 'completed';
  updatedAt: number;
}

export interface UpdateGamificationRequest {
  achievements?: Achievement[];
  totalPoints?: number;
  level?: number;
  exploredBrainRegions?: string[];
  slidesViewed?: number[];
  checklistCompleted?: boolean;
  gamesCompleted?: string[];
  audioJourneyProgress?: number;
  totalTimeSpent?: number;
  maxScrollProgress?: number;
  videosWatched?: string[];
  clinicalSessionsCompleted?: number;
  clinicalStreak?: number;
  lastClinicalActivity?: number;
  treatmentPhase?: 'assessment' | 'active' | 'maintenance' | 'completed';
}

export interface GamificationResponse {
  success: boolean;
  state: GamificationState | null;
  error?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// SETTINGS TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface UserSettings {
  userId: string;
  language: 'ar' | 'en';
  visitorMode: 'school' | 'parent' | 'clinician';
  notifications: {
    achievements: boolean;
    reminders: boolean;
    updates: boolean;
    email: boolean;
  };
  display: {
    reducedMotion: boolean;
    highContrast: boolean;
    fontSize: 'small' | 'medium' | 'large';
  };
  privacy: {
    shareProgress: boolean;
    anonymousAnalytics: boolean;
  };
  audio: {
    soundEffects: boolean;
    volume: number;
  };
  updatedAt: number;
}

export interface UpdateSettingsRequest {
  language?: 'ar' | 'en';
  visitorMode?: 'school' | 'parent' | 'clinician';
  notifications?: Partial<UserSettings['notifications']>;
  display?: Partial<UserSettings['display']>;
  privacy?: Partial<UserSettings['privacy']>;
  audio?: Partial<UserSettings['audio']>;
}

export interface SettingsResponse {
  success: boolean;
  settings: UserSettings | null;
  error?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// ASSESSMENT SESSION TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type GameResult = 'high' | 'medium' | 'low';

export interface TestOutcome {
  result: GameResult;
  scoreLabel: string;
  metrics?: Record<string, unknown>;
}

export interface AssessmentSession {
  id: string;
  userId: string;
  date: number;
  outcomes: Record<string, TestOutcome>;
  compositeResult?: GameResult;
  totalPoints?: number;
  achievements?: string[];
  duration?: number;
  createdAt: number;
}

export interface SaveSessionRequest {
  outcomes: Record<string, TestOutcome>;
  compositeResult?: GameResult;
  totalPoints?: number;
  achievements?: string[];
  duration?: number;
}

export interface SessionResponse {
  success: boolean;
  session: AssessmentSession | null;
  error?: string;
}

export interface SessionsListResponse {
  success: boolean;
  sessions: AssessmentSession[];
  total: number;
  error?: string;
}

export interface SessionAnalysisOverview {
  totalSessions: number;
  lastSession?: AssessmentSession;
  averagePoints: number;
}

export interface SessionTrendPoint {
  date: number;
  result: GameResult;
  scoreLabel: string;
}

export interface SessionProgressTrend {
  testKey: string;
  sessions: SessionTrendPoint[];
  improvement: number;
  trend: 'improving' | 'declining' | 'stable';
}

export interface SessionAnalysisResponse {
  success: boolean;
  overview?: SessionAnalysisOverview;
  trend?: SessionProgressTrend | null;
  message?: string;
  error?: string;
}

export interface SchoolSessionsSummary {
  school: string;
  totalSessions: number;
  uniqueUsers: number;
  averagePoints: number;
  averageScore: number;
  moduleAverages: Record<string, number>;
}

export interface SchoolSessionsAnalysisResponse {
  success: boolean;
  summary?: SchoolSessionsSummary;
  error?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// SYNC TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface SyncRequest {
  lastSyncAt: number;
  localData: {
    clinicalProgress?: Partial<ClinicalProgress>;
    gamification?: Partial<GamificationState>;
    settings?: Partial<UserSettings>;
    sessions?: AssessmentSession[];
  };
}

export interface SyncResponse {
  success: boolean;
  serverData: {
    clinicalProgress?: ClinicalProgress;
    gamification?: GamificationState;
    settings?: UserSettings;
    sessions?: AssessmentSession[];
  };
  conflicts?: {
    field: string;
    localValue: unknown;
    serverValue: unknown;
    resolution: 'local' | 'server';
  }[];
  syncedAt: number;
  error?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// API ERROR TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}
