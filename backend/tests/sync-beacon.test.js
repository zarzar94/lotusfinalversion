import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { app } from '../src/index.js';
import { ClinicalProgress, User } from '../src/models/index.js';
import { generateTokens } from '../src/middleware/auth.js';

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

test('accepts beacon payloads and updates clinical progress', async () => {
  const user = await User.create({
    email: 'sync@example.com',
    password: 'SyncPass1!',
    name: 'Sync User',
  });

  await ClinicalProgress.create({ userId: user._id });

  const { token } = generateTokens(user._id);
  const payload = {
    token,
    lastSyncAt: Date.now() + 60 * 1000,
    localData: {
      clinicalProgress: JSON.stringify({ sessionsCompleted: 3 }),
    },
  };

  const response = await request(app)
    .post('/api/sync/beacon')
    .set('Content-Type', 'text/plain')
    .send(JSON.stringify(payload));

  expect(response.status).toBe(200);
  expect(response.body.success).toBe(true);

  const updated = await ClinicalProgress.findOne({ userId: user._id });
  expect(updated.sessionsCompleted).toBe(3);
});
