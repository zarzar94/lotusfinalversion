import crypto from 'crypto';

// ═══════════════════════════════════════════════════════════════════════════
// CSRF PROTECTION MIDDLEWARE
// ═══════════════════════════════════════════════════════════════════════════

const CSRF_HEADER = 'x-csrf-token';
const CSRF_COOKIE = 'csrf_token';
const TOKEN_LENGTH = 32;
const TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

// Store for tokens (in production, use Redis)
const tokenStore = new Map();

// Methods that don't require CSRF protection
const SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS'];

// Paths that are exempt from CSRF protection
const EXEMPT_PATHS = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/refresh',
  '/api/health',
  '/api/docs',
];

/**
 * Generate a new CSRF token
 */
export function generateToken(sessionId) {
  const token = crypto.randomBytes(TOKEN_LENGTH).toString('hex');
  const expiry = Date.now() + TOKEN_EXPIRY;

  tokenStore.set(token, {
    sessionId,
    expiry,
  });

  return token;
}

/**
 * Validate a CSRF token
 */
export function validateToken(token, sessionId) {
  if (!token) return false;

  const stored = tokenStore.get(token);

  if (!stored) return false;
  if (stored.expiry < Date.now()) {
    tokenStore.delete(token);
    return false;
  }
  if (stored.sessionId !== sessionId) return false;

  return true;
}

/**
 * Cleanup expired tokens
 */
function cleanupTokens() {
  const now = Date.now();
  for (const [token, data] of tokenStore.entries()) {
    if (data.expiry < now) {
      tokenStore.delete(token);
    }
  }
}

// Run cleanup every hour
setInterval(cleanupTokens, 60 * 60 * 1000);

/**
 * CSRF Protection Middleware
 */
export function csrfProtection(options = {}) {
  const {
    cookie = CSRF_COOKIE,
    header = CSRF_HEADER,
    exemptPaths = EXEMPT_PATHS,
    ignoreMethods = SAFE_METHODS,
  } = options;

  return (req, res, next) => {
    // Skip for safe methods
    if (ignoreMethods.includes(req.method)) {
      return next();
    }

    // Skip for exempt paths
    if (exemptPaths.some(path => req.path.startsWith(path))) {
      return next();
    }

    // Get session ID (from JWT or session)
    const sessionId = req.user?.id || req.sessionID || req.ip;

    // Get token from header or cookie
    const token = req.headers[header] || req.cookies?.[cookie];

    // Validate token
    if (!validateToken(token, sessionId)) {
      return res.status(403).json({
        error: 'CSRF token validation failed',
        code: 'CSRF_INVALID',
      });
    }

    next();
  };
}

/**
 * Middleware to generate and send CSRF token
 */
export function csrfTokenGenerator(options = {}) {
  const { cookie = CSRF_COOKIE, header = CSRF_HEADER } = options;

  return (req, res, next) => {
    // Get session ID
    const sessionId = req.user?.id || req.sessionID || req.ip;

    // Generate new token
    const token = generateToken(sessionId);

    // Set token in response header
    res.setHeader(header, token);

    // Set token in cookie (for JS access)
    res.cookie(cookie, token, {
      httpOnly: false, // Allow JS access
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: TOKEN_EXPIRY,
    });

    // Add token to response object for API responses
    res.locals.csrfToken = token;

    next();
  };
}

/**
 * Route to get a new CSRF token
 */
export function csrfTokenRoute(req, res) {
  const sessionId = req.user?.id || req.sessionID || req.ip;
  const token = generateToken(sessionId);

  res.cookie(CSRF_COOKIE, token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: TOKEN_EXPIRY,
  });

  res.json({ token });
}

// ═══════════════════════════════════════════════════════════════════════════
// DOUBLE SUBMIT COOKIE PATTERN
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Simpler CSRF protection using double submit cookie pattern
 * Token is set in cookie and must be sent back in header
 */
export function doubleSubmitCookie(options = {}) {
  const {
    cookie = CSRF_COOKIE,
    header = CSRF_HEADER,
    exemptPaths = EXEMPT_PATHS,
    ignoreMethods = SAFE_METHODS,
  } = options;

  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return next();
    }

    // Generate token on first request
    if (!req.cookies?.[cookie]) {
      const token = crypto.randomBytes(TOKEN_LENGTH).toString('hex');
      res.cookie(cookie, token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      });
    }

    // Skip validation for safe methods
    if (ignoreMethods.includes(req.method)) {
      return next();
    }

    // Skip for exempt paths
    if (exemptPaths.some(path => req.path.startsWith(path))) {
      return next();
    }

    // Validate: header must match cookie
    const cookieToken = req.cookies?.[cookie];
    const headerToken = req.headers[header];

    if (!cookieToken || !headerToken || cookieToken !== headerToken) {
      return res.status(403).json({
        error: 'CSRF token validation failed',
        code: 'CSRF_MISMATCH',
      });
    }

    next();
  };
}

export default {
  csrfProtection,
  csrfTokenGenerator,
  csrfTokenRoute,
  doubleSubmitCookie,
  generateToken,
  validateToken,
};
