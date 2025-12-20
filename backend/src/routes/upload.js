import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, '../../uploads');
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '5242880'); // 5MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_DOC_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

// Ensure upload directory exists
async function ensureUploadDir(subdir = '') {
  const dir = path.join(UPLOAD_DIR, subdir);
  await fs.mkdir(dir, { recursive: true });
  return dir;
}

// ═══════════════════════════════════════════════════════════════════════════
// MULTER CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const subdir = req.params.type || 'general';
      const dir = await ensureUploadDir(subdir);
      cb(null, dir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOC_TYPES];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} not allowed`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 5, // Max 5 files per request
  },
});

// ═══════════════════════════════════════════════════════════════════════════
// UPLOAD ROUTES
// ═══════════════════════════════════════════════════════════════════════════

// Upload avatar
router.post('/avatar', upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!ALLOWED_IMAGE_TYPES.includes(req.file.mimetype)) {
      await fs.unlink(req.file.path);
      return res.status(400).json({ error: 'Only image files allowed for avatars' });
    }

    const fileUrl = `/uploads/avatars/${req.file.filename}`;

    res.json({
      success: true,
      file: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: fileUrl,
      },
    });
  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Upload document
router.post('/document', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileUrl = `/uploads/documents/${req.file.filename}`;

    res.json({
      success: true,
      file: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: fileUrl,
      },
    });
  } catch (error) {
    console.error('Document upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Upload multiple files
router.post('/batch', upload.array('files', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const files = req.files.map((file) => ({
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      url: `/uploads/general/${file.filename}`,
    }));

    res.json({
      success: true,
      count: files.length,
      files,
    });
  } catch (error) {
    console.error('Batch upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// FILE MANAGEMENT ROUTES
// ═══════════════════════════════════════════════════════════════════════════

// Get file info
router.get('/info/:filename', async (req, res) => {
  try {
    const { filename } = req.params;

    // Prevent directory traversal
    if (filename.includes('..') || filename.includes('/')) {
      return res.status(400).json({ error: 'Invalid filename' });
    }

    // Search in all upload subdirectories
    const subdirs = ['avatars', 'documents', 'general'];
    let filePath = null;
    let foundDir = null;

    for (const dir of subdirs) {
      const testPath = path.join(UPLOAD_DIR, dir, filename);
      try {
        await fs.access(testPath);
        filePath = testPath;
        foundDir = dir;
        break;
      } catch {
        continue;
      }
    }

    if (!filePath) {
      return res.status(404).json({ error: 'File not found' });
    }

    const stats = await fs.stat(filePath);

    res.json({
      filename,
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
      url: `/uploads/${foundDir}/${filename}`,
    });
  } catch (error) {
    console.error('File info error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete file
router.delete('/:filename', async (req, res) => {
  try {
    const { filename } = req.params;

    // Prevent directory traversal
    if (filename.includes('..') || filename.includes('/')) {
      return res.status(400).json({ error: 'Invalid filename' });
    }

    // Search in all upload subdirectories
    const subdirs = ['avatars', 'documents', 'general'];
    let filePath = null;

    for (const dir of subdirs) {
      const testPath = path.join(UPLOAD_DIR, dir, filename);
      try {
        await fs.access(testPath);
        filePath = testPath;
        break;
      } catch {
        continue;
      }
    }

    if (!filePath) {
      return res.status(404).json({ error: 'File not found' });
    }

    await fs.unlink(filePath);

    res.json({ success: true, message: 'File deleted' });
  } catch (error) {
    console.error('File delete error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// ERROR HANDLING
// ═══════════════════════════════════════════════════════════════════════════

router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        error: 'Too many files. Maximum is 5 files per request',
      });
    }
    return res.status(400).json({ error: error.message });
  }

  if (error.message.includes('not allowed')) {
    return res.status(400).json({ error: error.message });
  }

  next(error);
});

export default router;
