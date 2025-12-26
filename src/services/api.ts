/**
 * API Client Service - Handles all backend API communication
 * Provides localStorage fallback for offline support
 */

import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  RefreshTokenResponse,
  ApiUser,
  UpdateProfileRequest,
  UpdateProfileResponse,
  ClinicalProgress,
  UpdateClinicalProgressRequest,
  ClinicalProgressResponse,
  GamificationState,
  UpdateGamificationRequest,
  GamificationResponse,
  UserSettings,
  UpdateSettingsRequest,
  SettingsResponse,
  AssessmentSession,
  SaveSessionRequest,
  SessionResponse,
  SessionsListResponse,
  SessionAnalysisResponse,
  ParentChildrenAnalysisResponse,
  ClinicianPatientsAnalysisResponse,
  SchoolSessionsAnalysisResponse,
  SyncRequest,
  SyncResponse,
} from '../types/api';
import type { OfflineQueueItem } from '../utils/offlineQueue';
import { addOfflineQueueItems, getOfflineQueueItems, replaceOfflineQueueItemsForUser } from '../utils/offlineQueue';
import { getStoredUserId, getUserScopedKey } from '../utils/userStorage';

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const TOKEN_KEY = 'lotus_auth_token';
const REFRESH_TOKEN_KEY = 'lotus_refresh_token';
const OFFLINE_QUEUE_KEY = 'lotus_offline_queue';
const OFFLINE_SYNC_TAG = 'sync-data';

const getOfflineQueueKey = (userId?: string | null): string => {
  return getUserScopedKey(OFFLINE_QUEUE_KEY, userId ?? getStoredUserId());
};

const scheduleBackgroundSync = async (): Promise<void> => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
  try {
    const registration = await navigator.serviceWorker.ready;
    const syncManager = (registration as ServiceWorkerRegistration & {
      sync?: { register: (tag: string) => Promise<void> };
    }).sync;
    if (syncManager) {
      await syncManager.register(OFFLINE_SYNC_TAG);
    }
  } catch {
    // Ignore sync registration failures (fallback to online listeners).
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// TOKEN MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const setRefreshToken = (token: string): void => {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

export const clearTokens = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

// ═══════════════════════════════════════════════════════════════════════════
// OFFLINE QUEUE MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════

interface QueuedRequest {
  id: string;
  endpoint: string;
  method: string;
  body?: unknown;
  timestamp: number;
  baseUrl?: string;
  token?: string | null;
  userId?: string | null;
  skipAuth?: boolean;
}

const migrateLegacyOfflineQueue = async (userId: string | null): Promise<void> => {
  if (typeof indexedDB === 'undefined' || typeof window === 'undefined') return;
  const legacyKey = getOfflineQueueKey(userId);
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(legacyKey);
  } catch {
    return;
  }
  if (!raw) return;

  let legacy: QueuedRequest[] = [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      legacy = parsed as QueuedRequest[];
    }
  } catch {
    // Ignore parse errors.
  }

  if (legacy.length === 0) {
    localStorage.removeItem(legacyKey);
    return;
  }

  const token = getToken();
  const migrated: OfflineQueueItem[] = legacy
    .filter((entry) => entry && typeof entry.endpoint === 'string' && typeof entry.method === 'string')
    .map((entry) => ({
      id: entry.id || `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      endpoint: entry.endpoint,
      method: entry.method,
      body: entry.body,
      timestamp: typeof entry.timestamp === 'number' ? entry.timestamp : Date.now(),
      baseUrl: entry.baseUrl || API_BASE_URL,
      token: entry.token ?? token ?? null,
      userId: entry.userId ?? userId,
      skipAuth: Boolean(entry.skipAuth),
    }));

  await addOfflineQueueItems(migrated);
  localStorage.removeItem(legacyKey);
};

const getOfflineQueue = async (): Promise<OfflineQueueItem[]> => {
  const userId = getStoredUserId();
  if (!userId) return [];
  await migrateLegacyOfflineQueue(userId);
  return getOfflineQueueItems(userId);
};

const addToOfflineQueue = (request: Omit<QueuedRequest, 'id' | 'timestamp'>): void => {
  const userId = getStoredUserId();
  const token = getToken();
  const queued: OfflineQueueItem = {
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    endpoint: request.endpoint,
    method: request.method,
    body: request.body,
    timestamp: Date.now(),
    baseUrl: request.baseUrl || API_BASE_URL,
    token: request.token ?? token ?? null,
    userId: request.userId ?? userId,
    skipAuth: Boolean(request.skipAuth),
  };
  void addOfflineQueueItems([queued]);
  void scheduleBackgroundSync();
};

const clearOfflineQueue = async (): Promise<void> => {
  const userId = getStoredUserId();
  if (!userId) return;
  await replaceOfflineQueueItemsForUser(userId, []);
};

export const processOfflineQueue = async (): Promise<void> => {
  const userId = getStoredUserId();
  if (!userId) return;

  const queue = await getOfflineQueue();
  if (queue.length === 0) return;

  const failedRequests: OfflineQueueItem[] = [];

  for (const request of queue) {
    try {
      await fetchWithAuth(request.endpoint, {
        method: request.method,
        body: request.body ? JSON.stringify(request.body) : undefined,
        skipAuth: request.skipAuth,
        skipQueue: true,
        baseUrl: request.baseUrl,
      });
    } catch {
      // Keep failed requests for retry
      failedRequests.push(request);
    }
  }

  if (failedRequests.length > 0) {
    await replaceOfflineQueueItemsForUser(userId, failedRequests);
  } else {
    await clearOfflineQueue();
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// HTTP CLIENT
// ═══════════════════════════════════════════════════════════════════════════

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
  retryCount?: number;
  skipQueue?: boolean;
  baseUrl?: string;
}

const fetchWithAuth = async <T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> => {
  const { skipAuth = false, retryCount = 0, skipQueue = false, baseUrl, ...fetchOptions } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  if (!skipAuth) {
    const token = getToken();
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
  }

  const url = `${baseUrl || API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    // Handle token refresh on 401
    if (response.status === 401 && !skipAuth && retryCount < 1) {
      const refreshed = await refreshAuthToken();
      if (refreshed) {
        return fetchWithAuth<T>(endpoint, { ...options, retryCount: retryCount + 1 });
      }
      throw new Error('Authentication failed');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return response.json();
  } catch (error) {
    // If offline, queue the request for later
    if (!skipQueue && !navigator.onLine && options.method && options.method !== 'GET') {
      addToOfflineQueue({
        endpoint,
        method: options.method,
        body: options.body ? JSON.parse(options.body as string) : undefined,
        baseUrl,
        skipAuth,
      });
    }
    throw error;
  }
};

const refreshAuthToken = async (): Promise<boolean> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const response = await fetchWithAuth<RefreshTokenResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
      skipAuth: true,
    });

    if (response.success && response.token) {
      setToken(response.token);
      return true;
    }
    return false;
  } catch {
    clearTokens();
    return false;
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// AUTH API
// ═══════════════════════════════════════════════════════════════════════════

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await fetchWithAuth<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
      skipAuth: true,
    });

    if (response.success && response.token) {
      setToken(response.token);
      if (response.refreshToken) {
        setRefreshToken(response.refreshToken);
      }
    }

    return response;
  },

  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await fetchWithAuth<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
      skipAuth: true,
    });

    if (response.success && response.token) {
      setToken(response.token);
    }

    return response;
  },

  logout: async (): Promise<void> => {
    try {
      await fetchWithAuth('/auth/logout', { method: 'POST' });
    } finally {
      clearTokens();
    }
  },

  getCurrentUser: async (): Promise<ApiUser | null> => {
    try {
      const response = await fetchWithAuth<{ success: boolean; user: ApiUser }>('/auth/me');
      return response.success ? response.user : null;
    } catch {
      return null;
    }
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<UpdateProfileResponse> => {
    return fetchWithAuth<UpdateProfileResponse>('/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  deleteAccount: async (): Promise<{ success: boolean }> => {
    const response = await fetchWithAuth<{ success: boolean }>('/auth/account', {
      method: 'DELETE',
    });
    if (response.success) {
      clearTokens();
    }
    return response;
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// CLINICAL PROGRESS API
// ═══════════════════════════════════════════════════════════════════════════

export const clinicalApi = {
  getProgress: async (): Promise<ClinicalProgressResponse> => {
    return fetchWithAuth<ClinicalProgressResponse>('/clinical/progress');
  },

  updateProgress: async (data: UpdateClinicalProgressRequest): Promise<ClinicalProgressResponse> => {
    return fetchWithAuth<ClinicalProgressResponse>('/clinical/progress', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  completeSession: async (): Promise<ClinicalProgressResponse> => {
    return fetchWithAuth<ClinicalProgressResponse>('/clinical/session/complete', {
      method: 'POST',
    });
  },

  getProgressHistory: async (
    startDate?: number,
    endDate?: number
  ): Promise<{ success: boolean; history: ClinicalProgress[] }> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate.toString());
    if (endDate) params.append('endDate', endDate.toString());
    return fetchWithAuth(`/clinical/history?${params.toString()}`);
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// GAMIFICATION API
// ═══════════════════════════════════════════════════════════════════════════

export const gamificationApi = {
  getState: async (): Promise<GamificationResponse> => {
    return fetchWithAuth<GamificationResponse>('/gamification/state');
  },

  updateState: async (data: UpdateGamificationRequest): Promise<GamificationResponse> => {
    return fetchWithAuth<GamificationResponse>('/gamification/state', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  unlockAchievement: async (achievementId: string): Promise<GamificationResponse> => {
    return fetchWithAuth<GamificationResponse>(`/gamification/achievements/${achievementId}/unlock`, {
      method: 'POST',
    });
  },

  getLeaderboard: async (
    type: 'global' | 'clinic' | 'school' = 'global'
  ): Promise<{ success: boolean; leaderboard: Array<{ userId: string; name: string; points: number; rank: number }> }> => {
    return fetchWithAuth(`/gamification/leaderboard?type=${type}`);
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// SETTINGS API
// ═══════════════════════════════════════════════════════════════════════════

export const settingsApi = {
  getSettings: async (): Promise<SettingsResponse> => {
    return fetchWithAuth<SettingsResponse>('/settings');
  },

  updateSettings: async (data: UpdateSettingsRequest): Promise<SettingsResponse> => {
    return fetchWithAuth<SettingsResponse>('/settings', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// ASSESSMENT SESSIONS API
// ═══════════════════════════════════════════════════════════════════════════

export const sessionsApi = {
  saveSession: async (data: SaveSessionRequest): Promise<SessionResponse> => {
    return fetchWithAuth<SessionResponse>('/sessions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getSessions: async (limit = 50, offset = 0): Promise<SessionsListResponse> => {
    return fetchWithAuth<SessionsListResponse>(`/sessions?limit=${limit}&offset=${offset}`);
  },

  getSession: async (sessionId: string): Promise<SessionResponse> => {
    return fetchWithAuth<SessionResponse>(`/sessions/${sessionId}`);
  },

  deleteSession: async (sessionId: string): Promise<{ success: boolean }> => {
    return fetchWithAuth(`/sessions/${sessionId}`, {
      method: 'DELETE',
    });
  },

  getChildrenAnalysis: async (): Promise<ParentChildrenAnalysisResponse> => {
    return fetchWithAuth<ParentChildrenAnalysisResponse>('/sessions/analysis/children');
  },

  getPatientsAnalysis: async (school?: string): Promise<ClinicianPatientsAnalysisResponse> => {
    const params = new URLSearchParams();
    if (school) params.set('school', school);
    const query = params.toString();
    const endpoint = query ? `/sessions/analysis/patients?${query}` : '/sessions/analysis/patients';
    return fetchWithAuth<ClinicianPatientsAnalysisResponse>(endpoint);
  },

  getProgressAnalysis: async (testKey?: string): Promise<SessionAnalysisResponse> => {
    const params = new URLSearchParams();
    if (testKey) params.set('testKey', testKey);
    const query = params.toString();
    const endpoint = query ? `/sessions/analysis/progress?${query}` : '/sessions/analysis/progress';
    return fetchWithAuth<SessionAnalysisResponse>(endpoint);
  },

  getPatientProgressAnalysis: async (patientId: string, testKey?: string): Promise<SessionAnalysisResponse> => {
    const params = new URLSearchParams();
    params.set('patientId', patientId);
    if (testKey) params.set('testKey', testKey);
    const endpoint = `/sessions/analysis/patient?${params.toString()}`;
    return fetchWithAuth<SessionAnalysisResponse>(endpoint);
  },

  getSchoolAnalysis: async (school?: string): Promise<SchoolSessionsAnalysisResponse> => {
    const params = new URLSearchParams();
    if (school) params.set('school', school);
    const query = params.toString();
    const endpoint = query ? `/sessions/analysis/school?${query}` : '/sessions/analysis/school';
    return fetchWithAuth<SchoolSessionsAnalysisResponse>(endpoint);
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// SYNC API
// ═══════════════════════════════════════════════════════════════════════════

export const syncApi = {
  sync: async (data: SyncRequest): Promise<SyncResponse> => {
    return fetchWithAuth<SyncResponse>('/sync', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getLastSyncTime: async (): Promise<{ success: boolean; lastSyncAt: number }> => {
    return fetchWithAuth('/sync/last');
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// CONNECTION STATUS
// ═══════════════════════════════════════════════════════════════════════════

export const isOnline = (): boolean => navigator.onLine;

export const onConnectionChange = (callback: (online: boolean) => void): (() => void) => {
  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
};

// ═══════════════════════════════════════════════════════════════════════════
// HEALTH CHECK
// ═══════════════════════════════════════════════════════════════════════════

export const healthCheck = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.ok;
  } catch {
    return false;
  }
};
