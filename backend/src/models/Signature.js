/**
 * Signature Model - MongoDB Schema for stored signatures/consents
 */

import mongoose from 'mongoose';

const signatureSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
  },
  role: {
    type: String,
    enum: ['patient', 'parent', 'clinician', 'school_admin', 'super_admin'],
    required: true,
  },
  context: {
    type: String,
    trim: true,
  },
  signatureData: {
    type: String,
    required: true,
  },
  mimeType: {
    type: String,
    trim: true,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
  },
  signedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

signatureSchema.index({ userId: 1, signedAt: -1 });
signatureSchema.index({ patientId: 1, signedAt: -1 });

signatureSchema.methods.toJSON = function() {
  const obj = this.toObject();
  return {
    id: obj._id.toString(),
    userId: obj.userId?.toString(),
    patientId: obj.patientId?.toString(),
    role: obj.role,
    context: obj.context,
    signatureData: obj.signatureData,
    mimeType: obj.mimeType,
    metadata: obj.metadata,
    signedAt: obj.signedAt ? obj.signedAt.getTime() : undefined,
    createdAt: obj.createdAt.getTime(),
    updatedAt: obj.updatedAt.getTime(),
  };
};

const Signature = mongoose.model('Signature', signatureSchema);

export default Signature;
