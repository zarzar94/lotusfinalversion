/**
 * User Model - MongoDB Schema for user accounts
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  nameAr: {
    type: String,
    trim: true,
  },
  role: {
    type: String,
    enum: ['guest', 'patient', 'parent', 'clinician', 'school_admin', 'super_admin'],
    default: 'patient',
  },
  avatar: {
    type: String,
  },
  clinic: {
    type: String,
  },
  school: {
    type: String,
  },
  children: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  refreshToken: {
    type: String,
  },
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Transform output (remove sensitive fields)
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  delete obj.__v;

  // Transform _id to id and timestamps to numbers
  return {
    id: obj._id.toString(),
    email: obj.email,
    name: obj.name,
    nameAr: obj.nameAr,
    role: obj.role,
    avatar: obj.avatar,
    clinic: obj.clinic,
    school: obj.school,
    children: obj.children?.map(c => c.toString()),
    createdAt: obj.createdAt.getTime(),
    lastLogin: obj.lastLogin.getTime(),
  };
};

const User = mongoose.model('User', userSchema);

export default User;
