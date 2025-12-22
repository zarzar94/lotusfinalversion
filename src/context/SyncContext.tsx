/**
 * SyncContext - Cross-device synchronization provider
 * Handles syncing data between localStorage and backend API
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
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
import { LOCAL_CHANGE_EVENT } from '../utils/sync';

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

  // Track local changes from other parts of the app
  useEffect(() => {
    const handleLocalChange = () => markPendingChange();
    window.addEventListener(LOCAL_CHANGE_EVENT, handleLocalChange);
    window.addEventListener('lotus-settings-changed', handleLocalChange);
    return () => {
      window.removeEventListener(LOCAL_CHANGE_EVENT, handleLocalChange);
      window.removeEventListener('lotus-settings-changed', handleLocalChange);
    };
  }, [markPendingChange]);

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
  const sync = useCallback(async () => {
    // Skip if not authenticated
    if (!getToken()) {
      return;
    }

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
        const clinicalRaw = localStorage.getItem('lotus_clinical_progress');
        if (clinicalRaw) {
          localData.clinicalProgress = JSON.parse(clinicalRaw);
        }
      } catch {
        // Ignore parse errors
      }

      // Gamification state
      try {
        const gamificationRaw = localStorage.getItem('lotus_gamification_state');
        if (gamificationRaw) {
          localData.gamification = JSON.parse(gamificationRaw);
        }
      } catch {
        // Ignore parse errors
      }

      // Settings
      try {
        const settingsRaw = localStorage.getItem('lotus_user_settings');
        const language = localStorage.getItem('lotus_language');
        const visitorMode = localStorage.getItem('lotus_visitor_mode');

        localData.settings = {
          ...(settingsRaw ? JSON.parse(settingsRaw) : {}),
          language: language || 'ar',
          visitorMode: visitorMode || 'parent',
        };
      } catch {
        // Ignore parse errors
      }

      // Sessions
      try {
        const sessionsRaw = localStorage.getItem('berard-ait-sessions');
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
            'lotus_clinical_progress',
            JSON.stringify(response.serverData.clinicalProgress)
          );
        }

        if (response.serverData.gamification) {
          localStorage.setItem(
            'lotus_gamification_state',
            JSON.stringify(response.serverData.gamification)
          );
        }

        if (response.serverData.settings) {
          const { language, visitorMode, ...otherSettings } = response.serverData.settings;
          localStorage.setItem('lotus_user_settings', JSON.stringify(otherSettings));
          if (language) localStorage.setItem('lotus_language', language);
          if (visitorMode) localStorage.setItem('lotus_visitor_mode', visitorMode);
        }

        if (response.serverData.sessions) {
          localStorage.setItem(
            'berard-ait-sessions',
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
  }, [state.isOnline, state.lastSyncAt, clearPendingChanges]);

  // Auto-sync on mount and periodically
  useEffect(() => {
    if (!getToken()) return;

    // Initial sync after a short delay
    const initialTimeout = setTimeout(() => {
      sync();
    }, 2000);

    // Periodic sync every 5 minutes
    const interval = setInterval(() => {
      if (state.pendingChanges > 0 || !state.lastSyncAt) {
        sync();
      }
    }, 5 * 60 * 1000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [sync, state.pendingChanges, state.lastSyncAt]);

  // Debounced sync shortly after local changes
  useEffect(() => {
    if (!getToken()) return;
    if (!state.isOnline) return;
    if (state.pendingChanges <= 0) return;

    const timeout = window.setTimeout(() => {
      sync();
    }, 15000);

    return () => window.clearTimeout(timeout);
  }, [sync, state.pendingChanges, state.isOnline]);

  // Sync before page unload if there are pending changes
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (state.pendingChanges > 0 && state.isOnline && getToken()) {
        // Use sendBeacon for reliable sync on page close
        const localData = {
          clinicalProgress: localStorage.getItem('lotus_clinical_progress'),
          gamification: localStorage.getItem('lotus_gamification_state'),
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
