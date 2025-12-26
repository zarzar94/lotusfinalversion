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

const isPlainObject = (value) => Boolean(value && typeof value === 'object' && !Array.isArray(value));

const toTimestamp = (value) => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (value instanceof Date && Number.isFinite(value.getTime())) return value.getTime();
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const numeric = Number(trimmed);
    if (Number.isFinite(numeric)) return numeric;
    const parsed = new Date(trimmed);
    return Number.isFinite(parsed.getTime()) ? parsed.getTime() : null;
  }
  return null;
};

const getLatestTimestamp = (record, keys) => {
  if (!isPlainObject(record)) return null;
  let max = null;
  keys.forEach((key) => {
    const timestamp = toTimestamp(record[key]);
    if (timestamp === null) return;
    if (max === null || timestamp > max) {
      max = timestamp;
    }
  });
  return max;
};

const toDateValue = (value) => {
  const timestamp = toTimestamp(value);
  if (timestamp === null) return null;
  const date = new Date(timestamp);
  return Number.isFinite(date.getTime()) ? date : null;
};

const mergeUnique = (current, incoming) => {
  const merged = new Set([...(current || []), ...(incoming || [])]);
  return Array.from(merged);
};

const mergeDateValues = (current, incoming) => {
  const timestamps = new Set();
  (current || []).forEach((value) => {
    const date = toDateValue(value);
    if (date) timestamps.add(date.getTime());
  });
  (incoming || []).forEach((value) => {
    const date = toDateValue(value);
    if (date) timestamps.add(date.getTime());
  });
  return Array.from(timestamps)
    .sort((a, b) => a - b)
    .map((timestamp) => new Date(timestamp));
};

const mergeAchievements = (current, incoming) => {
  const map = new Map();
  (current || []).forEach((achievement) => {
    if (!achievement?.id) return;
    map.set(achievement.id, { ...achievement });
  });
  (incoming || []).forEach((achievement) => {
    if (!achievement?.id) return;
    const existing = map.get(achievement.id);
    if (!existing) {
      map.set(achievement.id, { ...achievement });
      return;
    }
    const unlocked = Boolean(existing.unlocked || achievement.unlocked);
    const existingUnlockedAt = toTimestamp(existing.unlockedAt);
    const incomingUnlockedAt = toTimestamp(achievement.unlockedAt);
    const unlockedAt = existingUnlockedAt === null
      ? incomingUnlockedAt
      : incomingUnlockedAt === null
        ? existingUnlockedAt
        : Math.min(existingUnlockedAt, incomingUnlockedAt);
    map.set(achievement.id, {
      ...existing,
      unlocked,
      unlockedAt: unlockedAt === null ? existing.unlockedAt : new Date(unlockedAt),
      points: Math.max(existing.points || 0, achievement.points || 0),
    });
  });
  return Array.from(map.values());
};

const mergeClinicalProgress = (clinicalProgress, localProgress, preferLocalScalars) => {
  let changed = false;
  const localSessionsCompleted = toTimestamp(localProgress.sessionsCompleted);
  if (localSessionsCompleted !== null) {
    const next = Math.max(clinicalProgress.sessionsCompleted || 0, localSessionsCompleted);
    if (next !== clinicalProgress.sessionsCompleted) {
      clinicalProgress.sessionsCompleted = next;
      changed = true;
    }
  }

  const mergedDates = mergeDateValues(clinicalProgress.sessionDates, localProgress.sessionDates);
  if (mergedDates.length !== (clinicalProgress.sessionDates || []).length) {
    clinicalProgress.sessionDates = mergedDates;
    changed = true;
  }

  const localWeeklyGoalsMet = toTimestamp(localProgress.weeklyGoalsMet);
  if (localWeeklyGoalsMet !== null) {
    const next = Math.max(clinicalProgress.weeklyGoalsMet || 0, localWeeklyGoalsMet);
    if (next !== clinicalProgress.weeklyGoalsMet) {
      clinicalProgress.weeklyGoalsMet = next;
      changed = true;
    }
  }

  const localStreak = toTimestamp(localProgress.streak);
  if (localStreak !== null) {
    const next = preferLocalScalars ? localStreak : Math.max(clinicalProgress.streak || 0, localStreak);
    if (next !== clinicalProgress.streak) {
      clinicalProgress.streak = next;
      changed = true;
    }
  }

  if (preferLocalScalars) {
    if (typeof localProgress.attentionScore === 'number') {
      clinicalProgress.attentionScore = localProgress.attentionScore;
      changed = true;
    }
    if (typeof localProgress.processingSpeed === 'number') {
      clinicalProgress.processingSpeed = localProgress.processingSpeed;
      changed = true;
    }
    if (typeof localProgress.auditoryDiscrimination === 'number') {
      clinicalProgress.auditoryDiscrimination = localProgress.auditoryDiscrimination;
      changed = true;
    }
  }

  const localActivity = toDateValue(localProgress.lastActivityDate);
  const serverActivity = toDateValue(clinicalProgress.lastActivityDate);
  const nextActivity = [serverActivity, localActivity]
    .filter(Boolean)
    .reduce((latest, current) => (current.getTime() > latest.getTime() ? current : latest), serverActivity || localActivity);
  if (nextActivity && (!serverActivity || nextActivity.getTime() !== serverActivity.getTime())) {
    clinicalProgress.lastActivityDate = nextActivity;
    changed = true;
  }

  if (localProgress.hearingProfile && isPlainObject(localProgress.hearingProfile)) {
    const localHearingUpdated = getLatestTimestamp(localProgress.hearingProfile, ['updatedAt']);
    const serverHearingUpdated = getLatestTimestamp(clinicalProgress.hearingProfile, ['updatedAt']);
    const useLocal = serverHearingUpdated === null
      || (localHearingUpdated !== null && localHearingUpdated > serverHearingUpdated);
    if (useLocal) {
      clinicalProgress.hearingProfile = localProgress.hearingProfile;
      changed = true;
    }
  }

  return changed;
};

const mergeGamificationState = (gamification, localState) => {
  let changed = false;

  const mergedRegions = mergeUnique(gamification.exploredBrainRegions, localState.exploredBrainRegions);
  if (mergedRegions.length !== (gamification.exploredBrainRegions || []).length) {
    gamification.exploredBrainRegions = mergedRegions;
    changed = true;
  }

  const mergedSlides = mergeUnique(gamification.slidesViewed, localState.slidesViewed);
  if (mergedSlides.length !== (gamification.slidesViewed || []).length) {
    gamification.slidesViewed = mergedSlides;
    changed = true;
  }

  const mergedGames = mergeUnique(gamification.gamesCompleted, localState.gamesCompleted);
  if (mergedGames.length !== (gamification.gamesCompleted || []).length) {
    gamification.gamesCompleted = mergedGames;
    changed = true;
  }

  const mergedVideos = mergeUnique(gamification.videosWatched, localState.videosWatched);
  if (mergedVideos.length !== (gamification.videosWatched || []).length) {
    gamification.videosWatched = mergedVideos;
    changed = true;
  }

  const mergedAchievements = mergeAchievements(gamification.achievements, localState.achievements);
  const currentAchievements = (gamification.achievements || []).map((achievement) => (
    achievement?.toObject ? achievement.toObject() : achievement
  ));
  if (!deepEqual(mergedAchievements, currentAchievements)) {
    gamification.achievements = mergedAchievements;
    changed = true;
  }

  const totalPoints = Math.max(gamification.totalPoints || 0, localState.totalPoints || 0);
  if (totalPoints !== gamification.totalPoints) {
    gamification.totalPoints = totalPoints;
    changed = true;
  }

  const maxScrollProgress = Math.max(gamification.maxScrollProgress || 0, localState.maxScrollProgress || 0);
  if (maxScrollProgress !== gamification.maxScrollProgress) {
    gamification.maxScrollProgress = maxScrollProgress;
    changed = true;
  }

  const audioJourneyProgress = Math.max(gamification.audioJourneyProgress || 0, localState.audioJourneyProgress || 0);
  if (audioJourneyProgress !== gamification.audioJourneyProgress) {
    gamification.audioJourneyProgress = audioJourneyProgress;
    changed = true;
  }

  const totalTimeSpent = Math.max(gamification.totalTimeSpent || 0, localState.totalTimeSpent || 0);
  if (totalTimeSpent !== gamification.totalTimeSpent) {
    gamification.totalTimeSpent = totalTimeSpent;
    changed = true;
  }

  const checklistCompleted = Boolean(gamification.checklistCompleted || localState.checklistCompleted);
  if (checklistCompleted !== gamification.checklistCompleted) {
    gamification.checklistCompleted = checklistCompleted;
    changed = true;
  }

  const clinicalSessionsCompleted = Math.max(
    gamification.clinicalSessionsCompleted || 0,
    localState.clinicalSessionsCompleted || 0
  );
  if (clinicalSessionsCompleted !== gamification.clinicalSessionsCompleted) {
    gamification.clinicalSessionsCompleted = clinicalSessionsCompleted;
    changed = true;
  }

  const clinicalStreak = Math.max(gamification.clinicalStreak || 0, localState.clinicalStreak || 0);
  if (clinicalStreak !== gamification.clinicalStreak) {
    gamification.clinicalStreak = clinicalStreak;
    changed = true;
  }

  const currentClinicalActivity = toTimestamp(gamification.lastClinicalActivity) || 0;
  const lastClinicalActivity = Math.max(
    currentClinicalActivity,
    toTimestamp(localState.lastClinicalActivity) || 0
  );
  if (lastClinicalActivity > 0 && lastClinicalActivity !== currentClinicalActivity) {
    gamification.lastClinicalActivity = new Date(lastClinicalActivity);
    changed = true;
  }

  return changed;
};

const sanitizeSettings = (localSettings) => {
  if (!isPlainObject(localSettings)) return {};
  const output = {};
  if (localSettings.language) output.language = localSettings.language;
  if (localSettings.visitorMode) output.visitorMode = localSettings.visitorMode;
  if (localSettings.notifications) output.notifications = localSettings.notifications;
  if (localSettings.display) output.display = localSettings.display;
  if (localSettings.privacy) output.privacy = localSettings.privacy;
  if (localSettings.audio) output.audio = localSettings.audio;
  return output;
};

const applySettingsUpdate = (settingsDoc, updates) => {
  if (!isPlainObject(updates)) return;
  const patch = { ...updates };

  if (patch.notifications) {
    const base = settingsDoc.notifications?.toObject
      ? settingsDoc.notifications.toObject()
      : settingsDoc.notifications || {};
    settingsDoc.notifications = {
      ...base,
      ...patch.notifications,
    };
    delete patch.notifications;
  }

  if (patch.display) {
    const base = settingsDoc.display?.toObject
      ? settingsDoc.display.toObject()
      : settingsDoc.display || {};
    settingsDoc.display = {
      ...base,
      ...patch.display,
    };
    delete patch.display;
  }

  if (patch.privacy) {
    const base = settingsDoc.privacy?.toObject
      ? settingsDoc.privacy.toObject()
      : settingsDoc.privacy || {};
    settingsDoc.privacy = {
      ...base,
      ...patch.privacy,
    };
    delete patch.privacy;
  }

  if (patch.audio) {
    const base = settingsDoc.audio?.toObject
      ? settingsDoc.audio.toObject()
      : settingsDoc.audio || {};
    settingsDoc.audio = {
      ...base,
      ...patch.audio,
    };
    delete patch.audio;
  }

  Object.assign(settingsDoc, patch);
};

const deepEqual = (a, b) => {
  if (a === b) return true;
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((value, index) => deepEqual(value, b[index]));
  }
  if (isPlainObject(a) && isPlainObject(b)) {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    return keysA.every((key) => deepEqual(a[key], b[key]));
  }
  return false;
};

const buildConflict = ({ field, resolution, localValue, serverValue, localUpdatedAt, serverUpdatedAt }) => ({
  field,
  resolution,
  localValue,
  serverValue,
  localUpdatedAt: localUpdatedAt ?? undefined,
  serverUpdatedAt: serverUpdatedAt ?? undefined,
});

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
  const localClinicalProgress = isPlainObject(localData?.clinicalProgress)
    ? localData.clinicalProgress
    : null;
  if (clinicalProgress) {
    const serverUpdatedAt = clinicalProgress.updatedAt?.getTime() || 0;
    const localUpdatedAt = getLatestTimestamp(localClinicalProgress, ['updatedAt', 'lastActivityDate']);
    const localChanged = localUpdatedAt !== null ? localUpdatedAt > lastSyncTime : false;
    const serverChanged = serverUpdatedAt > lastSyncTime;

    if (localClinicalProgress) {
      const preferLocalScalars = localUpdatedAt !== null && localUpdatedAt > serverUpdatedAt;
      const merged = mergeClinicalProgress(clinicalProgress, localClinicalProgress, preferLocalScalars);
      if (merged) {
        await clinicalProgress.save();
      }

      if (localChanged && serverChanged) {
        conflicts.push(buildConflict({
          field: 'clinicalProgress',
          localValue: localClinicalProgress,
          serverValue: clinicalProgress.toJSON(),
          resolution: 'merge',
          localUpdatedAt,
          serverUpdatedAt,
        }));
      }
    }

    serverData.clinicalProgress = clinicalProgress.toJSON();
  } else if (localClinicalProgress) {
    // Create from local data
    const payload = { ...localClinicalProgress };
    delete payload.updatedAt;
    delete payload.userId;
    const newProgress = await ClinicalProgress.create({
      userId,
      ...payload,
    });
    serverData.clinicalProgress = newProgress.toJSON();
  }

  // Resolve gamification
  const localGamification = isPlainObject(localData?.gamification)
    ? localData.gamification
    : null;
  if (gamification) {
    const serverUpdatedAt = gamification.updatedAt?.getTime() || 0;
    const localUpdatedAt = getLatestTimestamp(localGamification, [
      'updatedAt',
      'lastClinicalActivity',
      'sessionStartTime',
    ]);
    const localChanged = localUpdatedAt !== null ? localUpdatedAt > lastSyncTime : false;
    const serverChanged = serverUpdatedAt > lastSyncTime;

    if (localGamification) {
      const merged = mergeGamificationState(gamification, localGamification);
      if (merged) {
        await gamification.save();
      }

      if (localChanged && serverChanged) {
        conflicts.push(buildConflict({
          field: 'gamification',
          localValue: localGamification,
          serverValue: gamification.toJSON(),
          resolution: 'merge',
          localUpdatedAt,
          serverUpdatedAt,
        }));
      }
    }

    serverData.gamification = gamification.toJSON();
  } else if (localGamification) {
    const newGamification = await Gamification.create({
      userId,
      ...localGamification,
    });
    serverData.gamification = newGamification.toJSON();
  }

  // Resolve settings
  const localSettingsPayload = isPlainObject(localData?.settings) ? localData.settings : null;
  const localSettings = sanitizeSettings(localSettingsPayload);
  const localSettingsUpdatedAt = getLatestTimestamp(localSettingsPayload, ['updatedAt']);
  const hasLocalSettings = Object.keys(localSettings).length > 0;

  if (settings) {
    const serverUpdatedAt = settings.updatedAt?.getTime() || 0;
    const serverChanged = serverUpdatedAt > lastSyncTime;
    const localChanged = localSettingsUpdatedAt !== null
      ? localSettingsUpdatedAt > lastSyncTime
      : hasLocalSettings;
    const serverSnapshot = settings.toJSON();
    const serverSanitized = sanitizeSettings(serverSnapshot);

    if (hasLocalSettings && !deepEqual(localSettings, serverSanitized)) {
      let applyLocal = false;
      if (!serverChanged) {
        applyLocal = localSettingsUpdatedAt === null || localSettingsUpdatedAt >= serverUpdatedAt;
      } else if (localSettingsUpdatedAt !== null) {
        applyLocal = localSettingsUpdatedAt > serverUpdatedAt;
      }

      if (applyLocal) {
        applySettingsUpdate(settings, localSettings);
        await settings.save();
      }

      if (localChanged && serverChanged) {
        conflicts.push(buildConflict({
          field: 'settings',
          localValue: localSettings,
          serverValue: serverSnapshot,
          resolution: applyLocal ? 'local' : 'server',
          localUpdatedAt: localSettingsUpdatedAt,
          serverUpdatedAt,
        }));
      }
    }

    serverData.settings = settings.toJSON();
  } else if (hasLocalSettings) {
    const newSettings = new Settings({ userId });
    applySettingsUpdate(newSettings, localSettings);
    await newSettings.save();
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
