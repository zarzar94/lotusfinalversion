/**
 * Request Validation and Sanitization Middleware
 */

import { body, param, query, validationResult } from 'express-validator';

/**
 * Handle validation errors
 */
export const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: errors.array()[0].msg,
        details: errors.array(),
      },
    });
  }
  next();
};

/**
 * Sanitize string input
 */
const sanitizeString = (value) => {
  if (typeof value !== 'string') return value;
  return value
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML
    .slice(0, 10000); // Limit length
};

/**
 * Sanitize request body
 */
export const sanitizeBody = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    const sanitize = (obj) => {
      for (const key in obj) {
        if (typeof obj[key] === 'string') {
          obj[key] = sanitizeString(obj[key]);
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          sanitize(obj[key]);
        }
      }
    };
    sanitize(req.body);
  }
  next();
};

/**
 * Common validation chains
 */
export const validators = {
  // Auth validators
  email: body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email required'),

  password: body('password')
    .isLength({ min: 6, max: 128 })
    .withMessage('Password must be 6-128 characters'),

  name: body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be 2-100 characters'),

  // MongoDB ObjectId
  mongoId: (field) => param(field)
    .isMongoId()
    .withMessage(`Invalid ${field} format`),

  // Pagination
  pagination: [
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('offset').optional().isInt({ min: 0 }).toInt(),
  ],

  // Clinical progress
  sessionsCompleted: body('sessionsCompleted')
    .optional()
    .isInt({ min: 0, max: 100 })
    .toInt(),

  score: (field) => body(field)
    .optional()
    .isFloat({ min: 0, max: 100 })
    .toFloat(),

  treatmentPhase: body('treatmentPhase')
    .optional()
    .isIn(['assessment', 'active', 'maintenance', 'completed']),

  // Gamification
  points: body('totalPoints')
    .optional()
    .isInt({ min: 0 })
    .toInt(),

  level: body('level')
    .optional()
    .isInt({ min: 1, max: 10 })
    .toInt(),

  // Settings
  language: body('language')
    .optional()
    .isIn(['ar', 'en']),

  visitorMode: body('visitorMode')
    .optional()
    .isIn(['school', 'parent', 'clinician']),

  fontSize: body('display.fontSize')
    .optional()
    .isIn(['small', 'medium', 'large']),

  volume: body('audio.volume')
    .optional()
    .isInt({ min: 0, max: 100 })
    .toInt(),

  // Session outcomes
  gameResult: body('compositeResult')
    .optional()
    .isIn(['high', 'medium', 'low']),
};

/**
 * Rate limit by user
 */
export const userRateLimit = new Map();

export const rateLimitByUser = (maxRequests = 100, windowMs = 60000) => {
  return (req, res, next) => {
    if (!req.userId) return next();

    const key = req.userId.toString();
    const now = Date.now();
    const userLimit = userRateLimit.get(key) || { count: 0, resetAt: now + windowMs };

    if (now > userLimit.resetAt) {
      userLimit.count = 1;
      userLimit.resetAt = now + windowMs;
    } else {
      userLimit.count++;
    }

    userRateLimit.set(key, userLimit);

    if (userLimit.count > maxRequests) {
      return res.status(429).json({
        success: false,
        error: { code: 'RATE_LIMITED', message: 'Too many requests' },
      });
    }

    next();
  };
};

// Cleanup old entries periodically
const cleanupInterval = setInterval(() => {
  const now = Date.now();
  for (const [key, value] of userRateLimit.entries()) {
    if (now > value.resetAt) {
      userRateLimit.delete(key);
    }
  }
}, 60000);
if (process.env.NODE_ENV === 'test' && cleanupInterval.unref) {
  cleanupInterval.unref();
}
