/**
 * Sessions Routes - Assessment session endpoints
 */

import { Router } from 'express';
import { body, query, validationResult } from 'express-validator';
import { Session, User } from '../models/index.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: errors.array()[0].msg },
    });
  }
  next();
};

const clampScore = (value) => Math.max(0, Math.min(100, Math.round(value)));

const toNumber = (value) => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const getMetric = (metrics, key) => {
  if (!metrics || typeof metrics !== 'object') return null;
  if (!Object.prototype.hasOwnProperty.call(metrics, key)) return null;
  return toNumber(metrics[key]);
};

const extractScoreFromLabel = (scoreLabel) => {
  if (typeof scoreLabel !== 'string') return null;
  const byHundred = scoreLabel.match(/(\d+(?:\.\d+)?)\s*\/\s*100/);
  if (byHundred) return Number(byHundred[1]);

  const scoreMatch = scoreLabel.match(/Score\s*=?\s*(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/i);
  if (scoreMatch) {
    const earned = Number(scoreMatch[1]);
    const total = Number(scoreMatch[2]);
    if (Number.isFinite(earned) && Number.isFinite(total) && total > 0) {
      return (earned / total) * 100;
    }
  }

  const percentMatch = scoreLabel.match(/(\d+(?:\.\d+)?)\s*%/);
  if (percentMatch) return Number(percentMatch[1]);

  return null;
};

const deriveScore100FromOutcome = (outcome) => {
  const metrics = outcome?.metrics && typeof outcome.metrics === 'object' ? outcome.metrics : {};

  const direct = getMetric(metrics, 'score100');
  if (direct !== null) return clampScore(direct);

  const fromLabel = extractScoreFromLabel(outcome?.scoreLabel ?? '');
  if (fromLabel !== null && Number.isFinite(fromLabel)) {
    return clampScore(fromLabel);
  }

  const accuracy = getMetric(metrics, 'accuracyPct');
  if (accuracy !== null) return clampScore(accuracy);

  const hitRate = getMetric(metrics, 'hitRate');
  if (hitRate !== null) return clampScore(hitRate <= 1 ? hitRate * 100 : hitRate);

  const totalScore = getMetric(metrics, 'totalScore');
  const totalQuestions = getMetric(metrics, 'totalQuestions');
  if (totalScore !== null && totalQuestions !== null && totalQuestions > 0) {
    const maxScore = totalQuestions * 2;
    return clampScore((totalScore / maxScore) * 100);
  }

  return 0;
};

const getOutcomeEntries = (outcomes) => {
  if (!outcomes) return [];
  if (outcomes instanceof Map) return Array.from(outcomes.entries());
  if (typeof outcomes === 'object') return Object.entries(outcomes);
  return [];
};

const buildProgressOverview = (sessions) => ({
  totalSessions: sessions.length,
  lastSession: sessions[sessions.length - 1]?.toJSON(),
  averagePoints: sessions.length > 0
    ? sessions.reduce((sum, s) => sum + (s.totalPoints || 0), 0) / sessions.length
    : 0,
});

const buildProgressTrend = (sessions, testKey) => {
  const relevantSessions = sessions.filter((session) => {
    if (!session.outcomes) return false;
    if (session.outcomes instanceof Map) {
      return session.outcomes.has(testKey);
    }
    return Boolean(session.outcomes[testKey]);
  });

  if (relevantSessions.length < 2) {
    return {
      trend: null,
      message: 'Not enough data for trend analysis',
    };
  }

  const sessionData = relevantSessions.map((session) => {
    const outcome = session.outcomes instanceof Map
      ? session.outcomes.get(testKey)
      : session.outcomes[testKey];
    return {
      date: session.createdAt.getTime(),
      result: outcome.result,
      scoreLabel: outcome.scoreLabel,
    };
  });

  const resultScores = { high: 3, medium: 2, low: 1 };
  const firstScore = resultScores[sessionData[0].result];
  const lastScore = resultScores[sessionData[sessionData.length - 1].result];
  const improvement = firstScore > 0 ? ((lastScore - firstScore) / firstScore) * 100 : 0;

  let trend;
  if (improvement > 10) trend = 'improving';
  else if (improvement < -10) trend = 'declining';
  else trend = 'stable';

  return {
    trend: {
      testKey,
      sessions: sessionData,
      improvement: Math.round(improvement),
      trend,
    },
  };
};

const buildProgressAnalysis = (sessions, testKey) => {
  if (!testKey) {
    return {
      success: true,
      overview: buildProgressOverview(sessions),
    };
  }

  return {
    success: true,
    ...buildProgressTrend(sessions, testKey),
  };
};

const canAccessPatient = (req, patient) => {
  if (!req.user || !patient) return false;
  const patientId = patient._id?.toString?.() ?? patient.toString();
  const currentId = req.userId?.toString();
  if (['super_admin', 'clinician'].includes(req.user.role)) return true;
  if (currentId === patientId) return true;
  if (req.user.role === 'parent' && Array.isArray(req.user.children)) {
    return req.user.children.some((childId) => childId.toString() === patientId);
  }
  if (req.user.role === 'school_admin') {
    return Boolean(req.user.school && patient.school && req.user.school === patient.school);
  }
  return false;
};

const buildSchoolSummary = (sessions, school) => {
  const userIds = new Set();
  let pointsSum = 0;
  let pointsCount = 0;
  let scoreSum = 0;
  let scoreCount = 0;
  const moduleTotals = new Map();

  sessions.forEach((session) => {
    if (session.userId) {
      userIds.add(session.userId.toString());
    }
    if (typeof session.totalPoints === 'number') {
      pointsSum += session.totalPoints;
      pointsCount += 1;
    }
    const entries = getOutcomeEntries(session.outcomes);
    entries.forEach(([key, outcome]) => {
      const score = deriveScore100FromOutcome(outcome);
      scoreSum += score;
      scoreCount += 1;
      const current = moduleTotals.get(key) || { sum: 0, count: 0 };
      current.sum += score;
      current.count += 1;
      moduleTotals.set(key, current);
    });
  });

  const moduleAverages = {};
  moduleTotals.forEach((value, key) => {
    moduleAverages[key] = value.count > 0 ? Math.round(value.sum / value.count) : 0;
  });

  return {
    school,
    totalSessions: sessions.length,
    uniqueUsers: userIds.size,
    averagePoints: pointsCount > 0 ? Math.round(pointsSum / pointsCount) : 0,
    averageScore: scoreCount > 0 ? Math.round(scoreSum / scoreCount) : 0,
    moduleAverages,
  };
};

/**
 * POST /sessions - Save new assessment session
 */
router.post('/',
  [
    body('outcomes').isObject().withMessage('Outcomes object required'),
    body('compositeResult').optional().isIn(['high', 'medium', 'low']),
    body('totalPoints').optional().isInt({ min: 0 }),
    body('duration').optional().isInt({ min: 0 }),
  ],
  handleValidation,
  async (req, res) => {
    try {
      const { outcomes, compositeResult, totalPoints, achievements, duration } = req.body;

      const session = new Session({
        userId: req.userId,
        outcomes,
        compositeResult,
        totalPoints,
        achievements,
        duration,
      });

      await session.save();

      res.status(201).json({
        success: true,
        session: session.toJSON(),
      });
    } catch (error) {
      console.error('Save session error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'SERVER_ERROR', message: 'Failed to save session' },
      });
    }
  }
);

/**
 * GET /sessions - Get user's sessions
 */
router.get('/', async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const [sessions, total] = await Promise.all([
      Session.find({ userId: req.userId })
        .sort({ createdAt: -1 })
        .skip(parseInt(offset))
        .limit(parseInt(limit)),
      Session.countDocuments({ userId: req.userId }),
    ]);

    res.json({
      success: true,
      sessions: sessions.map(s => s.toJSON()),
      total,
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to get sessions' },
    });
  }
});

/**
 * GET /sessions/:sessionId - Get specific session
 */
router.get('/:sessionId', async (req, res) => {
  try {
    const session = await Session.findOne({
      _id: req.params.sessionId,
      userId: req.userId,
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Session not found' },
      });
    }

    res.json({
      success: true,
      session: session.toJSON(),
    });
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to get session' },
    });
  }
});

/**
 * DELETE /sessions/:sessionId - Delete session
 */
router.delete('/:sessionId', async (req, res) => {
  try {
    const result = await Session.deleteOne({
      _id: req.params.sessionId,
      userId: req.userId,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Session not found' },
      });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to delete session' },
    });
  }
});

/**
 * GET /sessions/analysis/progress - Get progress analysis
 */
router.get('/analysis/progress', async (req, res) => {
  try {
    const { testKey } = req.query;

    const sessions = await Session.find({ userId: req.userId })
      .sort({ createdAt: 1 })
      .limit(100);

    res.json(buildProgressAnalysis(sessions, testKey));
  } catch (error) {
    console.error('Get progress analysis error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to analyze progress' },
    });
  }
});

/**
 * GET /sessions/analysis/patient - Get progress analysis for a specific patient
 */
router.get('/analysis/patient',
  [query('patientId').isMongoId().withMessage('Invalid patientId')],
  handleValidation,
  async (req, res) => {
    try {
      const { patientId, testKey } = req.query;
      const patient = await User.findById(patientId).select('school');

      if (!patient) {
        return res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Patient not found' },
        });
      }

      if (!canAccessPatient(req, patient)) {
        return res.status(403).json({
          success: false,
          error: { code: 'FORBIDDEN', message: 'Insufficient permissions' },
        });
      }

      const sessions = await Session.find({ userId: patientId })
        .sort({ createdAt: 1 })
        .limit(100);

      res.json(buildProgressAnalysis(sessions, testKey));
    } catch (error) {
      console.error('Get patient analysis error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'SERVER_ERROR', message: 'Failed to analyze patient progress' },
      });
    }
  }
);

/**
 * GET /sessions/analysis/school - Get aggregated analytics for a school
 */
router.get('/analysis/school',
  [query('school').optional().isString().trim().notEmpty().withMessage('Invalid school')],
  handleValidation,
  async (req, res) => {
    try {
      const role = req.user?.role;
      if (!['school_admin', 'super_admin', 'clinician'].includes(role)) {
        return res.status(403).json({
          success: false,
          error: { code: 'FORBIDDEN', message: 'Insufficient permissions' },
        });
      }

      const requestedSchool = typeof req.query.school === 'string' ? req.query.school : null;
      const school = role === 'school_admin' ? req.user.school : (requestedSchool || req.user.school);

      if (!school) {
        return res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'school is required' },
        });
      }

      const users = await User.find({ school }).select('_id');
      const userIds = users.map((user) => user._id);

      if (userIds.length === 0) {
        return res.json({
          success: true,
          summary: {
            school,
            totalSessions: 0,
            uniqueUsers: 0,
            averagePoints: 0,
            averageScore: 0,
            moduleAverages: {},
          },
        });
      }

      const sessions = await Session.find({ userId: { $in: userIds } })
        .sort({ createdAt: 1 })
        .limit(500);

      res.json({
        success: true,
        summary: buildSchoolSummary(sessions, school),
      });
    } catch (error) {
      console.error('Get school analysis error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'SERVER_ERROR', message: 'Failed to analyze school progress' },
      });
    }
  }
);

export default router;
