import crypto from 'crypto';
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
});

test('password reset stores a single-hash password', async () => {
  const user = await User.create({
    email: 'reset@example.com',
    password: 'OldPass1!',
    name: 'Reset User',
  });

  const resetToken = 'reset-token-value';
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetToken = hashedToken;
  user.resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);
  await user.save();

  const { csrfToken, cookies } = await getCsrf(app);
  const newPassword = 'NewPass1!';

  const response = await request(app)
    .post('/api/password/reset')
    .set('Cookie', cookies)
    .set('x-csrf-token', csrfToken)
    .send({ token: resetToken, password: newPassword, confirmPassword: newPassword });

  expect(response.status).toBe(200);

  const updatedUser = await User.findById(user._id);
  const isMatch = await updatedUser.comparePassword(newPassword);
  expect(isMatch).toBe(true);
  expect(updatedUser.passwordVersion).toBe(1);
});

test('password change stores a single-hash password', async () => {
  const user = await User.create({
    email: 'change@example.com',
    password: 'OldPass1!',
    name: 'Change User',
  });

  const { token } = generateTokens(user._id);
  const { csrfToken, cookies } = await getCsrf(app);
  const newPassword = 'NewPass1';

  const response = await request(app)
    .post('/api/password/change')
    .set('Authorization', `Bearer ${token}`)
    .set('Cookie', cookies)
    .set('x-csrf-token', csrfToken)
    .send({ currentPassword: 'OldPass1!', newPassword });

  expect(response.status).toBe(200);

  const updatedUser = await User.findById(user._id);
  const isMatch = await updatedUser.comparePassword(newPassword);
  expect(isMatch).toBe(true);
  expect(updatedUser.passwordVersion).toBe(1);
});
