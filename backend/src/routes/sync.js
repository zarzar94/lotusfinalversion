/**
 * Sync Routes - Cross-device synchronization endpoints
 */

import express, { Router } from 'express';
import jwt from 'jsonwebtoken';
import { ClinicalProgress, Gamification, Settings, Session, User } from '../models/index.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

const parseJsonField = (value) => {
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
};

const normalizeLocalData = (localData) => {
  if (!localData || typeof localData !== 'object') return {};
  return {
    ...localData,
    clinicalProgress: parseJsonField(localData.clinicalProgress),
    gamification: parseJsonField(localData.gamification),
    settings: parseJsonField(localData.settings),
    sessions: parseJsonField(localData.sessions),
  };
};

const syncUserData = async ({ userId, lastSyncAt, localData }) => {
  const serverData = {};
  const conflicts = [];
  const lastSyncTime = Number.isFinite(Number(lastSyncAt)) ? Number(lastSyncAt) : 0;

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

    if (localData?.clinicalProgress && serverUpdated < lastSyncTime) {
      // Local is newer, update server
      Object.assign(clinicalProgress, localData.clinicalProgress);
      await clinicalProgress.save();
    } else if (serverUpdated > lastSyncTime) {
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

    if (localData?.gamification && serverUpdated < lastSyncTime) {
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
  if (Array.isArray(localData?.sessions) && localData.sessions.length > 0) {
    const existingIds = new Set(sessions.map(s => s._id.toString()));

    for (const localSession of localData.sessions) {
      const localId = localSession?.id || localSession?._id;
      if (!localId || !existingIds.has(localId.toString())) {
        await Session.create({
          userId,
          outcomes: localSession.outcomes,
          compositeResult: localSession.compositeResult,
          totalPoints: localSession.totalPoints,
          achievements: localSession.achievements,
          duration: localSession.duration,
        });
      }
    }

    // Refetch sessions
    const updatedSessions = await Session.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);
    serverData.sessions = updatedSessions.map(s => s.toJSON());
  } else {
    serverData.sessions = sessions.map(s => s.toJSON());
  }

  return { serverData, conflicts };
};

/**
 * POST /sync/beacon - Sync data on page unload
 */
router.post('/beacon', express.text({ type: '*/*', limit: '200kb' }), async (req, res) => {
  try {
    let payload = req.body;
    if (typeof payload === 'string') {
      try {
        payload = JSON.parse(payload);
      } catch {
        return res.status(400).json({
          success: false,
          error: { code: 'INVALID_JSON', message: 'Invalid JSON body' },
        });
      }
    }

    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_BODY', message: 'Request body required' },
      });
    }

    const { token, lastSyncAt, localData } = payload;
    if (!token) {
      return res.status(401).json({
        success: false,
        error: { code: 'NO_TOKEN', message: 'Access token required' },
      });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({
        success: false,
        error: { code: 'SERVER_ERROR', message: 'JWT secret not configured' },
      });
    }

    const decoded = jwt.verify(token, jwtSecret);
    const userId = decoded.userId || decoded.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_TOKEN', message: 'Invalid access token' },
      });
    }

    const user = await User.findById(userId);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_USER', message: 'User not found or inactive' },
      });
    }

    const normalizedLocalData = normalizeLocalData(localData);
    const { serverData, conflicts } = await syncUserData({
      userId: user._id,
      lastSyncAt,
      localData: normalizedLocalData,
    });

    res.json({
      success: true,
      serverData,
      conflicts,
      syncedAt: Date.now(),
    });
  } catch (error) {
    console.error('Beacon sync error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Sync failed' },
    });
  }
});

router.use(authenticate);

/**
 * POST /sync - Sync all user data
 */
router.post('/', async (req, res) => {
  try {
    const { lastSyncAt, localData } = req.body;
    const normalizedLocalData = normalizeLocalData(localData);
    const { serverData, conflicts } = await syncUserData({
      userId: req.userId,
      lastSyncAt,
      localData: normalizedLocalData,
    });

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
