/**
 * Signatures Routes - Signature capture endpoints
 */

import { Router } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { Signature } from '../models/index.js';
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

const canAccessPatient = (req, patientId) => {
  if (!patientId || !req.user) return false;
  const currentId = req.userId?.toString();
  if (['super_admin', 'clinician'].includes(req.user.role)) return true;
  if (currentId === patientId) return true;
  if (req.user.role === 'parent' && Array.isArray(req.user.children)) {
    return req.user.children.some((childId) => childId.toString() === patientId);
  }
  return false;
};

/**
 * GET /signatures - List signatures for a user or patient
 */
router.get('/',
  [
    query('patientId').optional().isMongoId().withMessage('Invalid patientId'),
    query('limit').optional().isInt({ min: 1, max: 200 }),
    query('offset').optional().isInt({ min: 0 }),
  ],
  handleValidation,
  async (req, res) => {
    try {
      const { patientId } = req.query;
      const limit = parseInt(req.query.limit || '50', 10);
      const offset = parseInt(req.query.offset || '0', 10);

      const query = {};
      if (patientId) {
        if (!canAccessPatient(req, patientId.toString())) {
          return res.status(403).json({
            success: false,
            error: { code: 'FORBIDDEN', message: 'Insufficient permissions' },
          });
        }
        query.patientId = patientId;
      } else {
        query.userId = req.userId;
      }

      const [signatures, total] = await Promise.all([
        Signature.find(query)
          .sort({ signedAt: -1 })
          .skip(offset)
          .limit(limit),
        Signature.countDocuments(query),
      ]);

      res.json({
        success: true,
        signatures: signatures.map((signature) => signature.toJSON()),
        total,
      });
    } catch (error) {
      console.error('Get signatures error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'SERVER_ERROR', message: 'Failed to get signatures' },
      });
    }
  }
);

/**
 * POST /signatures - Create a new signature
 */
router.post('/',
  [
    body('signatureData').isString().withMessage('signatureData required'),
    body('patientId').optional().isMongoId(),
    body('context').optional().isString().trim(),
    body('mimeType').optional().isString().trim(),
    body('metadata').optional().isObject(),
  ],
  handleValidation,
  async (req, res) => {
    try {
      const { signatureData, patientId, context, mimeType, metadata } = req.body;

      if (patientId && !canAccessPatient(req, patientId)) {
        return res.status(403).json({
          success: false,
          error: { code: 'FORBIDDEN', message: 'Insufficient permissions' },
        });
      }

      const signature = new Signature({
        userId: req.userId,
        patientId,
        role: req.user.role,
        context,
        signatureData,
        mimeType,
        metadata,
      });

      await signature.save();

      res.status(201).json({
        success: true,
        signature: signature.toJSON(),
      });
    } catch (error) {
      console.error('Create signature error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'SERVER_ERROR', message: 'Failed to create signature' },
      });
    }
  }
);

/**
 * DELETE /signatures/:signatureId - Remove a signature
 */
router.delete('/:signatureId',
  [param('signatureId').isMongoId().withMessage('Invalid signatureId')],
  handleValidation,
  async (req, res) => {
    try {
      const signature = await Signature.findById(req.params.signatureId);

      if (!signature) {
        return res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Signature not found' },
        });
      }

      const isOwner = signature.userId?.toString() === req.userId?.toString();
      if (!isOwner && req.user.role !== 'super_admin') {
        return res.status(403).json({
          success: false,
          error: { code: 'FORBIDDEN', message: 'Insufficient permissions' },
        });
      }

      await Signature.deleteOne({ _id: signature._id });

      res.json({ success: true });
    } catch (error) {
      console.error('Delete signature error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'SERVER_ERROR', message: 'Failed to delete signature' },
      });
    }
  }
);

export default router;
