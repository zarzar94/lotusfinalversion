/**
 * Note Model - MongoDB Schema for clinical and progress notes
 */

import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  authorRole: {
    type: String,
    enum: ['patient', 'parent', 'clinician', 'school_admin', 'super_admin'],
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 5000,
  },
  category: {
    type: String,
    enum: ['general', 'progress', 'session', 'behavior', 'treatment', 'follow_up'],
    default: 'general',
  },
  tags: [{
    type: String,
    trim: true,
  }],
}, {
  timestamps: true,
});

noteSchema.index({ patientId: 1, createdAt: -1 });
noteSchema.index({ authorId: 1, createdAt: -1 });

noteSchema.methods.toJSON = function() {
  const obj = this.toObject();
  return {
    id: obj._id.toString(),
    patientId: obj.patientId?.toString(),
    authorId: obj.authorId?.toString(),
    authorRole: obj.authorRole,
    content: obj.content,
    category: obj.category,
    tags: obj.tags ?? [],
    createdAt: obj.createdAt.getTime(),
    updatedAt: obj.updatedAt.getTime(),
  };
};

const Note = mongoose.model('Note', noteSchema);

export default Note;
