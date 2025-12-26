/**
 * MongoDB Index Definitions - Run on startup for query optimization
 */

import mongoose from 'mongoose';

const keysEqual = (left = {}, right = {}) => {
  const leftEntries = Object.entries(left);
  const rightEntries = Object.entries(right);
  if (leftEntries.length !== rightEntries.length) return false;
  return leftEntries.every(([key, value], index) => {
    const [rightKey, rightValue] = rightEntries[index] || [];
    return key === rightKey && value === rightValue;
  });
};

const findIndexByKey = (indexes, key) => indexes.find((index) => keysEqual(index.key, key));

const normalizeOption = (value) => (value ? JSON.stringify(value) : '');

const warnIfOptionMismatch = (collectionName, indexSpec, existingIndex) => {
  if (!existingIndex) return;

  const mismatches = [];
  if (indexSpec.unique && !existingIndex.unique) mismatches.push('unique');
  if (indexSpec.sparse && !existingIndex.sparse) mismatches.push('sparse');
  if (
    indexSpec.partialFilterExpression &&
    normalizeOption(indexSpec.partialFilterExpression) !== normalizeOption(existingIndex.partialFilterExpression)
  ) {
    mismatches.push('partialFilterExpression');
  }

  if (mismatches.length > 0) {
    console.warn(
      `Index options mismatch on ${collectionName} (${JSON.stringify(indexSpec.key)}): ${mismatches.join(', ')}`
    );
  }
};

const ensureIndexes = async (collectionName, collection, indexSpecs) => {
  const existingIndexes = await collection.indexes();
  const missingIndexes = [];

  for (const spec of indexSpecs) {
    const existingIndex = findIndexByKey(existingIndexes, spec.key);
    if (existingIndex) {
      warnIfOptionMismatch(collectionName, spec, existingIndex);
      continue;
    }
    missingIndexes.push(spec);
  }

  if (missingIndexes.length > 0) {
    await collection.createIndexes(missingIndexes);
  }
};

export const createIndexes = async () => {
  try {
    const db = mongoose.connection.db;

    // User indexes
    const userCollection = db.collection('users');
    const userIndexes = [
      { key: { email: 1 }, unique: true, name: 'email_unique' },
      { key: { role: 1 }, name: 'role_idx' },
      { key: { clinic: 1 }, sparse: true, name: 'clinic_idx' },
      { key: { school: 1 }, sparse: true, name: 'school_idx' },
      { key: { isActive: 1, lastLogin: -1 }, name: 'active_login_idx' },
    ];
    await ensureIndexes('users', userCollection, userIndexes);

    // ClinicalProgress indexes
    await ensureIndexes('clinicalprogresses', db.collection('clinicalprogresses'), [
      { key: { userId: 1 }, unique: true, name: 'userId_unique' },
      { key: { treatmentPhase: 1 }, name: 'phase_idx' },
      { key: { sessionsCompleted: -1 }, name: 'sessions_idx' },
      { key: { lastActivityDate: -1 }, name: 'activity_idx' },
    ]);

    // Gamification indexes
    await ensureIndexes('gamifications', db.collection('gamifications'), [
      { key: { userId: 1 }, unique: true, name: 'userId_unique' },
      { key: { totalPoints: -1 }, name: 'points_idx' },
      { key: { level: -1 }, name: 'level_idx' },
    ]);

    // Settings indexes
    await ensureIndexes('settings', db.collection('settings'), [
      { key: { userId: 1 }, unique: true, name: 'userId_unique' },
    ]);

    // Session indexes
    await ensureIndexes('sessions', db.collection('sessions'), [
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
    await ensureIndexes('notes', db.collection('notes'), [
      { key: { patientId: 1, createdAt: -1 }, name: 'patient_date_idx' },
      { key: { authorId: 1, createdAt: -1 }, name: 'author_date_idx' },
    ]);

    // Signatures indexes
    await ensureIndexes('signatures', db.collection('signatures'), [
      { key: { userId: 1, signedAt: -1 }, name: 'user_signed_idx' },
      { key: { patientId: 1, signedAt: -1 }, name: 'patient_signed_idx' },
    ]);

    console.log('✓ MongoDB indexes created successfully');
  } catch (error) {
    console.error('Failed to create indexes:', error);
  }
};

export default createIndexes;
