import { test, expect, type APIRequestContext, type Browser, type Locator, type Page, type StorageState } from '@playwright/test';

type SeededCredentials = {
  email: string;
  password: string;
};

type ParentChildrenResponse = {
  success: boolean;
  children: Array<{ name?: string | null }>;
};

type ClinicianPatientsResponse = {
  success: boolean;
  patients: Array<{ name?: string | null }>;
};

type SchoolAnalysisResponse = {
  success: boolean;
  students: Array<{ name?: string | null }>;
};

type LoginResponsePayload = {
  success?: boolean;
  token?: string;
  refreshToken?: string;
  user?: Record<string, unknown>;
  data?: {
    user?: Record<string, unknown>;
  };
  accessToken?: string;
  authToken?: string;
  refresh_token?: string;
};

const backendBaseUrl = process.env.BACKEND_URL || 'http://localhost:3001/api';
const appBaseUrl = process.env.APP_BASE_URL || 'http://localhost:5173';
const appOrigin = new URL(appBaseUrl).origin;
const shouldAssertDebug = process.env.VITE_E2E === 'true';

const seededUsers = {
  parent: { email: 'parent@lotusait.com', password: 'Parent123!' },
  clinician: { email: 'clinician@lotusait.com', password: 'Clinic123!' },
  schoolAdmin: { email: 'school@lotusait.com', password: 'School123!' },
  patient: { email: 'patient@lotusait.com', password: 'Patient123!' },
};

let backendAvailable = false;

const buildAppUrl = (path: string): string => new URL(path, appBaseUrl).toString();

const pickDisplayName = (names: Array<string | null | undefined>): string | null => {
  const candidates = names.filter((name): name is string => typeof name === 'string' && name.trim().length > 0);
  if (!candidates.length) return null;
  const english = candidates.find((name) => /[A-Za-z]/.test(name));
  return english || candidates[0];
};

const waitForAnalysis = async <T>(page: Page, pathFragment: string): Promise<T> => {
  const response = await page.waitForResponse(
    (resp) => resp.url().includes(pathFragment) && resp.request().method() === 'GET',
    { timeout: 15000 }
  );
  expect(response.ok()).toBeTruthy();
  return response.json() as Promise<T>;
};

const logDebugAttributes = async (dashboard: Locator, label: string): Promise<void> => {
  const debugState = await dashboard.evaluate((element) => ({
    canFetch: element.getAttribute('data-e2e-can-fetch'),
    role: element.getAttribute('data-e2e-role'),
    online: element.getAttribute('data-e2e-online'),
    auth: element.getAttribute('data-e2e-auth'),
    permission: element.getAttribute('data-e2e-permission'),
    permissionGranted: element.getAttribute('data-e2e-permission-granted'),
    token: element.getAttribute('data-e2e-token'),
    error: element.getAttribute('data-e2e-error'),
  }));
  console.log(`[e2e debug][${label}] ${JSON.stringify(debugState)}`);
};

const assertGlobalBanner = async (page: Page, label: string): Promise<void> => {
  const banner = page.locator('[data-e2e-app-auth]');
  await expect(banner).toBeVisible();
  const bannerState = await banner.evaluate((element) => ({
    auth: element.getAttribute('data-e2e-app-auth'),
    loading: element.getAttribute('data-e2e-app-loading'),
    role: element.getAttribute('data-e2e-app-role'),
  }));
  console.log(`[e2e banner][${label}] ${JSON.stringify(bannerState)}`);
  await expect(banner).toHaveAttribute('data-e2e-app-auth', 'true');
  await expect(banner).toHaveAttribute('data-e2e-app-loading', 'false');
};

const logAuthStorage = async (page: Page, label: string): Promise<void> => {
  const authState = await page.evaluate(() => {
    const userRaw = localStorage.getItem('lotus_user_state');
    let user: Record<string, unknown> | null = null;

    if (userRaw) {
      try {
        const parsed = JSON.parse(userRaw) as { user?: Record<string, unknown> };
        user = parsed?.user ?? null;
      } catch {
        user = null;
      }
    }

    const userSummary = user
      ? {
          id: typeof user.id === 'string' ? user.id : (user._id as string | undefined) ?? null,
          role: typeof user.role === 'string' ? user.role : (user.userRole as string | undefined) ?? null,
          email: typeof user.email === 'string' ? user.email : null,
        }
      : null;

    return {
      url: window.location.href,
      hasToken: Boolean(localStorage.getItem('lotus_auth_token')),
      hasRefreshToken: Boolean(localStorage.getItem('lotus_refresh_token')),
      user: userSummary,
      language: localStorage.getItem('lotus_language'),
      firstVisit: localStorage.getItem('lotus_first_visit'),
    };
  });

  console.log(`[e2e auth][${label}] ${JSON.stringify(authState)}`);
};

const attachDiagnostics = async (page: Page, label: string): Promise<void> => {
  const isApi = (url: string) => url.includes('/api/');

  page.on('pageerror', (error) => {
    console.log(`[pageerror][${label}] ${error.message}`);
  });

  page.on('console', (message) => {
    console.log(`[console][${label}] ${message.type()} ${message.text()}`);
  });

  page.on('request', (request) => {
    const url = request.url();
    if (isApi(url)) {
      console.log(`[api request][${label}] ${request.method()} ${url}`);
    }
  });

  page.on('response', (response) => {
    const url = response.url();
    if (isApi(url)) {
      console.log(`[api response][${label}] ${response.status()} ${url}`);
    }
  });

  page.on('requestfailed', (request) => {
    const url = request.url();
    const resourceType = request.resourceType();
    if (isApi(url)) {
      console.log(`[api failed][${label}] ${request.method()} ${url} :: ${request.failure()?.errorText}`);
      return;
    }

    const isAsset =
      resourceType === 'script' ||
      resourceType === 'stylesheet' ||
      url.includes('/assets/') ||
      url.includes('/@vite/');

    if (isAsset) {
      console.log(
        `[asset failed][${label}] ${resourceType} ${url} :: ${request.failure()?.errorText}`
      );
    }
  });

  await page.route('**/api/**', (route) => {
    const request = route.request();
    console.log(`[api route][${label}] ${request.method()} ${request.url()}`);
    return route.continue();
  });
};

const drawSignatureStroke = async (page: Page, canvas: Locator): Promise<void> => {
  const box = await canvas.boundingBox();
  if (!box) {
    throw new Error('Signature canvas was not visible for drawing.');
  }
  const startX = box.x + box.width * 0.2;
  const startY = box.y + box.height * 0.5;
  const midX = box.x + box.width * 0.6;
  const midY = box.y + box.height * 0.55;
  const endX = box.x + box.width * 0.85;
  const endY = box.y + box.height * 0.45;

  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(midX, midY);
  await page.mouse.move(endX, endY);
  await page.mouse.up();
};

const normalizeLoginUser = (
  user?: Record<string, unknown>
): Record<string, unknown> | null => {
  if (!user) return null;
  const normalized: Record<string, unknown> = { ...user };
  if (typeof normalized.id !== 'string' && typeof normalized._id === 'string') {
    normalized.id = normalized._id;
  }
  if (typeof normalized.role !== 'string' && typeof normalized.userRole === 'string') {
    normalized.role = normalized.userRole;
  }
  return normalized;
};

const parseLoginPayload = (data: LoginResponsePayload) => {
  const token = data.token ?? data.accessToken ?? data.authToken;
  const refreshToken = data.refreshToken ?? data.refresh_token;
  const user = normalizeLoginUser(data.user ?? data.data?.user);
  return { token, refreshToken, user };
};

const buildStorageState = async (
  request: APIRequestContext,
  credentials: SeededCredentials
): Promise<StorageState> => {
  const response = await request.post(`${backendBaseUrl}/auth/login`, {
    data: credentials,
  });

  if (!response.ok()) {
    throw new Error(`Auth login failed (${response.status()}) for ${credentials.email}.`);
  }

  const data = (await response.json()) as LoginResponsePayload;
  const { token, refreshToken, user } = parseLoginPayload(data);
  const userId = user && typeof user.id === 'string' ? user.id : null;
  const userRole = user && typeof user.role === 'string' ? user.role : null;

  console.log(
    `[e2e auth][login ${credentials.email}] ${JSON.stringify({
      success: Boolean(data.success),
      hasToken: Boolean(token),
      hasRefreshToken: Boolean(refreshToken),
      userId,
      userRole,
      userKeys: user ? Object.keys(user).sort().slice(0, 12) : [],
    })}`
  );

  if (!data.success || !token || !user || !userId || !userRole) {
    throw new Error(`Auth login missing token or user for ${credentials.email}.`);
  }

  const localStorage = [
    { name: 'lotus_auth_token', value: token },
    { name: 'lotus_user_state', value: JSON.stringify({ user }) },
    { name: 'lotus_language', value: 'en' },
    { name: 'lotus_first_visit', value: 'true' },
  ];

  if (refreshToken) {
    localStorage.push({ name: 'lotus_refresh_token', value: refreshToken });
  }

  return {
    cookies: [],
    origins: [
      {
        origin: appOrigin,
        localStorage,
      },
    ],
  };
};

const createAuthedPage = async (
  browser: Browser,
  request: APIRequestContext,
  credentials: SeededCredentials,
  label: string
) => {
  const storageState = await buildStorageState(request, credentials);
  const context = await browser.newContext({
    storageState,
    acceptDownloads: true,
  });

  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'onLine', { value: true, configurable: true });
  });

  const page = await context.newPage();
  await attachDiagnostics(page, label);

  return { context, page };
};

test.beforeAll(async ({ request }) => {
  try {
    const response = await request.get(`${backendBaseUrl}/health`);
    backendAvailable = response.ok();
  } catch {
    backendAvailable = false;
  }
});

test.describe('Seeded dashboard smoke', () => {
  test('parent dashboard uses seeded child data', async ({ browser, request }, testInfo) => {
    if (!backendAvailable) {
      test.skip(true, `Backend not reachable at ${backendBaseUrl}`);
    }

    const { context, page } = await createAuthedPage(browser, request, seededUsers.parent, testInfo.title);

    try {
      const analysisPromise = waitForAnalysis<ParentChildrenResponse>(page, '/api/sessions/analysis/children');
      await page.goto(buildAppUrl('/dashboard/parent'), { waitUntil: 'domcontentloaded' });

      await logAuthStorage(page, testInfo.title);
      const dashboard = page.locator('#parent-dashboard');
      await expect(dashboard).toBeVisible();

      if (shouldAssertDebug) {
        await assertGlobalBanner(page, testInfo.title);
        await logDebugAttributes(dashboard, testInfo.title);
        await expect(dashboard).toHaveAttribute('data-e2e-can-fetch', 'true');
        await expect(dashboard).toHaveAttribute('data-e2e-role', 'parent');
        await expect(dashboard).toHaveAttribute('data-e2e-online', 'true');
        await expect(dashboard).toHaveAttribute('data-e2e-auth', 'true');
      }

      const analysis = await analysisPromise;
      expect(analysis.success).toBeTruthy();
      expect(analysis.children.length).toBeGreaterThan(0);

      const displayName = pickDisplayName(analysis.children.map((child) => child.name));
      expect(displayName).not.toBeNull();
      await expect(page.getByText(displayName!)).toBeVisible({ timeout: 15000 });
    } finally {
      await context.close();
    }
  });

  test('signature modal stores data URL (parent)', async ({ browser, request }, testInfo) => {
    if (!backendAvailable) {
      test.skip(true, `Backend not reachable at ${backendBaseUrl}`);
    }

    const { context, page } = await createAuthedPage(browser, request, seededUsers.parent, testInfo.title);

    try {
      await page.goto(buildAppUrl('/dashboard/parent'), { waitUntil: 'domcontentloaded' });
      const dashboard = page.locator('#parent-dashboard');
      await expect(dashboard).toBeVisible();

      const addSignature = page.getByRole('button', { name: /add signature/i }).first();
      await expect(addSignature).toBeVisible();
      await addSignature.click();

      const modal = page.getByRole('dialog', { name: /signature/i });
      await expect(modal).toBeVisible();
      const canvas = modal.locator('canvas');
      await expect(canvas).toBeVisible();

      await drawSignatureStroke(page, canvas);

      const dataUrl = await canvas.evaluate(
        (node) => (node as HTMLCanvasElement).toDataURL('image/png')
      );
      expect(dataUrl.startsWith('data:image/png')).toBeTruthy();
      expect(dataUrl.length).toBeGreaterThan(200);

      await expect(modal.getByText(/signature saved/i)).toBeVisible();
      await modal.getByRole('button', { name: /close/i }).click();
      await expect(modal).toBeHidden();
    } finally {
      await context.close();
    }
  });

  test('clinician dashboard uses seeded patient data', async ({ browser, request }, testInfo) => {
    if (!backendAvailable) {
      test.skip(true, `Backend not reachable at ${backendBaseUrl}`);
    }

    const { context, page } = await createAuthedPage(browser, request, seededUsers.clinician, testInfo.title);

    try {
      const analysisPromise = waitForAnalysis<ClinicianPatientsResponse>(page, '/api/sessions/analysis/patients');
      await page.goto(buildAppUrl('/dashboard/clinician'), { waitUntil: 'domcontentloaded' });

      await logAuthStorage(page, testInfo.title);
      const dashboard = page.locator('#clinician-dashboard');
      await expect(dashboard).toBeVisible();

      if (shouldAssertDebug) {
        await assertGlobalBanner(page, testInfo.title);
        await logDebugAttributes(dashboard, testInfo.title);
        await expect(dashboard).toHaveAttribute('data-e2e-can-fetch', 'true');
        await expect(dashboard).toHaveAttribute('data-e2e-role', 'clinician');
        await expect(dashboard).toHaveAttribute('data-e2e-online', 'true');
        await expect(dashboard).toHaveAttribute('data-e2e-auth', 'true');
      }

      const analysis = await analysisPromise;
      expect(analysis.success).toBeTruthy();
      expect(analysis.patients.length).toBeGreaterThan(0);

      const displayName = pickDisplayName(analysis.patients.map((patient) => patient.name));
      expect(displayName).not.toBeNull();
      await expect(page.getByText(displayName!)).toBeVisible({ timeout: 15000 });
    } finally {
      await context.close();
    }
  });

  test('school dashboard uses seeded student data', async ({ browser, request }, testInfo) => {
    if (!backendAvailable) {
      test.skip(true, `Backend not reachable at ${backendBaseUrl}`);
    }

    const { context, page } = await createAuthedPage(browser, request, seededUsers.schoolAdmin, testInfo.title);

    try {
      const analysisPromise = waitForAnalysis<SchoolAnalysisResponse>(page, '/api/sessions/analysis/school');
      await page.goto(buildAppUrl('/dashboard/educator'), { waitUntil: 'domcontentloaded' });

      await logAuthStorage(page, testInfo.title);
      const dashboard = page.locator('#school-dashboard');
      await expect(dashboard).toBeVisible();

      if (shouldAssertDebug) {
        await assertGlobalBanner(page, testInfo.title);
        await logDebugAttributes(dashboard, testInfo.title);
        await expect(dashboard).toHaveAttribute('data-e2e-can-fetch', 'true');
        await expect(dashboard).toHaveAttribute('data-e2e-role', 'school_admin');
        await expect(dashboard).toHaveAttribute('data-e2e-online', 'true');
        await expect(dashboard).toHaveAttribute('data-e2e-auth', 'true');
      }

      const analysis = await analysisPromise;
      expect(analysis.success).toBeTruthy();
      expect(analysis.students.length).toBeGreaterThan(0);

      const displayName = pickDisplayName(analysis.students.map((student) => student.name));
      expect(displayName).not.toBeNull();
      await expect(page.getByText(displayName!)).toBeVisible({ timeout: 15000 });
    } finally {
      await context.close();
    }
  });

  test('resources download emits a download event', async ({ browser, request }, testInfo) => {
    if (!backendAvailable) {
      test.skip(true, `Backend not reachable at ${backendBaseUrl}`);
    }

    const { context, page } = await createAuthedPage(browser, request, seededUsers.patient, testInfo.title);

    try {
      await page.goto(buildAppUrl('/resources'), { waitUntil: 'domcontentloaded' });

      await logAuthStorage(page, testInfo.title);
      const openSampleButton = page.getByRole('button', { name: /open sample/i }).first();
      await expect(openSampleButton).toBeVisible();
      await openSampleButton.click();

      const modal = page.getByRole('dialog');
      await expect(modal).toBeVisible();

      const downloadPromise = page.waitForEvent('download');
      await modal.getByRole('link', { name: /download/i }).first().click();

      const download = await downloadPromise;
      expect(download.suggestedFilename()).toMatch(/\.png$/i);
    } finally {
      await context.close();
    }
  });
});
