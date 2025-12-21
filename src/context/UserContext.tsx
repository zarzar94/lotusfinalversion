import { createContext, useContext, useState, useCallback, useEffect, useMemo, useRef, type ReactNode } from 'react';
import { authApi, clinicalApi, getToken, clearTokens } from '../services/api';
import { safeStorage } from '../utils/storage';

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
  isOnline: boolean;
  authError: string | null;
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
  refreshUser: () => Promise<void>;
  clearAuthError: () => void;
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
// STORAGE (Offline fallback)
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
        isAuthenticated: !!parsed.user && !!getToken(),
        isLoading: false,
        clinicalProgress: null,
        isOnline: navigator.onLine,
        authError: null,
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
    isOnline: navigator.onLine,
    authError: null,
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
  if (!user) {
    safeStorage.removeItem(STORAGE_KEY);
    return;
  }
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
// CONTEXT
// ═══════════════════════════════════════════════════════════════════════════

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<UserState>(() => ({
    ...loadUserState(),
    clinicalProgress: loadClinicalProgress(),
  }));

  const updateTimeoutRef = useRef<number | null>(null);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setState(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setState(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Check for existing token on mount
  useEffect(() => {
    const token = getToken();
    if (token && !state.user) {
      // Try to restore session from API
      authApi.getCurrentUser().then(user => {
        if (user) {
          setState(prev => ({
            ...prev,
            user,
            isAuthenticated: true,
          }));
          saveUserState(user);

          // Also fetch clinical progress
          if (user.role === 'patient') {
            clinicalApi.getProgress().then(response => {
              if (response.success && response.progress) {
                setState(prev => ({
                  ...prev,
                  clinicalProgress: response.progress,
                }));
                saveClinicalProgress(response.progress);
              }
            });
          }
        } else {
          // Invalid token, clear it
          clearTokens();
          setState(prev => ({
            ...prev,
            user: null,
            isAuthenticated: false,
          }));
        }
      });
    }
  }, []);

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

  // Persist and sync clinical progress
  useEffect(() => {
    saveClinicalProgress(state.clinicalProgress);

    // Debounce API sync
    if (state.isAuthenticated && state.clinicalProgress && state.isOnline) {
      if (updateTimeoutRef.current) {
        window.clearTimeout(updateTimeoutRef.current);
      }

      updateTimeoutRef.current = window.setTimeout(() => {
        clinicalApi.updateProgress(state.clinicalProgress!).catch(() => {
          // Silently fail - data is saved locally
        });
      }, 2000);
    }

    return () => {
      if (updateTimeoutRef.current) {
        window.clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [state.clinicalProgress, state.isAuthenticated, state.isOnline]);

  // Listen for sync events
  useEffect(() => {
    const handleDataSync = (event: CustomEvent) => {
      const { clinicalProgress } = event.detail || {};
      if (clinicalProgress) {
        setState(prev => ({
          ...prev,
          clinicalProgress,
        }));
      }
    };

    window.addEventListener('lotus-data-synced', handleDataSync as EventListener);
    return () => window.removeEventListener('lotus-data-synced', handleDataSync as EventListener);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, authError: null }));

    try {
      const response = await authApi.login({ email, password });

      if (response.success && response.user) {
        const user = response.user;

        // Fetch clinical progress for patients
        let clinicalProgress: ClinicalProgress | null = null;
        if (user.role === 'patient') {
          try {
            const progressResponse = await clinicalApi.getProgress();
            if (progressResponse.success && progressResponse.progress) {
              clinicalProgress = progressResponse.progress;
            }
          } catch {
            // Use default progress if API fails
            clinicalProgress = {
              sessionsCompleted: 0,
              sessionDates: [],
              attentionScore: 0,
              processingSpeed: 0,
              auditoryDiscrimination: 0,
              weeklyGoalsMet: 0,
              treatmentPhase: 'assessment',
              streak: 1,
              lastActivityDate: Date.now(),
            };
          }
        }

        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
          clinicalProgress,
          isOnline: navigator.onLine,
          authError: null,
        });

        return true;
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        authError: response.error || 'Login failed',
      }));
      return false;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        authError: error instanceof Error ? error.message : 'Login failed',
      }));
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Continue with local logout even if API fails
    }

    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      clinicalProgress: null,
      isOnline: navigator.onLine,
      authError: null,
    });
    clearTokens();
    safeStorage.removeItem(STORAGE_KEY);
    safeStorage.removeItem(CLINICAL_STORAGE_KEY);
  }, []);

  const register = useCallback(async (data: RegisterData): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, authError: null }));

    try {
      const response = await authApi.register({
        email: data.email,
        password: data.password,
        name: data.name,
        nameAr: data.nameAr,
        role: data.role,
      });

      if (response.success && response.user) {
        const user = response.user;

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
          isOnline: navigator.onLine,
          authError: null,
        });

        return true;
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        authError: response.error || 'Registration failed',
      }));
      return false;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        authError: error instanceof Error ? error.message : 'Registration failed',
      }));
      return false;
    }
  }, []);

  const updateProfile = useCallback(async (data: Partial<User>) => {
    setState(prev => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...data } : null,
    }));

    // Sync to API if online
    if (state.isOnline && state.isAuthenticated) {
      try {
        await authApi.updateProfile({
          name: data.name,
          nameAr: data.nameAr,
          avatar: data.avatar,
        });
      } catch {
        // Data is saved locally, will sync later
      }
    }
  }, [state.isOnline, state.isAuthenticated]);

  const updateClinicalProgress = useCallback((data: Partial<ClinicalProgress>) => {
    setState(prev => ({
      ...prev,
      clinicalProgress: prev.clinicalProgress
        ? { ...prev.clinicalProgress, ...data, lastActivityDate: Date.now() }
        : null,
    }));
  }, []);

  const refreshUser = useCallback(async () => {
    if (!state.isAuthenticated) return;

    try {
      const user = await authApi.getCurrentUser();
      if (user) {
        setState(prev => ({ ...prev, user }));
      }
    } catch {
      // Silently fail - use cached user
    }
  }, [state.isAuthenticated]);

  const clearAuthError = useCallback(() => {
    setState(prev => ({ ...prev, authError: null }));
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
      refreshUser,
      clearAuthError,
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
      refreshUser,
      clearAuthError,
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

export function useAuthError(): string | null {
  const { authError } = useUser();
  return authError;
}
