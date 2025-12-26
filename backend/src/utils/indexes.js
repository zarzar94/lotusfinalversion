/**
 * MongoDB Index Definitions - Run on startup for query optimization
 */

import mongoose from 'mongoose';

export const createIndexes = async () => {
  try {
    const db = mongoose.connection.db;

    // User indexes
    const userCollection = db.collection('users');
    const existingUserIndexes = await userCollection.indexes();
    const emailIndex = existingUserIndexes.find((index) => index.key?.email === 1);

    if (emailIndex && !emailIndex.unique) {
      console.warn('User email index exists but is not unique; keeping existing index.');
    }

    const userIndexes = [
      { key: { role: 1 }, name: 'role_idx' },
      { key: { clinic: 1 }, sparse: true, name: 'clinic_idx' },
      { key: { school: 1 }, sparse: true, name: 'school_idx' },
      { key: { isActive: 1, lastLogin: -1 }, name: 'active_login_idx' },
    ];

    // Skip creating the email index if it already exists (legacy name email_1).
    if (!emailIndex) {
      userIndexes.unshift({ key: { email: 1 }, unique: true, name: 'email_unique' });
    }

    await userCollection.createIndexes(userIndexes);

    // ClinicalProgress indexes
    await db.collection('clinicalprogresses').createIndexes([
      { key: { userId: 1 }, unique: true, name: 'userId_unique' },
      { key: { treatmentPhase: 1 }, name: 'phase_idx' },
      { key: { sessionsCompleted: -1 }, name: 'sessions_idx' },
      { key: { lastActivityDate: -1 }, name: 'activity_idx' },
    ]);

    // Gamification indexes
    await db.collection('gamifications').createIndexes([
      { key: { userId: 1 }, unique: true, name: 'userId_unique' },
      { key: { totalPoints: -1 }, name: 'points_idx' },
      { key: { level: -1 }, name: 'level_idx' },
    ]);

    // Settings indexes
    await db.collection('settings').createIndexes([
      { key: { userId: 1 }, unique: true, name: 'userId_unique' },
    ]);

    // Session indexes
    await db.collection('sessions').createIndexes([
      { key: { userId: 1, createdAt: -1 }, name: 'user_date_idx' },
      {
        key: { userId: 1, clientId: 1 },
        name: 'user_client_unique',
        unique: true,
        partialFilterExpression: { clientId: { $type: 'string' } },
      },
      { key: { createdAt: -1 }, name: 'date_idx' },
      { key: { compositeResult: 1 }, sparse: true, name: 'result_idx' },
    ]);

    // Notes indexes
    await db.collection('notes').createIndexes([
      { key: { patientId: 1, createdAt: -1 }, name: 'patient_date_idx' },
      { key: { authorId: 1, createdAt: -1 }, name: 'author_date_idx' },
    ]);

    // Signatures indexes
    await db.collection('signatures').createIndexes([
      { key: { userId: 1, signedAt: -1 }, name: 'user_signed_idx' },
      { key: { patientId: 1, signedAt: -1 }, name: 'patient_signed_idx' },
    ]);

    console.log('✓ MongoDB indexes created successfully');
  } catch (error) {
    console.error('Failed to create indexes:', error);
  }
};

export default createIndexes;
