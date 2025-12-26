import mongoose from 'mongoose';

// ═══════════════════════════════════════════════════════════════════════════
// AUDIT LOG SCHEMA
// ═══════════════════════════════════════════════════════════════════════════

const auditLogSchema = new mongoose.Schema({
  // Who performed the action
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
  },
  userEmail: String,
  userRole: String,

  // What action was performed
  action: {
    type: String,
    required: true,
    enum: [
      // Auth actions
      'LOGIN', 'LOGOUT', 'REGISTER', 'PASSWORD_RESET', 'PASSWORD_CHANGE',
      'TOKEN_REFRESH', 'LOGIN_FAILED',
      // User actions
      'USER_CREATE', 'USER_UPDATE', 'USER_DELETE', 'ROLE_CHANGE',
      // Clinical actions
      'SESSION_START', 'SESSION_COMPLETE', 'PROGRESS_UPDATE',
      // Admin actions
      'SETTINGS_CHANGE', 'DATA_EXPORT', 'DATA_IMPORT', 'BULK_DELETE',
      // System actions
      'API_ERROR', 'RATE_LIMIT_HIT', 'SECURITY_ALERT',
    ],
    index: true,
  },

  // Target of the action
  targetType: {
    type: String,
    enum: ['user', 'session', 'progress', 'settings', 'system', 'file'],
  },
  targetId: String,

  // Details
  description: String,
  metadata: mongoose.Schema.Types.Mixed,

  // Request context
  ipAddress: String,
  userAgent: String,
  endpoint: String,
  method: String,

  // Result
  status: {
    type: String,
    enum: ['success', 'failure', 'warning'],
    default: 'success',
  },
  errorMessage: String,

  // Timestamps
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: false,
  collection: 'audit_logs',
});

// Compound indexes for common queries
auditLogSchema.index({ userId: 1, timestamp: -1 });
auditLogSchema.index({ action: 1, timestamp: -1 });
auditLogSchema.index({ status: 1, timestamp: -1 });

// TTL index to auto-delete old logs (90 days)
auditLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

// ═══════════════════════════════════════════════════════════════════════════
// AUDIT LOGGING FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

export async function log(options) {
  const {
    userId,
    userEmail,
    userRole,
    action,
    targetType,
    targetId,
    description,
    metadata,
    req,
    status = 'success',
    errorMessage,
  } = options;

  try {
    const logEntry = new AuditLog({
      userId,
      userEmail,
      userRole,
      action,
      targetType,
      targetId,
      description,
      metadata,
      ipAddress: req?.ip || req?.connection?.remoteAddress,
      userAgent: req?.headers?.['user-agent'],
      endpoint: req?.originalUrl,
      method: req?.method,
      status,
      errorMessage,
    });

    await logEntry.save();

    // Log to console in development
    if (process.env.NODE_ENV !== 'production') {
      console.log(`📋 Audit: [${action}] ${description || ''}`);
    }

    return logEntry;
  } catch (error) {
    console.error('Failed to write audit log:', error);
    // Don't throw - audit logging should not break the app
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// CONVENIENCE FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

export function logAuth(action, user, req, success = true, errorMessage = null) {
  return log({
    userId: user?._id || user?.id,
    userEmail: user?.email,
    userRole: user?.role,
    action,
    targetType: 'user',
    targetId: user?._id?.toString() || user?.id,
    description: `${action} ${success ? 'succeeded' : 'failed'}`,
    req,
    status: success ? 'success' : 'failure',
    errorMessage,
  });
}

export function logUserAction(action, user, target, req, metadata = {}) {
  return log({
    userId: user?._id || user?.id,
    userEmail: user?.email,
    userRole: user?.role,
    action,
    targetType: 'user',
    targetId: target?._id?.toString() || target?.id,
    description: `User ${action.toLowerCase()} performed`,
    metadata,
    req,
  });
}

export function logSessionAction(action, user, session, req, metadata = {}) {
  return log({
    userId: user?._id || user?.id,
    userEmail: user?.email,
    userRole: user?.role,
    action,
    targetType: 'session',
    targetId: session?._id?.toString() || session?.id,
    description: `Session ${action.toLowerCase()}`,
    metadata: {
      sessionType: session?.type,
      ...metadata,
    },
    req,
  });
}

export function logSecurityAlert(description, req, metadata = {}) {
  return log({
    action: 'SECURITY_ALERT',
    targetType: 'system',
    description,
    metadata,
    req,
    status: 'warning',
  });
}

export function logError(error, req, context = {}) {
  return log({
    userId: req?.user?.id,
    userEmail: req?.user?.email,
    action: 'API_ERROR',
    targetType: 'system',
    description: error.message,
    metadata: {
      stack: error.stack,
      ...context,
    },
    req,
    status: 'failure',
    errorMessage: error.message,
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// QUERY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

export async function getAuditLogs(filters = {}, options = {}) {
  const {
    userId,
    action,
    status,
    startDate,
    endDate,
    targetType,
  } = filters;

  const {
    page = 1,
    limit = 50,
    sortBy = 'timestamp',
    sortOrder = 'desc',
  } = options;

  const query = {};

  if (userId) query.userId = userId;
  if (action) query.action = action;
  if (status) query.status = status;
  if (targetType) query.targetType = targetType;

  if (startDate || endDate) {
    query.timestamp = {};
    if (startDate) query.timestamp.$gte = new Date(startDate);
    if (endDate) query.timestamp.$lte = new Date(endDate);
  }

  const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const [logs, total] = await Promise.all([
    AuditLog.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    AuditLog.countDocuments(query),
  ]);

  return {
    logs,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

export async function getUserActivity(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return AuditLog.find({
    userId,
    timestamp: { $gte: startDate },
  })
    .sort({ timestamp: -1 })
    .lean();
}

export async function getSecurityAlerts(days = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return AuditLog.find({
    $or: [
      { action: 'SECURITY_ALERT' },
      { action: 'LOGIN_FAILED' },
      { action: 'RATE_LIMIT_HIT' },
    ],
    timestamp: { $gte: startDate },
  })
    .sort({ timestamp: -1 })
    .lean();
}

// ═══════════════════════════════════════════════════════════════════════════
// MIDDLEWARE
// ═══════════════════════════════════════════════════════════════════════════

export function auditMiddleware(action, options = {}) {
  return async (req, res, next) => {
    // Store original end function
    const originalEnd = res.end;

    res.end = function (chunk, encoding) {
      // Restore original end
      res.end = originalEnd;

      // Log after response
      const status = res.statusCode < 400 ? 'success' : 'failure';

      log({
        userId: req.user?.id,
        userEmail: req.user?.email,
        userRole: req.user?.role,
        action,
        targetType: options.targetType,
        targetId: req.params?.id,
        description: options.description,
        metadata: options.includeBody ? req.body : undefined,
        req,
        status,
      }).catch(() => {}); // Ignore audit errors

      return originalEnd.call(this, chunk, encoding);
    };

    next();
  };
}

export default {
  log,
  logAuth,
  logUserAction,
  logSessionAction,
  logSecurityAlert,
  logError,
  getAuditLogs,
  getUserActivity,
  getSecurityAlerts,
  auditMiddleware,
  AuditLog,
};
