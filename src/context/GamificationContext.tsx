import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef, type ReactNode } from 'react';

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
  category: 'exploration' | 'learning' | 'mastery' | 'engagement';
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
  if (typeof window === 'undefined') {
    return {
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
    };
  }

  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        sessionStartTime: Date.now(),
        maxScrollProgress: parsed.maxScrollProgress || 0,
        videosWatched: parsed.videosWatched || [],
      };
    } catch {
      // Invalid data, return fresh state
    }
  }

  return {
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
  };
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
}

const GamificationContext = createContext<GamificationContextType | null>(null);

export function GamificationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GamificationState>(getInitialState);
  const [recentUnlock, setRecentUnlock] = useState<Achievement | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const saveTimeoutRef = useRef<number | null>(null);

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
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
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
  }, [state]);

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
    let didUnlock = false;
    let unlocked: Achievement | null = null;
    let shouldScheduleSoundScientist = false;

    setState((prev) => {
      const achievement = prev.achievements.find(a => a.id === id);
      if (!achievement || achievement.unlocked) return prev;

      const unlockedAt = Date.now();
      didUnlock = true;
      unlocked = { ...achievement, unlocked: true, unlockedAt };

      const achievements = prev.achievements.map(a =>
        a.id === id ? { ...a, unlocked: true, unlockedAt } : a
      );
      const totalPoints = prev.totalPoints + achievement.points;

      shouldScheduleSoundScientist =
        id !== 'sound_scientist' &&
        totalPoints >= 300 &&
        !prev.achievements.find(a => a.id === 'sound_scientist')?.unlocked;

      return {
        ...prev,
        achievements,
        totalPoints,
        level: calculateLevel(totalPoints),
      };
    });

    if (!didUnlock || !unlocked) return false;

    setRecentUnlock(unlocked);
    playUnlockSound();

    if (shouldScheduleSoundScientist) {
      window.setTimeout(() => {
        unlockAchievement('sound_scientist');
      }, 1500);
    }

    return true;
  }, [playUnlockSound]);

  const exploreBrainRegion = useCallback((id: string) => {
    let exploredCount: number | null = null;
    let exploredAll = false;

    setState((prev) => {
      if (prev.exploredBrainRegions.includes(id)) return prev;
      const exploredBrainRegions = [...prev.exploredBrainRegions, id];
      exploredCount = exploredBrainRegions.length;
      exploredAll = exploredBrainRegions.length === BRAIN_REGIONS.length;
      return { ...prev, exploredBrainRegions };
    });

    if (exploredCount === 3) unlockAchievement('brain_explorer');
    if (exploredAll) unlockAchievement('neural_master');
  }, [unlockAchievement]);

  const viewSlide = useCallback((slideId: number) => {
    let viewedCount: number | null = null;

    setState((prev) => {
      if (prev.slidesViewed.includes(slideId)) return prev;
      const slidesViewed = [...prev.slidesViewed, slideId];
      viewedCount = slidesViewed.length;
      return { ...prev, slidesViewed };
    });

    if (viewedCount === 10) unlockAchievement('slide_scholar');
    if (viewedCount === 30) unlockAchievement('data_detective');
  }, [unlockAchievement]);

  const completeChecklist = useCallback(() => {
    let shouldUnlock = false;
    setState((prev) => {
      if (prev.checklistCompleted) return prev;
      shouldUnlock = true;
      return { ...prev, checklistCompleted: true };
    });
    if (!shouldUnlock) return;
    unlockAchievement('self_aware');
  }, [unlockAchievement]);

  const completeGame = useCallback((gameId: string) => {
    let completedCount: number | null = null;

    setState((prev) => {
      if (prev.gamesCompleted.includes(gameId)) return prev;
      const gamesCompleted = [...prev.gamesCompleted, gameId];
      completedCount = gamesCompleted.length;
      return { ...prev, gamesCompleted };
    });

    if (completedCount === 1) unlockAchievement('game_starter');
    if (typeof completedCount === 'number' && completedCount >= 5) unlockAchievement('lab_explorer');
  }, [unlockAchievement]);

  const updateAudioJourneyProgress = useCallback((progress: number) => {
    const clampedProgress = Math.min(100, Math.max(0, progress));
    let previous = 0;
    let didUpdate = false;

    setState((prev) => {
      if (clampedProgress <= prev.audioJourneyProgress) return prev;
      previous = prev.audioJourneyProgress;
      didUpdate = true;
      return { ...prev, audioJourneyProgress: clampedProgress };
    });

    if (!didUpdate) return;

    if (clampedProgress >= 50 && previous < 50) {
      unlockAchievement('sound_traveler');
    }
    if (clampedProgress >= 100) {
      unlockAchievement('audio_master');
    }
  }, [unlockAchievement]);

  const updateScrollProgress = useCallback((progress: number) => {
    const clampedProgress = Math.min(100, Math.max(0, progress));
    let previous = 0;
    let didUpdate = false;

    setState((prev) => {
      if (clampedProgress <= prev.maxScrollProgress) return prev;
      previous = prev.maxScrollProgress;
      didUpdate = true;
      return { ...prev, maxScrollProgress: clampedProgress };
    });

    if (!didUpdate) return;

    // Check scroll achievements
    if (clampedProgress >= 50 && previous < 50) {
      unlockAchievement('curious_explorer');
    }
    if (clampedProgress >= 95) {
      unlockAchievement('completionist');
    }
  }, [unlockAchievement]);

  const watchVideo = useCallback((videoId: string) => {
    let watchedCount: number | null = null;

    setState((prev) => {
      if (prev.videosWatched.includes(videoId)) return prev;
      const videosWatched = [...prev.videosWatched, videoId];
      watchedCount = videosWatched.length;
      return { ...prev, videosWatched };
    });

    if (watchedCount === 1) unlockAchievement('video_watcher');
  }, [unlockAchievement]);

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

  const brainRegions = useMemo(() => {
    const exploredSet = new Set(state.exploredBrainRegions);
    return BRAIN_REGIONS.map(region => ({
      ...region,
      explored: exploredSet.has(region.id),
    }));
  }, [state.exploredBrainRegions]);

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
