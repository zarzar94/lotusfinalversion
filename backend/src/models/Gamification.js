/**
 * Gamification Model - MongoDB Schema for gamification state
 */

import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  unlocked: {
    type: Boolean,
    default: false,
  },
  unlockedAt: {
    type: Date,
  },
  points: {
    type: Number,
    default: 0,
  },
}, { _id: false });

const gamificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  achievements: [achievementSchema],
  totalPoints: {
    type: Number,
    default: 0,
    min: 0,
  },
  level: {
    type: Number,
    default: 1,
    min: 1,
  },
  exploredBrainRegions: [{
    type: String,
  }],
  slidesViewed: [{
    type: Number,
  }],
  checklistCompleted: {
    type: Boolean,
    default: false,
  },
  gamesCompleted: [{
    type: String,
  }],
  audioJourneyProgress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  totalTimeSpent: {
    type: Number,
    default: 0,
    min: 0,
  },
  maxScrollProgress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  videosWatched: [{
    type: String,
  }],
  clinicalSessionsCompleted: {
    type: Number,
    default: 0,
    min: 0,
  },
  clinicalStreak: {
    type: Number,
    default: 0,
    min: 0,
  },
  lastClinicalActivity: {
    type: Date,
  },
  treatmentPhase: {
    type: String,
    enum: ['assessment', 'active', 'maintenance', 'completed'],
    default: 'assessment',
  },
}, {
  timestamps: true,
});

// Calculate level based on points
gamificationSchema.pre('save', function(next) {
  if (this.isModified('totalPoints')) {
    const points = this.totalPoints;
    if (points < 50) this.level = 1;
    else if (points < 150) this.level = 2;
    else if (points < 300) this.level = 3;
    else if (points < 500) this.level = 4;
    else this.level = 5;
  }
  next();
});

// Transform output
gamificationSchema.methods.toJSON = function() {
  const obj = this.toObject();
  return {
    userId: obj.userId.toString(),
    achievements: obj.achievements.map(a => ({
      id: a.id,
      unlocked: a.unlocked,
      unlockedAt: a.unlockedAt?.getTime(),
      points: a.points,
    })),
    totalPoints: obj.totalPoints,
    level: obj.level,
    exploredBrainRegions: obj.exploredBrainRegions,
    slidesViewed: obj.slidesViewed,
    checklistCompleted: obj.checklistCompleted,
    gamesCompleted: obj.gamesCompleted,
    audioJourneyProgress: obj.audioJourneyProgress,
    totalTimeSpent: obj.totalTimeSpent,
    maxScrollProgress: obj.maxScrollProgress,
    videosWatched: obj.videosWatched,
    clinicalSessionsCompleted: obj.clinicalSessionsCompleted,
    clinicalStreak: obj.clinicalStreak,
    lastClinicalActivity: obj.lastClinicalActivity?.getTime() || 0,
    treatmentPhase: obj.treatmentPhase,
    updatedAt: obj.updatedAt.getTime(),
  };
};

const Gamification = mongoose.model('Gamification', gamificationSchema);

export default Gamification;
