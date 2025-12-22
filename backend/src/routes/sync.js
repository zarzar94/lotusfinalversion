/**
 * Sync Routes - Cross-device synchronization endpoints
 */

import { Router } from 'express';
import { ClinicalProgress, Gamification, Settings, Session } from '../models/index.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

/**
 * POST /sync - Sync all user data
 */
router.post('/', async (req, res) => {
  try {
    const { lastSyncAt, localData } = req.body;
    const userId = req.userId;
    const serverData = {};
    const conflicts = [];

    // Fetch server data
    const [clinicalProgress, gamification, settings, sessions] = await Promise.all([
      ClinicalProgress.findOne({ userId }),
      Gamification.findOne({ userId }),
      Settings.findOne({ userId }),
      Session.find({ userId }).sort({ createdAt: -1 }).limit(50),
    ]);

    // Resolve clinical progress
    if (clinicalProgress) {
      const serverUpdated = clinicalProgress.updatedAt.getTime();

      if (localData?.clinicalProgress && serverUpdated < lastSyncAt) {
        // Local is newer, update server
        Object.assign(clinicalProgress, localData.clinicalProgress);
        await clinicalProgress.save();
      } else if (serverUpdated > lastSyncAt) {
        // Server is newer, report conflict if local also changed
        if (localData?.clinicalProgress) {
          conflicts.push({
            field: 'clinicalProgress',
            localValue: localData.clinicalProgress,
            serverValue: clinicalProgress.toJSON(),
            resolution: 'server',
          });
        }
      }

      serverData.clinicalProgress = clinicalProgress.toJSON();
    } else if (localData?.clinicalProgress) {
      // Create from local data
      const newProgress = await ClinicalProgress.create({
        userId,
        ...localData.clinicalProgress,
      });
      serverData.clinicalProgress = newProgress.toJSON();
    }

    // Resolve gamification
    if (gamification) {
      const serverUpdated = gamification.updatedAt.getTime();

      if (localData?.gamification && serverUpdated < lastSyncAt) {
        // Merge arrays (union)
        const mergedRegions = [...new Set([
          ...gamification.exploredBrainRegions,
          ...(localData.gamification.exploredBrainRegions || []),
        ])];
        const mergedSlides = [...new Set([
          ...gamification.slidesViewed,
          ...(localData.gamification.slidesViewed || []),
        ])];
        const mergedGames = [...new Set([
          ...gamification.gamesCompleted,
          ...(localData.gamification.gamesCompleted || []),
        ])];
        const mergedVideos = [...new Set([
          ...gamification.videosWatched,
          ...(localData.gamification.videosWatched || []),
        ])];

        // Merge achievements
        if (localData.gamification.achievements) {
          for (const localAchievement of localData.gamification.achievements) {
            const existing = gamification.achievements.find(a => a.id === localAchievement.id);
            if (!existing) {
              gamification.achievements.push(localAchievement);
            } else if (!existing.unlocked && localAchievement.unlocked) {
              existing.unlocked = true;
              existing.unlockedAt = localAchievement.unlockedAt;
              existing.points = localAchievement.points;
            }
          }
        }

        gamification.exploredBrainRegions = mergedRegions;
        gamification.slidesViewed = mergedSlides;
        gamification.gamesCompleted = mergedGames;
        gamification.videosWatched = mergedVideos;

        // Take max values
        gamification.totalPoints = Math.max(
          gamification.totalPoints,
          localData.gamification.totalPoints || 0
        );
        gamification.maxScrollProgress = Math.max(
          gamification.maxScrollProgress,
          localData.gamification.maxScrollProgress || 0
        );
        gamification.audioJourneyProgress = Math.max(
          gamification.audioJourneyProgress,
          localData.gamification.audioJourneyProgress || 0
        );
        gamification.totalTimeSpent += localData.gamification.totalTimeSpent || 0;
        gamification.checklistCompleted = gamification.checklistCompleted ||
          localData.gamification.checklistCompleted;

        await gamification.save();
      }

      serverData.gamification = gamification.toJSON();
    } else if (localData?.gamification) {
      const newGamification = await Gamification.create({
        userId,
        ...localData.gamification,
      });
      serverData.gamification = newGamification.toJSON();
    }

    // Resolve settings (server always wins for settings)
    if (settings) {
      serverData.settings = settings.toJSON();
    } else if (localData?.settings) {
      const newSettings = await Settings.create({
        userId,
        ...localData.settings,
      });
      serverData.settings = newSettings.toJSON();
    }

    // Sync sessions (merge unique sessions)
    if (localData?.sessions?.length > 0) {
      const existingClientIds = new Set(sessions.map((s) => s.clientId).filter(Boolean));

      for (const localSession of localData.sessions) {
        const clientId = typeof localSession.clientId === 'string'
          ? localSession.clientId
          : localSession.id;
        if (!clientId) continue;

        await Session.findOneAndUpdate(
          { userId, clientId },
          {
            $set: {
              outcomes: localSession.outcomes,
              compositeResult: localSession.compositeResult,
              totalPoints: localSession.totalPoints,
              achievements: localSession.achievements,
              duration: localSession.duration,
            },
            $setOnInsert: { userId, clientId },
          },
          { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true },
        );

        existingClientIds.add(clientId);
      }

      // Refetch sessions
      const updatedSessions = await Session.find({ userId })
        .sort({ createdAt: -1 })
        .limit(50);
      serverData.sessions = updatedSessions.map(s => s.toJSON());
    } else {
      serverData.sessions = sessions.map(s => s.toJSON());
    }

    res.json({
      success: true,
      serverData,
      conflicts,
      syncedAt: Date.now(),
    });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Sync failed' },
    });
  }
});

/**
 * GET /sync/last - Get last sync time
 */
router.get('/last', async (req, res) => {
  try {
    // Get the most recent update across all user data
    const [clinicalProgress, gamification, settings] = await Promise.all([
      ClinicalProgress.findOne({ userId: req.userId }),
      Gamification.findOne({ userId: req.userId }),
      Settings.findOne({ userId: req.userId }),
    ]);

    const timestamps = [
      clinicalProgress?.updatedAt?.getTime() || 0,
      gamification?.updatedAt?.getTime() || 0,
      settings?.updatedAt?.getTime() || 0,
    ];

    res.json({
      success: true,
      lastSyncAt: Math.max(...timestamps),
    });
  } catch (error) {
    console.error('Get last sync error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to get last sync time' },
    });
  }
});

export default router;
