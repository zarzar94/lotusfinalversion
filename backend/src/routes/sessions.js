/**
 * Sessions Routes - Assessment session endpoints
 */

import { Router } from 'express';
import { body, query, validationResult } from 'express-validator';
import { ClinicalProgress, Session, User } from '../models/index.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

const PROGRAM_TOTAL_SESSIONS = 20;
const MS_IN_DAY = 24 * 60 * 60 * 1000;

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

const toDateValue = (value) => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isFinite(date.getTime()) ? date : null;
};

const getSessionDate = (session) => toDateValue(session?.createdAt ?? session?.date);

const getSessionTimestamp = (session) => {
  const date = getSessionDate(session);
  return date ? date.getTime() : null;
};

const getSessionAverageScore = (session) => {
  const entries = getOutcomeEntries(session?.outcomes);
  if (entries.length === 0) return null;
  let sum = 0;
  let count = 0;
  entries.forEach(([, outcome]) => {
    const score = deriveScore100FromOutcome(outcome);
    sum += score;
    count += 1;
  });
  if (count === 0) return null;
  return Math.round(sum / count);
};

const getOutcomeForKey = (session, key) => {
  if (!session?.outcomes) return null;
  if (session.outcomes instanceof Map) {
    return session.outcomes.get(key) ?? null;
  }
  if (typeof session.outcomes === 'object') {
    return session.outcomes[key] ?? null;
  }
  return null;
};

const getBaselineScoreForKeys = (sessions, keys) => {
  for (const session of sessions) {
    for (const key of keys) {
      const outcome = getOutcomeForKey(session, key);
      if (outcome) {
        return deriveScore100FromOutcome(outcome);
      }
    }
  }
  return null;
};

const getLatestScoreForKeys = (sessions, keys) => {
  for (let i = sessions.length - 1; i >= 0; i -= 1) {
    const session = sessions[i];
    for (const key of keys) {
      const outcome = getOutcomeForKey(session, key);
      if (outcome) {
        return deriveScore100FromOutcome(outcome);
      }
    }
  }
  return null;
};

const getAverageScoreForKeys = (sessions, keys) => {
  const scores = [];
  sessions.forEach((session) => {
    keys.forEach((key) => {
      const outcome = getOutcomeForKey(session, key);
      if (outcome) {
        scores.push(deriveScore100FromOutcome(outcome));
      }
    });
  });
  if (scores.length === 0) return null;
  const sum = scores.reduce((total, value) => total + value, 0);
  return Math.round(sum / scores.length);
};

const getWeekStart = (value) => {
  const date = toDateValue(value) ?? new Date();
  const day = date.getDay();
  const diff = (day + 6) % 7;
  const start = new Date(date);
  start.setDate(start.getDate() - diff);
  start.setHours(0, 0, 0, 0);
  return start;
};

const getCurrentWeekdayCounts = (sessions) => {
  const weekStart = getWeekStart(new Date());
  const weekEnd = new Date(weekStart.getTime() + 7 * MS_IN_DAY);
  const counts = [0, 0, 0, 0, 0];
  sessions.forEach((session) => {
    const date = getSessionDate(session);
    if (!date) return;
    if (date < weekStart || date >= weekEnd) return;
    const day = date.getDay();
    if (day >= 1 && day <= 5) {
      counts[day - 1] += 1;
    }
  });
  return counts;
};

const getWeeklyBuckets = (sessions, weekCount = 6) => {
  const now = new Date();
  const currentWeekStart = getWeekStart(now);
  const buckets = [];
  for (let i = weekCount - 1; i >= 0; i -= 1) {
    const start = new Date(currentWeekStart);
    start.setDate(start.getDate() - i * 7);
    const end = new Date(start.getTime() + 7 * MS_IN_DAY);
    buckets.push({
      start,
      end,
      label: `Week ${weekCount - i}`,
      sessionsCompleted: 0,
      scoreSum: 0,
      scoreCount: 0,
      activeUsers: new Set(),
    });
  }

  sessions.forEach((session) => {
    const date = getSessionDate(session);
    if (!date) return;
    const timestamp = date.getTime();
    const bucket = buckets.find((entry) => timestamp >= entry.start.getTime() && timestamp < entry.end.getTime());
    if (!bucket) return;
    const averageScore = getSessionAverageScore(session);
    if (averageScore !== null) {
      bucket.scoreSum += averageScore;
      bucket.scoreCount += 1;
    }
    bucket.sessionsCompleted += 1;
    if (session.userId) {
      bucket.activeUsers.add(session.userId.toString());
    }
  });

  return buckets.map((bucket) => ({
    week: bucket.label,
    weekAr: bucket.label,
    sessionsCompleted: bucket.sessionsCompleted,
    averageScore: bucket.scoreCount > 0 ? Math.round(bucket.scoreSum / bucket.scoreCount) : 0,
    activeStudents: bucket.activeUsers.size,
  }));
};

const getStreakFromSessions = (sessions) => {
  const sessionDates = sessions
    .map((session) => getSessionDate(session))
    .filter((date) => date)
    .map((date) => date.toDateString());
  if (sessionDates.length === 0) return 0;

  const uniqueDates = Array.from(new Set(sessionDates));
  if (uniqueDates.length === 0) return 0;

  const sortedDates = uniqueDates
    .map((date) => new Date(date).getTime())
    .filter((value) => Number.isFinite(value))
    .sort((a, b) => b - a);
  if (sortedDates.length === 0) return 0;

  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - MS_IN_DAY).toDateString();
  const latest = new Date(sortedDates[0]).toDateString();
  if (latest !== today && latest !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < sortedDates.length; i += 1) {
    const diffDays = Math.round((sortedDates[i - 1] - sortedDates[i]) / MS_IN_DAY);
    if (diffDays === 1) {
      streak += 1;
    } else {
      break;
    }
  }
  return streak;
};

const inferTreatmentPhase = (sessionsCompleted) => {
  if (sessionsCompleted >= 20) return 'completed';
  if (sessionsCompleted >= 15) return 'maintenance';
  if (sessionsCompleted >= 1) return 'active';
  return 'assessment';
};

const getProgressPercent = (sessionsCompleted, totalSessions) => {
  if (!totalSessions || totalSessions <= 0) return 0;
  return Math.round((sessionsCompleted / totalSessions) * 100);
};

const getAgeFromBirthDate = (birthDate) => {
  const date = toDateValue(birthDate);
  if (!date) return null;
  const diff = Date.now() - date.getTime();
  if (diff < 0) return null;
  return Math.floor(diff / (365.25 * MS_IN_DAY));
};

const groupSessionsByUser = (sessions) => {
  const map = new Map();
  sessions.forEach((session) => {
    const userId = session.userId?.toString?.() ?? session.userId;
    if (!userId) return;
    if (!map.has(userId)) {
      map.set(userId, []);
    }
    map.get(userId).push(session);
  });
  map.forEach((value) => {
    value.sort((a, b) => {
      const aTime = getSessionTimestamp(a) ?? 0;
      const bTime = getSessionTimestamp(b) ?? 0;
      return aTime - bTime;
    });
  });
  return map;
};

const METRIC_KEYS = {
  attention: ['attention'],
  processingSpeed: ['sequence', 'frequency'],
  auditoryDiscrimination: ['dichotic_listening', 'speech_in_noise'],
};

const getMetricValue = (progressValue, sessions, keys) => {
  if (typeof progressValue === 'number') return progressValue;
  const average = getAverageScoreForKeys(sessions, keys);
  return average ?? 0;
};

const getMetricBaseline = (sessions, keys, currentValue) => {
  const baseline = getBaselineScoreForKeys(sessions, keys);
  if (baseline !== null) return baseline;
  if (typeof currentValue === 'number') return currentValue;
  const latest = getLatestScoreForKeys(sessions, keys);
  return latest ?? 0;
};

const getLastActivityTimestamp = (progress, sessions, user) => {
  const progressDate = toDateValue(progress?.lastActivityDate);
  if (progressDate) return progressDate.getTime();
  const latestSession = sessions[sessions.length - 1];
  const sessionDate = getSessionDate(latestSession);
  if (sessionDate) return sessionDate.getTime();
  const userDate = toDateValue(user?.lastLogin ?? user?.createdAt);
  return userDate ? userDate.getTime() : Date.now();
};

const getStartDateTimestamp = (sessions, user) => {
  const firstSession = sessions[0];
  const sessionDate = getSessionDate(firstSession);
  if (sessionDate) return sessionDate.getTime();
  const userDate = toDateValue(user?.createdAt ?? user?.lastLogin);
  return userDate ? userDate.getTime() : Date.now();
};

const getTotalSessionsTarget = (progress) => {
  const total = progress?.totalSessions;
  if (typeof total === 'number' && total > 0) return total;
  return PROGRAM_TOTAL_SESSIONS;
};

const getStudentStatus = (progressPercent, attentionScore, treatmentPhase) => {
  if (treatmentPhase === 'completed' || progressPercent >= 100) return 'completed';
  if (progressPercent < 40 || attentionScore < 60) return 'at_risk';
  if (progressPercent < 70) return 'needs_attention';
  return 'on_track';
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
 * GET /sessions/analysis/children - Get parent-linked child summaries
 */
router.get('/analysis/children', async (req, res) => {
  try {
    const role = req.user?.role;
    if (!['parent', 'super_admin'].includes(role)) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Insufficient permissions' },
      });
    }

    const childIds = Array.isArray(req.user?.children)
      ? req.user.children.map((childId) => childId.toString())
      : [];

    if (childIds.length === 0) {
      return res.json({ success: true, children: [] });
    }

    const [children, progressList, sessions] = await Promise.all([
      User.find({ _id: { $in: childIds } })
        .select('name nameAr dateOfBirth lastLogin createdAt')
        .lean(),
      ClinicalProgress.find({ userId: { $in: childIds } }).lean(),
      Session.find({ userId: { $in: childIds } })
        .sort({ createdAt: 1 })
        .lean(),
    ]);

    const progressByUser = new Map();
    progressList.forEach((progress) => {
      progressByUser.set(progress.userId.toString(), progress);
    });
    const sessionsByUser = groupSessionsByUser(sessions);

    const childrenSummaries = children.map((child) => {
      const id = child._id.toString();
      const progress = progressByUser.get(id);
      const childSessions = sessionsByUser.get(id) || [];
      const sessionsCompleted = typeof progress?.sessionsCompleted === 'number'
        ? progress.sessionsCompleted
        : childSessions.length;
      const totalSessions = getTotalSessionsTarget(progress);
      const treatmentPhase = progress?.treatmentPhase ?? inferTreatmentPhase(sessionsCompleted);
      const attentionScore = getMetricValue(progress?.attentionScore, childSessions, METRIC_KEYS.attention);
      const processingSpeed = getMetricValue(progress?.processingSpeed, childSessions, METRIC_KEYS.processingSpeed);
      const auditoryDiscrimination = getMetricValue(
        progress?.auditoryDiscrimination,
        childSessions,
        METRIC_KEYS.auditoryDiscrimination
      );

      return {
        id,
        name: child.name,
        nameAr: child.nameAr || child.name,
        age: getAgeFromBirthDate(child.dateOfBirth),
        sessionsCompleted,
        totalSessions,
        attentionScore,
        processingSpeed,
        auditoryDiscrimination,
        streak: typeof progress?.streak === 'number' ? progress.streak : getStreakFromSessions(childSessions),
        lastActivity: getLastActivityTimestamp(progress, childSessions, child),
        treatmentPhase,
        weeklyProgress: getCurrentWeekdayCounts(childSessions),
      };
    });

    res.json({ success: true, children: childrenSummaries });
  } catch (error) {
    console.error('Get children analysis error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to load children analytics' },
    });
  }
});

/**
 * GET /sessions/analysis/patients - Get clinician patient summaries
 */
router.get('/analysis/patients',
  [query('school').optional().isString().trim().notEmpty().withMessage('Invalid school')],
  handleValidation,
  async (req, res) => {
    try {
      const role = req.user?.role;
      if (!['clinician', 'super_admin'].includes(role)) {
        return res.status(403).json({
          success: false,
          error: { code: 'FORBIDDEN', message: 'Insufficient permissions' },
        });
      }

      const requestedSchool = typeof req.query.school === 'string' ? req.query.school : null;
      const school = role === 'clinician' ? (req.user.school || requestedSchool) : requestedSchool;

      const queryFilter = { role: 'patient' };
      if (school) {
        queryFilter.school = school;
      }

      const patients = await User.find(queryFilter)
        .select('name nameAr email school dateOfBirth lastLogin createdAt')
        .lean();

      if (patients.length === 0) {
        return res.json({ success: true, patients: [] });
      }

      const patientIds = patients.map((patient) => patient._id.toString());
      const [progressList, sessions] = await Promise.all([
        ClinicalProgress.find({ userId: { $in: patientIds } }).lean(),
        Session.find({ userId: { $in: patientIds } })
          .sort({ createdAt: 1 })
          .lean(),
      ]);

      const progressByUser = new Map();
      progressList.forEach((progress) => {
        progressByUser.set(progress.userId.toString(), progress);
      });
      const sessionsByUser = groupSessionsByUser(sessions);

      const patientSummaries = patients.map((patient) => {
        const id = patient._id.toString();
        const progress = progressByUser.get(id);
        const patientSessions = sessionsByUser.get(id) || [];
        const sessionsCompleted = typeof progress?.sessionsCompleted === 'number'
          ? progress.sessionsCompleted
          : patientSessions.length;
        const totalSessions = getTotalSessionsTarget(progress);
        const treatmentPhase = progress?.treatmentPhase ?? inferTreatmentPhase(sessionsCompleted);

        const attentionScore = getMetricValue(progress?.attentionScore, patientSessions, METRIC_KEYS.attention);
        const processingSpeed = getMetricValue(progress?.processingSpeed, patientSessions, METRIC_KEYS.processingSpeed);
        const auditoryDiscrimination = getMetricValue(
          progress?.auditoryDiscrimination,
          patientSessions,
          METRIC_KEYS.auditoryDiscrimination
        );

        return {
          id,
          name: patient.name,
          nameAr: patient.nameAr || patient.name,
          email: patient.email,
          age: getAgeFromBirthDate(patient.dateOfBirth),
          startDate: getStartDateTimestamp(patientSessions, patient),
          sessionsCompleted,
          totalSessions,
          attentionScore,
          attentionBaseline: getMetricBaseline(patientSessions, METRIC_KEYS.attention, attentionScore),
          processingSpeed,
          processingBaseline: getMetricBaseline(patientSessions, METRIC_KEYS.processingSpeed, processingSpeed),
          auditoryDiscrimination,
          auditoryBaseline: getMetricBaseline(patientSessions, METRIC_KEYS.auditoryDiscrimination, auditoryDiscrimination),
          streak: typeof progress?.streak === 'number' ? progress.streak : getStreakFromSessions(patientSessions),
          lastActivity: getLastActivityTimestamp(progress, patientSessions, patient),
          treatmentPhase,
          notes: [],
        };
      });

      res.json({ success: true, patients: patientSummaries });
    } catch (error) {
      console.error('Get patients analysis error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'SERVER_ERROR', message: 'Failed to load patient analytics' },
      });
    }
  }
);

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

      const students = await User.find({ school, role: 'patient' })
        .select('name nameAr grade dateOfBirth lastLogin createdAt')
        .lean();
      const userIds = students.map((user) => user._id.toString());

      if (userIds.length === 0) {
        return res.json({
          success: true,
          summary: buildSchoolSummary([], school),
          students: [],
          weekly: getWeeklyBuckets([], 6),
          gradeDistribution: [],
        });
      }

      const [progressList, sessions] = await Promise.all([
        ClinicalProgress.find({ userId: { $in: userIds } }).lean(),
        Session.find({ userId: { $in: userIds } })
          .sort({ createdAt: 1 })
          .limit(1000)
          .lean(),
      ]);

      const progressByUser = new Map();
      progressList.forEach((progress) => {
        progressByUser.set(progress.userId.toString(), progress);
      });
      const sessionsByUser = groupSessionsByUser(sessions);

      const studentSummaries = students.map((student) => {
        const id = student._id.toString();
        const progress = progressByUser.get(id);
        const studentSessions = sessionsByUser.get(id) || [];
        const sessionsCompleted = typeof progress?.sessionsCompleted === 'number'
          ? progress.sessionsCompleted
          : studentSessions.length;
        const totalSessions = getTotalSessionsTarget(progress);
        const treatmentPhase = progress?.treatmentPhase ?? inferTreatmentPhase(sessionsCompleted);
        const attentionScore = getMetricValue(progress?.attentionScore, studentSessions, METRIC_KEYS.attention);
        const processingSpeed = getMetricValue(progress?.processingSpeed, studentSessions, METRIC_KEYS.processingSpeed);
        const progressPercent = getProgressPercent(sessionsCompleted, totalSessions);

        return {
          id,
          name: student.name,
          nameAr: student.nameAr || student.name,
          grade: student.grade || '--',
          gradeAr: student.grade ? student.grade : undefined,
          sessionsCompleted,
          totalSessions,
          attentionScore,
          processingSpeed,
          lastActivity: getLastActivityTimestamp(progress, studentSessions, student),
          status: getStudentStatus(progressPercent, attentionScore, treatmentPhase),
        };
      });

      const gradeTotals = new Map();
      studentSummaries.forEach((student) => {
        const progressPercent = getProgressPercent(student.sessionsCompleted, student.totalSessions);
        const gradeKey = student.grade || '--';
        const current = gradeTotals.get(gradeKey) || { grade: gradeKey, count: 0, progressSum: 0 };
        current.count += 1;
        current.progressSum += progressPercent;
        gradeTotals.set(gradeKey, current);
      });

      const gradeDistribution = Array.from(gradeTotals.values()).map((grade) => ({
        grade: grade.grade,
        gradeAr: grade.grade,
        count: grade.count,
        averageProgress: grade.count > 0 ? Math.round(grade.progressSum / grade.count) : 0,
      }));

      res.json({
        success: true,
        summary: buildSchoolSummary(sessions, school),
        students: studentSummaries,
        weekly: getWeeklyBuckets(sessions, 6),
        gradeDistribution,
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
