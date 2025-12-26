/**
 * Clinical Routes - Clinical progress endpoints
 */

import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { ClinicalProgress, User } from '../models/index.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { canAccessPatient } from '../utils/access.js';

const router = Router();

// All routes require authentication
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
 * GET /clinical/progress - Get user's clinical progress
 */
router.get('/progress', async (req, res) => {
  try {
    let progress = await ClinicalProgress.findOne({ userId: req.userId });

    // Create if not exists
    if (!progress) {
      progress = await ClinicalProgress.create({ userId: req.userId });
    }

    res.json({
      success: true,
      progress: progress.toJSON(),
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to get progress' },
    });
  }
});

/**
 * PATCH /clinical/progress - Update clinical progress
 */
router.patch('/progress',
  [
    body('sessionsCompleted').optional().isInt({ min: 0 }),
    body('attentionScore').optional().isFloat({ min: 0, max: 100 }),
    body('processingSpeed').optional().isFloat({ min: 0, max: 100 }),
    body('auditoryDiscrimination').optional().isFloat({ min: 0, max: 100 }),
    body('weeklyGoalsMet').optional().isInt({ min: 0 }),
    body('treatmentPhase').optional().isIn(['assessment', 'active', 'maintenance', 'completed']),
    body('streak').optional().isInt({ min: 0 }),
  ],
  handleValidation,
  async (req, res) => {
    try {
      const updates = { ...req.body, lastActivityDate: new Date() };
      delete updates.userId; // Prevent changing userId

      let progress = await ClinicalProgress.findOne({ userId: req.userId });

      if (!progress) {
        progress = new ClinicalProgress({ userId: req.userId, ...updates });
      } else {
        Object.assign(progress, updates);
      }

      await progress.save();

      res.json({
        success: true,
        progress: progress.toJSON(),
      });
    } catch (error) {
      console.error('Update progress error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'SERVER_ERROR', message: 'Failed to update progress' },
      });
    }
  }
);

/**
 * POST /clinical/session/complete - Complete a clinical session
 */
router.post('/session/complete', async (req, res) => {
  try {
    let progress = await ClinicalProgress.findOne({ userId: req.userId });

    if (!progress) {
      progress = new ClinicalProgress({ userId: req.userId });
    }

    // Increment sessions
    progress.sessionsCompleted += 1;
    progress.sessionDates.push(new Date());

    // Update streak
    const lastActivity = progress.lastActivityDate;
    const now = new Date();
    const oneDayMs = 24 * 60 * 60 * 1000;

    if (!lastActivity || now - lastActivity > 2 * oneDayMs) {
      progress.streak = 1;
    } else if (now - lastActivity > oneDayMs) {
      progress.streak += 1;
    }

    progress.lastActivityDate = now;

    await progress.save();

    res.json({
      success: true,
      progress: progress.toJSON(),
    });
  } catch (error) {
    console.error('Complete session error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to complete session' },
    });
  }
});

/**
 * GET /clinical/history - Get progress history
 */
router.get('/history', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const query = { userId: req.userId };

    // In a real app, you'd have a history collection
    // For now, return current progress
    const progress = await ClinicalProgress.findOne(query);

    res.json({
      success: true,
      history: progress ? [progress.toJSON()] : [],
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to get history' },
    });
  }
});

/**
 * GET /clinical/patient/:patientId - Get patient's progress (clinician only)
 */
router.get('/patient/:patientId',
  authorize('clinician', 'super_admin'),
  async (req, res) => {
    try {
      const patient = await User.findById(req.params.patientId).select('school clinic');

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

      const progress = await ClinicalProgress.findOne({
        userId: patient._id,
      });

      if (!progress) {
        return res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Patient progress not found' },
        });
      }

      res.json({
        success: true,
        progress: progress.toJSON(),
      });
    } catch (error) {
      console.error('Get patient progress error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'SERVER_ERROR', message: 'Failed to get patient progress' },
      });
    }
  }
);

export default router;
