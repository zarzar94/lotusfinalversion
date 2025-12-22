/**
 * Sessions Routes - Assessment session endpoints
 */

import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import { randomUUID } from 'node:crypto';
import { Session } from '../models/index.js';
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

/**
 * POST /sessions - Save new assessment session
 */
router.post('/',
  [
    body('clientId').optional().isString().withMessage('clientId must be a string'),
    body('outcomes').isObject().withMessage('Outcomes object required'),
    body('compositeResult').optional().isIn(['high', 'medium', 'low']),
    body('totalPoints').optional().isInt({ min: 0 }),
    body('duration').optional().isInt({ min: 0 }),
  ],
  handleValidation,
  async (req, res) => {
    try {
      const { outcomes, compositeResult, totalPoints, achievements, duration } = req.body;
      const clientId = typeof req.body.clientId === 'string' && req.body.clientId.trim().length
        ? req.body.clientId.trim()
        : randomUUID();

      const session = await Session.findOneAndUpdate(
        { userId: req.userId, clientId },
        { outcomes, compositeResult, totalPoints, achievements, duration },
        { new: true, upsert: true, setDefaultsOnInsert: true },
      );

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
    const { sessionId } = req.params;
    const match = {
      userId: req.userId,
      $or: [{ clientId: sessionId }],
    };

    if (mongoose.Types.ObjectId.isValid(sessionId)) {
      match.$or.push({ _id: sessionId });
    }

    const session = await Session.findOne({
      ...match,
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
    const { sessionId } = req.params;
    const match = {
      userId: req.userId,
      $or: [{ clientId: sessionId }],
    };

    if (mongoose.Types.ObjectId.isValid(sessionId)) {
      match.$or.push({ _id: sessionId });
    }

    const result = await Session.deleteOne({
      ...match,
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

    if (!testKey) {
      // Return overview
      const overview = {
        totalSessions: sessions.length,
        lastSession: sessions[sessions.length - 1]?.toJSON(),
        averagePoints: sessions.length > 0
          ? sessions.reduce((sum, s) => sum + (s.totalPoints || 0), 0) / sessions.length
          : 0,
      };

      return res.json({
        success: true,
        overview,
      });
    }

    // Filter sessions with the specific test
    const relevantSessions = sessions.filter(s =>
      s.outcomes && s.outcomes.get(testKey)
    );

    if (relevantSessions.length < 2) {
      return res.json({
        success: true,
        trend: null,
        message: 'Not enough data for trend analysis',
      });
    }

    const sessionData = relevantSessions.map(s => ({
      date: s.createdAt.getTime(),
      result: s.outcomes.get(testKey).result,
      scoreLabel: s.outcomes.get(testKey).scoreLabel,
    }));

    const resultScores = { high: 3, medium: 2, low: 1 };
    const firstScore = resultScores[sessionData[0].result];
    const lastScore = resultScores[sessionData[sessionData.length - 1].result];
    const improvement = firstScore > 0 ? ((lastScore - firstScore) / firstScore) * 100 : 0;

    let trend;
    if (improvement > 10) trend = 'improving';
    else if (improvement < -10) trend = 'declining';
    else trend = 'stable';

    res.json({
      success: true,
      trend: {
        testKey,
        sessions: sessionData,
        improvement: Math.round(improvement),
        trend,
      },
    });
  } catch (error) {
    console.error('Get progress analysis error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to analyze progress' },
    });
  }
});

export default router;
