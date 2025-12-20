/**
 * Settings Model - MongoDB Schema for user settings
 */

import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  language: {
    type: String,
    enum: ['ar', 'en'],
    default: 'ar',
  },
  visitorMode: {
    type: String,
    enum: ['school', 'parent', 'clinician'],
    default: 'parent',
  },
  notifications: {
    achievements: {
      type: Boolean,
      default: true,
    },
    reminders: {
      type: Boolean,
      default: true,
    },
    updates: {
      type: Boolean,
      default: true,
    },
    email: {
      type: Boolean,
      default: false,
    },
  },
  display: {
    reducedMotion: {
      type: Boolean,
      default: false,
    },
    highContrast: {
      type: Boolean,
      default: false,
    },
    fontSize: {
      type: String,
      enum: ['small', 'medium', 'large'],
      default: 'medium',
    },
  },
  privacy: {
    shareProgress: {
      type: Boolean,
      default: false,
    },
    anonymousAnalytics: {
      type: Boolean,
      default: true,
    },
  },
  audio: {
    soundEffects: {
      type: Boolean,
      default: true,
    },
    volume: {
      type: Number,
      default: 70,
      min: 0,
      max: 100,
    },
  },
}, {
  timestamps: true,
});

// Transform output
settingsSchema.methods.toJSON = function() {
  const obj = this.toObject();
  return {
    userId: obj.userId.toString(),
    language: obj.language,
    visitorMode: obj.visitorMode,
    notifications: obj.notifications,
    display: obj.display,
    privacy: obj.privacy,
    audio: obj.audio,
    updatedAt: obj.updatedAt.getTime(),
  };
};

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;
