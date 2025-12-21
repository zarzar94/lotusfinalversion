/**
 * Settings Routes - User settings endpoints
 */

import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { Settings } from '../models/index.js';
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
 * GET /settings - Get user settings
 */
router.get('/', async (req, res) => {
  try {
    let settings = await Settings.findOne({ userId: req.userId });

    if (!settings) {
      settings = await Settings.create({ userId: req.userId });
    }

    res.json({
      success: true,
      settings: settings.toJSON(),
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to get settings' },
    });
  }
});

/**
 * PATCH /settings - Update user settings
 */
router.patch('/',
  [
    body('language').optional().isIn(['ar', 'en']),
    body('visitorMode').optional().isIn(['school', 'parent', 'clinician']),
    body('notifications.achievements').optional().isBoolean(),
    body('notifications.reminders').optional().isBoolean(),
    body('notifications.updates').optional().isBoolean(),
    body('notifications.email').optional().isBoolean(),
    body('display.reducedMotion').optional().isBoolean(),
    body('display.highContrast').optional().isBoolean(),
    body('display.fontSize').optional().isIn(['small', 'medium', 'large']),
    body('privacy.shareProgress').optional().isBoolean(),
    body('privacy.anonymousAnalytics').optional().isBoolean(),
    body('audio.soundEffects').optional().isBoolean(),
    body('audio.volume').optional().isInt({ min: 0, max: 100 }),
  ],
  handleValidation,
  async (req, res) => {
    try {
      const updates = { ...req.body };
      delete updates.userId;

      let settings = await Settings.findOne({ userId: req.userId });

      if (!settings) {
        settings = new Settings({ userId: req.userId });
      }

      // Deep merge nested objects
      if (updates.notifications) {
        settings.notifications = {
          ...settings.notifications.toObject(),
          ...updates.notifications,
        };
        delete updates.notifications;
      }

      if (updates.display) {
        settings.display = {
          ...settings.display.toObject(),
          ...updates.display,
        };
        delete updates.display;
      }

      if (updates.privacy) {
        settings.privacy = {
          ...settings.privacy.toObject(),
          ...updates.privacy,
        };
        delete updates.privacy;
      }

      if (updates.audio) {
        settings.audio = {
          ...settings.audio.toObject(),
          ...updates.audio,
        };
        delete updates.audio;
      }

      Object.assign(settings, updates);

      await settings.save();

      res.json({
        success: true,
        settings: settings.toJSON(),
      });
    } catch (error) {
      console.error('Update settings error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'SERVER_ERROR', message: 'Failed to update settings' },
      });
    }
  }
);

export default router;
