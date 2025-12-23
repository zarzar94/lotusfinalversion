import express from 'express';
import User from '../models/User.js';
import ClinicalProgress from '../models/ClinicalProgress.js';
import Session from '../models/Session.js';
import { getAuditLogs, getSecurityAlerts } from '../utils/audit.js';
import { getStats as getWsStats } from '../utils/websocket.js';
import { getStats as getCacheStats } from '../utils/cache.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

// ═══════════════════════════════════════════════════════════════════════════
// ADMIN MIDDLEWARE
// ═══════════════════════════════════════════════════════════════════════════

const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (!['super_admin', 'clinician'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Admin access required' });
  }

  next();
};

const requireSuperAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'super_admin') {
    return res.status(403).json({ error: 'Super admin access required' });
  }

  next();
};

// ═══════════════════════════════════════════════════════════════════════════
// DASHBOARD STATS
// ═══════════════════════════════════════════════════════════════════════════

router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      newUsersThisMonth,
      activeUsersThisWeek,
      totalSessions,
      sessionsThisMonth,
      averageProgress,
      usersByRole,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Session.distinct('userId', { completedAt: { $gte: sevenDaysAgo } }).then(ids => ids.length),
      Session.countDocuments(),
      Session.countDocuments({ completedAt: { $gte: thirtyDaysAgo } }),
      ClinicalProgress.aggregate([
        { $group: { _id: null, avgProgress: { $avg: { $divide: ['$sessionsCompleted', '$totalSessions'] } } } },
      ]).then(result => result[0]?.avgProgress * 100 || 0),
      User.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } },
      ]),
    ]);

    res.json({
      users: {
        total: totalUsers,
        newThisMonth: newUsersThisMonth,
        activeThisWeek: activeUsersThisWeek,
        byRole: usersByRole.reduce((acc, { _id, count }) => {
          acc[_id] = count;
          return acc;
        }, {}),
      },
      sessions: {
        total: totalSessions,
        thisMonth: sessionsThisMonth,
        averagePerUser: totalUsers > 0 ? (totalSessions / totalUsers).toFixed(1) : 0,
      },
      progress: {
        averageCompletion: averageProgress.toFixed(1),
      },
      system: {
        websocket: getWsStats(),
        cache: getCacheStats(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
      },
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// USER MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════

router.get('/users', requireAdmin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      role,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const query = {};

    if (role) {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password -refreshToken -resetToken')
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .lean(),
      User.countDocuments(query),
    ]);

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.get('/users/:id', requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -refreshToken -resetToken')
      .lean();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's progress and sessions
    const [progress, sessions] = await Promise.all([
      ClinicalProgress.findOne({ userId: user._id }).lean(),
      Session.find({ userId: user._id })
        .sort({ completedAt: -1 })
        .limit(10)
        .lean(),
    ]);

    res.json({
      user,
      progress,
      recentSessions: sessions,
    });
  } catch (error) {
    console.error('Admin user detail error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

router.patch('/users/:id/role', requireSuperAdmin, async (req, res) => {
  try {
    const { role } = req.body;

    const validRoles = ['guest', 'patient', 'parent', 'clinician', 'school_admin', 'super_admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password -refreshToken -resetToken');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user, message: 'Role updated successfully' });
  } catch (error) {
    console.error('Admin role change error:', error);
    res.status(500).json({ error: 'Failed to update role' });
  }
});

router.delete('/users/:id', requireSuperAdmin, async (req, res) => {
  try {
    const userId = req.params.id;

    // Prevent self-deletion
    if (userId === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete user and related data
    await Promise.all([
      User.findByIdAndDelete(userId),
      ClinicalProgress.deleteMany({ userId }),
      Session.deleteMany({ userId }),
    ]);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Admin user delete error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// AUDIT LOGS
// ═══════════════════════════════════════════════════════════════════════════

router.get('/audit-logs', requireSuperAdmin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      userId,
      action,
      status,
      startDate,
      endDate,
    } = req.query;

    const result = await getAuditLogs(
      { userId, action, status, startDate, endDate },
      { page: parseInt(page), limit: parseInt(limit) }
    );

    res.json(result);
  } catch (error) {
    console.error('Audit logs error:', error);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

router.get('/security-alerts', requireSuperAdmin, async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const alerts = await getSecurityAlerts(parseInt(days));
    res.json({ alerts });
  } catch (error) {
    console.error('Security alerts error:', error);
    res.status(500).json({ error: 'Failed to fetch security alerts' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// SYSTEM MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════

router.get('/system/health', requireAdmin, async (req, res) => {
  try {
    const mongoStatus = await User.db.db.admin().ping();

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        mongodb: mongoStatus.ok === 1 ? 'connected' : 'disconnected',
        websocket: getWsStats().totalConnections >= 0 ? 'running' : 'stopped',
      },
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version || '1.0.0',
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
    });
  }
});

router.post('/system/cache/clear', requireSuperAdmin, async (req, res) => {
  try {
    const { clear } = await import('../utils/cache.js');
    clear();
    res.json({ message: 'Cache cleared successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear cache' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// DATA EXPORT
// ═══════════════════════════════════════════════════════════════════════════

router.get('/export/users', requireSuperAdmin, async (req, res) => {
  try {
    const users = await User.find()
      .select('-password -refreshToken -resetToken')
      .lean();

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=users-export.json');
    res.json({ exportDate: new Date().toISOString(), users });
  } catch (error) {
    res.status(500).json({ error: 'Export failed' });
  }
});

router.get('/export/sessions', requireSuperAdmin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const query = {};
    if (startDate || endDate) {
      query.completedAt = {};
      if (startDate) query.completedAt.$gte = new Date(startDate);
      if (endDate) query.completedAt.$lte = new Date(endDate);
    }

    const sessions = await Session.find(query)
      .populate('userId', 'name email')
      .lean();

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=sessions-export.json');
    res.json({ exportDate: new Date().toISOString(), sessions });
  } catch (error) {
    res.status(500).json({ error: 'Export failed' });
  }
});

export default router;
