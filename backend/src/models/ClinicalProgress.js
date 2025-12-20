/**
 * ClinicalProgress Model - MongoDB Schema for patient clinical data
 */

import mongoose from 'mongoose';

const hearingProfileSchema = new mongoose.Schema({
  leftEar: [Number],
  rightEar: [Number],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { _id: false });

const clinicalProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  sessionsCompleted: {
    type: Number,
    default: 0,
    min: 0,
  },
  sessionDates: [{
    type: Date,
  }],
  hearingProfile: hearingProfileSchema,
  attentionScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  processingSpeed: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  auditoryDiscrimination: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  weeklyGoalsMet: {
    type: Number,
    default: 0,
    min: 0,
  },
  treatmentPhase: {
    type: String,
    enum: ['assessment', 'active', 'maintenance', 'completed'],
    default: 'assessment',
  },
  streak: {
    type: Number,
    default: 0,
    min: 0,
  },
  lastActivityDate: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Auto-update treatment phase based on sessions
clinicalProgressSchema.pre('save', function(next) {
  if (this.isModified('sessionsCompleted')) {
    if (this.sessionsCompleted >= 20) {
      this.treatmentPhase = 'completed';
    } else if (this.sessionsCompleted >= 15) {
      this.treatmentPhase = 'maintenance';
    } else if (this.sessionsCompleted >= 1) {
      this.treatmentPhase = 'active';
    }
  }
  next();
});

// Transform output
clinicalProgressSchema.methods.toJSON = function() {
  const obj = this.toObject();
  return {
    userId: obj.userId.toString(),
    sessionsCompleted: obj.sessionsCompleted,
    sessionDates: obj.sessionDates.map(d => d.getTime()),
    hearingProfile: obj.hearingProfile ? {
      leftEar: obj.hearingProfile.leftEar,
      rightEar: obj.hearingProfile.rightEar,
      updatedAt: obj.hearingProfile.updatedAt.getTime(),
    } : undefined,
    attentionScore: obj.attentionScore,
    processingSpeed: obj.processingSpeed,
    auditoryDiscrimination: obj.auditoryDiscrimination,
    weeklyGoalsMet: obj.weeklyGoalsMet,
    treatmentPhase: obj.treatmentPhase,
    streak: obj.streak,
    lastActivityDate: obj.lastActivityDate.getTime(),
    updatedAt: obj.updatedAt.getTime(),
  };
};

const ClinicalProgress = mongoose.model('ClinicalProgress', clinicalProgressSchema);

export default ClinicalProgress;
