import { useEffect, useMemo, useState } from 'react';
import type { LabModuleMetrics } from '../types/moduleMetrics';
import { getSessionsOrDemo, getAllSessions } from '../utils/sessionStorage';
import { mapApiSessionsToLabMetrics } from '../utils/apiSessions';
import { sessionsApi, getToken } from '../services/api';
import { useUser } from '../context/UserContext';

export type SessionMetricsSource = 'api' | 'local' | 'demo' | 'none';

type SessionMetricsState = {
  sessions: LabModuleMetrics[];
  source: SessionMetricsSource;
  isLoading: boolean;
  error: string | null;
};

type SessionMetricsOptions = {
  allowDemo?: boolean;
  limit?: number;
};

const getLocalFallback = (allowDemo: boolean): { sessions: LabModuleMetrics[]; source: SessionMetricsSource } => {
  const localSessions = getAllSessions();
  if (localSessions.length > 0) {
    return { sessions: localSessions, source: 'local' };
  }
  if (allowDemo) {
    const demoSessions = getSessionsOrDemo(true);
    return { sessions: demoSessions, source: demoSessions.length ? 'demo' : 'none' };
  }
  return { sessions: [], source: 'none' };
};

export const useSessionMetrics = (options: SessionMetricsOptions = {}): SessionMetricsState => {
  const { isAuthenticated, isOnline, user } = useUser();
  const allowDemo = options.allowDemo ?? false;
  const limit = options.limit ?? 200;

  const fallback = useMemo(() => getLocalFallback(allowDemo), [allowDemo, user?.id]);
  const [state, setState] = useState<SessionMetricsState>({
    sessions: fallback.sessions,
    source: fallback.source,
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    const token = getToken();

    const refreshFallback = () => {
      const fresh = getLocalFallback(allowDemo);
      if (cancelled) return;
      setState((prev) => ({
        sessions: fresh.sessions,
        source: fresh.source,
        isLoading: false,
        error: prev.error,
      }));
    };

    if (!token || !isAuthenticated || !isOnline) {
      refreshFallback();
      return () => {
        cancelled = true;
      };
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    sessionsApi.getSessions(limit, 0)
      .then((response) => {
        if (cancelled) return;
        if (response.success && Array.isArray(response.sessions)) {
          const apiSessions = mapApiSessionsToLabMetrics(response.sessions);
          if (apiSessions.length > 0) {
            setState({
              sessions: apiSessions,
              source: 'api',
              isLoading: false,
              error: null,
            });
            return;
          }
        }
        refreshFallback();
      })
      .catch((error) => {
        if (cancelled) return;
        setState((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Failed to load sessions',
        }));
        refreshFallback();
      });

    return () => {
      cancelled = true;
    };
  }, [allowDemo, isAuthenticated, isOnline, limit, user?.id]);

  return state;
};
