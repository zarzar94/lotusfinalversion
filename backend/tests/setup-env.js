import fs from 'fs';
import os from 'os';
import path from 'path';

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'test';
}

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'test-refresh-secret';

if (!process.env.UPLOAD_DIR) {
  const uploadDir = fs.mkdtempSync(path.join(os.tmpdir(), 'lotus-uploads-'));
  process.env.UPLOAD_DIR = uploadDir;
}
