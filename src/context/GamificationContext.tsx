import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

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
    description: 'Complete all 5 games',
    descriptionAr: 'أكمل جميع الألعاب الخمس',
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

const getInitialState = (): GamificationState => {
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

  const saved = localStorage.getItem(STORAGE_KEY);
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
  const [state, setState] = useState<GamificationState>(getInitialState);
  const [recentUnlock, setRecentUnlock] = useState<Achievement | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  // Initialize audio context on first interaction
  useEffect(() => {
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
    const toSave = {
      ...state,
      totalTimeSpent: state.totalTimeSpent + Math.floor((Date.now() - state.sessionStartTime) / 1000),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  }, [state]);

  // Track time spent
  useEffect(() => {
    const interval = setInterval(() => {
      const timeSpent = Math.floor((Date.now() - state.sessionStartTime) / 1000);
      if (timeSpent >= 300 && !state.achievements.find(a => a.id === 'dedicated_learner')?.unlocked) {
        unlockAchievement('dedicated_learner');
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [state.sessionStartTime, state.achievements]);

  // Unlock first_steps on mount if not already unlocked
  useEffect(() => {
    const firstSteps = state.achievements.find(a => a.id === 'first_steps');
    if (firstSteps && !firstSteps.unlocked) {
      setTimeout(() => unlockAchievement('first_steps'), 2000);
    }
  }, []);

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

  const calculateLevel = (points: number): number => {
    if (points < 50) return 1;
    if (points < 150) return 2;
    if (points < 300) return 3;
    if (points < 500) return 4;
    return 5;
  };

  const unlockAchievement = useCallback((id: string): boolean => {
    const achievement = state.achievements.find(a => a.id === id);
    if (!achievement || achievement.unlocked) return false;

    const newAchievements = state.achievements.map(a =>
      a.id === id ? { ...a, unlocked: true, unlockedAt: Date.now() } : a
    );
    const newPoints = state.totalPoints + achievement.points;

    setState(prev => ({
      ...prev,
      achievements: newAchievements,
      totalPoints: newPoints,
      level: calculateLevel(newPoints),
    }));

    setRecentUnlock({ ...achievement, unlocked: true, unlockedAt: Date.now() });
    playUnlockSound();

    // Check for sound_scientist achievement
    if (newPoints >= 300) {
      setTimeout(() => {
        const soundScientist = state.achievements.find(a => a.id === 'sound_scientist');
        if (soundScientist && !soundScientist.unlocked) {
          unlockAchievement('sound_scientist');
        }
      }, 1500);
    }

    return true;
  }, [state.achievements, state.totalPoints, playUnlockSound]);

  const exploreBrainRegion = useCallback((id: string) => {
    if (state.exploredBrainRegions.includes(id)) return;

    const newExplored = [...state.exploredBrainRegions, id];
    setState(prev => ({ ...prev, exploredBrainRegions: newExplored }));

    // Check achievements
    if (newExplored.length === 3) {
      unlockAchievement('brain_explorer');
    }
    if (newExplored.length === BRAIN_REGIONS.length) {
      unlockAchievement('neural_master');
    }
  }, [state.exploredBrainRegions, unlockAchievement]);

  const viewSlide = useCallback((slideId: number) => {
    if (state.slidesViewed.includes(slideId)) return;

    const newViewed = [...state.slidesViewed, slideId];
    setState(prev => ({ ...prev, slidesViewed: newViewed }));

    if (newViewed.length === 10) {
      unlockAchievement('slide_scholar');
    }
    if (newViewed.length === 30) {
      unlockAchievement('data_detective');
    }
  }, [state.slidesViewed, unlockAchievement]);

  const completeChecklist = useCallback(() => {
    if (state.checklistCompleted) return;
    setState(prev => ({ ...prev, checklistCompleted: true }));
    unlockAchievement('self_aware');
  }, [state.checklistCompleted, unlockAchievement]);

  const completeGame = useCallback((gameId: string) => {
    if (state.gamesCompleted.includes(gameId)) return;

    const newCompleted = [...state.gamesCompleted, gameId];
    setState(prev => ({ ...prev, gamesCompleted: newCompleted }));

    if (newCompleted.length === 1) {
      unlockAchievement('game_starter');
    }
    if (newCompleted.length >= 5) {
      unlockAchievement('lab_explorer');
    }
  }, [state.gamesCompleted, unlockAchievement]);

  const updateAudioJourneyProgress = useCallback((progress: number) => {
    const clampedProgress = Math.min(100, Math.max(0, progress));
    if (clampedProgress <= state.audioJourneyProgress) return;

    setState(prev => ({ ...prev, audioJourneyProgress: clampedProgress }));

    if (clampedProgress >= 50 && state.audioJourneyProgress < 50) {
      unlockAchievement('sound_traveler');
    }
    if (clampedProgress >= 100) {
      unlockAchievement('audio_master');
    }
  }, [state.audioJourneyProgress, unlockAchievement]);

  const updateScrollProgress = useCallback((progress: number) => {
    const clampedProgress = Math.min(100, Math.max(0, progress));
    if (clampedProgress <= state.maxScrollProgress) return;

    setState(prev => ({ ...prev, maxScrollProgress: clampedProgress }));

    // Check scroll achievements
    if (clampedProgress >= 50 && state.maxScrollProgress < 50) {
      unlockAchievement('curious_explorer');
    }
    if (clampedProgress >= 95) {
      unlockAchievement('completionist');
    }
  }, [state.maxScrollProgress, unlockAchievement]);

  const watchVideo = useCallback((videoId: string) => {
    if (state.videosWatched.includes(videoId)) return;

    const newWatched = [...state.videosWatched, videoId];
    setState(prev => ({ ...prev, videosWatched: newWatched }));

    // First video achievement
    if (newWatched.length === 1) {
      unlockAchievement('video_watcher');
    }
  }, [state.videosWatched, unlockAchievement]);

  const getUnlockedAchievements = useCallback(() => {
    return state.achievements.filter(a => a.unlocked);
  }, [state.achievements]);

  const getNextAchievements = useCallback(() => {
    return state.achievements.filter(a => !a.unlocked).slice(0, 3);
  }, [state.achievements]);

  const clearRecentUnlock = useCallback(() => {
    setRecentUnlock(null);
  }, []);

  // Clinical tracking methods
  const completeClinicalSession = useCallback(() => {
    const newSessions = state.clinicalSessionsCompleted + 1;
    const now = Date.now();

    setState(prev => ({
      ...prev,
      clinicalSessionsCompleted: newSessions,
      lastClinicalActivity: now,
    }));

    // Check clinical session achievements
    if (newSessions === 1) {
      unlockAchievement('treatment_started');
    }
    if (newSessions === 5) {
      unlockAchievement('week_one');
    }
    if (newSessions === 10) {
      unlockAchievement('halfway_hero');
    }
    if (newSessions === 20) {
      unlockAchievement('treatment_graduate');
    }

    // Update treatment phase based on sessions
    if (newSessions >= 20) {
      setState(prev => ({ ...prev, treatmentPhase: 'completed' }));
    } else if (newSessions >= 15) {
      setState(prev => ({ ...prev, treatmentPhase: 'maintenance' }));
    } else if (newSessions >= 1) {
      setState(prev => ({ ...prev, treatmentPhase: 'active' }));
    }
  }, [state.clinicalSessionsCompleted, unlockAchievement]);

  const updateClinicalStreak = useCallback(() => {
    const now = Date.now();
    const lastActivity = state.lastClinicalActivity;
    const oneDayMs = 24 * 60 * 60 * 1000;

    // If last activity was within 24-48 hours, increment streak
    // If more than 48 hours, reset streak
    let newStreak = state.clinicalStreak;
    if (lastActivity === 0 || now - lastActivity > 2 * oneDayMs) {
      newStreak = 1;
    } else if (now - lastActivity > oneDayMs) {
      newStreak = state.clinicalStreak + 1;
    }

    setState(prev => ({
      ...prev,
      clinicalStreak: newStreak,
      lastClinicalActivity: now,
    }));

    // Check streak achievements
    if (newStreak >= 3) {
      unlockAchievement('streak_starter');
    }
    if (newStreak >= 7) {
      unlockAchievement('streak_master');
    }
  }, [state.clinicalStreak, state.lastClinicalActivity, unlockAchievement]);

  const setTreatmentPhase = useCallback((phase: GamificationState['treatmentPhase']) => {
    setState(prev => ({ ...prev, treatmentPhase: phase }));
  }, []);

  const getClinicalAchievements = useCallback(() => {
    return state.achievements.filter(a => a.category === 'clinical');
  }, [state.achievements]);

  const syncClinicalProgress = useCallback((progress: {
    sessionsCompleted?: number;
    streak?: number;
    attentionScore?: number;
    processingSpeed?: number;
    auditoryDiscrimination?: number;
  }) => {
    // Sync sessions if provided
    if (progress.sessionsCompleted !== undefined) {
      const currentSessions = state.clinicalSessionsCompleted;
      if (progress.sessionsCompleted > currentSessions) {
        setState(prev => ({
          ...prev,
          clinicalSessionsCompleted: progress.sessionsCompleted!,
        }));

        // Trigger achievements based on synced session count
        if (progress.sessionsCompleted >= 1 && currentSessions < 1) {
          unlockAchievement('treatment_started');
        }
        if (progress.sessionsCompleted >= 5 && currentSessions < 5) {
          unlockAchievement('week_one');
        }
        if (progress.sessionsCompleted >= 10 && currentSessions < 10) {
          unlockAchievement('halfway_hero');
        }
        if (progress.sessionsCompleted >= 20 && currentSessions < 20) {
          unlockAchievement('treatment_graduate');
        }
      }
    }

    // Sync streak if provided
    if (progress.streak !== undefined) {
      setState(prev => ({ ...prev, clinicalStreak: progress.streak! }));
      if (progress.streak >= 3) {
        unlockAchievement('streak_starter');
      }
      if (progress.streak >= 7) {
        unlockAchievement('streak_master');
      }
    }

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
  }, [state.clinicalSessionsCompleted, unlockAchievement]);

  const brainRegions = BRAIN_REGIONS.map(region => ({
    ...region,
    explored: state.exploredBrainRegions.includes(region.id),
  }));

  // Check time-based achievements on mount
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 9) {
      const earlyBird = state.achievements.find(a => a.id === 'early_bird');
      if (earlyBird && !earlyBird.unlocked) {
        setTimeout(() => unlockAchievement('early_bird'), 3000);
      }
    }
    if (hour >= 22) {
      const nightOwl = state.achievements.find(a => a.id === 'night_owl');
      if (nightOwl && !nightOwl.unlocked) {
        setTimeout(() => unlockAchievement('night_owl'), 3000);
      }
    }
  }, []);

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
