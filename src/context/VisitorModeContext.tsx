import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// VISITOR MODE TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type VisitorMode = 'school' | 'parent' | 'clinician';

interface VisitorModeConfig {
  id: VisitorMode;
  label: string;
  labelAr: string;
  icon: string;
  description: string;
  descriptionAr: string;
  ctaLabel: string;
  ctaLabelAr: string;
  ctaPath: string;
  color: string;
  priority: string[]; // Section order priority
}

// ═══════════════════════════════════════════════════════════════════════════
// MODE CONFIGURATIONS
// ═══════════════════════════════════════════════════════════════════════════

export const VISITOR_MODES: Record<VisitorMode, VisitorModeConfig> = {
  school: {
    id: 'school',
    label: 'Schools',
    labelAr: 'المدارس',
    icon: '🏫',
    description: 'Explore classroom screening and school partnerships',
    descriptionAr: 'استكشف فحص الفصول الدراسية والشراكات المدرسية',
    ctaLabel: 'Request School Demo',
    ctaLabelAr: 'اطلب تجربة مدرسية',
    ctaPath: '/contact?mode=school',
    color: '#f59e0b',
    priority: ['hero', 'school-partnership', 'games', 'results', 'program', 'checklist', 'contact'],
  },
  parent: {
    id: 'parent',
    label: 'Parents',
    labelAr: 'الأهالي',
    icon: '👨‍👩‍👧',
    description: 'Check your child\'s auditory processing',
    descriptionAr: 'افحص المعالجة السمعية لطفلك',
    ctaLabel: 'Book Screening',
    ctaLabelAr: 'احجز تقييم',
    ctaPath: '/contact?mode=parent',
    color: '#AF84BA',
    priority: ['hero', 'checklist', 'games', 'results', 'program', 'testimonials', 'contact'],
  },
  clinician: {
    id: 'clinician',
    label: 'Clinicians',
    labelAr: 'الأخصائيون',
    icon: '👨‍⚕️',
    description: 'Evidence-based auditory integration training',
    descriptionAr: 'تدريب التكامل السمعي القائم على الأدلة',
    ctaLabel: 'Clinician Inquiry',
    ctaLabelAr: 'تواصل كأخصائي',
    ctaPath: '/contact?mode=clinician',
    color: '#B01270',
    priority: ['hero', 'program', 'science', 'results', 'games', 'credentials', 'contact'],
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════════════════════════════════════════

interface VisitorModeContextType {
  mode: VisitorMode;
  config: VisitorModeConfig;
  setMode: (mode: VisitorMode) => void;
  isSchool: boolean;
  isParent: boolean;
  isClinician: boolean;
  getSectionOrder: () => string[];
  getCtaConfig: () => { label: string; labelAr: string; path: string };
}

const VisitorModeContext = createContext<VisitorModeContextType | null>(null);

const STORAGE_KEY = 'lotus_visitor_mode';

// ═══════════════════════════════════════════════════════════════════════════
// PROVIDER
// ═══════════════════════════════════════════════════════════════════════════

export function VisitorModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<VisitorMode>(() => {
    // Check localStorage for saved preference
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && (saved === 'school' || saved === 'parent' || saved === 'clinician')) {
        return saved as VisitorMode;
      }
    }
    return 'parent'; // Default to parent mode
  });

  // Save to localStorage when mode changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  const setMode = useCallback((newMode: VisitorMode) => {
    setModeState(newMode);
  }, []);

  const config = useMemo(() => VISITOR_MODES[mode], [mode]);

  const isSchool = mode === 'school';
  const isParent = mode === 'parent';
  const isClinician = mode === 'clinician';

  const getSectionOrder = useCallback(() => {
    return VISITOR_MODES[mode].priority;
  }, [mode]);

  const getCtaConfig = useCallback(() => ({
    label: config.ctaLabel,
    labelAr: config.ctaLabelAr,
    path: config.ctaPath,
  }), [config]);

  const value = useMemo(() => ({
    mode,
    config,
    setMode,
    isSchool,
    isParent,
    isClinician,
    getSectionOrder,
    getCtaConfig,
  }), [mode, config, setMode, isSchool, isParent, isClinician, getSectionOrder, getCtaConfig]);

  return (
    <VisitorModeContext.Provider value={value}>
      {children}
    </VisitorModeContext.Provider>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════════════════════════════════════

export function useVisitorMode() {
  const context = useContext(VisitorModeContext);
  if (!context) {
    throw new Error('useVisitorMode must be used within a VisitorModeProvider');
  }
  return context;
}

export function useVisitorModeConfig() {
  const { config } = useVisitorMode();
  return config;
}

export function useIsSchoolMode() {
  const { isSchool } = useVisitorMode();
  return isSchool;
}

export function useIsParentMode() {
  const { isParent } = useVisitorMode();
  return isParent;
}

export function useIsClinicianMode() {
  const { isClinician } = useVisitorMode();
  return isClinician;
}
