/**
 * SyncContext - Cross-device synchronization provider
 * Handles syncing data between localStorage and backend API
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import {
  syncApi,
  healthCheck,
  isOnline,
  onConnectionChange,
  processOfflineQueue,
  getToken,
} from '../services/api';
import { getStoredUserId, getUserScopedKey } from '../utils/userStorage';
import { LOCAL_CHANGE_EVENT } from '../utils/sync';
import { LANGUAGE_STORAGE_KEY, LANGUAGE_UPDATED_AT_KEY } from '../utils/language';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error' | 'offline';

interface SyncState {
  status: SyncStatus;
  lastSyncAt: number | null;
  isOnline: boolean;
  isApiAvailable: boolean;
  pendingChanges: number;
  error: string | null;
}

interface SyncContextType extends SyncState {
  sync: () => Promise<void>;
  markPendingChange: () => void;
  clearPendingChanges: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// STORAGE KEYS
// ═══════════════════════════════════════════════════════════════════════════

const LAST_SYNC_KEY = 'lotus_last_sync';
const PENDING_CHANGES_KEY = 'lotus_pending_changes';
const VISITOR_MODE_STORAGE_KEY = 'lotus_visitor_mode';
const VISITOR_MODE_UPDATED_AT_KEY = 'lotus_visitor_mode_updated_at';

const toNumber = (value: unknown): number | null => {
  if (value === null || value === undefined) return null;
  if (typeof value === 'string' && value.trim() === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

// ═══════════════════════════════════════════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════════════════════════════════════════

const SyncContext = createContext<SyncContextType | null>(null);

export function SyncProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SyncState>(() => ({
    status: 'idle',
    lastSyncAt: (() => {
      try {
        const saved = localStorage.getItem(LAST_SYNC_KEY);
        return saved ? parseInt(saved, 10) : null;
      } catch {
        return null;
      }
    })(),
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    isApiAvailable: false,
    pendingChanges: (() => {
      try {
        const saved = localStorage.getItem(PENDING_CHANGES_KEY);
        return saved ? parseInt(saved, 10) : 0;
      } catch {
        return 0;
      }
    })(),
    error: null,
  }));
  const localChangeTimeoutRef = useRef<number | null>(null);
  const syncInFlightRef = useRef<Promise<void> | null>(null);

  // Check API availability
  const checkApiAvailability = useCallback(async () => {
    const available = await healthCheck();
    setState(prev => ({ ...prev, isApiAvailable: available }));
    return available;
  }, []);

  // Handle connection changes
  useEffect(() => {
    const cleanup = onConnectionChange((online) => {
      setState(prev => ({ ...prev, isOnline: online }));

      if (online) {
        // Process offline queue when coming back online
        processOfflineQueue();
        checkApiAvailability();
      }
    });

    // Initial API check
    checkApiAvailability();

    return cleanup;
  }, [checkApiAvailability]);

  // Mark a pending change
  const markPendingChange = useCallback(() => {
    setState(prev => {
      const newCount = prev.pendingChanges + 1;
      try {
        localStorage.setItem(PENDING_CHANGES_KEY, newCount.toString());
      } catch {
        // Ignore storage errors
      }
      return { ...prev, pendingChanges: newCount };
    });
  }, []);

  // Clear pending changes
  const clearPendingChanges = useCallback(() => {
    setState(prev => ({ ...prev, pendingChanges: 0 }));
    try {
      localStorage.removeItem(PENDING_CHANGES_KEY);
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Sync function
  const sync = useCallback(() => {
    if (syncInFlightRef.current) {
      return syncInFlightRef.current;
    }

    const run = (async () => {
      // Skip if not authenticated
      if (!getToken()) {
        return;
      }

      const userId = getStoredUserId();
      if (!userId) {
        return;
      }

      const clinicalKey = getUserScopedKey('lotus_clinical_progress', userId);
      const gamificationKey = getUserScopedKey('lotus_gamification_state', userId);
      const sessionsKey = getUserScopedKey('berard-ait-sessions', userId);
      const settingsKey = getUserScopedKey('lotus_user_settings', userId);

      // Skip if offline
      if (!state.isOnline) {
        setState(prev => ({ ...prev, status: 'offline' }));
        return;
      }

      setState(prev => ({ ...prev, status: 'syncing', error: null }));

      try {
        // Gather local data
        const localData: Record<string, unknown> = {};

        // Clinical progress
        try {
          const clinicalRaw = localStorage.getItem(clinicalKey);
          if (clinicalRaw) {
            localData.clinicalProgress = JSON.parse(clinicalRaw);
          }
        } catch {
          // Ignore parse errors
        }

        // Gamification state
        try {
          const gamificationRaw = localStorage.getItem(gamificationKey);
          if (gamificationRaw) {
            localData.gamification = JSON.parse(gamificationRaw);
          }
        } catch {
          // Ignore parse errors
        }

        // Settings
        try {
          const settingsRaw = localStorage.getItem(settingsKey);
          const language = localStorage.getItem(LANGUAGE_STORAGE_KEY);
          const visitorMode = localStorage.getItem(VISITOR_MODE_STORAGE_KEY);
          const languageUpdatedAt = toNumber(localStorage.getItem(LANGUAGE_UPDATED_AT_KEY));
          const visitorUpdatedAt = toNumber(localStorage.getItem(VISITOR_MODE_UPDATED_AT_KEY));

          let storedSettings: Record<string, unknown> = {};
          let settingsUpdatedAt: number | null = null;
          if (settingsRaw) {
            const parsed = JSON.parse(settingsRaw);
            if (parsed && typeof parsed === 'object') {
              const { updatedAt, userId, ...rest } = parsed as Record<string, unknown>;
              storedSettings = rest;
              settingsUpdatedAt = toNumber(updatedAt);
            }
          }

          const updatedAtCandidates = [settingsUpdatedAt, languageUpdatedAt, visitorUpdatedAt]
            .filter((value): value is number => value !== null);
          const combinedUpdatedAt = updatedAtCandidates.length > 0
            ? Math.max(...updatedAtCandidates)
            : null;

          localData.settings = {
            ...storedSettings,
            language: language || 'ar',
            visitorMode: visitorMode || 'parent',
            ...(combinedUpdatedAt !== null ? { updatedAt: combinedUpdatedAt } : {}),
          };
        } catch {
          // Ignore parse errors
        }

        // Sessions
        try {
          const sessionsRaw = localStorage.getItem(sessionsKey);
          if (sessionsRaw) {
            localData.sessions = JSON.parse(sessionsRaw);
          }
        } catch {
          // Ignore parse errors
        }

        // Perform sync
        const response = await syncApi.sync({
          lastSyncAt: state.lastSyncAt || 0,
          localData,
        });

        if (response.success) {
          // Update local storage with server data
          if (response.serverData.clinicalProgress) {
            localStorage.setItem(
              clinicalKey,
              JSON.stringify(response.serverData.clinicalProgress)
            );
          }

          if (response.serverData.gamification) {
            localStorage.setItem(
              gamificationKey,
              JSON.stringify(response.serverData.gamification)
            );
          }

          if (response.serverData.settings) {
            const {
              language,
              visitorMode,
              updatedAt,
              ...otherSettings
            } = response.serverData.settings;
            localStorage.setItem(settingsKey, JSON.stringify({ ...otherSettings, updatedAt }));
            if (language) localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
            if (visitorMode) localStorage.setItem(VISITOR_MODE_STORAGE_KEY, visitorMode);
            if (typeof updatedAt === 'number') {
              localStorage.setItem(LANGUAGE_UPDATED_AT_KEY, updatedAt.toString());
              localStorage.setItem(VISITOR_MODE_UPDATED_AT_KEY, updatedAt.toString());
            }
          }

          if (response.serverData.sessions) {
            localStorage.setItem(
              sessionsKey,
              JSON.stringify(response.serverData.sessions)
            );
          }

          // Update sync state
          const syncTime = response.syncedAt;
          localStorage.setItem(LAST_SYNC_KEY, syncTime.toString());

          setState(prev => ({
            ...prev,
            status: 'synced',
            lastSyncAt: syncTime,
            pendingChanges: 0,
          }));

          clearPendingChanges();

          // Dispatch event for contexts to reload
          window.dispatchEvent(new CustomEvent('lotus-data-synced', {
            detail: response.serverData,
          }));
        } else {
          throw new Error(response.error || 'Sync failed');
        }
      } catch (error) {
        console.error('Sync error:', error);
        setState(prev => ({
          ...prev,
          status: 'error',
          error: error instanceof Error ? error.message : 'Sync failed',
        }));
      }
    })();

    syncInFlightRef.current = run;
    return run.finally(() => {
      syncInFlightRef.current = null;
    });
  }, [state.isOnline, state.lastSyncAt, clearPendingChanges]);

  // Track local changes and schedule syncs.
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const handleLocalChange = () => {
      markPendingChange();
      if (!getToken() || !state.isOnline) return;

      if (localChangeTimeoutRef.current !== null) {
        window.clearTimeout(localChangeTimeoutRef.current);
      }
      localChangeTimeoutRef.current = window.setTimeout(() => {
        sync();
      }, 1500);
    };

    window.addEventListener(LOCAL_CHANGE_EVENT, handleLocalChange);

    return () => {
      window.removeEventListener(LOCAL_CHANGE_EVENT, handleLocalChange);
      if (localChangeTimeoutRef.current !== null) {
        window.clearTimeout(localChangeTimeoutRef.current);
        localChangeTimeoutRef.current = null;
      }
    };
  }, [markPendingChange, state.isOnline, sync]);

  // Auto-sync on mount and periodically
  useEffect(() => {
    // Initial sync after a short delay
    const initialTimeout = setTimeout(() => {
      if (getToken()) {
        sync();
      }
    }, 2000);

    // Periodic sync every 5 minutes
    const interval = setInterval(() => {
      if (!getToken()) return;
      if (state.pendingChanges > 0 || !state.lastSyncAt) {
        sync();
      }
    }, 5 * 60 * 1000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [sync, state.pendingChanges, state.lastSyncAt]);

  // Sync before page unload if there are pending changes
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (state.pendingChanges > 0 && state.isOnline && getToken()) {
        const userId = getStoredUserId();
        if (!userId) return;
        const clinicalKey = getUserScopedKey('lotus_clinical_progress', userId);
        const gamificationKey = getUserScopedKey('lotus_gamification_state', userId);

        // Use sendBeacon for reliable sync on page close
        const localData = {
          clinicalProgress: localStorage.getItem(clinicalKey),
          gamification: localStorage.getItem(gamificationKey),
        };

        navigator.sendBeacon?.(
          `${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/sync/beacon`,
          JSON.stringify({
            token: getToken(),
            lastSyncAt: state.lastSyncAt || 0,
            localData,
          })
        );
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [state.pendingChanges, state.isOnline, state.lastSyncAt]);

  const value = useMemo<SyncContextType>(() => ({
    ...state,
    sync,
    markPendingChange,
    clearPendingChanges,
  }), [state, sync, markPendingChange, clearPendingChanges]);

  return (
    <SyncContext.Provider value={value}>
      {children}
    </SyncContext.Provider>
  );
}

export function useSync() {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSync must be used within a SyncProvider');
  }
  return context;
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY HOOKS
// ═══════════════════════════════════════════════════════════════════════════

export function useSyncStatus() {
  const { status, isOnline, isApiAvailable } = useSync();
  return { status, isOnline, isApiAvailable };
}

export function useIsSyncing() {
  const { status } = useSync();
  return status === 'syncing';
}

export function useIsOffline() {
  const { isOnline } = useSync();
  return !isOnline;
}
