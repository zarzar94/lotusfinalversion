/**
 * Response Compression and Optimization Middleware
 */

import zlib from 'zlib';

/**
 * Compress JSON responses for large payloads
 */
export const compressResponse = (threshold = 1024) => {
  return (req, res, next) => {
    // Check if client accepts gzip
    const acceptEncoding = req.headers['accept-encoding'] || '';
    if (!acceptEncoding.includes('gzip')) {
      return next();
    }

    const originalJson = res.json.bind(res);

    res.json = (data) => {
      const jsonString = JSON.stringify(data);

      // Only compress if above threshold
      if (jsonString.length < threshold) {
        return originalJson(data);
      }

      zlib.gzip(jsonString, (err, compressed) => {
        if (err) {
          return originalJson(data);
        }

        res.setHeader('Content-Encoding', 'gzip');
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Length', compressed.length);
        res.end(compressed);
      });
    };

    next();
  };
};

/**
 * Add performance headers
 */
export const performanceHeaders = () => {
  return (req, res, next) => {
    // Start timer
    const start = process.hrtime.bigint();

    // Add timing header on response
    res.on('finish', () => {
      const end = process.hrtime.bigint();
      const durationMs = Number(end - start) / 1e6;

      // Log slow requests in development
      if (process.env.NODE_ENV !== 'production' && durationMs > 100) {
        console.log(`⚠️ Slow request: ${req.method} ${req.path} - ${durationMs.toFixed(2)}ms`);
      }
    });

    // Cache control for GET requests
    if (req.method === 'GET') {
      res.setHeader('Cache-Control', 'private, max-age=0, must-revalidate');
    }

    // Security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');

    next();
  };
};

/**
 * Request timeout middleware
 */
export const requestTimeout = (timeoutMs = 30000) => {
  return (req, res, next) => {
    res.setTimeout(timeoutMs, () => {
      if (!res.headersSent) {
        res.status(408).json({
          success: false,
          error: { code: 'TIMEOUT', message: 'Request timeout' },
        });
      }
    });
    next();
  };
};

/**
 * Pagination helper
 */
export const paginate = (defaultLimit = 20, maxLimit = 100) => {
  return (req, res, next) => {
    let limit = parseInt(req.query.limit) || defaultLimit;
    let offset = parseInt(req.query.offset) || 0;

    // Enforce limits
    limit = Math.min(Math.max(1, limit), maxLimit);
    offset = Math.max(0, offset);

    req.pagination = { limit, offset };
    next();
  };
};
