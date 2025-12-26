import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { app } from '../src/index.js';
import { Session, User } from '../src/models/index.js';
import { generateTokens } from '../src/middleware/auth.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

const createUser = async ({
  email,
  role = 'patient',
  children = [],
  school,
}) => User.create({
  email,
  password: 'TestPass1!',
  name: `Test ${role}`,
  role,
  children,
  school,
});

const tokenFor = (user) => generateTokens(user._id).token;

const seedSession = async (userId) => Session.create({
  userId,
  outcomes: {
    attention: {
      result: 'high',
      scoreLabel: 'Score 8/10',
      metrics: { score100: 80 },
    },
  },
  totalPoints: 120,
});

test('enforces patient-scoped analytics access', async () => {
  const patient = await createUser({ email: 'patient@example.com', role: 'patient', school: 'Lotus' });
  const otherPatient = await createUser({ email: 'other@example.com', role: 'patient', school: 'Lotus' });
  const parent = await createUser({
    email: 'parent@example.com',
    role: 'parent',
    children: [patient._id],
    school: 'Lotus',
  });
  const parentUnlinked = await createUser({ email: 'parent2@example.com', role: 'parent', school: 'Lotus' });
  const clinician = await createUser({ email: 'clinician@example.com', role: 'clinician' });
  const superAdmin = await createUser({ email: 'super@example.com', role: 'super_admin' });
  const schoolAdmin = await createUser({ email: 'school@example.com', role: 'school_admin', school: 'Lotus' });
  const schoolAdminOther = await createUser({ email: 'school2@example.com', role: 'school_admin', school: 'Other' });

  await seedSession(patient._id);

  const scenarios = [
    ['patient self', patient, 200],
    ['parent linked', parent, 200],
    ['clinician', clinician, 200],
    ['super_admin', superAdmin, 200],
    ['school_admin same school', schoolAdmin, 200],
    ['parent unlinked', parentUnlinked, 403],
    ['other patient', otherPatient, 403],
    ['school_admin other school', schoolAdminOther, 403],
  ];

  for (const [label, user, expectedStatus] of scenarios) {
    const response = await request(app)
      .get(`/api/sessions/analysis/patient?patientId=${patient._id}`)
      .set('Authorization', `Bearer ${tokenFor(user)}`);

    expect(response.status).toBe(expectedStatus);
    if (expectedStatus === 200) {
      expect(response.body.success).toBe(true);
    } else {
      expect(response.body.error?.code).toBe('FORBIDDEN');
    }
  }
});

test('enforces school-scoped analytics access', async () => {
  const schoolAdmin = await createUser({ email: 'school@example.com', role: 'school_admin', school: 'Lotus' });
  const schoolAdminNoSchool = await createUser({ email: 'school2@example.com', role: 'school_admin' });
  const clinician = await createUser({ email: 'clinician@example.com', role: 'clinician' });
  const superAdmin = await createUser({ email: 'super@example.com', role: 'super_admin' });
  const parent = await createUser({ email: 'parent@example.com', role: 'parent', school: 'Lotus' });

  const studentOne = await createUser({ email: 'student1@example.com', role: 'patient', school: 'Lotus' });
  const studentTwo = await createUser({ email: 'student2@example.com', role: 'patient', school: 'Lotus' });
  const otherStudent = await createUser({ email: 'other@example.com', role: 'patient', school: 'Other' });

  await seedSession(studentOne._id);
  await seedSession(studentTwo._id);
  await seedSession(otherStudent._id);

  const schoolResponse = await request(app)
    .get('/api/sessions/analysis/school')
    .set('Authorization', `Bearer ${tokenFor(schoolAdmin)}`);

  expect(schoolResponse.status).toBe(200);
  expect(schoolResponse.body.success).toBe(true);
  expect(schoolResponse.body.summary.school).toBe('Lotus');
  expect(schoolResponse.body.summary.totalSessions).toBe(2);
  expect(schoolResponse.body.summary.uniqueUsers).toBe(2);

  const superResponse = await request(app)
    .get('/api/sessions/analysis/school?school=Lotus')
    .set('Authorization', `Bearer ${tokenFor(superAdmin)}`);

  expect(superResponse.status).toBe(200);
  expect(superResponse.body.success).toBe(true);

  const clinicianResponse = await request(app)
    .get('/api/sessions/analysis/school?school=Lotus')
    .set('Authorization', `Bearer ${tokenFor(clinician)}`);

  expect(clinicianResponse.status).toBe(200);
  expect(clinicianResponse.body.success).toBe(true);

  const parentResponse = await request(app)
    .get('/api/sessions/analysis/school')
    .set('Authorization', `Bearer ${tokenFor(parent)}`);

  expect(parentResponse.status).toBe(403);
  expect(parentResponse.body.error?.code).toBe('FORBIDDEN');

  const missingSchoolResponse = await request(app)
    .get('/api/sessions/analysis/school')
    .set('Authorization', `Bearer ${tokenFor(schoolAdminNoSchool)}`);

  expect(missingSchoolResponse.status).toBe(400);
  expect(missingSchoolResponse.body.error?.code).toBe('VALIDATION_ERROR');
});
