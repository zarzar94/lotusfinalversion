/**
 * In-Memory Cache with TTL - Lightweight caching for API responses
 * Can be replaced with Redis for production at scale
 */

class Cache {
  constructor(defaultTTL = 300000) { // 5 minutes default
    this.cache = new Map();
    this.defaultTTL = defaultTTL;

    // Cleanup expired entries every minute
    this.cleanupInterval = setInterval(() => this.cleanup(), 60000);
  }

  /**
   * Get cached value
   */
  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  /**
   * Set cached value with optional TTL
   */
  set(key, value, ttl = this.defaultTTL) {
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttl,
    });
  }

  /**
   * Delete cached value
   */
  delete(key) {
    this.cache.delete(key);
  }

  /**
   * Delete all entries matching pattern
   */
  deletePattern(pattern) {
    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear all cache
   */
  clear() {
    this.cache.clear();
  }

  /**
   * Cleanup expired entries
   */
  cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get cache stats
   */
  stats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }

  /**
   * Destroy cache (cleanup interval)
   */
  destroy() {
    clearInterval(this.cleanupInterval);
    this.cache.clear();
  }
}

// Singleton instance
const cache = new Cache();

// Cache key generators
export const cacheKeys = {
  user: (id) => `user:${id}`,
  userProgress: (id) => `progress:${id}`,
  userGamification: (id) => `gamification:${id}`,
  userSettings: (id) => `settings:${id}`,
  userSessions: (id, page = 0) => `sessions:${id}:${page}`,
  leaderboard: (type) => `leaderboard:${type}`,
};

// Cache TTLs (in milliseconds)
export const cacheTTL = {
  short: 30000,      // 30 seconds
  medium: 300000,    // 5 minutes
  long: 900000,      // 15 minutes
  leaderboard: 60000, // 1 minute
};

/**
 * Cache middleware for Express routes
 */
export const cacheMiddleware = (keyFn, ttl = cacheTTL.medium) => {
  return (req, res, next) => {
    const key = typeof keyFn === 'function' ? keyFn(req) : keyFn;
    const cached = cache.get(key);

    if (cached) {
      return res.json(cached);
    }

    // Store original json method
    const originalJson = res.json.bind(res);

    // Override json to cache response
    res.json = (data) => {
      if (res.statusCode === 200 && data.success) {
        cache.set(key, data, ttl);
      }
      return originalJson(data);
    };

    next();
  };
};

/**
 * Invalidate cache after mutation
 */
export const invalidateCache = (patterns) => {
  return (req, res, next) => {
    const originalJson = res.json.bind(res);

    res.json = (data) => {
      if (res.statusCode >= 200 && res.statusCode < 300 && data.success) {
        const userId = req.userId?.toString();
        patterns.forEach(pattern => {
          if (typeof pattern === 'function') {
            cache.delete(pattern(userId));
          } else {
            cache.deletePattern(pattern.replace('{userId}', userId));
          }
        });
      }
      return originalJson(data);
    };

    next();
  };
};

export default cache;
