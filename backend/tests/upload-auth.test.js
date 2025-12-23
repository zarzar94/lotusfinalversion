import fs from 'fs/promises';
import path from 'path';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { app } from '../src/index.js';
import { User } from '../src/models/index.js';
import { generateTokens } from '../src/middleware/auth.js';
import { getCsrf } from './test-helpers.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();

  if (process.env.UPLOAD_DIR) {
    await fs.rm(process.env.UPLOAD_DIR, { recursive: true, force: true });
  }
});

test('rejects uploads without authentication', async () => {
  const { csrfToken, cookies } = await getCsrf(app);

  const response = await request(app)
    .post('/api/upload/avatar')
    .set('Cookie', cookies)
    .set('x-csrf-token', csrfToken)
    .attach('avatar', Buffer.from('test'), 'avatar.png');

  expect(response.status).toBe(401);
});

test('stores avatar uploads under the avatars directory', async () => {
  const user = await User.create({
    email: 'upload@example.com',
    password: 'UploadPass1!',
    name: 'Upload User',
  });
  const { token } = generateTokens(user._id);
  const { csrfToken, cookies } = await getCsrf(app);

  const response = await request(app)
    .post('/api/upload/avatar')
    .set('Authorization', `Bearer ${token}`)
    .set('Cookie', cookies)
    .set('x-csrf-token', csrfToken)
    .attach('avatar', Buffer.from('test'), 'avatar.png');

  expect(response.status).toBe(200);
  expect(response.body.success).toBe(true);
  expect(response.body.file.url).toContain('/uploads/avatars/');

  const storedPath = path.join(process.env.UPLOAD_DIR, 'avatars', response.body.file.filename);
  const stats = await fs.stat(storedPath);
  expect(stats.isFile()).toBe(true);
});

test('prevents non-admin users from deleting files', async () => {
  const user = await User.create({
    email: 'delete@example.com',
    password: 'DeletePass1!',
    name: 'Delete User',
    role: 'patient',
  });
  const { token } = generateTokens(user._id);
  const { csrfToken, cookies } = await getCsrf(app);

  const response = await request(app)
    .delete('/api/upload/not-a-file.png')
    .set('Authorization', `Bearer ${token}`)
    .set('Cookie', cookies)
    .set('x-csrf-token', csrfToken);

  expect(response.status).toBe(403);
});
