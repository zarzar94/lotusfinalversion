/**
 * Mock Data Generator for LOTUS SOUND LAB Platform
 * Generates realistic sample data for development and demo purposes
 */

import type {
  User,
  Patient,
  Assessment,
  TreatmentPlan,
  TreatmentSession,
  Booking,
  Feedback,
  Testimonial,
  Partner,
  Certification,
  ContentItem,
  GameProgress,
  PracticeActivity,
} from './models';

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

const generateId = (): string => {
  return `${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 9)}`;
};

const randomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const randomFromArray = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// =============================================================================
// MOCK DATA CONSTANTS
// =============================================================================

const FIRST_NAMES_EN = ['Ahmed', 'Sara', 'Mohammed', 'Fatima', 'Omar', 'Layla', 'Khalid', 'Nora', 'Ali', 'Hana'];
const FIRST_NAMES_AR = ['أحمد', 'سارة', 'محمد', 'فاطمة', 'عمر', 'ليلى', 'خالد', 'نورة', 'علي', 'هنا'];
const LAST_NAMES_EN = ['Al-Rahman', 'Hassan', 'Al-Sayed', 'Ibrahim', 'Al-Qahtani', 'Al-Dosari', 'Al-Shehri', 'Al-Harbi'];
const LAST_NAMES_AR = ['الرحمن', 'حسن', 'السيد', 'إبراهيم', 'القحطاني', 'الدوسري', 'الشهري', 'الحربي'];

const SCHOOLS = [
  { en: 'International School of Riyadh', ar: 'المدرسة الدولية بالرياض' },
  { en: 'Dar Al-Fikr Schools', ar: 'مدارس دار الفكر' },
  { en: 'Al-Faisal Academy', ar: 'أكاديمية الفيصل' },
  { en: 'Modern Knowledge Schools', ar: 'مدارس المعرفة الحديثة' },
];

const CONCERNS = [
  'attention',
  'processing',
  'sensitivity',
  'speech',
  'reading',
  'behavior',
  'academic',
  'social',
];

const THERAPIES = [
  'Speech Therapy',
  'Occupational Therapy',
  'Behavioral Therapy',
  'Physical Therapy',
  'Music Therapy',
  'Play Therapy',
];

// =============================================================================
// MOCK DATA GENERATORS
// =============================================================================

export const generateMockUser = (role: User['role'] = 'patient'): User => {
  const firstNameIndex = randomInt(0, FIRST_NAMES_EN.length - 1);
  const lastNameIndex = randomInt(0, LAST_NAMES_EN.length - 1);

  return {
    id: generateId(),
    email: `${FIRST_NAMES_EN[firstNameIndex].toLowerCase()}.${LAST_NAMES_EN[lastNameIndex].toLowerCase().replace('al-', '')}@email.com`,
    role,
    profile: {
      firstName: FIRST_NAMES_EN[firstNameIndex],
      lastName: LAST_NAMES_EN[lastNameIndex],
      displayName: `${FIRST_NAMES_EN[firstNameIndex]} ${LAST_NAMES_EN[lastNameIndex]}`,
      phone: `05${randomInt(0, 9)}${randomInt(1000000, 9999999)}`,
      dateOfBirth: randomDate(new Date(1980, 0, 1), new Date(2010, 11, 31)).toISOString().split('T')[0],
      gender: randomFromArray(['male', 'female']),
      nationality: 'Saudi',
      address: {
        city: randomFromArray(['Riyadh', 'Jeddah', 'Dammam']),
        region: randomFromArray(['Riyadh Region', 'Makkah Region', 'Eastern Province']),
        country: 'Saudi Arabia',
      },
    },
    preferences: {
      language: randomFromArray(['en', 'ar']),
      theme: 'system',
      notifications: {
        email: true,
        sms: true,
        whatsapp: true,
        push: true,
        appointmentReminders: true,
        progressUpdates: true,
        marketing: false,
      },
      timezone: 'Asia/Riyadh',
    },
    createdAt: randomDate(new Date(2022, 0, 1), new Date()),
    updatedAt: new Date(),
    lastLoginAt: randomDate(new Date(2024, 0, 1), new Date()),
    isActive: true,
    isVerified: true,
  };
};

export const generateMockPatient = (parentId: string): Patient => {
  const firstNameIndex = randomInt(0, FIRST_NAMES_EN.length - 1);
  const lastNameIndex = randomInt(0, LAST_NAMES_EN.length - 1);
  const age = randomInt(4, 16);
  const dob = new Date();
  dob.setFullYear(dob.getFullYear() - age);

  return {
    id: generateId(),
    parentId,
    profile: {
      firstName: FIRST_NAMES_EN[firstNameIndex],
      lastName: LAST_NAMES_EN[lastNameIndex],
      dateOfBirth: dob.toISOString().split('T')[0],
      age,
      gender: randomFromArray(['male', 'female']),
      nationality: 'Saudi',
    },
    medicalHistory: {
      hasHearingLoss: Math.random() > 0.7,
      hearingLossDetails: Math.random() > 0.5 ? 'Mild hearing loss in left ear' : undefined,
      hasEarInfections: Math.random() > 0.6,
      earInfectionDetails: Math.random() > 0.5 ? 'History of recurring ear infections in childhood' : undefined,
      hasTubesOrSurgery: Math.random() > 0.8,
      currentMedications: [],
      allergies: Math.random() > 0.7 ? ['Penicillin'] : [],
      previousTherapies: Math.random() > 0.5 ? [
        {
          type: randomFromArray(THERAPIES),
          startDate: '2022-01-01',
          endDate: '2022-06-30',
          outcome: 'Moderate improvement',
        },
      ] : [],
      otherMedicalConditions: [],
      diagnosisHistory: Math.random() > 0.6 ? [
        {
          code: 'F81.0',
          name: 'Specific reading disorder',
          diagnosedDate: '2022-03-15',
          diagnosedBy: 'Dr. Mohammed Al-Hassan',
        },
      ] : [],
    },
    auditoryProfile: {
      soundSensitivity: randomFromArray([1, 2, 3, 4, 5]) as 1 | 2 | 3 | 4 | 5,
      attentionDifficulty: randomFromArray([1, 2, 3, 4, 5]) as 1 | 2 | 3 | 4 | 5,
      speechProcessing: randomFromArray([1, 2, 3, 4, 5]) as 1 | 2 | 3 | 4 | 5,
      readingDifficulty: randomFromArray([1, 2, 3, 4, 5]) as 1 | 2 | 3 | 4 | 5,
      followingInstructions: randomFromArray([1, 2, 3, 4, 5]) as 1 | 2 | 3 | 4 | 5,
      noisyEnvironments: randomFromArray([1, 2, 3, 4, 5]) as 1 | 2 | 3 | 4 | 5,
      primaryConcerns: [randomFromArray(CONCERNS), randomFromArray(CONCERNS)].filter((v, i, a) => a.indexOf(v) === i),
      concernsDescription: 'Difficulty focusing in classroom settings, especially with background noise.',
      goalsForTreatment: 'Improve attention span and reading comprehension.',
    },
    schoolInfo: age >= 6 ? {
      schoolName: randomFromArray(SCHOOLS).en,
      gradeLevel: `Grade ${age - 5}`,
      teacherName: `${randomFromArray(FIRST_NAMES_EN)} ${randomFromArray(LAST_NAMES_EN)}`,
      teacherEmail: 'teacher@school.edu.sa',
      hasIEP: Math.random() > 0.7,
      specialServices: Math.random() > 0.5 ? ['Resource Room', 'Speech Services'] : [],
      academicChallenges: 'Reading comprehension and following multi-step instructions.',
    } : undefined,
    treatmentHistory: [],
    documents: [],
    notes: [],
    createdAt: randomDate(new Date(2023, 0, 1), new Date()),
    updatedAt: new Date(),
  };
};

export const generateMockAssessment = (patientId: string, practitionerId: string): Assessment => {
  const completedDate = randomDate(new Date(2024, 0, 1), new Date());

  return {
    id: generateId(),
    patientId,
    type: randomFromArray(['initial', 'progress', 'final']),
    status: 'completed',
    scheduledDate: completedDate.toISOString().split('T')[0],
    completedDate: completedDate.toISOString().split('T')[0],
    practitionerId,
    practitionerName: 'Dr. Sarah Al-Rahman',
    results: {
      overallScore: randomInt(40, 85),
      categories: [
        {
          name: 'Auditory Attention',
          score: randomInt(30, 90),
          maxScore: 100,
          percentile: randomInt(20, 80),
          interpretation: 'Below average attention span for auditory stimuli.',
        },
        {
          name: 'Auditory Discrimination',
          score: randomInt(40, 85),
          maxScore: 100,
          percentile: randomInt(25, 75),
          interpretation: 'Moderate difficulty distinguishing similar sounds.',
        },
        {
          name: 'Auditory Sequencing',
          score: randomInt(35, 80),
          maxScore: 100,
          percentile: randomInt(20, 70),
          interpretation: 'Challenges with processing sequential auditory information.',
        },
        {
          name: 'Auditory Memory',
          score: randomInt(45, 90),
          maxScore: 100,
          percentile: randomInt(30, 80),
          interpretation: 'Average short-term auditory memory capacity.',
        },
      ],
      summary: 'The assessment indicates moderate auditory processing difficulties, particularly in attention and sequencing tasks. Bérard AIT is recommended.',
      riskLevel: randomFromArray(['low', 'moderate', 'high']),
    },
    behavioralObservations: [
      'Patient appeared fidgety during longer listening tasks',
      'Required frequent repetition of instructions',
      'Showed good effort and engagement throughout the assessment',
      'Some difficulty maintaining focus in the presence of background noise',
    ],
    recommendations: [
      'Complete 10-day Bérard AIT program',
      'Follow-up assessment in 3 months',
      'Classroom accommodations: preferential seating, reduced background noise',
      'Home practice with auditory attention exercises',
    ],
    followUpDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    createdAt: completedDate,
    updatedAt: new Date(),
  };
};

export const generateMockTreatmentPlan = (patientId: string): TreatmentPlan => {
  const startDate = randomDate(new Date(2024, 0, 1), new Date());
  const sessions: TreatmentSession[] = [];

  // Generate 20 sessions (10 days, 2 per day)
  for (let day = 1; day <= 10; day++) {
    for (const period of ['morning', 'afternoon'] as const) {
      const sessionDate = new Date(startDate);
      sessionDate.setDate(sessionDate.getDate() + day - 1);

      sessions.push({
        id: generateId(),
        planId: '', // Will be set after plan creation
        patientId,
        sessionNumber: sessions.length + 1,
        day,
        period,
        status: sessions.length < randomInt(5, 20) ? 'completed' : 'scheduled',
        scheduledDate: sessionDate.toISOString().split('T')[0],
        scheduledTime: period === 'morning' ? '09:00' : '16:00',
        duration: 30,
        practitionerId: 'prac-001',
        practitionerName: 'Fatima Al-Sayed',
        protocol: {
          frequencyProfile: 'Standard Bérard Profile',
          volumeSettings: {
            left: 65,
            right: 65,
            maxAllowed: 80,
          },
          filterSettings: [
            { frequencyBand: 'Low', centerHz: 250, attenuation: 0, enabled: true },
            { frequencyBand: 'Mid-Low', centerHz: 500, attenuation: -3, enabled: true },
            { frequencyBand: 'Mid', centerHz: 1000, attenuation: 0, enabled: true },
            { frequencyBand: 'Mid-High', centerHz: 2000, attenuation: -6, enabled: true },
            { frequencyBand: 'High', centerHz: 4000, attenuation: 0, enabled: true },
          ],
        },
        patientResponse: sessions.length < randomInt(5, 20)
          ? randomFromArray(['positive', 'neutral', 'challenging'])
          : null,
        observations: sessions.length < 10
          ? 'Patient responded well to the session. Good engagement observed.'
          : undefined,
        createdAt: sessionDate,
        updatedAt: new Date(),
      });
    }
  }

  const plan: TreatmentPlan = {
    id: generateId(),
    patientId,
    status: randomFromArray(['active', 'completed']),
    type: 'standard',
    startDate: startDate.toISOString().split('T')[0],
    endDate: sessions.length === 20 ? new Date(startDate.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined,
    totalSessions: 20,
    completedSessions: sessions.filter(s => s.status === 'completed').length,
    sessions: sessions.map(s => ({ ...s, planId: '' })), // planId will be set below
    goals: [
      {
        id: generateId(),
        category: 'Attention',
        description: 'Improve sustained auditory attention to 30+ minutes',
        status: 'in-progress',
        baseline: 15,
        target: 30,
        current: 22,
      },
      {
        id: generateId(),
        category: 'Sound Sensitivity',
        description: 'Reduce hypersensitivity to everyday sounds',
        status: 'in-progress',
        baseline: 4,
        target: 2,
        current: 3,
      },
      {
        id: generateId(),
        category: 'Reading',
        description: 'Improve reading fluency by 20%',
        status: 'not-started',
        baseline: 60,
        target: 80,
        current: 60,
      },
    ],
    protocol: {
      name: 'Bérard AIT Standard Protocol',
      version: '2.0',
      description: 'Standard 10-day Bérard Auditory Integration Training protocol',
      dailySessions: 2,
      sessionDuration: 30,
      totalDays: 10,
      frequencyProfiles: [
        {
          id: 'standard',
          name: 'Standard Profile',
          description: 'Default frequency profile for general auditory processing improvement',
          bands: [
            { band: 'Sub-Bass', centerHz: 40, minHz: 20, maxHz: 60, defaultAttenuation: 0 },
            { band: 'Bass', centerHz: 125, minHz: 60, maxHz: 250, defaultAttenuation: 0 },
            { band: 'Low-Mid', centerHz: 500, minHz: 250, maxHz: 1000, defaultAttenuation: 0 },
            { band: 'Mid', centerHz: 2000, minHz: 1000, maxHz: 4000, defaultAttenuation: 0 },
            { band: 'High-Mid', centerHz: 6000, minHz: 4000, maxHz: 8000, defaultAttenuation: 0 },
            { band: 'High', centerHz: 12000, minHz: 8000, maxHz: 16000, defaultAttenuation: 0 },
          ],
        },
      ],
    },
    createdById: 'admin-001',
    createdAt: startDate,
    updatedAt: new Date(),
  };

  // Set planId for all sessions
  plan.sessions = plan.sessions.map(s => ({ ...s, planId: plan.id }));

  return plan;
};

export const generateMockBooking = (patientId: string, parentId: string): Booking => {
  const scheduledDate = randomDate(new Date(), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));

  return {
    id: generateId(),
    patientId,
    patientName: `${randomFromArray(FIRST_NAMES_EN)} ${randomFromArray(LAST_NAMES_EN)}`,
    parentId,
    parentName: `${randomFromArray(FIRST_NAMES_EN)} ${randomFromArray(LAST_NAMES_EN)}`,
    type: randomFromArray(['initial-consultation', 'assessment', 'treatment-start', 'follow-up']),
    status: randomFromArray(['pending', 'confirmed']),
    scheduledDate: scheduledDate.toISOString().split('T')[0],
    scheduledTime: randomFromArray(['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']),
    duration: 60,
    practitionerId: 'prac-001',
    practitionerName: 'Dr. Sarah Al-Rahman',
    location: 'Main Clinic - Room 3',
    contactInfo: {
      phone: `05${randomInt(0, 9)}${randomInt(1000000, 9999999)}`,
      email: 'parent@email.com',
      preferredContact: randomFromArray(['phone', 'email', 'whatsapp']),
    },
    reminders: {
      enabled: true,
      channels: ['email', 'whatsapp'],
      times: [24, 2], // 24 hours and 2 hours before
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

export const generateMockFeedback = (patientId: string, userId: string): Feedback => {
  return {
    id: generateId(),
    patientId,
    userId,
    type: randomFromArray(['session', 'treatment', 'service']),
    overallRating: randomInt(3, 5),
    categoryRatings: {
      'Staff Friendliness': randomInt(4, 5),
      'Facility Cleanliness': randomInt(4, 5),
      'Wait Time': randomInt(3, 5),
      'Treatment Effectiveness': randomInt(3, 5),
      'Communication': randomInt(4, 5),
    },
    wouldRecommend: Math.random() > 0.1,
    improvements: randomFromArray([
      ['Shorter wait times'],
      ['More flexible scheduling'],
      ['More parking space'],
      [],
    ]),
    comments: randomFromArray([
      'Excellent experience! The staff was very professional and caring.',
      'My child loves coming here. We have seen great improvements.',
      'Very happy with the treatment. Would definitely recommend.',
      'The facility is clean and welcoming. Great service overall.',
    ]),
    isPublic: Math.random() > 0.3,
    isApproved: true,
    followUpConsent: Math.random() > 0.5,
    createdAt: randomDate(new Date(2024, 0, 1), new Date()),
  };
};

export const generateMockTestimonial = (): Testimonial => {
  const improvements = {
    attention: { before: randomInt(30, 50), after: randomInt(70, 90) },
    processing: { before: randomInt(35, 55), after: randomInt(65, 85) },
    reading: { before: randomInt(40, 60), after: randomInt(75, 95) },
  };

  return {
    id: generateId(),
    authorName: `${randomFromArray(FIRST_NAMES_EN)} ${randomFromArray(LAST_NAMES_EN)}`,
    relationship: randomFromArray(['parent', 'patient']),
    content: randomFromArray([
      'The improvement in my child\'s attention and focus has been remarkable. After completing the AIT program, he can now follow instructions better and his reading has significantly improved.',
      'We were skeptical at first, but the results speak for themselves. Our daughter is more confident in class and her teachers have noticed a positive change.',
      'The team at Lotus Sound Lab is amazing. They made my son feel comfortable throughout the treatment. We are so grateful for the progress he has made.',
      'AIT changed our lives. My child used to struggle with loud sounds, but now she can enjoy birthday parties and family gatherings without distress.',
    ]),
    rating: randomInt(4, 5),
    category: randomFromArray(['attention', 'academic', 'behavioral', 'sensory']),
    beforeMetrics: {
      attention: improvements.attention.before,
      processing: improvements.processing.before,
      reading: improvements.reading.before,
    },
    afterMetrics: {
      attention: improvements.attention.after,
      processing: improvements.processing.after,
      reading: improvements.reading.after,
    },
    isApproved: true,
    isFeatured: Math.random() > 0.7,
    createdAt: randomDate(new Date(2023, 0, 1), new Date()),
  };
};

export const generateMockPartner = (): Partner => {
  const types: Partner['type'][] = ['school', 'hospital', 'clinic', 'organization', 'research'];
  const type = randomFromArray(types);

  const names: Record<Partner['type'], { en: string; ar: string }[]> = {
    school: SCHOOLS,
    hospital: [
      { en: 'King Faisal Specialist Hospital', ar: 'مستشفى الملك فيصل التخصصي' },
      { en: 'King Abdulaziz Medical City', ar: 'مدينة الملك عبدالعزيز الطبية' },
    ],
    clinic: [
      { en: 'Pediatric Development Center', ar: 'مركز تطور الطفل' },
      { en: 'Hearing Health Clinic', ar: 'عيادة صحة السمع' },
    ],
    organization: [
      { en: 'Saudi Autism Society', ar: 'الجمعية السعودية للتوحد' },
      { en: 'Learning Disabilities Association', ar: 'جمعية صعوبات التعلم' },
    ],
    research: [
      { en: 'King Abdullah University', ar: 'جامعة الملك عبدالله' },
      { en: 'Auditory Research Institute', ar: 'معهد بحوث السمع' },
    ],
  };

  const name = randomFromArray(names[type]);

  return {
    id: generateId(),
    type,
    name,
    description: {
      en: `Leading ${type} in Saudi Arabia committed to excellence in healthcare and education.`,
      ar: `${type === 'school' ? 'مدرسة' : type === 'hospital' ? 'مستشفى' : 'مؤسسة'} رائدة في المملكة العربية السعودية ملتزمة بالتميز في الرعاية الصحية والتعليم.`,
    },
    website: `https://www.${name.en.toLowerCase().replace(/\s+/g, '')}.sa`,
    contactPerson: `${randomFromArray(FIRST_NAMES_EN)} ${randomFromArray(LAST_NAMES_EN)}`,
    contactEmail: `contact@${name.en.toLowerCase().replace(/\s+/g, '')}.sa`,
    contactPhone: `011${randomInt(1000000, 9999999)}`,
    address: {
      city: 'Riyadh',
      region: 'Riyadh Region',
      country: 'Saudi Arabia',
    },
    partnershipStart: '2022-01-01',
    status: 'active',
    referralCount: randomInt(10, 150),
    isFeatured: Math.random() > 0.6,
  };
};

export const generateMockCertification = (): Certification => {
  const certifications = [
    {
      name: { en: 'Bérard AIT Practitioner Certification', ar: 'شهادة ممارس تدريب التكامل السمعي بيرارد' },
      issuedBy: 'Bérard AIT International',
    },
    {
      name: { en: 'Saudi Health Council License', ar: 'ترخيص المجلس الصحي السعودي' },
      issuedBy: 'Saudi Health Council',
    },
    {
      name: { en: 'Clinical Audiology Certification', ar: 'شهادة علم السمع السريري' },
      issuedBy: 'American Academy of Audiology',
    },
  ];

  const cert = randomFromArray(certifications);

  return {
    id: generateId(),
    type: randomFromArray(['practitioner', 'facility', 'program']),
    name: cert.name,
    issuedBy: cert.issuedBy,
    issuedDate: randomDate(new Date(2020, 0, 1), new Date()).toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000 * 3).toISOString().split('T')[0],
    description: {
      en: 'Officially certified to provide Bérard Auditory Integration Training services.',
      ar: 'معتمد رسمياً لتقديم خدمات تدريب التكامل السمعي بيرارد.',
    },
  };
};

export const generateMockGameProgress = (userId: string): GameProgress => {
  return {
    userId,
    level: randomInt(1, 15),
    totalXP: randomInt(500, 10000),
    currentXP: randomInt(0, 500),
    xpToNextLevel: 500,
    badges: [
      {
        id: generateId(),
        name: 'First Steps',
        description: 'Completed your first practice session',
        iconUrl: '/badges/first-steps.svg',
        category: 'milestone',
        earnedAt: randomDate(new Date(2024, 0, 1), new Date()),
        rarity: 'common',
      },
      {
        id: generateId(),
        name: 'Sound Explorer',
        description: 'Tried all game types',
        iconUrl: '/badges/explorer.svg',
        category: 'exploration',
        earnedAt: randomDate(new Date(2024, 0, 1), new Date()),
        rarity: 'uncommon',
      },
    ],
    achievements: [
      {
        id: generateId(),
        name: 'Practice Champion',
        description: 'Complete 50 practice sessions',
        category: 'practice',
        progress: randomInt(10, 50),
        target: 50,
        isCompleted: false,
        reward: { type: 'xp', value: 500 },
      },
    ],
    streak: {
      current: randomInt(0, 14),
      longest: randomInt(7, 30),
      lastActivityDate: new Date().toISOString().split('T')[0],
    },
    stats: {
      totalPracticeTime: randomInt(600, 3600),
      sessionsCompleted: randomInt(10, 100),
      gamesPlayed: randomInt(20, 200),
      perfectScores: randomInt(5, 30),
      averageScore: randomInt(65, 95),
    },
  };
};

// =============================================================================
// BATCH GENERATORS
// =============================================================================

export const generateMockDataSet = () => {
  const users = Array.from({ length: 10 }, () => generateMockUser('parent'));
  const patients = users.flatMap(user =>
    Array.from({ length: randomInt(1, 3) }, () => generateMockPatient(user.id))
  );
  const assessments = patients.map(patient => generateMockAssessment(patient.id, 'prac-001'));
  const treatmentPlans = patients.slice(0, 5).map(patient => generateMockTreatmentPlan(patient.id));
  const bookings = patients.slice(0, 8).map(patient =>
    generateMockBooking(patient.id, patient.parentId)
  );
  const feedbacks = patients.slice(0, 6).map((patient, i) =>
    generateMockFeedback(patient.id, users[i % users.length].id)
  );
  const testimonials = Array.from({ length: 8 }, generateMockTestimonial);
  const partners = Array.from({ length: 10 }, generateMockPartner);
  const certifications = Array.from({ length: 5 }, generateMockCertification);

  return {
    users,
    patients,
    assessments,
    treatmentPlans,
    bookings,
    feedbacks,
    testimonials,
    partners,
    certifications,
  };
};

export default {
  generateMockUser,
  generateMockPatient,
  generateMockAssessment,
  generateMockTreatmentPlan,
  generateMockBooking,
  generateMockFeedback,
  generateMockTestimonial,
  generateMockPartner,
  generateMockCertification,
  generateMockGameProgress,
  generateMockDataSet,
};
