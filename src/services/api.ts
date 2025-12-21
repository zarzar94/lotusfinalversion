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
  SyncRequest,
  SyncResponse,
} from '../types/api';

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const TOKEN_KEY = 'lotus_auth_token';
const REFRESH_TOKEN_KEY = 'lotus_refresh_token';
const OFFLINE_QUEUE_KEY = 'lotus_offline_queue';

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
}

const getOfflineQueue = (): QueuedRequest[] => {
  try {
    const queue = localStorage.getItem(OFFLINE_QUEUE_KEY);
    return queue ? JSON.parse(queue) : [];
  } catch {
    return [];
  }
};

const addToOfflineQueue = (request: Omit<QueuedRequest, 'id' | 'timestamp'>): void => {
  const queue = getOfflineQueue();
  queue.push({
    ...request,
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    timestamp: Date.now(),
  });
  localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
};

const clearOfflineQueue = (): void => {
  localStorage.removeItem(OFFLINE_QUEUE_KEY);
};

export const processOfflineQueue = async (): Promise<void> => {
  const queue = getOfflineQueue();
  if (queue.length === 0) return;

  const failedRequests: QueuedRequest[] = [];

  for (const request of queue) {
    try {
      await fetchWithAuth(request.endpoint, {
        method: request.method,
        body: request.body ? JSON.stringify(request.body) : undefined,
      });
    } catch {
      // Keep failed requests for retry
      failedRequests.push(request);
    }
  }

  if (failedRequests.length > 0) {
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(failedRequests));
  } else {
    clearOfflineQueue();
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// HTTP CLIENT
// ═══════════════════════════════════════════════════════════════════════════

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
  retryCount?: number;
}

const fetchWithAuth = async <T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> => {
  const { skipAuth = false, retryCount = 0, ...fetchOptions } = options;

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

  const url = `${API_BASE_URL}${endpoint}`;

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
    if (!navigator.onLine && options.method && options.method !== 'GET') {
      addToOfflineQueue({
        endpoint,
        method: options.method,
        body: options.body ? JSON.parse(options.body as string) : undefined,
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
