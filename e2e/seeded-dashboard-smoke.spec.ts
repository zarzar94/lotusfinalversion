import { test, expect, type APIRequestContext, type Page } from '@playwright/test';

type SeededCredentials = {
  email: string;
  password: string;
};

type LoginResponse = {
  success: boolean;
  token?: string;
  refreshToken?: string;
  user?: {
    id: string;
    email?: string;
    name?: string;
    nameAr?: string;
    role: string;
    clinic?: string;
    school?: string;
    children?: string[];
    createdAt: number;
    lastLogin: number;
  };
};

const backendBaseUrl = process.env.BACKEND_URL || 'http://localhost:3001/api';

const seededUsers = {
  parent: { email: 'parent@lotusait.com', password: 'Parent123!' },
  clinician: { email: 'clinician@lotusait.com', password: 'Clinic123!' },
  schoolAdmin: { email: 'school@lotusait.com', password: 'School123!' },
  patient: { email: 'patient@lotusait.com', password: 'Patient123!' },
};

const seededNamePattern = /Maya Hassan|Omar Saleh/;

let backendAvailable = false;

const loginSeededUser = async (
  request: APIRequestContext,
  credentials: SeededCredentials
): Promise<LoginResponse> => {
  const response = await request.post(`${backendBaseUrl}/auth/login`, {
    data: credentials,
  });

  expect(response.ok()).toBeTruthy();
  const body = await response.json() as LoginResponse;
  expect(body.success).toBeTruthy();

  if (!body.token || !body.user) {
    throw new Error('Seeded login did not return token + user');
  }

  return body;
};

const seedSessionStorage = async (page: Page, session: LoginResponse) => {
  await page.addInitScript(({ token, refreshToken, user }) => {
    localStorage.setItem('lotus_auth_token', token);
    if (refreshToken) {
      localStorage.setItem('lotus_refresh_token', refreshToken);
    }
    localStorage.setItem('lotus_user_state', JSON.stringify({ user }));
    localStorage.setItem('lotus_language', 'en');
    localStorage.setItem('lotus_first_visit', 'true');
  }, {
    token: session.token,
    refreshToken: session.refreshToken,
    user: session.user,
  });
};

test.use({ acceptDownloads: true });

test.beforeAll(async ({ request }) => {
  try {
    const response = await request.get(`${backendBaseUrl}/health`);
    backendAvailable = response.ok();
  } catch {
    backendAvailable = false;
  }
});

test.describe('Seeded dashboard smoke', () => {
  test('parent dashboard uses seeded child data', async ({ page, request }) => {
    if (!backendAvailable) {
      test.skip(true, `Backend not reachable at ${backendBaseUrl}`);
    }

    const session = await loginSeededUser(request, seededUsers.parent);
    await seedSessionStorage(page, session);

    await page.goto('/dashboard/parent');
    await expect(page.getByText(/Parent Dashboard/i)).toBeVisible();
    await expect(page.getByText(seededNamePattern)).toBeVisible();
  });

  test('clinician dashboard uses seeded patient data', async ({ page, request }) => {
    if (!backendAvailable) {
      test.skip(true, `Backend not reachable at ${backendBaseUrl}`);
    }

    const session = await loginSeededUser(request, seededUsers.clinician);
    await seedSessionStorage(page, session);

    await page.goto('/dashboard/clinician');
    await expect(page.getByText(/Clinician Dashboard/i)).toBeVisible();
    await expect(page.getByText(seededNamePattern)).toBeVisible();
  });

  test('school dashboard uses seeded student data', async ({ page, request }) => {
    if (!backendAvailable) {
      test.skip(true, `Backend not reachable at ${backendBaseUrl}`);
    }

    const session = await loginSeededUser(request, seededUsers.schoolAdmin);
    await seedSessionStorage(page, session);

    await page.goto('/dashboard/educator');
    await expect(page.getByText(/School Analytics Dashboard/i)).toBeVisible();
    await expect(page.getByText(seededNamePattern)).toBeVisible();
  });

  test('resources download emits a download event', async ({ page, request }) => {
    if (!backendAvailable) {
      test.skip(true, `Backend not reachable at ${backendBaseUrl}`);
    }

    const session = await loginSeededUser(request, seededUsers.patient);
    await seedSessionStorage(page, session);

    await page.goto('/resources');

    const openSampleButton = page.getByRole('button', { name: /open sample/i }).first();
    await expect(openSampleButton).toBeVisible();
    await openSampleButton.click();

    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();

    const downloadPromise = page.waitForEvent('download');
    await modal.getByRole('link', { name: /download/i }).first().click();

    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/\.png$/i);
  });
});
