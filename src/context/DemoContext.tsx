/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * LOTUS SOUND LAB - Demo Mode Context
 * Manages demo/trial mode state and limitations
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface DemoLimits {
  maxAssessmentModules: number;
  maxPracticeTrials: number;
  showFullResults: boolean;
  allowReports: boolean;
  allowBooking: boolean;
  sessionDuration: number; // minutes
}

interface DemoProgress {
  modulesCompleted: string[];
  practiceTrialsCompleted: number;
  totalTimeSpent: number; // seconds
  checklistCompleted: boolean;
  assessmentStarted: boolean;
  promptsShown: string[];
}

interface DemoPrompt {
  id: string;
  type: 'upgrade' | 'contact' | 'booking' | 'info';
  title: string;
  titleAr: string;
  message: string;
  messageAr: string;
  cta: string;
  ctaAr: string;
  condition: 'after_games' | 'after_results' | 'time_limit' | 'module_limit' | 'manual';
}

interface DemoContextValue {
  // State
  isDemoMode: boolean;
  demoProgress: DemoProgress;
  limits: DemoLimits;
  activePrompt: DemoPrompt | null;
  sessionStartTime: number | null;

  // Actions
  enableDemoMode: () => void;
  disableDemoMode: () => void;
  completeModule: (moduleId: string) => void;
  completePracticeTrial: () => void;
  completeChecklist: () => void;
  startAssessment: () => void;
  showPrompt: (promptId: string) => void;
  dismissPrompt: () => void;
  resetDemo: () => void;

  // Checks
  canAccessModule: (moduleId: string) => boolean;
  canStartNewModule: () => boolean;
  canViewFullResults: () => boolean;
  canGenerateReport: () => boolean;
  canBookAppointment: () => boolean;
  shouldShowUpgradePrompt: () => boolean;
  getRemainingModules: () => number;
  getRemainingTime: () => number; // seconds
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const STORAGE_KEY = 'lotus_demo_state';

const DEFAULT_LIMITS: DemoLimits = {
  maxAssessmentModules: 2,
  maxPracticeTrials: 3,
  showFullResults: false,
  allowReports: false,
  allowBooking: true,
  sessionDuration: 30, // 30 minutes demo session
};

const DEFAULT_PROGRESS: DemoProgress = {
  modulesCompleted: [],
  practiceTrialsCompleted: 0,
  totalTimeSpent: 0,
  checklistCompleted: false,
  assessmentStarted: false,
  promptsShown: [],
};

const DEMO_PROMPTS: DemoPrompt[] = [
  {
    id: 'after_practice',
    type: 'upgrade',
    title: 'Practice Complete!',
    titleAr: 'اكتملت التجربة!',
    message: 'You\'ve completed the practice trials. Book a full assessment to get comprehensive results.',
    messageAr: 'أكملت التجارب التدريبية. احجز تقييماً كاملاً للحصول على نتائج شاملة.',
    cta: 'Book Full Assessment',
    ctaAr: 'احجز تقييماً كاملاً',
    condition: 'after_games',
  },
  {
    id: 'module_limit',
    type: 'upgrade',
    title: 'Demo Limit Reached',
    titleAr: 'انتهت حدود العرض التجريبي',
    message: 'You\'ve explored the demo modules. Contact us to unlock the full assessment suite.',
    messageAr: 'لقد استكشفت الوحدات التجريبية. تواصل معنا لفتح مجموعة التقييم الكاملة.',
    cta: 'Contact Us',
    ctaAr: 'تواصل معنا',
    condition: 'module_limit',
  },
  {
    id: 'time_warning',
    type: 'info',
    title: 'Session Ending Soon',
    titleAr: 'الجلسة تنتهي قريباً',
    message: 'Your demo session will expire in 5 minutes. Book now to save your progress.',
    messageAr: 'ستنتهي جلستك التجريبية خلال 5 دقائق. احجز الآن لحفظ تقدمك.',
    cta: 'Book Now',
    ctaAr: 'احجز الآن',
    condition: 'time_limit',
  },
  {
    id: 'results_teaser',
    type: 'contact',
    title: 'Want Full Results?',
    titleAr: 'تريد النتائج الكاملة؟',
    message: 'Get a complete analysis with detailed recommendations from our specialist.',
    messageAr: 'احصل على تحليل شامل مع توصيات مفصلة من متخصصنا.',
    cta: 'Contact Specialist',
    ctaAr: 'تواصل مع المتخصص',
    condition: 'after_results',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════════════════════════════════════════════

const DemoContext = createContext<DemoContextValue | null>(null);

// ═══════════════════════════════════════════════════════════════════════════════
// PROVIDER
// ═══════════════════════════════════════════════════════════════════════════════

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored).isDemoMode : false;
    } catch {
      return false;
    }
  });

  const [demoProgress, setDemoProgress] = useState<DemoProgress>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored).progress : DEFAULT_PROGRESS;
    } catch {
      return DEFAULT_PROGRESS;
    }
  });

  const [limits] = useState<DemoLimits>(DEFAULT_LIMITS);
  const [activePrompt, setActivePrompt] = useState<DemoPrompt | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored).sessionStartTime : null;
    } catch {
      return null;
    }
  });

  // Persist state
  useEffect(() => {
    if (isDemoMode) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        isDemoMode,
        progress: demoProgress,
        sessionStartTime,
      }));
    }
  }, [isDemoMode, demoProgress, sessionStartTime]);

  // Time tracking
  useEffect(() => {
    if (!isDemoMode || !sessionStartTime) return;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
      const remaining = limits.sessionDuration * 60 - elapsed;

      // Show warning at 5 minutes remaining
      if (remaining === 300 && !demoProgress.promptsShown.includes('time_warning')) {
        setActivePrompt(DEMO_PROMPTS.find(p => p.id === 'time_warning') || null);
      }

      // Session expired
      if (remaining <= 0) {
        setActivePrompt(DEMO_PROMPTS.find(p => p.id === 'module_limit') || null);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isDemoMode, sessionStartTime, limits.sessionDuration, demoProgress.promptsShown]);

  // Actions
  const enableDemoMode = useCallback(() => {
    setIsDemoMode(true);
    setSessionStartTime(Date.now());
    setDemoProgress(DEFAULT_PROGRESS);
  }, []);

  const disableDemoMode = useCallback(() => {
    setIsDemoMode(false);
    setSessionStartTime(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const completeModule = useCallback((moduleId: string) => {
    setDemoProgress(prev => {
      const updated = {
        ...prev,
        modulesCompleted: prev.modulesCompleted.includes(moduleId)
          ? prev.modulesCompleted
          : [...prev.modulesCompleted, moduleId],
      };

      // Check if limit reached
      if (updated.modulesCompleted.length >= limits.maxAssessmentModules) {
        setTimeout(() => {
          setActivePrompt(DEMO_PROMPTS.find(p => p.id === 'after_practice') || null);
        }, 1000);
      }

      return updated;
    });
  }, [limits.maxAssessmentModules]);

  const completePracticeTrial = useCallback(() => {
    setDemoProgress(prev => ({
      ...prev,
      practiceTrialsCompleted: prev.practiceTrialsCompleted + 1,
    }));
  }, []);

  const completeChecklist = useCallback(() => {
    setDemoProgress(prev => ({ ...prev, checklistCompleted: true }));
  }, []);

  const startAssessment = useCallback(() => {
    setDemoProgress(prev => ({ ...prev, assessmentStarted: true }));
  }, []);

  const showPrompt = useCallback((promptId: string) => {
    const prompt = DEMO_PROMPTS.find(p => p.id === promptId);
    if (prompt) {
      setActivePrompt(prompt);
      setDemoProgress(prev => ({
        ...prev,
        promptsShown: prev.promptsShown.includes(promptId)
          ? prev.promptsShown
          : [...prev.promptsShown, promptId],
      }));
    }
  }, []);

  const dismissPrompt = useCallback(() => {
    setActivePrompt(null);
  }, []);

  const resetDemo = useCallback(() => {
    setDemoProgress(DEFAULT_PROGRESS);
    setSessionStartTime(Date.now());
    setActivePrompt(null);
  }, []);

  // Checks
  const canAccessModule = useCallback((moduleId: string): boolean => {
    if (!isDemoMode) return true;
    // Allow already completed modules
    if (demoProgress.modulesCompleted.includes(moduleId)) return true;
    // Check if under limit
    return demoProgress.modulesCompleted.length < limits.maxAssessmentModules;
  }, [isDemoMode, demoProgress.modulesCompleted, limits.maxAssessmentModules]);

  const canStartNewModule = useCallback((): boolean => {
    if (!isDemoMode) return true;
    return demoProgress.modulesCompleted.length < limits.maxAssessmentModules;
  }, [isDemoMode, demoProgress.modulesCompleted.length, limits.maxAssessmentModules]);

  const canViewFullResults = useCallback((): boolean => {
    if (!isDemoMode) return true;
    return limits.showFullResults;
  }, [isDemoMode, limits.showFullResults]);

  const canGenerateReport = useCallback((): boolean => {
    if (!isDemoMode) return true;
    return limits.allowReports;
  }, [isDemoMode, limits.allowReports]);

  const canBookAppointment = useCallback((): boolean => {
    return limits.allowBooking;
  }, [limits.allowBooking]);

  const shouldShowUpgradePrompt = useCallback((): boolean => {
    if (!isDemoMode) return false;
    return demoProgress.modulesCompleted.length >= limits.maxAssessmentModules;
  }, [isDemoMode, demoProgress.modulesCompleted.length, limits.maxAssessmentModules]);

  const getRemainingModules = useCallback((): number => {
    return Math.max(0, limits.maxAssessmentModules - demoProgress.modulesCompleted.length);
  }, [limits.maxAssessmentModules, demoProgress.modulesCompleted.length]);

  const getRemainingTime = useCallback((): number => {
    if (!sessionStartTime) return limits.sessionDuration * 60;
    const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
    return Math.max(0, limits.sessionDuration * 60 - elapsed);
  }, [sessionStartTime, limits.sessionDuration]);

  // Context value
  const value = useMemo<DemoContextValue>(() => ({
    isDemoMode,
    demoProgress,
    limits,
    activePrompt,
    sessionStartTime,

    enableDemoMode,
    disableDemoMode,
    completeModule,
    completePracticeTrial,
    completeChecklist,
    startAssessment,
    showPrompt,
    dismissPrompt,
    resetDemo,

    canAccessModule,
    canStartNewModule,
    canViewFullResults,
    canGenerateReport,
    canBookAppointment,
    shouldShowUpgradePrompt,
    getRemainingModules,
    getRemainingTime,
  }), [
    isDemoMode, demoProgress, limits, activePrompt, sessionStartTime,
    enableDemoMode, disableDemoMode, completeModule, completePracticeTrial,
    completeChecklist, startAssessment, showPrompt, dismissPrompt, resetDemo,
    canAccessModule, canStartNewModule, canViewFullResults, canGenerateReport,
    canBookAppointment, shouldShowUpgradePrompt, getRemainingModules, getRemainingTime,
  ]);

  return (
    <DemoContext.Provider value={value}>
      {children}
    </DemoContext.Provider>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export const useDemo = (): DemoContextValue => {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
};

export default DemoContext;
