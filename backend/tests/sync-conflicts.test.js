import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { app } from '../src/index.js';
import { Gamification, Settings, User } from '../src/models/index.js';
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

const createUser = async (email) => {
  return User.create({
    email,
    password: 'SyncPass1!',
    name: 'Sync User',
  });
};

const tokenFor = (user) => generateTokens(user._id).token;

test('prefers newer local settings and records conflict metadata', async () => {
  const user = await createUser('sync-settings@example.com');
  const settings = await Settings.create({ userId: user._id, language: 'ar', visitorMode: 'parent' });
  const serverUpdatedAt = settings.updatedAt.getTime();
  const localUpdatedAt = serverUpdatedAt + 60_000;

  const response = await request(app)
    .post('/api/sync')
    .set('Authorization', `Bearer ${tokenFor(user)}`)
    .send({
      lastSyncAt: 0,
      localData: {
        settings: {
          language: 'en',
          visitorMode: 'clinician',
          notifications: {
            achievements: false,
            reminders: true,
            updates: true,
            email: false,
          },
          display: {
            reducedMotion: true,
            highContrast: false,
            fontSize: 'large',
          },
          privacy: {
            shareProgress: true,
            anonymousAnalytics: false,
          },
          audio: {
            soundEffects: false,
            volume: 35,
          },
          updatedAt: localUpdatedAt,
        },
      },
    });

  expect(response.status).toBe(200);
  expect(response.body.success).toBe(true);

  const conflict = response.body.conflicts?.find((entry) => entry.field === 'settings');
  expect(conflict).toBeTruthy();
  expect(conflict.resolution).toBe('local');
  expect(conflict.localUpdatedAt).toBe(localUpdatedAt);
  expect(conflict.serverUpdatedAt).toBe(serverUpdatedAt);

  const updated = await Settings.findOne({ userId: user._id });
  expect(updated.language).toBe('en');
  expect(updated.visitorMode).toBe('clinician');
  expect(updated.display.fontSize).toBe('large');
});

test('keeps newer server settings when local is older', async () => {
  const user = await createUser('sync-settings-older@example.com');
  const settings = await Settings.create({ userId: user._id, language: 'ar', visitorMode: 'parent' });
  const serverUpdatedAt = settings.updatedAt.getTime();
  const localUpdatedAt = serverUpdatedAt - 60_000;

  const response = await request(app)
    .post('/api/sync')
    .set('Authorization', `Bearer ${tokenFor(user)}`)
    .send({
      lastSyncAt: 0,
      localData: {
        settings: {
          language: 'en',
          visitorMode: 'clinician',
          updatedAt: localUpdatedAt,
        },
      },
    });

  expect(response.status).toBe(200);
  expect(response.body.success).toBe(true);

  const conflict = response.body.conflicts?.find((entry) => entry.field === 'settings');
  expect(conflict).toBeTruthy();
  expect(conflict.resolution).toBe('server');

  const updated = await Settings.findOne({ userId: user._id });
  expect(updated.language).toBe('ar');
  expect(updated.visitorMode).toBe('parent');
});

test('merges gamification updates and reports merge conflict', async () => {
  const user = await createUser('sync-gamification@example.com');
  await Gamification.create({
    userId: user._id,
    exploredBrainRegions: ['region_1'],
    slidesViewed: [1],
    gamesCompleted: ['attention'],
    videosWatched: [],
    totalPoints: 10,
    maxScrollProgress: 20,
    audioJourneyProgress: 5,
    totalTimeSpent: 100,
    checklistCompleted: false,
    clinicalSessionsCompleted: 0,
    clinicalStreak: 0,
  });

  const now = Date.now();
  const response = await request(app)
    .post('/api/sync')
    .set('Authorization', `Bearer ${tokenFor(user)}`)
    .send({
      lastSyncAt: 0,
      localData: {
        gamification: {
          exploredBrainRegions: ['region_2'],
          slidesViewed: [2],
          gamesCompleted: ['attention', 'frequency'],
          videosWatched: ['intro'],
          achievements: [
            { id: 'first_steps', unlocked: true, unlockedAt: now, points: 10 },
          ],
          totalPoints: 25,
          maxScrollProgress: 55,
          audioJourneyProgress: 15,
          totalTimeSpent: 150,
          checklistCompleted: true,
          clinicalSessionsCompleted: 1,
          clinicalStreak: 2,
          lastClinicalActivity: now,
          sessionStartTime: now,
        },
      },
    });

  expect(response.status).toBe(200);
  expect(response.body.success).toBe(true);

  const conflict = response.body.conflicts?.find((entry) => entry.field === 'gamification');
  expect(conflict).toBeTruthy();
  expect(conflict.resolution).toBe('merge');

  const updated = await Gamification.findOne({ userId: user._id });
  expect(updated.exploredBrainRegions).toEqual(expect.arrayContaining(['region_1', 'region_2']));
  expect(updated.gamesCompleted).toEqual(expect.arrayContaining(['attention', 'frequency']));
  expect(updated.totalPoints).toBe(25);
  expect(updated.checklistCompleted).toBe(true);
});
