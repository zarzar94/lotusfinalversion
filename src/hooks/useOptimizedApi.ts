/**
 * Optimized API Hooks - Deduplication, caching, and request batching
 */

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// REQUEST DEDUPLICATION
// ═══════════════════════════════════════════════════════════════════════════

type PendingRequest = {
  promise: Promise<unknown>;
  timestamp: number;
};

const pendingRequests = new Map<string, PendingRequest>();
const REQUEST_DEDUP_WINDOW = 100; // ms

/**
 * Deduplicate identical requests within a time window
 */
export function dedupeRequest<T>(
  key: string,
  requestFn: () => Promise<T>
): Promise<T> {
  const existing = pendingRequests.get(key);
  const now = Date.now();

  if (existing && now - existing.timestamp < REQUEST_DEDUP_WINDOW) {
    return existing.promise as Promise<T>;
  }

  const promise = requestFn().finally(() => {
    // Clean up after request completes
    setTimeout(() => pendingRequests.delete(key), REQUEST_DEDUP_WINDOW);
  });

  pendingRequests.set(key, { promise, timestamp: now });
  return promise;
}

// ═══════════════════════════════════════════════════════════════════════════
// CLIENT-SIDE CACHE
// ═══════════════════════════════════════════════════════════════════════════

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

const apiCache = new Map<string, CacheEntry<unknown>>();

export function getCached<T>(key: string): T | null {
  const entry = apiCache.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;

  if (Date.now() > entry.timestamp + entry.ttl) {
    apiCache.delete(key);
    return null;
  }

  return entry.data;
}

export function setCache<T>(key: string, data: T, ttl = 60000): void {
  apiCache.set(key, { data, timestamp: Date.now(), ttl });
}

export function invalidateCache(pattern?: string): void {
  if (!pattern) {
    apiCache.clear();
    return;
  }

  const regex = new RegExp(pattern);
  for (const key of apiCache.keys()) {
    if (regex.test(key)) {
      apiCache.delete(key);
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// OPTIMIZED FETCH HOOK
// ═══════════════════════════════════════════════════════════════════════════

interface UseFetchOptions<T> {
  cacheKey?: string;
  cacheTTL?: number;
  enabled?: boolean;
  dedupe?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  staleWhileRevalidate?: boolean;
}

interface UseFetchResult<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  isValidating: boolean;
  refetch: () => Promise<void>;
  mutate: (data: T | ((prev: T | null) => T)) => void;
}

export function useFetch<T>(
  fetchFn: () => Promise<T>,
  deps: unknown[] = [],
  options: UseFetchOptions<T> = {}
): UseFetchResult<T> {
  const {
    cacheKey,
    cacheTTL = 60000,
    enabled = true,
    dedupe = true,
    onSuccess,
    onError,
    staleWhileRevalidate = true,
  } = options;

  const [data, setData] = useState<T | null>(() =>
    cacheKey ? getCached<T>(cacheKey) : null
  );
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(!data && enabled);
  const [isValidating, setIsValidating] = useState(false);

  const mountedRef = useRef(true);
  const fetchCountRef = useRef(0);

  const doFetch = useCallback(async (isRefetch = false) => {
    if (!enabled) return;

    const fetchId = ++fetchCountRef.current;

    if (isRefetch || !data) {
      setIsValidating(true);
    }
    if (!data) {
      setIsLoading(true);
    }

    try {
      const result = dedupe && cacheKey
        ? await dedupeRequest(cacheKey, fetchFn)
        : await fetchFn();

      // Check if this is still the latest request
      if (!mountedRef.current || fetchId !== fetchCountRef.current) return;

      setData(result);
      setError(null);

      if (cacheKey) {
        setCache(cacheKey, result, cacheTTL);
      }

      onSuccess?.(result);
    } catch (err) {
      if (!mountedRef.current || fetchId !== fetchCountRef.current) return;

      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
    } finally {
      if (mountedRef.current && fetchId === fetchCountRef.current) {
        setIsLoading(false);
        setIsValidating(false);
      }
    }
  }, [enabled, data, dedupe, cacheKey, fetchFn, cacheTTL, onSuccess, onError]);

  // Initial fetch
  useEffect(() => {
    mountedRef.current = true;

    // If we have stale data, show it immediately and revalidate
    if (staleWhileRevalidate && data) {
      doFetch(true);
    } else if (!data) {
      doFetch();
    }

    return () => {
      mountedRef.current = false;
    };
  }, [...deps, enabled]);

  const refetch = useCallback(async () => {
    await doFetch(true);
  }, [doFetch]);

  const mutate = useCallback((updater: T | ((prev: T | null) => T)) => {
    setData(prev =>
      typeof updater === 'function'
        ? (updater as (prev: T | null) => T)(prev)
        : updater
    );

    if (cacheKey) {
      const newData = typeof updater === 'function'
        ? (updater as (prev: T | null) => T)(data)
        : updater;
      if (newData) setCache(cacheKey, newData, cacheTTL);
    }
  }, [cacheKey, cacheTTL, data]);

  return { data, error, isLoading, isValidating, refetch, mutate };
}

// ═══════════════════════════════════════════════════════════════════════════
// DEBOUNCED MUTATION HOOK
// ═══════════════════════════════════════════════════════════════════════════

interface UseMutationOptions<T, V> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  debounce?: number;
  invalidateKeys?: string[];
}

interface UseMutationResult<T, V> {
  mutate: (variables: V) => Promise<T | null>;
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  reset: () => void;
}

export function useMutation<T, V = void>(
  mutationFn: (variables: V) => Promise<T>,
  options: UseMutationOptions<T, V> = {}
): UseMutationResult<T, V> {
  const { onSuccess, onError, debounce = 0, invalidateKeys } = options;

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const timeoutRef = useRef<number | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const mutate = useCallback(async (variables: V): Promise<T | null> => {
    // Clear any pending debounced call
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    return new Promise((resolve) => {
      const execute = async () => {
        setIsLoading(true);
        setError(null);

        try {
          const result = await mutationFn(variables);

          if (!mountedRef.current) {
            resolve(null);
            return;
          }

          setData(result);
          onSuccess?.(result);

          // Invalidate related cache keys
          if (invalidateKeys) {
            invalidateKeys.forEach(key => invalidateCache(key));
          }

          resolve(result);
        } catch (err) {
          if (!mountedRef.current) {
            resolve(null);
            return;
          }

          const error = err instanceof Error ? err : new Error(String(err));
          setError(error);
          onError?.(error);
          resolve(null);
        } finally {
          if (mountedRef.current) {
            setIsLoading(false);
          }
        }
      };

      if (debounce > 0) {
        timeoutRef.current = window.setTimeout(execute, debounce);
      } else {
        execute();
      }
    });
  }, [mutationFn, onSuccess, onError, debounce, invalidateKeys]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return { mutate, data, error, isLoading, reset };
}

// ═══════════════════════════════════════════════════════════════════════════
// INFINITE SCROLL HOOK
// ═══════════════════════════════════════════════════════════════════════════

interface UseInfiniteOptions<T> {
  pageSize?: number;
  threshold?: number;
}

export function useInfiniteScroll<T>(
  fetchPage: (offset: number, limit: number) => Promise<{ items: T[]; total: number }>,
  options: UseInfiniteOptions<T> = {}
): {
  items: T[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  loadMore: () => void;
  reset: () => void;
} {
  const { pageSize = 20, threshold = 100 } = options;

  const [items, setItems] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const hasMore = items.length < total;
  const loadingRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;

    loadingRef.current = true;
    setIsLoadingMore(true);

    try {
      const result = await fetchPage(offset + pageSize, pageSize);
      setItems(prev => [...prev, ...result.items]);
      setTotal(result.total);
      setOffset(prev => prev + pageSize);
    } finally {
      setIsLoadingMore(false);
      loadingRef.current = false;
    }
  }, [fetchPage, offset, pageSize, hasMore]);

  const reset = useCallback(() => {
    setItems([]);
    setTotal(0);
    setOffset(0);
    setIsLoading(true);

    fetchPage(0, pageSize).then(result => {
      setItems(result.items);
      setTotal(result.total);
      setIsLoading(false);
    });
  }, [fetchPage, pageSize]);

  // Initial load
  useEffect(() => {
    reset();
  }, []);

  return { items, isLoading, isLoadingMore, hasMore, loadMore, reset };
}
