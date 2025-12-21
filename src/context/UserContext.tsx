import { createContext, useContext, useState, useCallback, useEffect, useMemo, type ReactNode } from 'react';\nimport { safeStorage } from '../utils/storage';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type UserRole = 'guest' | 'patient' | 'parent' | 'clinician' | 'school_admin' | 'super_admin';

export type Permission =
  | 'view_content'
  | 'play_games'
  | 'save_progress'
  | 'view_own_reports'
  | 'view_child_reports'
  | 'view_patient_reports'
  | 'school_analytics'
  | 'global_analytics'
  | 'system_config';

export interface User {
  id: string;
  email?: string;
  name?: string;
  nameAr?: string;
  role: UserRole;
  avatar?: string;
  clinic?: string;
  school?: string;
  children?: string[]; // For parent role - child user IDs
  createdAt: number;
  lastLogin: number;
}

export interface ClinicalProgress {
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
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  clinicalProgress: ClinicalProgress | null;
}

interface UserContextValue extends UserState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (data: RegisterData) => Promise<boolean>;
  updateProfile: (data: Partial<User>) => void;
  updateClinicalProgress: (data: Partial<ClinicalProgress>) => void;
  hasPermission: (permission: Permission) => boolean;
  getPermissions: () => Permission[];
  switchRole: (role: UserRole) => void; // Dev mode only
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  nameAr?: string;
  role?: UserRole;
}

// ═══════════════════════════════════════════════════════════════════════════
// PERMISSION MATRIX
// ═══════════════════════════════════════════════════════════════════════════

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  guest: ['view_content', 'play_games'],
  patient: ['view_content', 'play_games', 'save_progress', 'view_own_reports'],
  parent: ['view_content', 'play_games', 'save_progress', 'view_own_reports', 'view_child_reports'],
  clinician: ['view_content', 'play_games', 'save_progress', 'view_own_reports', 'view_patient_reports'],
  school_admin: ['view_content', 'play_games', 'save_progress', 'view_own_reports', 'school_analytics'],
  super_admin: [
    'view_content',
    'play_games',
    'save_progress',
    'view_own_reports',
    'view_child_reports',
    'view_patient_reports',
    'school_analytics',
    'global_analytics',
    'system_config',
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// STORAGE
// ═══════════════════════════════════════════════════════════════════════════

const STORAGE_KEY = 'lotus_user_state';
const CLINICAL_STORAGE_KEY = 'lotus_clinical_progress';

const loadUserState = (): UserState => {
  const stored = safeStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return {
        user: parsed.user || null,
        isAuthenticated: !!parsed.user,
        isLoading: false,
        clinicalProgress: null,
      };
    } catch {
      console.warn('Failed to load user state');
    }
  }
  return {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    clinicalProgress: null,
  };
};
const loadClinicalProgress = (): ClinicalProgress | null => {
  const stored = safeStorage.getItem(CLINICAL_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      console.warn('Failed to load clinical progress');
    }
  }
  return null;
};
const saveUserState = (user: User | null) => {
  const payload = JSON.stringify({ user });
  if (!safeStorage.setItem(STORAGE_KEY, payload)) {
    console.warn('Failed to save user state');
  }
};
const saveClinicalProgress = (progress: ClinicalProgress | null) => {
  if (progress) {
    const payload = JSON.stringify(progress);
    if (!safeStorage.setItem(CLINICAL_STORAGE_KEY, payload)) {
      console.warn('Failed to save clinical progress');
    }
    return;
  }
  if (!safeStorage.removeItem(CLINICAL_STORAGE_KEY)) {
    console.warn('Failed to save clinical progress');
  }
};
// ═══════════════════════════════════════════════════════════════════════════
// MOCK AUTH (Replace with real API later)
// ═══════════════════════════════════════════════════════════════════════════

const generateId = () => `user_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

// Mock user database for demo
const MOCK_USERS: Record<string, { user: User; password: string }> = {
  'demo@patient.com': {
    password: 'demo123',
    user: {
      id: 'demo_patient_1',
      email: 'demo@patient.com',
      name: 'Demo Patient',
      nameAr: 'مريض تجريبي',
      role: 'patient',
      createdAt: Date.now() - 86400000 * 30,
      lastLogin: Date.now(),
    },
  },
  'demo@clinician.com': {
    password: 'demo123',
    user: {
      id: 'demo_clinician_1',
      email: 'demo@clinician.com',
      name: 'Dr. Demo Clinician',
      nameAr: 'د. طبيب تجريبي',
      role: 'clinician',
      clinic: 'Lotus AIT Center',
      createdAt: Date.now() - 86400000 * 90,
      lastLogin: Date.now(),
    },
  },
  'demo@school.com': {
    password: 'demo123',
    user: {
      id: 'demo_school_1',
      email: 'demo@school.com',
      name: 'School Administrator',
      nameAr: 'مدير المدرسة',
      role: 'school_admin',
      school: 'International Academy',
      createdAt: Date.now() - 86400000 * 60,
      lastLogin: Date.now(),
    },
  },
  'demo@admin.com': {
    password: 'demo123',
    user: {
      id: 'demo_admin_1',
      email: 'demo@admin.com',
      name: 'Super Admin',
      nameAr: 'المشرف العام',
      role: 'super_admin',
      createdAt: Date.now() - 86400000 * 180,
      lastLogin: Date.now(),
    },
  },
  'demo@parent.com': {
    password: 'demo123',
    user: {
      id: 'demo_parent_1',
      email: 'demo@parent.com',
      name: 'Demo Parent',
      nameAr: 'ولي أمر تجريبي',
      role: 'parent',
      children: ['child_1', 'child_2'],
      createdAt: Date.now() - 86400000 * 45,
      lastLogin: Date.now(),
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════════════════════════════════════════

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<UserState>(() => ({
    ...loadUserState(),
    clinicalProgress: loadClinicalProgress(),
  }));

  // Update streak on activity
  useEffect(() => {
    if (state.clinicalProgress) {
      const today = new Date().toDateString();
      const lastActivity = new Date(state.clinicalProgress.lastActivityDate).toDateString();

      if (today !== lastActivity) {
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        const newStreak = lastActivity === yesterday ? state.clinicalProgress.streak + 1 : 1;

        setState(prev => ({
          ...prev,
          clinicalProgress: prev.clinicalProgress
            ? {
                ...prev.clinicalProgress,
                streak: newStreak,
                lastActivityDate: Date.now(),
              }
            : null,
        }));
      }
    }
  }, []);

  // Persist user state
  useEffect(() => {
    saveUserState(state.user);
  }, [state.user]);

  // Persist clinical progress
  useEffect(() => {
    saveClinicalProgress(state.clinicalProgress);
  }, [state.clinicalProgress]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true }));

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const mockEntry = MOCK_USERS[email.toLowerCase()];
    if (mockEntry && mockEntry.password === password) {
      const user = { ...mockEntry.user, lastLogin: Date.now() };

      // Initialize clinical progress for patients
      const clinicalProgress: ClinicalProgress | null =
        user.role === 'patient'
          ? {
              sessionsCompleted: 0,
              sessionDates: [],
              attentionScore: 0,
              processingSpeed: 0,
              auditoryDiscrimination: 0,
              weeklyGoalsMet: 0,
              treatmentPhase: 'assessment',
              streak: 1,
              lastActivityDate: Date.now(),
            }
          : null;

      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        clinicalProgress,
      });
      return true;
    }

    setState(prev => ({ ...prev, isLoading: false }));
    return false;
  }, []);

  const logout = useCallback(() => {
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      clinicalProgress: null,
    });
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(CLINICAL_STORAGE_KEY);
  }, []);

  const register = useCallback(async (data: RegisterData): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true }));

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if email already exists
    if (MOCK_USERS[data.email.toLowerCase()]) {
      setState(prev => ({ ...prev, isLoading: false }));
      return false;
    }

    const newUser: User = {
      id: generateId(),
      email: data.email,
      name: data.name,
      nameAr: data.nameAr,
      role: data.role || 'patient',
      createdAt: Date.now(),
      lastLogin: Date.now(),
    };

    // Add to mock database
    MOCK_USERS[data.email.toLowerCase()] = {
      password: data.password,
      user: newUser,
    };

    const clinicalProgress: ClinicalProgress | null =
      newUser.role === 'patient'
        ? {
            sessionsCompleted: 0,
            sessionDates: [],
            attentionScore: 0,
            processingSpeed: 0,
            auditoryDiscrimination: 0,
            weeklyGoalsMet: 0,
            treatmentPhase: 'assessment',
            streak: 1,
            lastActivityDate: Date.now(),
          }
        : null;

    setState({
      user: newUser,
      isAuthenticated: true,
      isLoading: false,
      clinicalProgress,
    });

    return true;
  }, []);

  const updateProfile = useCallback((data: Partial<User>) => {
    setState(prev => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...data } : null,
    }));
  }, []);

  const updateClinicalProgress = useCallback((data: Partial<ClinicalProgress>) => {
    setState(prev => ({
      ...prev,
      clinicalProgress: prev.clinicalProgress
        ? { ...prev.clinicalProgress, ...data, lastActivityDate: Date.now() }
        : null,
    }));
  }, []);

  const hasPermission = useCallback(
    (permission: Permission): boolean => {
      const role = state.user?.role || 'guest';
      return ROLE_PERMISSIONS[role].includes(permission);
    },
    [state.user?.role]
  );

  const getPermissions = useCallback((): Permission[] => {
    const role = state.user?.role || 'guest';
    return ROLE_PERMISSIONS[role];
  }, [state.user?.role]);

  // Dev mode: Switch role for testing
  const switchRole = useCallback((role: UserRole) => {
    if (import.meta.env.DEV) {
      setState(prev => ({
        ...prev,
        user: prev.user
          ? { ...prev.user, role }
          : {
              id: 'dev_user',
              name: 'Dev User',
              role,
              createdAt: Date.now(),
              lastLogin: Date.now(),
            },
        isAuthenticated: true,
        clinicalProgress:
          role === 'patient'
            ? {
                sessionsCompleted: 5,
                sessionDates: [
                  Date.now() - 86400000 * 4,
                  Date.now() - 86400000 * 3,
                  Date.now() - 86400000 * 2,
                  Date.now() - 86400000,
                  Date.now(),
                ],
                attentionScore: 72,
                processingSpeed: 68,
                auditoryDiscrimination: 65,
                weeklyGoalsMet: 3,
                treatmentPhase: 'active',
                streak: 5,
                lastActivityDate: Date.now(),
              }
            : null,
      }));
    }
  }, []);

  const value = useMemo<UserContextValue>(
    () => ({
      ...state,
      login,
      logout,
      register,
      updateProfile,
      updateClinicalProgress,
      hasPermission,
      getPermissions,
      switchRole,
    }),
    [
      state,
      login,
      logout,
      register,
      updateProfile,
      updateClinicalProgress,
      hasPermission,
      getPermissions,
      switchRole,
    ]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY HOOKS
// ═══════════════════════════════════════════════════════════════════════════

export function usePermission(permission: Permission): boolean {
  const { hasPermission } = useUser();
  return hasPermission(permission);
}

export function useRole(): UserRole {
  const { user } = useUser();
  return user?.role || 'guest';
}

export function useClinicalProgress() {
  const { clinicalProgress, updateClinicalProgress } = useUser();
  return { progress: clinicalProgress, update: updateClinicalProgress };
}

export function useIsPatient(): boolean {
  const { user } = useUser();
  return user?.role === 'patient';
}

export function useIsParent(): boolean {
  const { user } = useUser();
  return user?.role === 'parent';
}

export function useIsClinician(): boolean {
  const { user } = useUser();
  return user?.role === 'clinician';
}
