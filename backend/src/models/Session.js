/**
 * Session Model - MongoDB Schema for assessment sessions
 */

import mongoose from 'mongoose';

const testOutcomeSchema = new mongoose.Schema({
  result: {
    type: String,
    enum: ['high', 'medium', 'low'],
    required: true,
  },
  scoreLabel: {
    type: String,
    required: true,
  },
  metrics: {
    type: mongoose.Schema.Types.Mixed,
  },
}, { _id: false });

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  outcomes: {
    type: Map,
    of: testOutcomeSchema,
    default: {},
  },
  compositeResult: {
    type: String,
    enum: ['high', 'medium', 'low'],
  },
  totalPoints: {
    type: Number,
    default: 0,
  },
  achievements: [{
    type: String,
  }],
  duration: {
    type: Number, // in seconds
  },
}, {
  timestamps: true,
});

// Index for efficient querying by user and date
sessionSchema.index({ userId: 1, createdAt: -1 });

// Transform output
sessionSchema.methods.toJSON = function() {
  const obj = this.toObject();

  // Convert Map to plain object
  const outcomes = {};
  if (obj.outcomes) {
    for (const [key, value] of obj.outcomes) {
      outcomes[key] = value;
    }
  }

  return {
    id: obj._id.toString(),
    userId: obj.userId.toString(),
    date: obj.createdAt.getTime(),
    outcomes,
    compositeResult: obj.compositeResult,
    totalPoints: obj.totalPoints,
    achievements: obj.achievements,
    duration: obj.duration,
    createdAt: obj.createdAt.getTime(),
  };
};

const Session = mongoose.model('Session', sessionSchema);

export default Session;
