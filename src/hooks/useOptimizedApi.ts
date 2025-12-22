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
  // New: Retry options
  retry?: number | boolean;
  retryDelay?: number | ((attempt: number) => number);
  // New: Polling options
  pollingInterval?: number;
  pollingWhenHidden?: boolean;
  // New: Prefetch options
  prefetch?: boolean;
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
    retry = 0,
    retryDelay = (attempt) => Math.min(1000 * 2 ** attempt, 30000),
    pollingInterval,
    pollingWhenHidden = false,
  } = options;

  const [data, setData] = useState<T | null>(() =>
    cacheKey ? getCached<T>(cacheKey) : null
  );
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(!data && enabled);
  const [isValidating, setIsValidating] = useState(false);

  const mountedRef = useRef(true);
  const fetchCountRef = useRef(0);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Retry with exponential backoff
  const fetchWithRetry = useCallback(async (attempt = 0): Promise<T> => {
    try {
      return dedupe && cacheKey
        ? await dedupeRequest(cacheKey, fetchFn)
        : await fetchFn();
    } catch (err) {
      const maxRetries = typeof retry === 'boolean' ? (retry ? 3 : 0) : retry;
      if (attempt < maxRetries) {
        const delay = typeof retryDelay === 'function'
          ? retryDelay(attempt)
          : retryDelay;
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchWithRetry(attempt + 1);
      }
      throw err;
    }
  }, [dedupe, cacheKey, fetchFn, retry, retryDelay]);

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
      const result = await fetchWithRetry();

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
  }, [enabled, data, fetchWithRetry, cacheKey, cacheTTL, onSuccess, onError]);

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

  // Polling
  useEffect(() => {
    if (!pollingInterval || !enabled) return;

    const poll = () => {
      // Skip if tab is hidden and pollingWhenHidden is false
      if (!pollingWhenHidden && document.hidden) return;
      doFetch(true);
    };

    pollingRef.current = setInterval(poll, pollingInterval);

    // Handle visibility change
    const handleVisibility = () => {
      if (!document.hidden && !pollingWhenHidden) {
        doFetch(true);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [pollingInterval, pollingWhenHidden, enabled, doFetch]);

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

// ═══════════════════════════════════════════════════════════════════════════
// DEBOUNCE HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Debounce a value - delays updating until after wait period
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Debounced callback hook
 */
export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number,
  deps: unknown[] = []
): T & { cancel: () => void; flush: () => void } {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef(callback);
  const argsRef = useRef<Parameters<T> | null>(null);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    argsRef.current = null;
  }, []);

  const flush = useCallback(() => {
    if (timeoutRef.current && argsRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      callbackRef.current(...argsRef.current);
      argsRef.current = null;
    }
  }, []);

  const debouncedFn = useCallback((...args: Parameters<T>) => {
    argsRef.current = args;
    cancel();
    timeoutRef.current = setTimeout(() => {
      if (argsRef.current) {
        callbackRef.current(...argsRef.current);
        argsRef.current = null;
      }
    }, delay);
  }, [delay, cancel, ...deps]) as T & { cancel: () => void; flush: () => void };

  debouncedFn.cancel = cancel;
  debouncedFn.flush = flush;

  // Cleanup on unmount
  useEffect(() => cancel, [cancel]);

  return debouncedFn;
}

// ═══════════════════════════════════════════════════════════════════════════
// THROTTLE HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Throttle a value - limits updates to once per wait period
 */
export function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastRan = useRef(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));

    return () => clearTimeout(handler);
  }, [value, limit]);

  return throttledValue;
}

/**
 * Throttled callback hook
 */
export function useThrottledCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  limit: number,
  deps: unknown[] = []
): T {
  const lastRan = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback((...args: Parameters<T>) => {
    const now = Date.now();

    if (now - lastRan.current >= limit) {
      callbackRef.current(...args);
      lastRan.current = now;
    } else if (!timeoutRef.current) {
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
        lastRan.current = Date.now();
        timeoutRef.current = null;
      }, limit - (now - lastRan.current));
    }
  }, [limit, ...deps]) as T;
}

// ═══════════════════════════════════════════════════════════════════════════
// VIRTUAL LIST HOOK
// ═══════════════════════════════════════════════════════════════════════════

interface UseVirtualListOptions {
  itemHeight: number;
  overscan?: number;
  containerRef: React.RefObject<HTMLElement>;
}

interface VirtualItem<T> {
  index: number;
  item: T;
  style: React.CSSProperties;
}

export function useVirtualList<T>(
  items: T[],
  options: UseVirtualListOptions
): {
  virtualItems: VirtualItem<T>[];
  totalHeight: number;
  scrollTo: (index: number) => void;
} {
  const { itemHeight, overscan = 5, containerRef } = options;
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  // Calculate visible range
  const totalHeight = items.length * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  // Create virtual items
  const virtualItems = useMemo(() => {
    const result: VirtualItem<T>[] = [];
    for (let i = startIndex; i <= endIndex; i++) {
      result.push({
        index: i,
        item: items[i],
        style: {
          position: 'absolute',
          top: i * itemHeight,
          height: itemHeight,
          left: 0,
          right: 0,
        },
      });
    }
    return result;
  }, [items, startIndex, endIndex, itemHeight]);

  // Handle scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => setScrollTop(container.scrollTop);
    const handleResize = () => setContainerHeight(container.clientHeight);

    // Initial measurements
    handleResize();

    container.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [containerRef]);

  const scrollTo = useCallback((index: number) => {
    const container = containerRef.current;
    if (container) {
      container.scrollTop = index * itemHeight;
    }
  }, [containerRef, itemHeight]);

  return { virtualItems, totalHeight, scrollTo };
}

// ═══════════════════════════════════════════════════════════════════════════
// PREFETCH UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

const prefetchCache = new Map<string, Promise<unknown>>();

/**
 * Prefetch data and cache it for later use
 */
export function prefetch<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl = 60000
): Promise<T> {
  const existing = prefetchCache.get(key);
  if (existing) return existing as Promise<T>;

  const promise = fetchFn()
    .then(data => {
      setCache(key, data, ttl);
      return data;
    })
    .finally(() => {
      // Remove from prefetch cache after completion
      setTimeout(() => prefetchCache.delete(key), 100);
    });

  prefetchCache.set(key, promise);
  return promise;
}

/**
 * Preload component data on hover/focus
 */
export function usePrefetchOnHover<T>(
  cacheKey: string,
  fetchFn: () => Promise<T>,
  ttl = 60000
): {
  onMouseEnter: () => void;
  onFocus: () => void;
} {
  const prefetchedRef = useRef(false);

  const doPrefetch = useCallback(() => {
    if (prefetchedRef.current) return;
    if (getCached(cacheKey)) return;

    prefetchedRef.current = true;
    prefetch(cacheKey, fetchFn, ttl);
  }, [cacheKey, fetchFn, ttl]);

  return {
    onMouseEnter: doPrefetch,
    onFocus: doPrefetch,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// PERFORMANCE MONITORING HOOK
// ═══════════════════════════════════════════════════════════════════════════

interface PerformanceMetrics {
  renderCount: number;
  lastRenderTime: number;
  averageRenderTime: number;
}

export function usePerformanceMonitor(componentName: string): PerformanceMetrics {
  const renderCount = useRef(0);
  const renderTimes = useRef<number[]>([]);
  const startTime = useRef(0);

  // Track render start
  startTime.current = performance.now();
  renderCount.current++;

  // Track render end
  useEffect(() => {
    const renderTime = performance.now() - startTime.current;
    renderTimes.current.push(renderTime);

    // Keep only last 10 renders
    if (renderTimes.current.length > 10) {
      renderTimes.current.shift();
    }

    // Log slow renders in development
    if (import.meta.env.DEV && renderTime > 16) {
      console.warn(`⚠️ Slow render in ${componentName}: ${renderTime.toFixed(2)}ms`);
    }
  });

  const times = renderTimes.current;
  const lastRenderTime = times[times.length - 1] || 0;
  const averageRenderTime = times.length > 0
    ? times.reduce((a, b) => a + b, 0) / times.length
    : 0;

  return {
    renderCount: renderCount.current,
    lastRenderTime,
    averageRenderTime,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// INTERSECTION OBSERVER HOOK
// ═══════════════════════════════════════════════════════════════════════════

interface UseIntersectionOptions extends IntersectionObserverInit {
  triggerOnce?: boolean;
}

export function useIntersection(
  ref: React.RefObject<Element>,
  options: UseIntersectionOptions = {}
): boolean {
  const { triggerOnce = false, ...observerOptions } = options;
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      const isVisible = entry.isIntersecting;
      setIsIntersecting(isVisible);

      if (isVisible && triggerOnce) {
        observer.disconnect();
      }
    }, observerOptions);

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, triggerOnce, observerOptions.root, observerOptions.rootMargin, observerOptions.threshold]);

  return isIntersecting;
}

// ═══════════════════════════════════════════════════════════════════════════
// LOCAL STORAGE HOOK
// ═══════════════════════════════════════════════════════════════════════════

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue(prev => {
      const valueToStore = typeof value === 'function'
        ? (value as (prev: T) => T)(prev)
        : value;
      try {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.warn(`Failed to save to localStorage: ${error}`);
      }
      return valueToStore;
    });
  }, [key]);

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`Failed to remove from localStorage: ${error}`);
    }
  }, [key, initialValue]);

  // Sync across tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch {
          // Ignore parse errors
        }
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [key]);

  return [storedValue, setValue, removeValue];
}

// ═══════════════════════════════════════════════════════════════════════════
// WINDOW SIZE HOOK
// ═══════════════════════════════════════════════════════════════════════════

interface WindowSize {
  width: number;
  height: number;
}

export function useWindowSize(): WindowSize {
  const [size, setSize] = useState<WindowSize>(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  }));

  useEffect(() => {
    let rafId: number;

    const handleResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      });
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return size;
}

// ═══════════════════════════════════════════════════════════════════════════
// PREVIOUS VALUE HOOK
// ═══════════════════════════════════════════════════════════════════════════

export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

// ═══════════════════════════════════════════════════════════════════════════
// MEDIA QUERY HOOK
// ═══════════════════════════════════════════════════════════════════════════

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);

    // Use modern API if available
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    }
  }, [query]);

  return matches;
}
