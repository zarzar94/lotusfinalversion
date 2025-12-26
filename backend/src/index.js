/**
 * Lotus AIT Backend - Express Server Entry Point
 * Full-featured API with WebSocket, file uploads, email, and admin panel
 */

import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';

import { connectDB } from './utils/db.js';
import createIndexes from './utils/indexes.js';
import { initWebSocket } from './utils/websocket.js';
import { verifyEmailConnection } from './utils/email.js';
import { swaggerSpec } from './utils/swagger.js';
import { compressResponse, performanceHeaders, requestTimeout } from './middleware/compression.js';
import { sanitizeBody } from './middleware/validate.js';
import { doubleSubmitCookie } from './middleware/csrf.js';
import {
  authRoutes,
  clinicalRoutes,
  gamificationRoutes,
  settingsRoutes,
  sessionsRoutes,
  syncRoutes,
  notesRoutes,
  signaturesRoutes,
} from './routes/index.js';
import passwordRoutes from './routes/password.js';
import uploadRoutes from './routes/upload.js';
import adminRoutes from './routes/admin.js';

// ═══════════════════════════════════════════════════════════════════════════
// APP CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

export const app = express();
const PORT = process.env.PORT || 3001;

// ═══════════════════════════════════════════════════════════════════════════
// MIDDLEWARE
// ═══════════════════════════════════════════════════════════════════════════

// Security headers
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  skip: (req) => req.path === '/health',
  message: {
    success: false,
    error: { code: 'RATE_LIMITED', message: 'Too many requests, please try again later' },
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(cookieParser());

// CSRF protection (using double submit cookie pattern)
app.use(doubleSubmitCookie());

// Performance optimizations
app.use(performanceHeaders());
app.use(requestTimeout(30000));
app.use(compressResponse(1024));
app.use(sanitizeBody);

// Request logging (dev mode)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
    next();
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// ROUTES
// ═══════════════════════════════════════════════════════════════════════════

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: Date.now(),
    version: '1.0.0',
  });
});

// API Documentation (Swagger)
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Lotus AIT API Documentation',
}));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/password', passwordRoutes);
app.use('/api/clinical', clinicalRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/sessions', sessionsRoutes);
app.use('/api/sync', syncRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/signatures', signaturesRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// 404 handler
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: 'Endpoint not found' },
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: messages.join(', ') },
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      error: { code: 'DUPLICATE_KEY', message: 'Resource already exists' },
    });
  }

  // Default error
  res.status(err.status || 500).json({
    success: false,
    error: {
      code: err.code || 'SERVER_ERROR',
      message: process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message,
    },
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// SERVER START
// ═══════════════════════════════════════════════════════════════════════════

export const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Create indexes for query optimization
    await createIndexes();

    // Verify email configuration
    await verifyEmailConnection();

    // Create HTTP server for WebSocket support
    const server = createServer(app);

    // Initialize WebSocket
    initWebSocket(server);

    // Start server
    server.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🧠 Lotus AIT Backend Server                              ║
║                                                            ║
║   Environment: ${(process.env.NODE_ENV || 'development').padEnd(12)}                   ║
║   Port: ${PORT}                                              ║
║   API: http://localhost:${PORT}/api                          ║
║   Docs: http://localhost:${PORT}/api/docs                    ║
║   WebSocket: ws://localhost:${PORT}/ws                       ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nShutting down gracefully...');
  process.exit(0);
});

if (process.env.NODE_ENV !== 'test') {
  startServer();
}
