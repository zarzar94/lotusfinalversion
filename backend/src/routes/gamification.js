/**
 * Gamification Routes - Gamification state endpoints
 */

import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { Gamification, User } from '../models/index.js';
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
 * GET /gamification/state - Get user's gamification state
 */
router.get('/state', async (req, res) => {
  try {
    let state = await Gamification.findOne({ userId: req.userId });

    if (!state) {
      state = await Gamification.create({ userId: req.userId });
    }

    res.json({
      success: true,
      state: state.toJSON(),
    });
  } catch (error) {
    console.error('Get gamification state error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to get state' },
    });
  }
});

/**
 * PATCH /gamification/state - Update gamification state
 */
router.patch('/state',
  [
    body('totalPoints').optional().isInt({ min: 0 }),
    body('level').optional().isInt({ min: 1, max: 10 }),
    body('audioJourneyProgress').optional().isFloat({ min: 0, max: 100 }),
    body('maxScrollProgress').optional().isFloat({ min: 0, max: 100 }),
    body('totalTimeSpent').optional().isInt({ min: 0 }),
    body('checklistCompleted').optional().isBoolean(),
  ],
  handleValidation,
  async (req, res) => {
    try {
      const updates = { ...req.body };
      delete updates.userId;

      let state = await Gamification.findOne({ userId: req.userId });

      if (!state) {
        state = new Gamification({ userId: req.userId, ...updates });
      } else {
        // Handle array updates specially
        if (updates.exploredBrainRegions) {
          state.exploredBrainRegions = [...new Set([
            ...state.exploredBrainRegions,
            ...updates.exploredBrainRegions,
          ])];
          delete updates.exploredBrainRegions;
        }

        if (updates.slidesViewed) {
          state.slidesViewed = [...new Set([
            ...state.slidesViewed,
            ...updates.slidesViewed,
          ])];
          delete updates.slidesViewed;
        }

        if (updates.gamesCompleted) {
          state.gamesCompleted = [...new Set([
            ...state.gamesCompleted,
            ...updates.gamesCompleted,
          ])];
          delete updates.gamesCompleted;
        }

        if (updates.videosWatched) {
          state.videosWatched = [...new Set([
            ...state.videosWatched,
            ...updates.videosWatched,
          ])];
          delete updates.videosWatched;
        }

        // Handle achievements update
        if (updates.achievements) {
          const existingIds = new Set(state.achievements.map(a => a.id));
          for (const achievement of updates.achievements) {
            if (existingIds.has(achievement.id)) {
              const existing = state.achievements.find(a => a.id === achievement.id);
              if (existing && !existing.unlocked && achievement.unlocked) {
                existing.unlocked = true;
                existing.unlockedAt = new Date();
                existing.points = achievement.points;
              }
            } else {
              state.achievements.push(achievement);
            }
          }
          delete updates.achievements;
        }

        Object.assign(state, updates);
      }

      await state.save();

      res.json({
        success: true,
        state: state.toJSON(),
      });
    } catch (error) {
      console.error('Update gamification state error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'SERVER_ERROR', message: 'Failed to update state' },
      });
    }
  }
);

/**
 * POST /gamification/achievements/:achievementId/unlock - Unlock achievement
 */
router.post('/achievements/:achievementId/unlock', async (req, res) => {
  try {
    const { achievementId } = req.params;
    const { points = 0 } = req.body;

    let state = await Gamification.findOne({ userId: req.userId });

    if (!state) {
      state = new Gamification({ userId: req.userId });
    }

    // Find or create achievement
    let achievement = state.achievements.find(a => a.id === achievementId);

    if (achievement) {
      if (achievement.unlocked) {
        return res.json({
          success: true,
          state: state.toJSON(),
          message: 'Achievement already unlocked',
        });
      }
      achievement.unlocked = true;
      achievement.unlockedAt = new Date();
      achievement.points = points;
    } else {
      state.achievements.push({
        id: achievementId,
        unlocked: true,
        unlockedAt: new Date(),
        points,
      });
    }

    // Update total points
    state.totalPoints += points;

    await state.save();

    res.json({
      success: true,
      state: state.toJSON(),
    });
  } catch (error) {
    console.error('Unlock achievement error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to unlock achievement' },
    });
  }
});

/**
 * GET /gamification/leaderboard - Get leaderboard
 */
router.get('/leaderboard', async (req, res) => {
  try {
    const { type = 'global', limit = 10 } = req.query;

    const pipeline = [
      { $sort: { totalPoints: -1 } },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          userId: { $toString: '$userId' },
          name: '$user.name',
          points: '$totalPoints',
          level: 1,
        },
      },
    ];

    // Add filter for clinic/school if needed
    if (type === 'clinic' && req.user.clinic) {
      pipeline.unshift({
        $match: { 'user.clinic': req.user.clinic },
      });
    } else if (type === 'school' && req.user.school) {
      pipeline.unshift({
        $match: { 'user.school': req.user.school },
      });
    }

    const leaderboard = await Gamification.aggregate(pipeline);

    // Add rank
    const rankedLeaderboard = leaderboard.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));

    res.json({
      success: true,
      leaderboard: rankedLeaderboard,
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to get leaderboard' },
    });
  }
});

export default router;
