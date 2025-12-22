/**
 * Auth Routes - Authentication endpoints
 */

import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { User, ClinicalProgress, Gamification, Settings } from '../models/index.js';
import { authenticate, generateTokens, verifyRefreshToken } from '../middleware/auth.js';

const router = Router();

// Validation helpers
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
 * POST /auth/register - Register new user
 */
router.post('/register',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('role').optional().isIn(['patient', 'parent', 'clinician', 'school_admin']),
  ],
  handleValidation,
  async (req, res) => {
    try {
      const { email, password, name, nameAr, role = 'patient' } = req.body;

      // Check if user exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: { code: 'EMAIL_EXISTS', message: 'Email already registered' },
        });
      }

      // Create user
      const user = new User({
        email: email.toLowerCase(),
        password,
        name,
        nameAr,
        role,
      });

      await user.save();

      // Create related documents
      await Promise.all([
        ClinicalProgress.create({ userId: user._id }),
        Gamification.create({ userId: user._id }),
        Settings.create({ userId: user._id }),
      ]);

      // Generate tokens
      const { token, refreshToken } = generateTokens(user._id);
      user.refreshToken = refreshToken;
      await user.save();

      res.status(201).json({
        success: true,
        user: user.toJSON(),
        token,
        refreshToken,
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'SERVER_ERROR', message: 'Registration failed' },
      });
    }
  }
);

/**
 * POST /auth/login - User login
 */
router.post('/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required'),
  ],
  handleValidation,
  async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(401).json({
          success: false,
          error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' },
        });
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' },
        });
      }

      // Check if active
      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          error: { code: 'ACCOUNT_DISABLED', message: 'Account is disabled' },
        });
      }

      // Update last login
      user.lastLogin = new Date();

      // Generate tokens
      const { token, refreshToken } = generateTokens(user._id);
      user.refreshToken = refreshToken;
      await user.save();

      res.json({
        success: true,
        user: user.toJSON(),
        token,
        refreshToken,
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'SERVER_ERROR', message: 'Login failed' },
      });
    }
  }
);

/**
 * POST /auth/refresh - Refresh access token
 */
router.post('/refresh',
  body('refreshToken').notEmpty().withMessage('Refresh token required'),
  handleValidation,
  async (req, res) => {
    try {
      const { refreshToken } = req.body;

      // Verify refresh token
      const decoded = verifyRefreshToken(refreshToken);
      if (!decoded) {
        return res.status(401).json({
          success: false,
          error: { code: 'INVALID_REFRESH_TOKEN', message: 'Invalid refresh token' },
        });
      }

      // Find user
      const user = await User.findById(decoded.userId);
      if (!user || user.refreshToken !== refreshToken) {
        return res.status(401).json({
          success: false,
          error: { code: 'INVALID_REFRESH_TOKEN', message: 'Invalid refresh token' },
        });
      }

      // Generate new tokens
      const tokens = generateTokens(user._id);
      user.refreshToken = tokens.refreshToken;
      await user.save();

      res.json({
        success: true,
        token: tokens.token,
        refreshToken: tokens.refreshToken,
      });
    } catch (error) {
      console.error('Token refresh error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'SERVER_ERROR', message: 'Token refresh failed' },
      });
    }
  }
);

/**
 * POST /auth/logout - User logout
 */
router.post('/logout', authenticate, async (req, res) => {
  try {
    req.user.refreshToken = null;
    await req.user.save();

    res.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Logout failed' },
    });
  }
});

/**
 * GET /auth/me - Get current user
 */
router.get('/me', authenticate, (req, res) => {
  res.json({
    success: true,
    user: req.user.toJSON(),
  });
});

/**
 * PATCH /auth/profile - Update user profile
 */
router.patch('/profile',
  authenticate,
  [
    body('name').optional().trim().isLength({ min: 2 }),
    body('nameAr').optional().trim(),
    body('avatar').optional().isURL(),
  ],
  handleValidation,
  async (req, res) => {
    try {
      const { name, nameAr, avatar } = req.body;
      const user = req.user;

      if (name) user.name = name;
      if (nameAr !== undefined) user.nameAr = nameAr;
      if (avatar !== undefined) user.avatar = avatar;

      await user.save();

      res.json({
        success: true,
        user: user.toJSON(),
      });
    } catch (error) {
      console.error('Profile update error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'SERVER_ERROR', message: 'Profile update failed' },
      });
    }
  }
);

/**
 * DELETE /auth/account - Delete user account
 */
router.delete('/account', authenticate, async (req, res) => {
  try {
    const userId = req.userId;

    // Delete all related data
    await Promise.all([
      ClinicalProgress.deleteOne({ userId }),
      Gamification.deleteOne({ userId }),
      Settings.deleteOne({ userId }),
      User.deleteOne({ _id: userId }),
    ]);

    res.json({ success: true });
  } catch (error) {
    console.error('Account deletion error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Account deletion failed' },
    });
  }
});

export default router;
