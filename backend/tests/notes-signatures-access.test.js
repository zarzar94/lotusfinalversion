import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { app } from '../src/index.js';
import { Note, Signature, User } from '../src/models/index.js';
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

const createUser = async ({ email, role = 'patient', children = [] }) => {
  return User.create({
    email,
    password: 'TestPass1!',
    name: `Test ${role}`,
    role,
    children,
  });
};

const tokenFor = (user) => generateTokens(user._id).token;

const seedUsers = async () => {
  const patient = await createUser({ email: 'patient@example.com', role: 'patient' });
  const otherPatient = await createUser({ email: 'other@example.com', role: 'patient' });
  const parent = await createUser({
    email: 'parent@example.com',
    role: 'parent',
    children: [patient._id],
  });
  const parentUnlinked = await createUser({ email: 'parent2@example.com', role: 'parent' });
  const clinician = await createUser({ email: 'clinician@example.com', role: 'clinician' });
  const schoolAdmin = await createUser({ email: 'school@example.com', role: 'school_admin' });
  const superAdmin = await createUser({ email: 'super@example.com', role: 'super_admin' });

  return {
    patient,
    otherPatient,
    parent,
    parentUnlinked,
    clinician,
    schoolAdmin,
    superAdmin,
  };
};

test('enforces role-based access for listing notes by patient', async () => {
  const users = await seedUsers();
  await Note.create({
    patientId: users.patient._id,
    authorId: users.clinician._id,
    authorRole: 'clinician',
    content: 'Baseline note.',
  });

  const scenarios = [
    ['clinician', users.clinician, 200],
    ['super_admin', users.superAdmin, 200],
    ['parent linked', users.parent, 200],
    ['patient self', users.patient, 200],
    ['parent unlinked', users.parentUnlinked, 403],
    ['other patient', users.otherPatient, 403],
    ['school_admin', users.schoolAdmin, 403],
  ];

  for (const [label, user, expectedStatus] of scenarios) {
    const response = await request(app)
      .get(`/api/notes?patientId=${users.patient._id}`)
      .set('Authorization', `Bearer ${tokenFor(user)}`);

    expect(response.status).toBe(expectedStatus);
    if (expectedStatus === 200) {
      expect(response.body.success).toBe(true);
    } else {
      expect(response.body.error?.code).toBe('FORBIDDEN');
    }
  }
});

test('enforces role-based access for creating notes', async () => {
  const users = await seedUsers();

  const scenarios = [
    ['patient self', users.patient, users.patient._id, 201],
    ['parent linked', users.parent, users.patient._id, 201],
    ['clinician', users.clinician, users.patient._id, 201],
    ['super_admin', users.superAdmin, users.patient._id, 201],
    ['parent unlinked', users.parentUnlinked, users.patient._id, 403],
    ['other patient', users.otherPatient, users.patient._id, 403],
    ['school_admin', users.schoolAdmin, users.patient._id, 403],
  ];

  for (const [label, user, patientId, expectedStatus] of scenarios) {
    const response = await request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${tokenFor(user)}`)
      .send({
        patientId,
        content: `Note by ${label}.`,
        category: 'progress',
      });

    expect(response.status).toBe(expectedStatus);
    if (expectedStatus === 201) {
      expect(response.body.success).toBe(true);
    } else {
      expect(response.body.error?.code).toBe('FORBIDDEN');
    }
  }
});

test('restricts note updates and deletes to author or super_admin', async () => {
  const users = await seedUsers();

  const note = await Note.create({
    patientId: users.patient._id,
    authorId: users.patient._id,
    authorRole: 'patient',
    content: 'Original note.',
  });

  const updateByAuthor = await request(app)
    .patch(`/api/notes/${note._id}`)
    .set('Authorization', `Bearer ${tokenFor(users.patient)}`)
    .send({ content: 'Updated by author.' });

  expect(updateByAuthor.status).toBe(200);

  const updateByClinician = await request(app)
    .patch(`/api/notes/${note._id}`)
    .set('Authorization', `Bearer ${tokenFor(users.clinician)}`)
    .send({ content: 'Updated by clinician.' });

  expect(updateByClinician.status).toBe(403);

  const updateBySuper = await request(app)
    .patch(`/api/notes/${note._id}`)
    .set('Authorization', `Bearer ${tokenFor(users.superAdmin)}`)
    .send({ content: 'Updated by super admin.' });

  expect(updateBySuper.status).toBe(200);

  const deleteByClinician = await request(app)
    .delete(`/api/notes/${note._id}`)
    .set('Authorization', `Bearer ${tokenFor(users.clinician)}`);

  expect(deleteByClinician.status).toBe(403);

  const deleteBySuper = await request(app)
    .delete(`/api/notes/${note._id}`)
    .set('Authorization', `Bearer ${tokenFor(users.superAdmin)}`);

  expect(deleteBySuper.status).toBe(200);
});

test('enforces role-based access for listing signatures by patient', async () => {
  const users = await seedUsers();
  await Signature.create({
    userId: users.patient._id,
    patientId: users.patient._id,
    role: 'patient',
    context: 'consent',
    signatureData: 'signature-data',
  });

  const scenarios = [
    ['clinician', users.clinician, 200],
    ['super_admin', users.superAdmin, 200],
    ['parent linked', users.parent, 200],
    ['patient self', users.patient, 200],
    ['parent unlinked', users.parentUnlinked, 403],
    ['other patient', users.otherPatient, 403],
    ['school_admin', users.schoolAdmin, 403],
  ];

  for (const [label, user, expectedStatus] of scenarios) {
    const response = await request(app)
      .get(`/api/signatures?patientId=${users.patient._id}`)
      .set('Authorization', `Bearer ${tokenFor(user)}`);

    expect(response.status).toBe(expectedStatus);
    if (expectedStatus === 200) {
      expect(response.body.success).toBe(true);
    } else {
      expect(response.body.error?.code).toBe('FORBIDDEN');
    }
  }
});

test('enforces role-based access for creating signatures with patientId', async () => {
  const users = await seedUsers();

  const scenarios = [
    ['patient self', users.patient, users.patient._id, 201],
    ['parent linked', users.parent, users.patient._id, 201],
    ['clinician', users.clinician, users.patient._id, 201],
    ['super_admin', users.superAdmin, users.patient._id, 201],
    ['parent unlinked', users.parentUnlinked, users.patient._id, 403],
    ['other patient', users.otherPatient, users.patient._id, 403],
    ['school_admin', users.schoolAdmin, users.patient._id, 403],
  ];

  for (const [label, user, patientId, expectedStatus] of scenarios) {
    const response = await request(app)
      .post('/api/signatures')
      .set('Authorization', `Bearer ${tokenFor(user)}`)
      .send({
        patientId,
        signatureData: `sig-${label}`,
        context: 'consent',
      });

    expect(response.status).toBe(expectedStatus);
    if (expectedStatus === 201) {
      expect(response.body.success).toBe(true);
    } else {
      expect(response.body.error?.code).toBe('FORBIDDEN');
    }
  }
});

test('restricts signature deletes to owner or super_admin', async () => {
  const users = await seedUsers();

  const signature = await Signature.create({
    userId: users.patient._id,
    patientId: users.patient._id,
    role: 'patient',
    context: 'consent',
    signatureData: 'signature-data',
  });

  const deleteByClinician = await request(app)
    .delete(`/api/signatures/${signature._id}`)
    .set('Authorization', `Bearer ${tokenFor(users.clinician)}`);

  expect(deleteByClinician.status).toBe(403);

  const deleteByOwner = await request(app)
    .delete(`/api/signatures/${signature._id}`)
    .set('Authorization', `Bearer ${tokenFor(users.patient)}`);

  expect(deleteByOwner.status).toBe(200);

  const signatureForSuper = await Signature.create({
    userId: users.patient._id,
    patientId: users.patient._id,
    role: 'patient',
    context: 'consent',
    signatureData: 'signature-data-2',
  });

  const deleteBySuper = await request(app)
    .delete(`/api/signatures/${signatureForSuper._id}`)
    .set('Authorization', `Bearer ${tokenFor(users.superAdmin)}`);

  expect(deleteBySuper.status).toBe(200);
});
