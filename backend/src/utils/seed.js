import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../.env') });

// Import models
import User from '../models/User.js';
import ClinicalProgress from '../models/ClinicalProgress.js';
import Gamification from '../models/Gamification.js';
import Settings from '../models/Settings.js';
import Session from '../models/Session.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lotus_ait';

// ═══════════════════════════════════════════════════════════════════════════
// SEED DATA
// ═══════════════════════════════════════════════════════════════════════════

const users = [
  {
    email: 'admin@lotusait.com',
    password: 'Admin123!',
    name: 'مدير النظام',
    nameEn: 'System Admin',
    role: 'super_admin',
    phone: '+966500000001',
  },
  {
    email: 'clinician@lotusait.com',
    password: 'Clinic123!',
    name: 'د. سارة أحمد',
    nameEn: 'Dr. Sarah Ahmed',
    role: 'clinician',
    phone: '+966500000002',
  },
  {
    email: 'school@lotusait.com',
    password: 'School123!',
    name: 'مدرسة النور',
    nameEn: 'Al-Noor School',
    role: 'school_admin',
    phone: '+966500000003',
  },
  {
    email: 'parent@lotusait.com',
    password: 'Parent123!',
    name: 'أحمد محمد',
    nameEn: 'Ahmed Mohammed',
    role: 'parent',
    phone: '+966500000004',
  },
  {
    email: 'patient@lotusait.com',
    password: 'Patient123!',
    name: 'يوسف أحمد',
    nameEn: 'Youssef Ahmed',
    role: 'patient',
    phone: '+966500000005',
    dateOfBirth: new Date('2015-03-15'),
  },
];

const achievements = [
  { id: 'first_steps', unlockedAt: new Date() },
  { id: 'brain_explorer', unlockedAt: new Date() },
  { id: 'slide_scholar', unlockedAt: null },
];

// ═══════════════════════════════════════════════════════════════════════════
// SEED FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

async function clearDatabase() {
  console.log('🗑️  Clearing existing data...');
  await Promise.all([
    User.deleteMany({}),
    ClinicalProgress.deleteMany({}),
    Gamification.deleteMany({}),
    Settings.deleteMany({}),
    Session.deleteMany({}),
  ]);
  console.log('✅ Database cleared');
}

async function seedUsers() {
  console.log('👥 Seeding users...');
  const createdUsers = [];

  for (const userData of users) {
    const user = await User.create({
      ...userData,
      password: userData.password,
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    createdUsers.push(user);
    console.log(`   ✓ Created ${userData.role}: ${userData.email}`);
  }

  return createdUsers;
}

async function seedClinicalProgress(users) {
  console.log('📊 Seeding clinical progress...');

  const patient = users.find(u => u.role === 'patient');
  if (!patient) return;

  await ClinicalProgress.create({
    userId: patient._id,
    sessionsCompleted: 8,
    totalSessions: 20,
    treatmentPhase: 'active',
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    hearingProfile: {
      left: [25, 30, 35, 40, 45, 50, 55, 60],
      right: [20, 25, 30, 35, 40, 45, 50, 55],
      frequencies: [250, 500, 1000, 2000, 3000, 4000, 6000, 8000],
    },
    metrics: {
      attention: 72,
      processingSpeed: 68,
      auditoryDiscrimination: 75,
      sequencing: 70,
    },
    weeklyGoals: [
      { week: 1, target: 5, completed: 5 },
      { week: 2, target: 5, completed: 5 },
      { week: 3, target: 5, completed: 3 },
    ],
    notes: [
      { date: new Date(), content: 'Good progress in attention tasks', author: 'Dr. Sarah' },
    ],
  });

  console.log('   ✓ Created clinical progress for patient');
}

async function seedGamification(users) {
  console.log('🏆 Seeding gamification...');

  for (const user of users) {
    const points = user.role === 'patient' ? 1250 : 500;
    const level = Math.floor(points / 500) + 1;

    await Gamification.create({
      userId: user._id,
      totalPoints: points,
      level,
      achievements: user.role === 'patient' ? achievements : [achievements[0]],
      exploredBrainRegions: ['temporal', 'frontal'],
      streakDays: user.role === 'patient' ? 7 : 1,
      lastActivityDate: new Date(),
      badges: user.role === 'patient' ? ['early_bird', 'consistent'] : [],
    });
  }

  console.log('   ✓ Created gamification states');
}

async function seedSettings(users) {
  console.log('⚙️  Seeding user settings...');

  for (const user of users) {
    await Settings.create({
      userId: user._id,
      language: 'ar',
      theme: 'dark',
      reducedMotion: false,
      highContrast: false,
      fontSize: 'medium',
      notifications: {
        email: true,
        push: true,
        sessionReminders: true,
        progressUpdates: true,
      },
      accessibility: {
        screenReader: false,
        keyboardNavigation: true,
      },
    });
  }

  console.log('   ✓ Created user settings');
}

async function seedSessions(users) {
  console.log('📝 Seeding assessment sessions...');

  const patient = users.find(u => u.role === 'patient');
  if (!patient) return;

  const sessionTypes = ['attention', 'frequency', 'sequencing', 'questionnaire'];

  for (let i = 0; i < 8; i++) {
    const sessionDate = new Date(Date.now() - (30 - i * 3) * 24 * 60 * 60 * 1000);

    await Session.create({
      userId: patient._id,
      type: sessionTypes[i % sessionTypes.length],
      completedAt: sessionDate,
      duration: 15 + Math.random() * 10, // 15-25 minutes
      score: 65 + Math.random() * 30, // 65-95 score
      results: {
        correctResponses: 18 + Math.floor(Math.random() * 7),
        totalTrials: 25,
        reactionTime: 350 + Math.random() * 150,
        accuracy: 0.72 + Math.random() * 0.23,
      },
      metadata: {
        device: 'web',
        browser: 'Chrome',
        headphonesVerified: true,
      },
    });
  }

  console.log('   ✓ Created 8 assessment sessions');
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════

async function seed() {
  try {
    console.log('\n🌱 Starting database seed...\n');
    console.log(`📦 Connecting to: ${MONGODB_URI}\n`);

    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    await clearDatabase();
    const createdUsers = await seedUsers();
    await seedClinicalProgress(createdUsers);
    await seedGamification(createdUsers);
    await seedSettings(createdUsers);
    await seedSessions(createdUsers);

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('🎉 Database seeded successfully!');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('\n📋 Test Accounts:');
    console.log('─────────────────────────────────────────────────────────────────');
    users.forEach(u => {
      console.log(`   ${u.role.padEnd(12)} │ ${u.email.padEnd(25)} │ ${u.password}`);
    });
    console.log('─────────────────────────────────────────────────────────────────\n');

  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB\n');
    process.exit(0);
  }
}

seed();
