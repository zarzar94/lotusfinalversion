/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * LOTUS SOUND LAB - Treatment Context
 * Manages treatment protocol state, sessions, and progress tracking
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type {
  TreatmentPlan,
  TreatmentSession,
  TreatmentProgress,
  TreatmentPhase,
  PatientProfile,
  Booking,
  TreatmentReport,
  FollowUpSchedule,
} from '../types/treatment';

// ═══════════════════════════════════════════════════════════════════════════════
// STORAGE KEYS
// ═══════════════════════════════════════════════════════════════════════════════

const STORAGE_KEYS = {
  TREATMENT_PLAN: 'lotus_treatment_plan',
  SESSIONS: 'lotus_treatment_sessions',
  PROGRESS: 'lotus_treatment_progress',
  PATIENT_PROFILE: 'lotus_patient_profile',
  BOOKINGS: 'lotus_bookings',
  REPORTS: 'lotus_reports',
  FOLLOW_UP: 'lotus_follow_up',
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// CONTEXT TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface TreatmentContextValue {
  // State
  treatmentPlan: TreatmentPlan | null;
  sessions: TreatmentSession[];
  progress: TreatmentProgress | null;
  patientProfile: PatientProfile | null;
  bookings: Booking[];
  reports: TreatmentReport[];
  followUpSchedule: FollowUpSchedule | null;
  currentSession: TreatmentSession | null;
  isLoading: boolean;

  // Treatment Plan Actions
  createTreatmentPlan: (plan: Omit<TreatmentPlan, 'id' | 'createdAt' | 'updatedAt'>) => TreatmentPlan;
  updateTreatmentPlan: (updates: Partial<TreatmentPlan>) => void;
  pauseTreatment: (reason: string) => void;
  resumeTreatment: () => void;
  completeTreatment: () => void;

  // Session Actions
  scheduleSession: (session: Omit<TreatmentSession, 'id' | 'createdAt' | 'updatedAt'>) => TreatmentSession;
  startSession: (sessionId: string) => void;
  updateSession: (sessionId: string, updates: Partial<TreatmentSession>) => void;
  completeSession: (sessionId: string, observations: TreatmentSession['observations']) => void;
  cancelSession: (sessionId: string, reason: string) => void;
  getNextSession: () => TreatmentSession | null;
  getTodaysSessions: () => TreatmentSession[];
  getSessionsByDay: (dayNumber: number) => TreatmentSession[];

  // Progress Actions
  updateProgress: (updates: Partial<TreatmentProgress>) => void;
  updateGoalProgress: (goalId: string, currentValue: number) => void;
  addMilestone: (milestone: TreatmentProgress['milestones'][0]) => void;
  calculateOverallProgress: () => number;

  // Patient Profile Actions
  setPatientProfile: (profile: PatientProfile) => void;
  updatePatientProfile: (updates: Partial<PatientProfile>) => void;

  // Booking Actions
  createBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>) => Booking;
  updateBooking: (bookingId: string, updates: Partial<Booking>) => void;
  cancelBooking: (bookingId: string, reason: string) => void;
  getUpcomingBookings: () => Booking[];

  // Report Actions
  generateReport: (type: TreatmentReport['type']) => TreatmentReport;
  getReports: () => TreatmentReport[];

  // Follow-up Actions
  scheduleFollowUp: (schedule: Omit<FollowUpSchedule, 'id' | 'createdAt'>) => void;
  completeFollowUp: (intervalId: string, assessmentId: string) => void;

  // Utility
  getTreatmentPhase: () => TreatmentPhase;
  getDaysRemaining: () => number;
  getAdherenceRate: () => number;
  clearTreatmentData: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTEXT CREATION
// ═══════════════════════════════════════════════════════════════════════════════

const TreatmentContext = createContext<TreatmentContextValue | null>(null);

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

const generateId = (): string => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const safeJsonParse = <T>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

const safeJsonSave = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to save ${key}:`, error);
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// PROVIDER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const TreatmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State initialization
  const [treatmentPlan, setTreatmentPlan] = useState<TreatmentPlan | null>(() =>
    safeJsonParse(STORAGE_KEYS.TREATMENT_PLAN, null)
  );
  const [sessions, setSessions] = useState<TreatmentSession[]>(() =>
    safeJsonParse(STORAGE_KEYS.SESSIONS, [])
  );
  const [progress, setProgress] = useState<TreatmentProgress | null>(() =>
    safeJsonParse(STORAGE_KEYS.PROGRESS, null)
  );
  const [patientProfile, setPatientProfileState] = useState<PatientProfile | null>(() =>
    safeJsonParse(STORAGE_KEYS.PATIENT_PROFILE, null)
  );
  const [bookings, setBookings] = useState<Booking[]>(() =>
    safeJsonParse(STORAGE_KEYS.BOOKINGS, [])
  );
  const [reports, setReports] = useState<TreatmentReport[]>(() =>
    safeJsonParse(STORAGE_KEYS.REPORTS, [])
  );
  const [followUpSchedule, setFollowUpSchedule] = useState<FollowUpSchedule | null>(() =>
    safeJsonParse(STORAGE_KEYS.FOLLOW_UP, null)
  );
  const [currentSession, setCurrentSession] = useState<TreatmentSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Persist state changes
  useEffect(() => {
    if (treatmentPlan) safeJsonSave(STORAGE_KEYS.TREATMENT_PLAN, treatmentPlan);
  }, [treatmentPlan]);

  useEffect(() => {
    safeJsonSave(STORAGE_KEYS.SESSIONS, sessions);
  }, [sessions]);

  useEffect(() => {
    if (progress) safeJsonSave(STORAGE_KEYS.PROGRESS, progress);
  }, [progress]);

  useEffect(() => {
    if (patientProfile) safeJsonSave(STORAGE_KEYS.PATIENT_PROFILE, patientProfile);
  }, [patientProfile]);

  useEffect(() => {
    safeJsonSave(STORAGE_KEYS.BOOKINGS, bookings);
  }, [bookings]);

  useEffect(() => {
    safeJsonSave(STORAGE_KEYS.REPORTS, reports);
  }, [reports]);

  useEffect(() => {
    if (followUpSchedule) safeJsonSave(STORAGE_KEYS.FOLLOW_UP, followUpSchedule);
  }, [followUpSchedule]);

  // ═══════════════════════════════════════════════════════════════════════════
  // TREATMENT PLAN ACTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  const createTreatmentPlan = useCallback((plan: Omit<TreatmentPlan, 'id' | 'createdAt' | 'updatedAt'>): TreatmentPlan => {
    const now = Date.now();
    const newPlan: TreatmentPlan = {
      ...plan,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    setTreatmentPlan(newPlan);

    // Initialize progress
    const initialProgress: TreatmentProgress = {
      patientId: plan.patientId,
      treatmentPlanId: newPlan.id,
      overallProgress: 0,
      phaseProgress: 0,
      currentPhase: 'assessment',
      sessionsCompleted: 0,
      totalSessions: plan.sessions.scheduled,
      streak: 0,
      goalProgress: plan.goals.map(g => ({
        goalId: g.id,
        startValue: g.current,
        currentValue: g.current,
        targetValue: g.target,
        changeFromBaseline: 0,
        trend: 'stable' as const,
        lastUpdated: now,
      })),
      milestones: [],
      weeklyTrends: [],
      updatedAt: now,
    };
    setProgress(initialProgress);

    return newPlan;
  }, []);

  const updateTreatmentPlan = useCallback((updates: Partial<TreatmentPlan>) => {
    setTreatmentPlan(prev => prev ? { ...prev, ...updates, updatedAt: Date.now() } : null);
  }, []);

  const pauseTreatment = useCallback((reason: string) => {
    setTreatmentPlan(prev => prev ? {
      ...prev,
      status: 'paused',
      notes: `${prev.notes}\n\n[PAUSED ${new Date().toISOString()}]: ${reason}`,
      updatedAt: Date.now(),
    } : null);
  }, []);

  const resumeTreatment = useCallback(() => {
    setTreatmentPlan(prev => prev ? {
      ...prev,
      status: 'active',
      notes: `${prev.notes}\n\n[RESUMED ${new Date().toISOString()}]`,
      updatedAt: Date.now(),
    } : null);
  }, []);

  const completeTreatment = useCallback(() => {
    const now = Date.now();
    setTreatmentPlan(prev => prev ? {
      ...prev,
      status: 'completed',
      endDate: now,
      updatedAt: now,
    } : null);
    setProgress(prev => prev ? {
      ...prev,
      currentPhase: 'completed',
      overallProgress: 100,
      updatedAt: now,
    } : null);
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // SESSION ACTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  const scheduleSession = useCallback((session: Omit<TreatmentSession, 'id' | 'createdAt' | 'updatedAt'>): TreatmentSession => {
    const now = Date.now();
    const newSession: TreatmentSession = {
      ...session,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    setSessions(prev => [...prev, newSession]);
    return newSession;
  }, []);

  const startSession = useCallback((sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      const updatedSession = { ...session, status: 'in_progress' as const, updatedAt: Date.now() };
      setSessions(prev => prev.map(s => s.id === sessionId ? updatedSession : s));
      setCurrentSession(updatedSession);
    }
  }, [sessions]);

  const updateSession = useCallback((sessionId: string, updates: Partial<TreatmentSession>) => {
    setSessions(prev => prev.map(s =>
      s.id === sessionId ? { ...s, ...updates, updatedAt: Date.now() } : s
    ));
    if (currentSession?.id === sessionId) {
      setCurrentSession(prev => prev ? { ...prev, ...updates, updatedAt: Date.now() } : null);
    }
  }, [currentSession?.id]);

  const completeSession = useCallback((sessionId: string, observations: TreatmentSession['observations']) => {
    const now = Date.now();
    setSessions(prev => prev.map(s =>
      s.id === sessionId ? { ...s, status: 'completed', observations, updatedAt: now } : s
    ));
    setCurrentSession(null);

    // Update progress
    setProgress(prev => {
      if (!prev) return null;
      const completedCount = sessions.filter(s => s.id === sessionId || s.status === 'completed').length;
      const overallProgress = Math.round((completedCount / prev.totalSessions) * 100);
      return {
        ...prev,
        sessionsCompleted: completedCount,
        overallProgress,
        lastSessionDate: now,
        streak: prev.lastSessionDate && (now - prev.lastSessionDate < 48 * 60 * 60 * 1000)
          ? prev.streak + 1
          : 1,
        updatedAt: now,
      };
    });

    // Update treatment plan
    setTreatmentPlan(prev => prev ? {
      ...prev,
      sessions: {
        ...prev.sessions,
        completed: prev.sessions.completed + 1,
      },
      updatedAt: now,
    } : null);
  }, [sessions]);

  const cancelSession = useCallback((sessionId: string, reason: string) => {
    const now = Date.now();
    setSessions(prev => prev.map(s =>
      s.id === sessionId ? {
        ...s,
        status: 'cancelled',
        observations: { ...s.observations, clinicianNotes: `CANCELLED: ${reason}` },
        updatedAt: now,
      } : s
    ));
  }, []);

  const getNextSession = useCallback((): TreatmentSession | null => {
    const now = Date.now();
    return sessions
      .filter(s => s.status === 'scheduled' && s.date >= now)
      .sort((a, b) => a.date - b.date)[0] || null;
  }, [sessions]);

  const getTodaysSessions = useCallback((): TreatmentSession[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return sessions.filter(s => s.date >= today.getTime() && s.date < tomorrow.getTime());
  }, [sessions]);

  const getSessionsByDay = useCallback((dayNumber: number): TreatmentSession[] => {
    return sessions.filter(s => s.dayNumber === dayNumber);
  }, [sessions]);

  // ═══════════════════════════════════════════════════════════════════════════
  // PROGRESS ACTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  const updateProgress = useCallback((updates: Partial<TreatmentProgress>) => {
    setProgress(prev => prev ? { ...prev, ...updates, updatedAt: Date.now() } : null);
  }, []);

  const updateGoalProgress = useCallback((goalId: string, currentValue: number) => {
    setProgress(prev => {
      if (!prev) return null;
      const goalProgress = prev.goalProgress.map(gp => {
        if (gp.goalId !== goalId) return gp;
        const changeFromBaseline = currentValue - gp.startValue;
        const previousChange = gp.currentValue - gp.startValue;
        const trend: 'improving' | 'stable' | 'declining' =
          changeFromBaseline > previousChange ? 'improving' :
          changeFromBaseline < previousChange ? 'declining' : 'stable';
        return {
          ...gp,
          currentValue,
          changeFromBaseline,
          trend,
          lastUpdated: Date.now(),
        };
      });
      return { ...prev, goalProgress, updatedAt: Date.now() };
    });
  }, []);

  const addMilestone = useCallback((milestone: TreatmentProgress['milestones'][0]) => {
    setProgress(prev => prev ? {
      ...prev,
      milestones: [...prev.milestones, milestone],
      updatedAt: Date.now(),
    } : null);
  }, []);

  const calculateOverallProgress = useCallback((): number => {
    if (!progress || !treatmentPlan) return 0;
    const sessionProgress = (progress.sessionsCompleted / progress.totalSessions) * 50;
    const goalProgress = progress.goalProgress.reduce((acc, gp) => {
      const goalCompletion = Math.min(100, (gp.currentValue / gp.targetValue) * 100);
      return acc + goalCompletion;
    }, 0) / Math.max(1, progress.goalProgress.length) * 0.5;
    return Math.round(sessionProgress + goalProgress);
  }, [progress, treatmentPlan]);

  // ═══════════════════════════════════════════════════════════════════════════
  // PATIENT PROFILE ACTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  const setPatientProfile = useCallback((profile: PatientProfile) => {
    setPatientProfileState(profile);
  }, []);

  const updatePatientProfile = useCallback((updates: Partial<PatientProfile>) => {
    setPatientProfileState(prev => prev ? { ...prev, ...updates, updatedAt: Date.now() } : null);
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // BOOKING ACTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  const createBooking = useCallback((booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Booking => {
    const now = Date.now();
    const newBooking: Booking = {
      ...booking,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    setBookings(prev => [...prev, newBooking]);
    return newBooking;
  }, []);

  const updateBooking = useCallback((bookingId: string, updates: Partial<Booking>) => {
    setBookings(prev => prev.map(b =>
      b.id === bookingId ? { ...b, ...updates, updatedAt: Date.now() } : b
    ));
  }, []);

  const cancelBooking = useCallback((bookingId: string, reason: string) => {
    const now = Date.now();
    setBookings(prev => prev.map(b =>
      b.id === bookingId ? {
        ...b,
        status: 'cancelled',
        cancellation: { reason, cancelledAt: now, cancelledBy: 'user' },
        updatedAt: now,
      } : b
    ));
  }, []);

  const getUpcomingBookings = useCallback((): Booking[] => {
    const now = Date.now();
    return bookings
      .filter(b => b.scheduledAt >= now && b.status !== 'cancelled')
      .sort((a, b) => a.scheduledAt - b.scheduledAt);
  }, [bookings]);

  // ═══════════════════════════════════════════════════════════════════════════
  // REPORT ACTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  const generateReport = useCallback((type: TreatmentReport['type']): TreatmentReport => {
    const now = Date.now();
    const completedSessions = sessions.filter(s => s.status === 'completed');

    const report: TreatmentReport = {
      id: generateId(),
      patientId: patientProfile?.id || '',
      treatmentPlanId: treatmentPlan?.id || '',
      type,
      generatedAt: now,
      generatedBy: 'system',
      summary: {
        title: `${type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')} Report`,
        titleAr: 'تقرير المعالجة',
        period: {
          start: treatmentPlan?.startDate || now,
          end: now,
        },
        overallProgress: progress?.overallProgress || 0,
        keyFindings: [],
        keyFindingsAr: [],
        highlights: [],
        highlightsAr: [],
        concerns: [],
        concernsAr: [],
      },
      sessionSummary: {
        totalSessions: treatmentPlan?.sessions.scheduled || 0,
        completedSessions: completedSessions.length,
        missedSessions: sessions.filter(s => s.status === 'missed').length,
        averageAttention: completedSessions.reduce((acc, s) => acc + s.observations.attentionLevel, 0) / Math.max(1, completedSessions.length),
        averageCooperation: completedSessions.reduce((acc, s) => acc + s.observations.cooperationLevel, 0) / Math.max(1, completedSessions.length),
        averageComfort: completedSessions.reduce((acc, s) => acc + s.observations.comfortLevel, 0) / Math.max(1, completedSessions.length),
        adherenceRate: completedSessions.length / Math.max(1, treatmentPlan?.sessions.scheduled || 1) * 100,
        frequencyAdjustments: treatmentPlan?.adjustments.length || 0,
      },
      goalAnalysis: (progress?.goalProgress || []).map(gp => {
        const goal = treatmentPlan?.goals.find(g => g.id === gp.goalId);
        return {
          goalId: gp.goalId,
          goal: goal?.description || '',
          goalAr: goal?.descriptionAr || '',
          baseline: gp.startValue,
          current: gp.currentValue,
          target: gp.targetValue,
          progress: (gp.currentValue / gp.targetValue) * 100,
          trend: gp.trend,
          status: gp.currentValue >= gp.targetValue ? 'achieved' : gp.trend === 'improving' ? 'on_track' : 'at_risk',
          notes: '',
          notesAr: '',
        };
      }),
      recommendations: [],
      nextSteps: [],
      nextStepsAr: [],
    };

    setReports(prev => [...prev, report]);
    return report;
  }, [sessions, patientProfile, treatmentPlan, progress]);

  const getReports = useCallback((): TreatmentReport[] => {
    return reports.sort((a, b) => b.generatedAt - a.generatedAt);
  }, [reports]);

  // ═══════════════════════════════════════════════════════════════════════════
  // FOLLOW-UP ACTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  const scheduleFollowUp = useCallback((schedule: Omit<FollowUpSchedule, 'id' | 'createdAt'>) => {
    const newSchedule: FollowUpSchedule = {
      ...schedule,
      id: generateId(),
      createdAt: Date.now(),
    };
    setFollowUpSchedule(newSchedule);
  }, []);

  const completeFollowUp = useCallback((intervalId: string, assessmentId: string) => {
    setFollowUpSchedule(prev => {
      if (!prev) return null;
      return {
        ...prev,
        intervals: prev.intervals.map(i =>
          i.id === intervalId ? { ...i, status: 'completed', completedDate: Date.now(), assessmentId } : i
        ),
      };
    });
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // UTILITY FUNCTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  const getTreatmentPhase = useCallback((): TreatmentPhase => {
    return progress?.currentPhase || 'intake';
  }, [progress]);

  const getDaysRemaining = useCallback((): number => {
    if (!treatmentPlan) return 0;
    const completedDays = new Set(sessions.filter(s => s.status === 'completed').map(s => s.dayNumber)).size;
    return Math.max(0, 10 - completedDays); // Standard 10-day protocol
  }, [treatmentPlan, sessions]);

  const getAdherenceRate = useCallback((): number => {
    if (!treatmentPlan || treatmentPlan.sessions.scheduled === 0) return 0;
    const completed = sessions.filter(s => s.status === 'completed').length;
    const scheduled = treatmentPlan.sessions.scheduled;
    return Math.round((completed / scheduled) * 100);
  }, [treatmentPlan, sessions]);

  const clearTreatmentData = useCallback(() => {
    setTreatmentPlan(null);
    setSessions([]);
    setProgress(null);
    setPatientProfileState(null);
    setBookings([]);
    setReports([]);
    setFollowUpSchedule(null);
    setCurrentSession(null);
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // CONTEXT VALUE
  // ═══════════════════════════════════════════════════════════════════════════

  const contextValue = useMemo<TreatmentContextValue>(() => ({
    treatmentPlan,
    sessions,
    progress,
    patientProfile,
    bookings,
    reports,
    followUpSchedule,
    currentSession,
    isLoading,

    createTreatmentPlan,
    updateTreatmentPlan,
    pauseTreatment,
    resumeTreatment,
    completeTreatment,

    scheduleSession,
    startSession,
    updateSession,
    completeSession,
    cancelSession,
    getNextSession,
    getTodaysSessions,
    getSessionsByDay,

    updateProgress,
    updateGoalProgress,
    addMilestone,
    calculateOverallProgress,

    setPatientProfile,
    updatePatientProfile,

    createBooking,
    updateBooking,
    cancelBooking,
    getUpcomingBookings,

    generateReport,
    getReports,

    scheduleFollowUp,
    completeFollowUp,

    getTreatmentPhase,
    getDaysRemaining,
    getAdherenceRate,
    clearTreatmentData,
  }), [
    treatmentPlan, sessions, progress, patientProfile, bookings, reports,
    followUpSchedule, currentSession, isLoading,
    createTreatmentPlan, updateTreatmentPlan, pauseTreatment, resumeTreatment, completeTreatment,
    scheduleSession, startSession, updateSession, completeSession, cancelSession,
    getNextSession, getTodaysSessions, getSessionsByDay,
    updateProgress, updateGoalProgress, addMilestone, calculateOverallProgress,
    setPatientProfile, updatePatientProfile,
    createBooking, updateBooking, cancelBooking, getUpcomingBookings,
    generateReport, getReports,
    scheduleFollowUp, completeFollowUp,
    getTreatmentPhase, getDaysRemaining, getAdherenceRate, clearTreatmentData,
  ]);

  return (
    <TreatmentContext.Provider value={contextValue}>
      {children}
    </TreatmentContext.Provider>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export const useTreatment = (): TreatmentContextValue => {
  const context = useContext(TreatmentContext);
  if (!context) {
    throw new Error('useTreatment must be used within a TreatmentProvider');
  }
  return context;
};

export default TreatmentContext;
