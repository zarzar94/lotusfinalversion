/**
 * Comprehensive Data Models for LOTUS SOUND LAB Platform
 * This file contains all TypeScript interfaces and types for the platform
 */

// =============================================================================
// USER & AUTHENTICATION
// =============================================================================

export type UserRole = 'guest' | 'patient' | 'parent' | 'clinician' | 'school_admin' | 'super_admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  profile: UserProfile;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  isActive: boolean;
  isVerified: boolean;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  displayName?: string;
  avatarUrl?: string;
  phone?: string;
  alternatePhone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  nationality?: string;
  nationalId?: string;
  address?: Address;
}

export interface Address {
  street?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  country: string;
}

export interface UserPreferences {
  language: 'en' | 'ar';
  theme: 'light' | 'dark' | 'system';
  notifications: NotificationPreferences;
  timezone: string;
}

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  whatsapp: boolean;
  push: boolean;
  appointmentReminders: boolean;
  progressUpdates: boolean;
  marketing: boolean;
}

// =============================================================================
// PATIENT & CLINICAL
// =============================================================================

export interface Patient {
  id: string;
  userId?: string; // If patient has their own account
  parentId: string; // Link to parent/guardian
  profile: PatientProfile;
  medicalHistory: MedicalHistory;
  auditoryProfile: AuditoryProfile;
  schoolInfo?: SchoolInfo;
  treatmentHistory: TreatmentHistoryEntry[];
  documents: Document[];
  notes: ClinicalNote[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PatientProfile {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  avatarUrl?: string;
  nationality?: string;
  nationalId?: string;
  preferredName?: string;
}

export interface MedicalHistory {
  hasHearingLoss: boolean | null;
  hearingLossDetails?: string;
  hasEarInfections: boolean | null;
  earInfectionDetails?: string;
  hasTubesOrSurgery: boolean | null;
  surgeryDetails?: string;
  currentMedications: string[];
  allergies: string[];
  previousTherapies: PreviousTherapy[];
  otherMedicalConditions: string[];
  diagnosisHistory: Diagnosis[];
  lastAudiogramDate?: string;
}

export interface PreviousTherapy {
  type: string;
  provider?: string;
  startDate?: string;
  endDate?: string;
  outcome?: string;
}

export interface Diagnosis {
  code: string;
  name: string;
  diagnosedDate: string;
  diagnosedBy?: string;
  notes?: string;
}

export interface AuditoryProfile {
  soundSensitivity: ScaleRating;
  attentionDifficulty: ScaleRating;
  speechProcessing: ScaleRating;
  readingDifficulty: ScaleRating;
  followingInstructions: ScaleRating;
  noisyEnvironments: ScaleRating;
  primaryConcerns: string[];
  concernsDescription?: string;
  goalsForTreatment?: string;
  lastAssessmentDate?: string;
  lastAssessmentId?: string;
}

export type ScaleRating = 1 | 2 | 3 | 4 | 5;

export interface SchoolInfo {
  schoolName?: string;
  gradeLevel?: string;
  teacherName?: string;
  teacherEmail?: string;
  hasIEP: boolean | null;
  specialServices: string[];
  academicChallenges?: string;
  attendanceIssues?: string;
  behavioralNotes?: string;
}

export interface ClinicalNote {
  id: string;
  patientId: string;
  authorId: string;
  authorName: string;
  type: 'progress' | 'observation' | 'recommendation' | 'follow-up' | 'other';
  content: string;
  isPrivate: boolean;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  id: string;
  patientId: string;
  type: 'audiogram' | 'assessment' | 'report' | 'consent' | 'referral' | 'other';
  name: string;
  url: string;
  mimeType: string;
  size: number;
  uploadedBy: string;
  uploadedAt: Date;
  expiresAt?: Date;
}

// =============================================================================
// ASSESSMENT
// =============================================================================

export interface Assessment {
  id: string;
  patientId: string;
  type: 'initial' | 'progress' | 'final' | 'follow-up';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  scheduledDate: string;
  completedDate?: string;
  practitionerId: string;
  practitionerName: string;
  results?: AssessmentResults;
  audiogramData?: AudiogramData;
  behavioralObservations: string[];
  recommendations: string[];
  followUpDate?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AssessmentResults {
  overallScore: number;
  categories: AssessmentCategory[];
  summary: string;
  riskLevel: 'low' | 'moderate' | 'high';
}

export interface AssessmentCategory {
  name: string;
  score: number;
  maxScore: number;
  percentile?: number;
  interpretation: string;
  subTests?: AssessmentSubTest[];
}

export interface AssessmentSubTest {
  name: string;
  score: number;
  maxScore: number;
  notes?: string;
}

export interface AudiogramData {
  testDate: string;
  testedBy: string;
  leftEar: FrequencyReading[];
  rightEar: FrequencyReading[];
  notes?: string;
  equipmentUsed?: string;
}

export interface FrequencyReading {
  frequencyHz: number;
  thresholdDb: number;
  masked?: boolean;
}

// =============================================================================
// TREATMENT
// =============================================================================

export interface TreatmentPlan {
  id: string;
  patientId: string;
  status: 'draft' | 'scheduled' | 'active' | 'completed' | 'cancelled' | 'on-hold';
  type: 'standard' | 'intensive' | 'maintenance';
  startDate: string;
  endDate?: string;
  totalSessions: number;
  completedSessions: number;
  sessions: TreatmentSession[];
  goals: TreatmentGoal[];
  protocol: TreatmentProtocol;
  preAssessmentId?: string;
  postAssessmentId?: string;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TreatmentSession {
  id: string;
  planId: string;
  patientId: string;
  sessionNumber: number;
  day: number; // 1-10 for standard protocol
  period: 'morning' | 'afternoon';
  status: 'scheduled' | 'in-progress' | 'completed' | 'missed' | 'cancelled';
  scheduledDate: string;
  scheduledTime: string;
  actualStartTime?: string;
  actualEndTime?: string;
  duration: number; // in minutes
  practitionerId: string;
  practitionerName: string;
  protocol: SessionProtocol;
  patientResponse: 'positive' | 'neutral' | 'challenging' | null;
  observations?: string;
  parentFeedback?: string;
  practitionerNotes?: string;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionProtocol {
  frequencyProfile: string;
  volumeSettings: VolumeSettings;
  filterSettings: FilterSettings[];
  musicTracks?: string[];
  specialInstructions?: string;
}

export interface VolumeSettings {
  left: number;
  right: number;
  maxAllowed: number;
}

export interface FilterSettings {
  frequencyBand: string;
  centerHz: number;
  attenuation: number;
  enabled: boolean;
}

export interface TreatmentGoal {
  id: string;
  category: string;
  description: string;
  targetDate?: string;
  status: 'not-started' | 'in-progress' | 'achieved' | 'modified';
  baseline?: number;
  target?: number;
  current?: number;
  notes?: string;
}

export interface TreatmentProtocol {
  name: string;
  version: string;
  description: string;
  dailySessions: number;
  sessionDuration: number;
  totalDays: number;
  restDaysBetween?: number;
  frequencyProfiles: FrequencyProfile[];
}

export interface FrequencyProfile {
  id: string;
  name: string;
  description: string;
  bands: FrequencyBandSetting[];
}

export interface FrequencyBandSetting {
  band: string;
  centerHz: number;
  minHz: number;
  maxHz: number;
  defaultAttenuation: number;
}

export interface TreatmentHistoryEntry {
  planId: string;
  startDate: string;
  endDate?: string;
  status: string;
  outcome?: string;
  sessionsCompleted: number;
  totalSessions: number;
}

// =============================================================================
// BOOKING & SCHEDULING
// =============================================================================

export interface Booking {
  id: string;
  patientId?: string;
  patientName: string;
  parentId: string;
  parentName: string;
  type: 'initial-consultation' | 'assessment' | 'treatment-start' | 'follow-up' | 'other';
  status: 'pending' | 'confirmed' | 'rescheduled' | 'completed' | 'cancelled' | 'no-show';
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  practitionerId?: string;
  practitionerName?: string;
  location?: string;
  notes?: string;
  contactInfo: BookingContactInfo;
  reminders: ReminderSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingContactInfo {
  phone: string;
  email: string;
  preferredContact: 'phone' | 'email' | 'whatsapp';
}

export interface ReminderSettings {
  enabled: boolean;
  channels: ('email' | 'sms' | 'whatsapp')[];
  times: number[]; // hours before appointment
}

export interface TimeSlot {
  date: string;
  time: string;
  available: boolean;
  practitionerId?: string;
  practitionerName?: string;
}

export interface PractitionerSchedule {
  practitionerId: string;
  practitionerName: string;
  workingDays: number[]; // 0-6, Sunday to Saturday
  workingHours: WorkingHours;
  breaks: BreakTime[];
  blockedDates: string[];
  specialHours: SpecialHours[];
}

export interface WorkingHours {
  start: string; // HH:mm format
  end: string;
}

export interface BreakTime {
  start: string;
  end: string;
  label?: string;
}

export interface SpecialHours {
  date: string;
  hours?: WorkingHours;
  isHoliday?: boolean;
  note?: string;
}

// =============================================================================
// ANALYTICS & REPORTING
// =============================================================================

export interface DashboardMetrics {
  period: 'day' | 'week' | 'month' | 'quarter' | 'year';
  startDate: string;
  endDate: string;
  patients: PatientMetrics;
  sessions: SessionMetrics;
  outcomes: OutcomeMetrics;
  financial?: FinancialMetrics;
}

export interface PatientMetrics {
  total: number;
  active: number;
  new: number;
  returning: number;
  byAgeGroup: Record<string, number>;
  byGender: Record<string, number>;
  byConcern: Record<string, number>;
}

export interface SessionMetrics {
  scheduled: number;
  completed: number;
  cancelled: number;
  noShow: number;
  averageDuration: number;
  byDay: Record<string, number>;
  byPractitioner: Record<string, number>;
}

export interface OutcomeMetrics {
  averageImprovement: number;
  improvementByCategory: Record<string, number>;
  satisfactionRate: number;
  completionRate: number;
  referralRate: number;
}

export interface FinancialMetrics {
  revenue: number;
  averagePerPatient: number;
  outstandingPayments: number;
  byService: Record<string, number>;
}

// =============================================================================
// FEEDBACK & REVIEWS
// =============================================================================

export interface Feedback {
  id: string;
  patientId?: string;
  userId: string;
  type: 'session' | 'treatment' | 'service' | 'facility' | 'general';
  relatedId?: string; // Session ID, Treatment ID, etc.
  overallRating: number; // 1-5
  categoryRatings: Record<string, number>;
  wouldRecommend: boolean | null;
  improvements: string[];
  comments?: string;
  isPublic: boolean;
  isApproved: boolean;
  response?: FeedbackResponse;
  followUpConsent: boolean;
  createdAt: Date;
}

export interface FeedbackResponse {
  responderId: string;
  responderName: string;
  content: string;
  respondedAt: Date;
}

export interface Testimonial {
  id: string;
  patientId?: string;
  authorName: string;
  relationship: 'patient' | 'parent' | 'teacher' | 'therapist';
  content: string;
  rating: number;
  category: string;
  beforeMetrics?: Record<string, number>;
  afterMetrics?: Record<string, number>;
  isApproved: boolean;
  isFeatured: boolean;
  createdAt: Date;
}

// =============================================================================
// GAMIFICATION & PRACTICE
// =============================================================================

export interface GameProgress {
  userId: string;
  patientId?: string;
  level: number;
  totalXP: number;
  currentXP: number;
  xpToNextLevel: number;
  badges: Badge[];
  achievements: Achievement[];
  streak: StreakData;
  stats: GameStats;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  category: string;
  earnedAt: Date;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: string;
  progress: number;
  target: number;
  isCompleted: boolean;
  completedAt?: Date;
  reward?: AchievementReward;
}

export interface AchievementReward {
  type: 'xp' | 'badge' | 'unlock';
  value: number | string;
}

export interface StreakData {
  current: number;
  longest: number;
  lastActivityDate: string;
}

export interface GameStats {
  totalPracticeTime: number;
  sessionsCompleted: number;
  gamesPlayed: number;
  perfectScores: number;
  averageScore: number;
}

export interface PracticeActivity {
  id: string;
  userId: string;
  patientId?: string;
  type: 'game' | 'exercise' | 'assessment';
  gameId: string;
  gameName: string;
  startedAt: Date;
  completedAt?: Date;
  duration: number;
  score?: number;
  maxScore?: number;
  accuracy?: number;
  difficulty: 'easy' | 'medium' | 'hard';
  metrics: Record<string, number>;
}

// =============================================================================
// CONTENT & RESOURCES
// =============================================================================

export interface ContentItem {
  id: string;
  type: 'article' | 'video' | 'infographic' | 'guide' | 'faq';
  title: BilingualText;
  description: BilingualText;
  content: BilingualText;
  category: string;
  tags: string[];
  thumbnailUrl?: string;
  mediaUrl?: string;
  duration?: number; // For videos
  readTime?: number; // For articles
  targetAudience: ('patient' | 'parent' | 'educator' | 'professional')[];
  isPublished: boolean;
  publishedAt?: Date;
  author: string;
  views: number;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BilingualText {
  en: string;
  ar: string;
}

export interface FAQ {
  id: string;
  question: BilingualText;
  answer: BilingualText;
  category: string;
  order: number;
  isPublished: boolean;
}

// =============================================================================
// NOTIFICATIONS & COMMUNICATIONS
// =============================================================================

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  channels: ('in-app' | 'email' | 'sms' | 'push')[];
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
  expiresAt?: Date;
}

export type NotificationType =
  | 'appointment-reminder'
  | 'appointment-confirmation'
  | 'appointment-cancelled'
  | 'treatment-update'
  | 'assessment-ready'
  | 'report-available'
  | 'payment-due'
  | 'message'
  | 'achievement'
  | 'system';

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  recipientId: string;
  recipientName: string;
  subject?: string;
  content: string;
  attachments?: Attachment[];
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

// =============================================================================
// PARTNERS & ORGANIZATIONS
// =============================================================================

export interface Partner {
  id: string;
  type: 'school' | 'hospital' | 'clinic' | 'organization' | 'research';
  name: BilingualText;
  description?: BilingualText;
  logoUrl?: string;
  website?: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: Address;
  partnershipStart: string;
  partnershipEnd?: string;
  status: 'active' | 'inactive' | 'pending';
  referralCount: number;
  isFeatured: boolean;
}

export interface Certification {
  id: string;
  type: 'practitioner' | 'facility' | 'program';
  name: BilingualText;
  issuedBy: string;
  issuedByLogo?: string;
  issuedDate: string;
  expiryDate?: string;
  certificateUrl?: string;
  verificationUrl?: string;
  description?: BilingualText;
}

// =============================================================================
// AUDIT & LOGGING
// =============================================================================

export interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  resource: string;
  resourceId: string;
  previousValue?: unknown;
  newValue?: unknown;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

export interface SystemLog {
  id: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  context?: Record<string, unknown>;
  stack?: string;
  createdAt: Date;
}

// =============================================================================
// SETTINGS & CONFIGURATION
// =============================================================================

export interface ClinicSettings {
  name: BilingualText;
  tagline?: BilingualText;
  description?: BilingualText;
  logoUrl?: string;
  faviconUrl?: string;
  address: Address;
  phone: string;
  email: string;
  website?: string;
  socialMedia?: SocialMedia;
  workingHours: WorkingHoursSettings;
  appointmentSettings: AppointmentSettings;
  notificationSettings: ClinicNotificationSettings;
}

export interface SocialMedia {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
  tiktok?: string;
}

export interface WorkingHoursSettings {
  timezone: string;
  schedule: Record<number, WorkingHours | null>; // 0-6 for days
  holidays: HolidaySettings[];
}

export interface HolidaySettings {
  date: string;
  name: BilingualText;
  isRecurring: boolean;
}

export interface AppointmentSettings {
  slotDuration: number;
  bufferTime: number;
  maxAdvanceBookingDays: number;
  minAdvanceBookingHours: number;
  cancellationPolicyHours: number;
  allowWaitlist: boolean;
  requireConfirmation: boolean;
}

export interface ClinicNotificationSettings {
  appointmentReminderTimes: number[];
  sendConfirmations: boolean;
  sendCancellations: boolean;
  sendFollowUps: boolean;
  defaultChannels: ('email' | 'sms' | 'whatsapp')[];
}

export default {
  // Re-export all types for convenience
};
