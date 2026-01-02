import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef, type ReactNode } from 'react';
import { notifyLocalChange } from '../utils/sync';
import { useUser } from './UserContext';
import { readUserScopedStorage, writeUserScopedStorage } from '../utils/userStorage';

// Achievement definitions
export interface Achievement {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  icon: string;
  points: number;
  unlocked: boolean;
  unlockedAt?: number;
  category: 'exploration' | 'learning' | 'mastery' | 'engagement' | 'clinical';
}

export interface BrainRegion {
  id: string;
  name: string;
  nameAr: string;
  explored: boolean;
  treatmentAreas: string[];
  treatmentAreasAr: string[];
  description: string;
  descriptionAr: string;
}

export interface GamificationState {
  achievements: Achievement[];
  totalPoints: number;
  level: number;
  exploredBrainRegions: string[];
  slidesViewed: number[];
  checklistCompleted: boolean;
  gamesCompleted: string[];
  audioJourneyProgress: number; // 0-100
  sessionStartTime: number;
  totalTimeSpent: number; // in seconds
  maxScrollProgress: number; // 0-100
  videosWatched: string[];
  // Clinical tracking
  clinicalSessionsCompleted: number;
  clinicalStreak: number;
  lastClinicalActivity: number;
  treatmentPhase: 'assessment' | 'active' | 'maintenance' | 'completed';
}

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  // Exploration achievements
  {
    id: 'first_steps',
    title: 'First Steps',
    titleAr: 'الخطوات الأولى',
    description: 'Start your journey',
    descriptionAr: 'ابدأ رحلتك',
    icon: '👣',
    points: 10,
    unlocked: false,
    category: 'exploration',
  },
  {
    id: 'brain_explorer',
    title: 'Brain Explorer',
    titleAr: 'مستكشف الدماغ',
    description: 'Explore 3 brain regions',
    descriptionAr: 'استكشف 3 مناطق في الدماغ',
    icon: '🧠',
    points: 50,
    unlocked: false,
    category: 'exploration',
  },
  {
    id: 'neural_master',
    title: 'Neural Master',
    titleAr: 'سيد الأعصاب',
    description: 'Explore all brain regions',
    descriptionAr: 'استكشف جميع مناطق الدماغ',
    icon: '⚡',
    points: 100,
    unlocked: false,
    category: 'mastery',
  },
  // Learning achievements
  {
    id: 'slide_scholar',
    title: 'Slide Scholar',
    titleAr: 'باحث الشرائح',
    description: 'View 10 slides',
    descriptionAr: 'شاهد 10 شرائح',
    icon: '📊',
    points: 30,
    unlocked: false,
    category: 'learning',
  },
  {
    id: 'data_detective',
    title: 'Data Detective',
    titleAr: 'محقق البيانات',
    description: 'View 30+ slides',
    descriptionAr: 'شاهد أكثر من 30 شريحة',
    icon: '🔍',
    points: 75,
    unlocked: false,
    category: 'learning',
  },
  {
    id: 'self_aware',
    title: 'Self Aware',
    titleAr: 'الوعي الذاتي',
    description: 'Complete the checklist',
    descriptionAr: 'أكمل قائمة التحقق',
    icon: '✅',
    points: 40,
    unlocked: false,
    category: 'engagement',
  },
  // Game achievements
  {
    id: 'game_starter',
    title: 'Game Starter',
    titleAr: 'بداية اللعبة',
    description: 'Complete your first game',
    descriptionAr: 'أكمل لعبتك الأولى',
    icon: '🎮',
    points: 25,
    unlocked: false,
    category: 'engagement',
  },
  {
    id: 'lab_explorer',
    title: 'Lab Explorer',
    titleAr: 'مستكشف المعمل',
    description: 'Complete all 7 modules',
    descriptionAr: 'أكمل جميع الوحدات السبعة',
    icon: '🧪',
    points: 150,
    unlocked: false,
    category: 'mastery',
  },
  // Journey achievements
  {
    id: 'sound_traveler',
    title: 'Sound Traveler',
    titleAr: 'مسافر الصوت',
    description: 'Complete 50% of audio journey',
    descriptionAr: 'أكمل 50٪ من رحلة الصوت',
    icon: '🎧',
    points: 35,
    unlocked: false,
    category: 'exploration',
  },
  {
    id: 'audio_master',
    title: 'Audio Master',
    titleAr: 'خبير الصوت',
    description: 'Complete the full audio journey',
    descriptionAr: 'أكمل رحلة الصوت كاملة',
    icon: '🎵',
    points: 100,
    unlocked: false,
    category: 'mastery',
  },
  // Time-based achievements
  {
    id: 'dedicated_learner',
    title: 'Dedicated Learner',
    titleAr: 'متعلم متفاني',
    description: 'Spend 5+ minutes exploring',
    descriptionAr: 'اقضِ أكثر من 5 دقائق في الاستكشاف',
    icon: '⏱️',
    points: 20,
    unlocked: false,
    category: 'engagement',
  },
  {
    id: 'sound_scientist',
    title: 'Sound Scientist',
    titleAr: 'عالم الصوت',
    description: 'Earn 300+ points',
    descriptionAr: 'احصل على أكثر من 300 نقطة',
    icon: '🔬',
    points: 50,
    unlocked: false,
    category: 'mastery',
  },
  // Scroll/section achievements
  {
    id: 'curious_explorer',
    title: 'Curious Explorer',
    titleAr: 'المستكشف الفضولي',
    description: 'Scroll past 50% of the page',
    descriptionAr: 'تصفح أكثر من 50٪ من الصفحة',
    icon: '📜',
    points: 15,
    unlocked: false,
    category: 'exploration',
  },
  {
    id: 'completionist',
    title: 'Completionist',
    titleAr: 'المكمّل',
    description: 'Reach the bottom of the page',
    descriptionAr: 'الوصول إلى نهاية الصفحة',
    icon: '🏁',
    points: 25,
    unlocked: false,
    category: 'exploration',
  },
  {
    id: 'video_watcher',
    title: 'Video Watcher',
    titleAr: 'مشاهد الفيديو',
    description: 'Watch an educational video',
    descriptionAr: 'شاهد فيديو تعليمي',
    icon: '🎬',
    points: 20,
    unlocked: false,
    category: 'learning',
  },
  {
    id: 'early_bird',
    title: 'Early Bird',
    titleAr: 'الطائر المبكر',
    description: 'Visit before 9 AM',
    descriptionAr: 'زيارة قبل الساعة 9 صباحاً',
    icon: '🌅',
    points: 15,
    unlocked: false,
    category: 'engagement',
  },
  {
    id: 'night_owl',
    title: 'Night Owl',
    titleAr: 'بومة الليل',
    description: 'Visit after 10 PM',
    descriptionAr: 'زيارة بعد الساعة 10 مساءً',
    icon: '🦉',
    points: 15,
    unlocked: false,
    category: 'engagement',
  },
  // Clinical achievements - Treatment milestones
  {
    id: 'treatment_started',
    title: 'Treatment Pioneer',
    titleAr: 'رائد العلاج',
    description: 'Complete your first treatment session',
    descriptionAr: 'أكمل جلستك العلاجية الأولى',
    icon: '🏥',
    points: 50,
    unlocked: false,
    category: 'clinical',
  },
  {
    id: 'week_one',
    title: 'Week One Champion',
    titleAr: 'بطل الأسبوع الأول',
    description: 'Complete 5 treatment sessions',
    descriptionAr: 'أكمل 5 جلسات علاجية',
    icon: '📅',
    points: 100,
    unlocked: false,
    category: 'clinical',
  },
  {
    id: 'halfway_hero',
    title: 'Halfway Hero',
    titleAr: 'بطل المنتصف',
    description: 'Complete 10 treatment sessions',
    descriptionAr: 'أكمل 10 جلسات علاجية',
    icon: '⭐',
    points: 150,
    unlocked: false,
    category: 'clinical',
  },
  {
    id: 'treatment_graduate',
    title: 'Treatment Graduate',
    titleAr: 'خريج العلاج',
    description: 'Complete all 20 treatment sessions',
    descriptionAr: 'أكمل جميع الجلسات العلاجية الـ 20',
    icon: '🎓',
    points: 300,
    unlocked: false,
    category: 'clinical',
  },
  {
    id: 'streak_starter',
    title: 'Consistency Starter',
    titleAr: 'بداية الاستمرارية',
    description: 'Maintain a 3-day activity streak',
    descriptionAr: 'حافظ على نشاط لمدة 3 أيام متتالية',
    icon: '🔥',
    points: 30,
    unlocked: false,
    category: 'clinical',
  },
  {
    id: 'streak_master',
    title: 'Streak Master',
    titleAr: 'سيد الاستمرارية',
    description: 'Maintain a 7-day activity streak',
    descriptionAr: 'حافظ على نشاط لمدة 7 أيام متتالية',
    icon: '💪',
    points: 75,
    unlocked: false,
    category: 'clinical',
  },
  {
    id: 'attention_improved',
    title: 'Focus Enhanced',
    titleAr: 'تركيز محسّن',
    description: 'Improve your attention score by 10%',
    descriptionAr: 'حسّن درجة انتباهك بنسبة 10٪',
    icon: '🎯',
    points: 100,
    unlocked: false,
    category: 'clinical',
  },
  {
    id: 'processing_boost',
    title: 'Quick Processor',
    titleAr: 'معالج سريع',
    description: 'Improve your processing speed by 15%',
    descriptionAr: 'حسّن سرعة معالجتك بنسبة 15٪',
    icon: '⚡',
    points: 100,
    unlocked: false,
    category: 'clinical',
  },
  {
    id: 'auditory_ace',
    title: 'Auditory Ace',
    titleAr: 'خبير السمع',
    description: 'Achieve 80%+ auditory discrimination score',
    descriptionAr: 'حقق درجة تمييز سمعي أعلى من 80٪',
    icon: '👂',
    points: 150,
    unlocked: false,
    category: 'clinical',
  },
];

const BRAIN_REGIONS: BrainRegion[] = [
  {
    id: 'auditory_cortex',
    name: 'Auditory Cortex',
    nameAr: 'القشرة السمعية',
    explored: false,
    treatmentAreas: ['Auditory Processing', 'Sound Recognition', 'Speech Perception'],
    treatmentAreasAr: ['المعالجة السمعية', 'التعرف على الأصوات', 'إدراك الكلام'],
    description: 'Primary area for processing sound and auditory information',
    descriptionAr: 'المنطقة الرئيسية لمعالجة الصوت والمعلومات السمعية',
  },
  {
    id: 'temporal_lobe',
    name: 'Temporal Lobe',
    nameAr: 'الفص الصدغي',
    explored: false,
    treatmentAreas: ['Language', 'Memory', 'Music Perception'],
    treatmentAreasAr: ['اللغة', 'الذاكرة', 'إدراك الموسيقى'],
    description: 'Processes language comprehension, memory formation, and musical understanding',
    descriptionAr: 'يعالج فهم اللغة وتكوين الذاكرة وفهم الموسيقى',
  },
  {
    id: 'brainstem',
    name: 'Brainstem',
    nameAr: 'جذع الدماغ',
    explored: false,
    treatmentAreas: ['Sensory Balance', 'Reflexes', 'Basic Auditory Processing'],
    treatmentAreasAr: ['التوازن الحسي', 'ردود الفعل', 'المعالجة السمعية الأساسية'],
    description: 'Controls basic auditory reflexes and sensory-motor integration',
    descriptionAr: 'يتحكم في ردود الفعل السمعية الأساسية والتكامل الحسي الحركي',
  },
  {
    id: 'thalamus',
    name: 'Thalamus',
    nameAr: 'المهاد',
    explored: false,
    treatmentAreas: ['Attention', 'Concentration', 'Sensory Relay'],
    treatmentAreasAr: ['الانتباه', 'التركيز', 'نقل الإحساس'],
    description: 'Relays sensory information and regulates attention and alertness',
    descriptionAr: 'ينقل المعلومات الحسية وينظم الانتباه واليقظة',
  },
  {
    id: 'prefrontal',
    name: 'Prefrontal Cortex',
    nameAr: 'القشرة الجبهية',
    explored: false,
    treatmentAreas: ['Behavior', 'Learning', 'Executive Function'],
    treatmentAreasAr: ['السلوك', 'التعلم', 'الوظائف التنفيذية'],
    description: 'Controls higher-order thinking, planning, and behavioral regulation',
    descriptionAr: 'يتحكم في التفكير العالي والتخطيط وتنظيم السلوك',
  },
  {
    id: 'cerebellum',
    name: 'Cerebellum',
    nameAr: 'المخيخ',
    explored: false,
    treatmentAreas: ['Well-being', 'Motor Coordination', 'Timing'],
    treatmentAreasAr: ['الرفاهية', 'التنسيق الحركي', 'التوقيت'],
    description: 'Coordinates movement timing and contributes to cognitive processing',
    descriptionAr: 'ينسق توقيت الحركة ويساهم في المعالجة المعرفية',
  },
];

const STORAGE_KEY = 'lotus_gamification_state';

const getInitialState = (userId?: string | null): GamificationState => {
  const defaultState: GamificationState = {
    achievements: INITIAL_ACHIEVEMENTS,
    totalPoints: 0,
    level: 1,
    exploredBrainRegions: [],
    slidesViewed: [],
    checklistCompleted: false,
    gamesCompleted: [],
    audioJourneyProgress: 0,
    sessionStartTime: Date.now(),
    totalTimeSpent: 0,
    maxScrollProgress: 0,
    videosWatched: [],
    // Clinical tracking defaults
    clinicalSessionsCompleted: 0,
    clinicalStreak: 0,
    lastClinicalActivity: 0,
    treatmentPhase: 'assessment',
  };

  if (typeof window === 'undefined') {
    return defaultState;
  }

  const saved = readUserScopedStorage(STORAGE_KEY, userId);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return {
        ...defaultState,
        ...parsed,
        sessionStartTime: Date.now(),
        maxScrollProgress: parsed.maxScrollProgress || 0,
        videosWatched: parsed.videosWatched || [],
        // Ensure clinical fields exist
        clinicalSessionsCompleted: parsed.clinicalSessionsCompleted || 0,
        clinicalStreak: parsed.clinicalStreak || 0,
        lastClinicalActivity: parsed.lastClinicalActivity || 0,
        treatmentPhase: parsed.treatmentPhase || 'assessment',
      };
    } catch {
      // Invalid data, return fresh state
    }
  }

  return defaultState;
};

interface GamificationContextType {
  state: GamificationState;
  brainRegions: BrainRegion[];
  unlockAchievement: (id: string) => boolean;
  exploreBrainRegion: (id: string) => void;
  viewSlide: (slideId: number) => void;
  completeChecklist: () => void;
  completeGame: (gameId: string) => void;
  updateAudioJourneyProgress: (progress: number) => void;
  updateScrollProgress: (progress: number) => void;
  watchVideo: (videoId: string) => void;
  getUnlockedAchievements: () => Achievement[];
  getNextAchievements: () => Achievement[];
  recentUnlock: Achievement | null;
  clearRecentUnlock: () => void;
  playUnlockSound: () => void;
  // Clinical tracking methods
  completeClinicalSession: () => void;
  updateClinicalStreak: () => void;
  setTreatmentPhase: (phase: GamificationState['treatmentPhase']) => void;
  getClinicalAchievements: () => Achievement[];
  syncClinicalProgress: (progress: {
    sessionsCompleted?: number;
    streak?: number;
    attentionScore?: number;
    processingSpeed?: number;
    auditoryDiscrimination?: number;
  }) => void;
}

const GamificationContext = createContext<GamificationContextType | null>(null);

export function GamificationProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const userId = user?.id ?? null;
  const [state, setState] = useState<GamificationState>(() => getInitialState(userId));
  const [recentUnlock, setRecentUnlock] = useState<Achievement | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const stateRef = useRef(state);
  const saveTimeoutRef = useRef<number | null>(null);
  const lastNotifiedUnlockAtRef = useRef(0);
  const unlockCursorUserIdRef = useRef<string | null>(null);
  const soundScientistTimerRef = useRef<number | null>(null);
  const lastUserIdRef = useRef<string | null>(userId);

  stateRef.current = state;

  useEffect(() => {
    if (lastUserIdRef.current === userId) return;
    lastUserIdRef.current = userId;
    setState(getInitialState(userId));
  }, [userId]);

  // Initialize audio context on first interaction
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initAudio = () => {
      if (!audioContext) {
        const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        setAudioContext(ctx);
      }
      document.removeEventListener('click', initAudio);
    };
    document.addEventListener('click', initAudio);
    return () => document.removeEventListener('click', initAudio);
  }, [audioContext]);

  // Save state to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (saveTimeoutRef.current !== null) {
      window.clearTimeout(saveTimeoutRef.current);
    }

    const snapshot = state;
    saveTimeoutRef.current = window.setTimeout(() => {
      try {
        const toSave = {
          ...snapshot,
          totalTimeSpent: snapshot.totalTimeSpent + Math.floor((Date.now() - snapshot.sessionStartTime) / 1000),
        };
        writeUserScopedStorage(STORAGE_KEY, JSON.stringify(toSave), userId);
        notifyLocalChange();
      } catch {
        // Ignore quota/availability errors
      }
    }, 750);

    return () => {
      if (saveTimeoutRef.current !== null) {
        window.clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
      }
    };
  }, [state, userId]);

  const playUnlockSound = useCallback(() => {
    if (!audioContext) return;

    try {
      // Create a pleasant achievement sound
      const osc1 = audioContext.createOscillator();
      const osc2 = audioContext.createOscillator();
      const gain = audioContext.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(audioContext.destination);

      const now = audioContext.currentTime;

      // Arpeggio effect
      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.setValueAtTime(659.25, now + 0.1); // E5
      osc1.frequency.setValueAtTime(783.99, now + 0.2); // G5

      osc2.frequency.setValueAtTime(783.99, now); // G5
      osc2.frequency.setValueAtTime(987.77, now + 0.1); // B5
      osc2.frequency.setValueAtTime(1046.50, now + 0.2); // C6

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.5);
      osc2.stop(now + 0.5);
    } catch {
      // Audio failed, silently continue
    }
  }, [audioContext]);

  const calculateLevel = useCallback((points: number): number => {
    if (points < 50) return 1;
    if (points < 150) return 2;
    if (points < 300) return 3;
    if (points < 500) return 4;
    return 5;
  }, []);

  const unlockAchievement = useCallback((id: string): boolean => {
    const current = stateRef.current;
    const currentAchievement = current.achievements.find(a => a.id === id);
    if (!currentAchievement || currentAchievement.unlocked) return false;

    const unlockedAt = Date.now();

    setState((prev) => {
      const achievement = prev.achievements.find(a => a.id === id);
      if (!achievement || achievement.unlocked) return prev;

      const achievements = prev.achievements.map(a => (
        a.id === id ? { ...a, unlocked: true, unlockedAt } : a
      ));
      const totalPoints = prev.totalPoints + achievement.points;

      return {
        ...prev,
        achievements,
        totalPoints,
        level: calculateLevel(totalPoints),
      };
    });

    return true;
  }, [calculateLevel]);

  const exploreBrainRegion = useCallback((id: string) => {
    setState((prev) => {
      if (prev.exploredBrainRegions.includes(id)) return prev;
      return { ...prev, exploredBrainRegions: [...prev.exploredBrainRegions, id] };
    });
  }, []);

  const viewSlide = useCallback((slideId: number) => {
    setState((prev) => {
      if (prev.slidesViewed.includes(slideId)) return prev;
      return { ...prev, slidesViewed: [...prev.slidesViewed, slideId] };
    });
  }, []);

  const completeChecklist = useCallback(() => {
    setState((prev) => {
      if (prev.checklistCompleted) return prev;
      return { ...prev, checklistCompleted: true };
    });
  }, []);

  const completeGame = useCallback((gameId: string) => {
    setState((prev) => {
      if (prev.gamesCompleted.includes(gameId)) return prev;
      return { ...prev, gamesCompleted: [...prev.gamesCompleted, gameId] };
    });
  }, []);

  const updateAudioJourneyProgress = useCallback((progress: number) => {
    const clampedProgress = Math.min(100, Math.max(0, progress));

    setState((prev) => {
      if (clampedProgress <= prev.audioJourneyProgress) return prev;
      return { ...prev, audioJourneyProgress: clampedProgress };
    });
  }, []);

  const updateScrollProgress = useCallback((progress: number) => {
    const clampedProgress = Math.min(100, Math.max(0, progress));

    setState((prev) => {
      if (clampedProgress <= prev.maxScrollProgress) return prev;
      return { ...prev, maxScrollProgress: clampedProgress };
    });
  }, []);

  const watchVideo = useCallback((videoId: string) => {
    setState((prev) => {
      if (prev.videosWatched.includes(videoId)) return prev;
      return { ...prev, videosWatched: [...prev.videosWatched, videoId] };
    });
  }, []);

  const unlockedAchievements = useMemo(() => {
    return state.achievements.filter(a => a.unlocked);
  }, [state.achievements]);

  const nextAchievements = useMemo(() => {
    return state.achievements.filter(a => !a.unlocked).slice(0, 3);
  }, [state.achievements]);

  const getUnlockedAchievements = useCallback(() => unlockedAchievements, [unlockedAchievements]);
  const getNextAchievements = useCallback(() => nextAchievements, [nextAchievements]);

  const clearRecentUnlock = useCallback(() => {
    setRecentUnlock(null);
  }, []);

  // Clinical tracking methods
  const completeClinicalSession = useCallback(() => {
    setState((prev) => {
      const clinicalSessionsCompleted = prev.clinicalSessionsCompleted + 1;

      let treatmentPhase: GamificationState['treatmentPhase'] = prev.treatmentPhase;
      if (clinicalSessionsCompleted >= 20) {
        treatmentPhase = 'completed';
      } else if (clinicalSessionsCompleted >= 15) {
        treatmentPhase = 'maintenance';
      } else if (clinicalSessionsCompleted >= 1) {
        treatmentPhase = 'active';
      }

      return {
        ...prev,
        clinicalSessionsCompleted,
        treatmentPhase,
      };
    });
  }, []);

  const updateClinicalStreak = useCallback(() => {
    setState((prev) => {
      const now = Date.now();
      const lastActivity = prev.lastClinicalActivity;
      const oneDayMs = 24 * 60 * 60 * 1000;

      let clinicalStreak = prev.clinicalStreak;
      if (lastActivity === 0 || now - lastActivity > 2 * oneDayMs) {
        clinicalStreak = 1;
      } else if (now - lastActivity > oneDayMs) {
        clinicalStreak = prev.clinicalStreak + 1;
      }

      return {
        ...prev,
        clinicalStreak,
        lastClinicalActivity: now,
      };
    });
  }, []);

  const setTreatmentPhase = useCallback((phase: GamificationState['treatmentPhase']) => {
    setState(prev => ({ ...prev, treatmentPhase: phase }));
  }, []);

  const clinicalAchievements = useMemo(() => {
    return state.achievements.filter(a => a.category === 'clinical');
  }, [state.achievements]);

  const getClinicalAchievements = useCallback(() => clinicalAchievements, [clinicalAchievements]);

  const syncClinicalProgress = useCallback((progress: {
    sessionsCompleted?: number;
    streak?: number;
    attentionScore?: number;
    processingSpeed?: number;
    auditoryDiscrimination?: number;
  }) => {
    setState((prev) => {
      let changed = false;
      const next: GamificationState = { ...prev };

      if (
        progress.sessionsCompleted !== undefined &&
        progress.sessionsCompleted > prev.clinicalSessionsCompleted
      ) {
        next.clinicalSessionsCompleted = progress.sessionsCompleted;
        changed = true;

        if (progress.sessionsCompleted >= 20) {
          next.treatmentPhase = 'completed';
        } else if (progress.sessionsCompleted >= 15) {
          next.treatmentPhase = 'maintenance';
        } else if (progress.sessionsCompleted >= 1) {
          next.treatmentPhase = 'active';
        }
      }

      if (progress.streak !== undefined && progress.streak !== prev.clinicalStreak) {
        next.clinicalStreak = progress.streak;
        changed = true;
      }

      if (!changed) return prev;

      next.lastClinicalActivity = Date.now();
      return next;
    });

    // Check score-based achievements
    if (progress.attentionScore !== undefined && progress.attentionScore >= 10) {
      // 10% improvement triggers achievement
      unlockAchievement('attention_improved');
    }
    if (progress.processingSpeed !== undefined && progress.processingSpeed >= 15) {
      // 15% improvement triggers achievement
      unlockAchievement('processing_boost');
    }
    if (progress.auditoryDiscrimination !== undefined && progress.auditoryDiscrimination >= 80) {
      // 80%+ score triggers achievement
      unlockAchievement('auditory_ace');
    }
  }, [unlockAchievement]);

  const brainRegions = useMemo(() => {
    const exploredSet = new Set(state.exploredBrainRegions);
    return BRAIN_REGIONS.map(region => ({
      ...region,
      explored: exploredSet.has(region.id),
    }));
  }, [state.exploredBrainRegions]);

  // Initialize unlock notification cursor from existing saved state.
  useEffect(() => {
    if (unlockCursorUserIdRef.current === userId) return;
    unlockCursorUserIdRef.current = userId;
    lastNotifiedUnlockAtRef.current = state.achievements.reduce((max, achievement) => {
      if (!achievement.unlocked) return max;
      if (!achievement.unlockedAt) return max;
      return Math.max(max, achievement.unlockedAt);
    }, 0);
  }, [state.achievements, userId]);

  // Show toast + play sound for new unlocks (but not for previously persisted unlocks).
  useEffect(() => {
    const latest = state.achievements.reduce<Achievement | null>((acc, achievement) => {
      if (!achievement.unlocked) return acc;
      if (!achievement.unlockedAt) return acc;
      if (achievement.unlockedAt <= lastNotifiedUnlockAtRef.current) return acc;
      if (!acc || (acc.unlockedAt ?? 0) < achievement.unlockedAt) return achievement;
      return acc;
    }, null);

    if (!latest || !latest.unlockedAt) return;

    lastNotifiedUnlockAtRef.current = latest.unlockedAt;
    setRecentUnlock(latest);
    playUnlockSound();
  }, [state.achievements, playUnlockSound]);

  // Derive achievement unlocks from state (keeps update functions side-effect free).
  useEffect(() => {
    const isUnlocked = (id: string) => (
      state.achievements.some(a => a.id === id && a.unlocked)
    );

    if (state.exploredBrainRegions.length >= 3 && !isUnlocked('brain_explorer')) {
      unlockAchievement('brain_explorer');
    }
    if (state.exploredBrainRegions.length >= BRAIN_REGIONS.length && !isUnlocked('neural_master')) {
      unlockAchievement('neural_master');
    }
    if (state.slidesViewed.length >= 10 && !isUnlocked('slide_scholar')) {
      unlockAchievement('slide_scholar');
    }
    if (state.slidesViewed.length >= 30 && !isUnlocked('data_detective')) {
      unlockAchievement('data_detective');
    }
    if (state.checklistCompleted && !isUnlocked('self_aware')) {
      unlockAchievement('self_aware');
    }
    if (state.gamesCompleted.length >= 1 && !isUnlocked('game_starter')) {
      unlockAchievement('game_starter');
    }
    if (state.gamesCompleted.length >= 7 && !isUnlocked('lab_explorer')) {
      unlockAchievement('lab_explorer');
    }
    if (state.audioJourneyProgress >= 50 && !isUnlocked('sound_traveler')) {
      unlockAchievement('sound_traveler');
    }
    if (state.audioJourneyProgress >= 100 && !isUnlocked('audio_master')) {
      unlockAchievement('audio_master');
    }
    if (state.maxScrollProgress >= 50 && !isUnlocked('curious_explorer')) {
      unlockAchievement('curious_explorer');
    }
    if (state.maxScrollProgress >= 95 && !isUnlocked('completionist')) {
      unlockAchievement('completionist');
    }
    if (state.videosWatched.length >= 1 && !isUnlocked('video_watcher')) {
      unlockAchievement('video_watcher');
    }
    if (state.clinicalSessionsCompleted >= 1 && !isUnlocked('treatment_started')) {
      unlockAchievement('treatment_started');
    }
    if (state.clinicalSessionsCompleted >= 5 && !isUnlocked('week_one')) {
      unlockAchievement('week_one');
    }
    if (state.clinicalSessionsCompleted >= 10 && !isUnlocked('halfway_hero')) {
      unlockAchievement('halfway_hero');
    }
    if (state.clinicalSessionsCompleted >= 20 && !isUnlocked('treatment_graduate')) {
      unlockAchievement('treatment_graduate');
    }
    if (state.clinicalStreak >= 3 && !isUnlocked('streak_starter')) {
      unlockAchievement('streak_starter');
    }
    if (state.clinicalStreak >= 7 && !isUnlocked('streak_master')) {
      unlockAchievement('streak_master');
    }
  }, [
    state.exploredBrainRegions.length,
    state.slidesViewed.length,
    state.checklistCompleted,
    state.gamesCompleted.length,
    state.audioJourneyProgress,
    state.maxScrollProgress,
    state.videosWatched.length,
    state.clinicalSessionsCompleted,
    state.clinicalStreak,
    state.achievements,
    unlockAchievement,
  ]);

  // Cleanup any pending timers on unmount.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    return () => {
      if (soundScientistTimerRef.current !== null) {
        window.clearTimeout(soundScientistTimerRef.current);
        soundScientistTimerRef.current = null;
      }
    };
  }, []);

  // Schedule sound_scientist when point threshold is reached.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const soundScientistUnlocked =
      state.achievements.find(a => a.id === 'sound_scientist')?.unlocked ?? false;

    const shouldSchedule = state.totalPoints >= 300 && !soundScientistUnlocked;
    if (!shouldSchedule) {
      if (soundScientistTimerRef.current !== null) {
        window.clearTimeout(soundScientistTimerRef.current);
        soundScientistTimerRef.current = null;
      }
      return;
    }

    if (soundScientistTimerRef.current !== null) return;

    soundScientistTimerRef.current = window.setTimeout(() => {
      soundScientistTimerRef.current = null;
      unlockAchievement('sound_scientist');
    }, 1500);
  }, [state.totalPoints, state.achievements, unlockAchievement]);

  // Track time spent
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const interval = window.setInterval(() => {
      const timeSpent = Math.floor((Date.now() - state.sessionStartTime) / 1000);
      if (timeSpent < 300) return;
      unlockAchievement('dedicated_learner');
    }, 30000); // Check every 30 seconds

    return () => window.clearInterval(interval);
  }, [state.sessionStartTime, unlockAchievement]);

  // Unlock first_steps shortly after mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const timer = window.setTimeout(() => {
      unlockAchievement('first_steps');
    }, 2000);
    return () => window.clearTimeout(timer);
  }, [unlockAchievement]);

  // Check time-based achievements on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hour = new Date().getHours();
    if (hour < 9) {
      const timer = window.setTimeout(() => unlockAchievement('early_bird'), 3000);
      return () => window.clearTimeout(timer);
    }
    if (hour >= 22) {
      const timer = window.setTimeout(() => unlockAchievement('night_owl'), 3000);
      return () => window.clearTimeout(timer);
    }
  }, [unlockAchievement]);

  return (
    <GamificationContext.Provider
      value={{
        state,
        brainRegions,
        unlockAchievement,
        exploreBrainRegion,
        viewSlide,
        completeChecklist,
        completeGame,
        updateAudioJourneyProgress,
        updateScrollProgress,
        watchVideo,
        getUnlockedAchievements,
        getNextAchievements,
        recentUnlock,
        clearRecentUnlock,
        playUnlockSound,
        // Clinical tracking
        completeClinicalSession,
        updateClinicalStreak,
        setTreatmentPhase,
        getClinicalAchievements,
        syncClinicalProgress,
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
}

export { BRAIN_REGIONS };
