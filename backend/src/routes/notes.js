/**
 * Notes Routes - Clinical and progress notes endpoints
 */

import { Router } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { Note, User } from '../models/index.js';
import { authenticate } from '../middleware/auth.js';
import { canAccessPatient } from '../utils/access.js';

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
 * GET /notes - List notes for a patient (or current user)
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
      const patientId = (req.query.patientId || req.userId).toString();
      const patient = await User.findById(patientId).select('school clinic');
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

      const limit = parseInt(req.query.limit || '50', 10);
      const offset = parseInt(req.query.offset || '0', 10);

      const [notes, total] = await Promise.all([
        Note.find({ patientId })
          .sort({ createdAt: -1 })
          .skip(offset)
          .limit(limit),
        Note.countDocuments({ patientId }),
      ]);

      res.json({
        success: true,
        notes: notes.map((note) => note.toJSON()),
        total,
      });
    } catch (error) {
      console.error('Get notes error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'SERVER_ERROR', message: 'Failed to get notes' },
      });
    }
  }
);

/**
 * POST /notes - Create a new note
 */
router.post('/',
  [
    body('patientId').isMongoId().withMessage('patientId required'),
    body('content').isString().trim().notEmpty().withMessage('content required'),
    body('category').optional().isIn(['general', 'progress', 'session', 'behavior', 'treatment', 'follow_up']),
    body('tags').optional().isArray(),
    body('tags.*').optional().isString().trim(),
  ],
  handleValidation,
  async (req, res) => {
    try {
      const { patientId, content, category, tags } = req.body;

      const patient = await User.findById(patientId).select('school clinic');
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

      const note = new Note({
        patientId,
        authorId: req.userId,
        authorRole: req.user.role,
        content,
        category,
        tags,
      });

      await note.save();

      res.status(201).json({
        success: true,
        note: note.toJSON(),
      });
    } catch (error) {
      console.error('Create note error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'SERVER_ERROR', message: 'Failed to create note' },
      });
    }
  }
);

/**
 * PATCH /notes/:noteId - Update a note
 */
router.patch('/:noteId',
  [
    param('noteId').isMongoId().withMessage('Invalid noteId'),
    body('content').optional().isString().trim().notEmpty(),
    body('category').optional().isIn(['general', 'progress', 'session', 'behavior', 'treatment', 'follow_up']),
    body('tags').optional().isArray(),
    body('tags.*').optional().isString().trim(),
  ],
  handleValidation,
  async (req, res) => {
    try {
      const note = await Note.findById(req.params.noteId);

      if (!note) {
        return res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Note not found' },
        });
      }

      const isAuthor = note.authorId?.toString() === req.userId?.toString();
      if (!isAuthor && req.user.role !== 'super_admin') {
        return res.status(403).json({
          success: false,
          error: { code: 'FORBIDDEN', message: 'Insufficient permissions' },
        });
      }

      const updates = { ...req.body };
      delete updates.authorId;
      delete updates.authorRole;
      delete updates.patientId;

      Object.assign(note, updates);
      await note.save();

      res.json({
        success: true,
        note: note.toJSON(),
      });
    } catch (error) {
      console.error('Update note error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'SERVER_ERROR', message: 'Failed to update note' },
      });
    }
  }
);

/**
 * DELETE /notes/:noteId - Remove a note
 */
router.delete('/:noteId',
  [param('noteId').isMongoId().withMessage('Invalid noteId')],
  handleValidation,
  async (req, res) => {
    try {
      const note = await Note.findById(req.params.noteId);

      if (!note) {
        return res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Note not found' },
        });
      }

      const isAuthor = note.authorId?.toString() === req.userId?.toString();
      if (!isAuthor && req.user.role !== 'super_admin') {
        return res.status(403).json({
          success: false,
          error: { code: 'FORBIDDEN', message: 'Insufficient permissions' },
        });
      }

      await Note.deleteOne({ _id: note._id });

      res.json({ success: true });
    } catch (error) {
      console.error('Delete note error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'SERVER_ERROR', message: 'Failed to delete note' },
      });
    }
  }
);

export default router;
