import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { notifyLocalChange } from '../utils/sync';
import { SchoolIcon, ParentIcon, ClinicianIcon } from '../components/icons/index';
import { brandPink, brandPurple, colors } from '../components/styles';

// ═══════════════════════════════════════════════════════════════════════════
// VISITOR MODE TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type VisitorMode = 'school' | 'parent' | 'clinician';

interface VisitorModeConfig {
  id: VisitorMode;
  label: string;
  labelAr: string;
  icon: ReactNode;
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
    icon: <SchoolIcon size={18} tone="warning" />,
    description: 'Explore classroom screening and school partnerships',
    descriptionAr: 'استكشف فحص الفصول الدراسية والشراكات المدرسية',
    ctaLabel: 'Request School Demo',
    ctaLabelAr: 'اطلب تجربة مدرسية',
    ctaPath: '/contact?mode=school',
    color: colors.warning,
    priority: ['hero', 'school-partnership', 'games', 'results', 'program', 'checklist', 'contact'],
  },
  parent: {
    id: 'parent',
    label: 'Parents',
    labelAr: 'الأهالي',
    icon: <ParentIcon size={18} tone="purple" />,
    description: 'Check your child\'s auditory processing',
    descriptionAr: 'افحص المعالجة السمعية لطفلك',
    ctaLabel: 'Book Screening',
    ctaLabelAr: 'احجز تقييم',
    ctaPath: '/contact?mode=parent',
    color: brandPurple,
    priority: ['hero', 'checklist', 'games', 'results', 'program', 'testimonials', 'contact'],
  },
  clinician: {
    id: 'clinician',
    label: 'Clinicians',
    labelAr: 'الأخصائيون',
    icon: <ClinicianIcon size={18} tone="pink" />,
    description: 'Evidence-based auditory integration training',
    descriptionAr: 'تدريب التكامل السمعي القائم على الأدلة',
    ctaLabel: 'Clinician Inquiry',
    ctaLabelAr: 'تواصل كأخصائي',
    ctaPath: '/contact?mode=clinician',
    color: brandPink,
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
const UPDATED_AT_KEY = 'lotus_visitor_mode_updated_at';

// ═══════════════════════════════════════════════════════════════════════════
// PROVIDER
// ═══════════════════════════════════════════════════════════════════════════

export function VisitorModeProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [mode, setModeState] = useState<VisitorMode>(() => {
    if (typeof window !== 'undefined') {
      // Allow deep links to force a mode (e.g. /contact?mode=parent)
      const urlMode = new URLSearchParams(window.location.search).get('mode');
      if (urlMode && (urlMode === 'school' || urlMode === 'parent' || urlMode === 'clinician')) {
        return urlMode as VisitorMode;
      }

      // Check localStorage for saved preference
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && (saved === 'school' || saved === 'parent' || saved === 'clinician')) {
        return saved as VisitorMode;
      }
    }
    return 'school'; // Default to school mode
  });

  // Sync mode from URL query param on navigation (supports internal links with ?mode=...)
  useEffect(() => {
    const urlMode = new URLSearchParams(location.search).get('mode');
    if (!urlMode) return;
    if (urlMode !== 'school' && urlMode !== 'parent' && urlMode !== 'clinician') return;
    setModeState(urlMode as VisitorMode);
  }, [location.search]);

  // Save to localStorage when mode changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  const setMode = useCallback((newMode: VisitorMode) => {
    setModeState(newMode);
    try {
      localStorage.setItem(UPDATED_AT_KEY, Date.now().toString());
    } catch {
      // Ignore storage errors.
    }
    notifyLocalChange();
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
