// ═══════════════════════════════════════════════════════════════════════════
// FRONTEND RATE LIMITING
// ═══════════════════════════════════════════════════════════════════════════

interface RateLimitEntry {
  count: number;
  firstRequest: number;
  blocked: boolean;
  blockedUntil?: number;
}

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  blockDurationMs: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxRequests: 100,
  windowMs: 60 * 1000, // 1 minute
  blockDurationMs: 5 * 60 * 1000, // 5 minutes
};

const rateLimitStore = new Map<string, RateLimitEntry>();

// ═══════════════════════════════════════════════════════════════════════════
// RATE LIMITER CLASS
// ═══════════════════════════════════════════════════════════════════════════

export class RateLimiter {
  private config: RateLimitConfig;
  private key: string;

  constructor(key: string, config: Partial<RateLimitConfig> = {}) {
    this.key = key;
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  check(): { allowed: boolean; remaining: number; resetAt: number } {
    const now = Date.now();
    let entry = rateLimitStore.get(this.key);

    // Check if blocked
    if (entry?.blocked && entry.blockedUntil) {
      if (now < entry.blockedUntil) {
        return {
          allowed: false,
          remaining: 0,
          resetAt: entry.blockedUntil,
        };
      }
      // Block expired, reset entry
      entry = undefined;
    }

    // Initialize or reset entry if window expired
    if (!entry || now - entry.firstRequest > this.config.windowMs) {
      entry = {
        count: 0,
        firstRequest: now,
        blocked: false,
      };
    }

    // Increment count
    entry.count++;

    // Check if limit exceeded
    if (entry.count > this.config.maxRequests) {
      entry.blocked = true;
      entry.blockedUntil = now + this.config.blockDurationMs;
      rateLimitStore.set(this.key, entry);

      return {
        allowed: false,
        remaining: 0,
        resetAt: entry.blockedUntil,
      };
    }

    rateLimitStore.set(this.key, entry);

    return {
      allowed: true,
      remaining: this.config.maxRequests - entry.count,
      resetAt: entry.firstRequest + this.config.windowMs,
    };
  }

  reset(): void {
    rateLimitStore.delete(this.key);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// PRE-CONFIGURED LIMITERS
// ═══════════════════════════════════════════════════════════════════════════

const limiters = {
  // API calls: 100 per minute
  api: (endpoint: string) =>
    new RateLimiter(`api:${endpoint}`, {
      maxRequests: 100,
      windowMs: 60 * 1000,
      blockDurationMs: 60 * 1000,
    }),

  // Auth attempts: 5 per minute
  auth: (identifier: string) =>
    new RateLimiter(`auth:${identifier}`, {
      maxRequests: 5,
      windowMs: 60 * 1000,
      blockDurationMs: 5 * 60 * 1000,
    }),

  // Form submissions: 10 per minute
  form: (formId: string) =>
    new RateLimiter(`form:${formId}`, {
      maxRequests: 10,
      windowMs: 60 * 1000,
      blockDurationMs: 2 * 60 * 1000,
    }),

  // Search queries: 30 per minute
  search: () =>
    new RateLimiter('search', {
      maxRequests: 30,
      windowMs: 60 * 1000,
      blockDurationMs: 30 * 1000,
    }),

  // File uploads: 5 per 5 minutes
  upload: () =>
    new RateLimiter('upload', {
      maxRequests: 5,
      windowMs: 5 * 60 * 1000,
      blockDurationMs: 10 * 60 * 1000,
    }),
};

// ═══════════════════════════════════════════════════════════════════════════
// WRAPPER FUNCTION FOR API CALLS
// ═══════════════════════════════════════════════════════════════════════════

export async function withRateLimit<T>(
  limiterKey: string,
  fn: () => Promise<T>,
  config?: Partial<RateLimitConfig>
): Promise<T> {
  const limiter = new RateLimiter(limiterKey, config);
  const { allowed, remaining, resetAt } = limiter.check();

  if (!allowed) {
    const waitTime = Math.ceil((resetAt - Date.now()) / 1000);
    throw new RateLimitError(
      `Rate limit exceeded. Please try again in ${waitTime} seconds.`,
      resetAt,
      remaining
    );
  }

  return fn();
}

// ═══════════════════════════════════════════════════════════════════════════
// RATE LIMIT ERROR
// ═══════════════════════════════════════════════════════════════════════════

export class RateLimitError extends Error {
  public resetAt: number;
  public remaining: number;

  constructor(message: string, resetAt: number, remaining: number) {
    super(message);
    this.name = 'RateLimitError';
    this.resetAt = resetAt;
    this.remaining = remaining;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// REACT HOOK
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useCallback, useRef } from 'react';

interface UseRateLimitOptions {
  maxRequests?: number;
  windowMs?: number;
  onLimitReached?: (resetAt: number) => void;
}

export function useRateLimit(key: string, options: UseRateLimitOptions = {}) {
  const { maxRequests = 10, windowMs = 60000, onLimitReached } = options;
  const [isLimited, setIsLimited] = useState(false);
  const [remaining, setRemaining] = useState(maxRequests);
  const limiterRef = useRef<RateLimiter | null>(null);

  if (!limiterRef.current) {
    limiterRef.current = new RateLimiter(key, { maxRequests, windowMs });
  }

  const checkLimit = useCallback(() => {
    const result = limiterRef.current!.check();

    setIsLimited(!result.allowed);
    setRemaining(result.remaining);

    if (!result.allowed && onLimitReached) {
      onLimitReached(result.resetAt);
    }

    return result.allowed;
  }, [onLimitReached]);

  const reset = useCallback(() => {
    limiterRef.current!.reset();
    setIsLimited(false);
    setRemaining(maxRequests);
  }, [maxRequests]);

  return {
    isLimited,
    remaining,
    checkLimit,
    reset,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// CLEANUP
// ═══════════════════════════════════════════════════════════════════════════

// Periodically clean up expired entries
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.blocked && entry.blockedUntil && now > entry.blockedUntil) {
      rateLimitStore.delete(key);
    } else if (!entry.blocked && now - entry.firstRequest > 5 * 60 * 1000) {
      rateLimitStore.delete(key);
    }
  }
}, 60 * 1000); // Every minute

export { limiters };
export default RateLimiter;
