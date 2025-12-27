/**
 * Performance Utilities - Memoization, throttling, and optimization helpers
 */

// ═══════════════════════════════════════════════════════════════════════════
// DEBOUNCE & THROTTLE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Debounce function - delays execution until after wait period
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  wait: number,
  immediate = false
): T & { cancel: () => void } {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const debounced = function (this: unknown, ...args: Parameters<T>) {
    const callNow = immediate && !timeoutId;

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      timeoutId = null;
      if (!immediate) {
        fn.apply(this, args);
      }
    }, wait);

    if (callNow) {
      fn.apply(this, args);
    }
  } as T & { cancel: () => void };

  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debounced;
}

/**
 * Throttle function - limits execution to once per wait period
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  wait: number,
  options: { leading?: boolean; trailing?: boolean } = {}
): T & { cancel: () => void } {
  const { leading = true, trailing = true } = options;

  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;
  let lastThis: unknown;

  const invoke = () => {
    if (!lastArgs) return;
    fn.apply(lastThis, lastArgs);
    lastArgs = null;
    lastThis = undefined;
  };

  const startWindow = () => {
    timeoutId = setTimeout(() => {
      timeoutId = null;
      if (trailing) {
        invoke();
      } else {
        lastArgs = null;
        lastThis = undefined;
      }
    }, wait);
  };

  const throttled = function (this: unknown, ...args: Parameters<T>) {
    lastArgs = args;
    lastThis = this;

    if (!timeoutId) {
      if (leading) {
        invoke();
      }
      startWindow();
    }
  } as T & { cancel: () => void };

  throttled.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    lastArgs = null;
    lastThis = undefined;
  };

  return throttled;
}

// ═══════════════════════════════════════════════════════════════════════════
// MEMOIZATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Memoize function with configurable cache size
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  options: {
    maxSize?: number;
    keyFn?: (...args: Parameters<T>) => string;
    ttl?: number;
  } = {}
): T & { cache: Map<string, { value: ReturnType<T>; timestamp: number }> } {
  const { maxSize = 100, keyFn, ttl } = options;
  const cache = new Map<string, { value: ReturnType<T>; timestamp: number }>();

  const memoized = function (this: unknown, ...args: Parameters<T>): ReturnType<T> {
    const key = keyFn ? keyFn(...args) : JSON.stringify(args);
    const now = Date.now();

    const cached = cache.get(key);
    if (cached) {
      if (!ttl || now - cached.timestamp < ttl) {
        return cached.value;
      }
      cache.delete(key);
    }

    const result = fn.apply(this, args) as ReturnType<T>;

    // Enforce max size (LRU eviction)
    if (cache.size >= maxSize) {
      const firstKey = cache.keys().next().value;
      if (firstKey) cache.delete(firstKey);
    }

    cache.set(key, { value: result, timestamp: now });
    return result;
  } as T & { cache: Map<string, { value: ReturnType<T>; timestamp: number }> };

  memoized.cache = cache;
  return memoized;
}

// ═══════════════════════════════════════════════════════════════════════════
// LAZY INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Lazy initialization - only compute value when first accessed
 */
export function lazy<T>(factory: () => T): { readonly value: T } {
  let value: T | undefined;
  let initialized = false;

  return {
    get value() {
      if (!initialized) {
        value = factory();
        initialized = true;
      }
      return value as T;
    },
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// BATCH UPDATES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Batch multiple updates into a single execution
 */
export function createBatcher<T>(
  processor: (items: T[]) => void,
  options: { maxSize?: number; maxWait?: number } = {}
): (item: T) => void {
  const { maxSize = 100, maxWait = 50 } = options;

  let batch: T[] = [];
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const flush = () => {
    if (batch.length > 0) {
      const items = batch;
      batch = [];
      processor(items);
    }
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return (item: T) => {
    batch.push(item);

    if (batch.length >= maxSize) {
      flush();
    } else if (!timeoutId) {
      timeoutId = setTimeout(flush, maxWait);
    }
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// INTERSECTION OBSERVER (LAZY LOADING)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Create intersection observer for lazy loading
 */
export function createLazyLoader(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver | null {
  if (typeof IntersectionObserver === 'undefined') {
    return null;
  }

  return new IntersectionObserver(callback, {
    rootMargin: '200px',
    threshold: 0.1,
    ...options,
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// REQUEST ANIMATION FRAME UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Debounce using requestAnimationFrame
 */
export function rafDebounce<T extends (...args: any[]) => any>(fn: T): T {
  let rafId: number | null = null;

  return ((...args: Parameters<T>) => {
    if (rafId) {
      cancelAnimationFrame(rafId);
    }
    rafId = requestAnimationFrame(() => {
      fn(...args);
      rafId = null;
    });
  }) as T;
}

/**
 * Schedule work during idle time
 */
export function scheduleIdleWork(
  callback: () => void,
  options: { timeout?: number } = {}
): number | ReturnType<typeof setTimeout> {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    return (
      window as Window & {
        requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number;
      }
    ).requestIdleCallback(callback, options);
  }
  return setTimeout(callback, 1);
}

// ═══════════════════════════════════════════════════════════════════════════
// PERFORMANCE MEASUREMENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Measure execution time of a function
 */
export function measureTime<T>(name: string, fn: () => T): T {
  const start = performance.now();
  try {
    return fn();
  } finally {
    const duration = performance.now() - start;
    if (import.meta.env.DEV && duration > 16) {
      console.warn(`Slow operation "${name}": ${duration.toFixed(2)}ms`);
    }
  }
}

/**
 * Create a performance marker
 */
export function mark(name: string): () => void {
  const startMark = `${name}-start`;
  const endMark = `${name}-end`;

  performance.mark(startMark);

  return () => {
    performance.mark(endMark);
    performance.measure(name, startMark, endMark);

    if (import.meta.env.DEV) {
      const measure = performance.getEntriesByName(name)[0];
      if (measure && measure.duration > 16) {
        console.warn(`Slow operation "${name}": ${measure.duration.toFixed(2)}ms`);
      }
    }

    performance.clearMarks(startMark);
    performance.clearMarks(endMark);
    performance.clearMeasures(name);
  };
}
