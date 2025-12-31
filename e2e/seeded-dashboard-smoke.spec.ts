import { test, expect, type APIRequestContext, type Browser, type Locator, type Page, type StorageState } from '@playwright/test';
import { translations } from '../src/i18n/translations';

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
const english = translations.en;
const arabic = translations.ar;
const seedSessionHistory = [
  {
    moduleId: 'attention',
    score100: 72,
    band: 'high',
    timestamp: new Date(Date.now() - 6 * 86400000).toISOString(),
    metrics: { score100: 72, accuracyPct: 72 },
  },
  {
    moduleId: 'attention',
    score100: 58,
    band: 'mid',
    timestamp: new Date(Date.now() - 3 * 86400000).toISOString(),
    metrics: { score100: 58, accuracyPct: 58 },
  },
  {
    moduleId: 'attention',
    score100: 41,
    band: 'mid',
    timestamp: new Date(Date.now() - 1 * 86400000).toISOString(),
    metrics: { score100: 41, accuracyPct: 41 },
  },
];

const seededUsers = {
  parent: { email: 'parent@lotusait.com', password: 'Parent123!' },
  clinician: { email: 'clinician@lotusait.com', password: 'Clinic123!' },
  schoolAdmin: { email: 'school@lotusait.com', password: 'School123!' },
  patient: { email: 'patient@lotusait.com', password: 'Patient123!' },
};

let backendAvailable = false;
const storageStateCache = new Map<string, StorageState>();

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

const waitForVisible = async (locator: Locator, timeout = 20000): Promise<void> => {
  await expect(locator).toBeVisible({ timeout });
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
  if (await banner.count() === 0) {
    console.log(`[e2e banner][${label}] missing`);
    return;
  }
  await waitForVisible(banner);
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

  await canvas.dispatchEvent('pointerdown', {
    clientX: startX,
    clientY: startY,
    pointerId: 1,
    pointerType: 'mouse',
    buttons: 1,
    isPrimary: true,
  });
  await canvas.dispatchEvent('pointermove', {
    clientX: midX,
    clientY: midY,
    pointerId: 1,
    pointerType: 'mouse',
    buttons: 1,
    isPrimary: true,
  });
  await canvas.dispatchEvent('pointermove', {
    clientX: endX,
    clientY: endY,
    pointerId: 1,
    pointerType: 'mouse',
    buttons: 1,
    isPrimary: true,
  });
  await canvas.dispatchEvent('pointerup', {
    clientX: endX,
    clientY: endY,
    pointerId: 1,
    pointerType: 'mouse',
    buttons: 0,
    isPrimary: true,
  });
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
  credentials: SeededCredentials,
  options?: { language?: string; seedSessions?: boolean }
): Promise<StorageState> => {
  const language = options?.language ?? 'en';
  const cacheKey = `${credentials.email}:${language}:${options?.seedSessions ? 'seed' : 'noseed'}`;
  const cached = storageStateCache.get(cacheKey);
  if (cached) return cached;

  let response = await request.post(`${backendBaseUrl}/auth/login`, {
    data: credentials,
  });

  if (!response.ok() && response.status() === 429) {
    const retryAfter = Number(response.headers()['retry-after']);
    const waitMs = Number.isFinite(retryAfter) ? retryAfter * 1000 : 2000;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
    response = await request.post(`${backendBaseUrl}/auth/login`, {
      data: credentials,
    });
  }

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
    { name: 'lotus_language', value: language },
    { name: 'lotus_first_visit', value: 'true' },
  ];

  if (refreshToken) {
    localStorage.push({ name: 'lotus_refresh_token', value: refreshToken });
  }

  if (options?.seedSessions && userId) {
    localStorage.push({
      name: `SBLAB_SESSION_HISTORY:${userId}`,
      value: JSON.stringify(seedSessionHistory),
    });
  }

  const state = {
    cookies: [],
    origins: [
      {
        origin: appOrigin,
        localStorage,
      },
    ],
  };
  storageStateCache.set(cacheKey, state);
  return state;
};

const createAuthedPage = async (
  browser: Browser,
  request: APIRequestContext,
  credentials: SeededCredentials,
  label: string,
  options?: { language?: string }
) => {
  const storageState = await buildStorageState(request, credentials, options);
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
  test.describe.configure({ mode: 'serial' });

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
      await waitForVisible(dashboard);

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
      await waitForVisible(dashboard);

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
      const closeButton = modal.getByRole('button', { name: /close/i });
      await closeButton.waitFor({ state: 'attached', timeout: 10000 });
      await closeButton.evaluate((node) => (node as HTMLButtonElement).click());
      await expect(modal).toBeHidden({ timeout: 10000 });
    } finally {
      await context.close();
    }
  });

  test('band tooltip renders in English', async ({ browser, request }, testInfo) => {
    if (!backendAvailable) {
      test.skip(true, `Backend not reachable at ${backendBaseUrl}`);
    }

    const { context, page } = await createAuthedPage(browser, request, seededUsers.parent, testInfo.title, {
      seedSessions: true,
    });

    try {
      await page.goto(buildAppUrl('/dashboard/parent'), { waitUntil: 'domcontentloaded' });
      const dashboard = page.locator('#parent-dashboard');
      await waitForVisible(dashboard);

      const bandHelpButton = page.getByRole('button', { name: english.dashboard.bandHelpAria });
      await waitForVisible(bandHelpButton);
      const ariaLabel = await bandHelpButton.getAttribute('aria-label');
      console.log(`[e2e band][en] aria-label=${ariaLabel ?? 'missing'}`);
      await bandHelpButton.click();

      const tooltip = page.locator('[data-e2e-band-tooltip]');
      await waitForVisible(tooltip);
      await expect(tooltip).toContainText(english.dashboard.bandExplanation.split('\n')[0]);
    } finally {
      await context.close();
    }
  });

  test('band tooltip renders in Arabic', async ({ browser, request }, testInfo) => {
    if (!backendAvailable) {
      test.skip(true, `Backend not reachable at ${backendBaseUrl}`);
    }

    const { context, page } = await createAuthedPage(browser, request, seededUsers.parent, testInfo.title, {
      language: 'ar',
      seedSessions: true,
    });

    try {
      await page.goto(buildAppUrl('/dashboard/parent'), { waitUntil: 'domcontentloaded' });
      const dashboard = page.locator('#parent-dashboard');
      await waitForVisible(dashboard);

      const bandHelpButton = page.getByRole('button', { name: arabic.dashboard.bandHelpAria });
      await waitForVisible(bandHelpButton);
      const ariaLabel = await bandHelpButton.getAttribute('aria-label');
      console.log(`[e2e band][ar] aria-label=${ariaLabel ?? 'missing'}`);
      await bandHelpButton.click();

      const tooltip = page.locator('[data-e2e-band-tooltip]');
      await waitForVisible(tooltip);
      await expect(tooltip).toContainText(arabic.dashboard.bandExplanation.split('\n')[0]);
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
      await waitForVisible(dashboard);

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

  test('signature modal stores data URL (clinician)', async ({ browser, request }, testInfo) => {
    if (!backendAvailable) {
      test.skip(true, `Backend not reachable at ${backendBaseUrl}`);
    }

    const { context, page } = await createAuthedPage(browser, request, seededUsers.clinician, testInfo.title);

    try {
      await page.goto(buildAppUrl('/dashboard/clinician'), { waitUntil: 'domcontentloaded' });
      const dashboard = page.locator('#clinician-dashboard');
      await waitForVisible(dashboard);

      const addSignature = dashboard.getByRole('button', { name: /add signature/i });
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
      const closeButton = modal.getByRole('button', { name: /close/i });
      await closeButton.waitFor({ state: 'attached', timeout: 10000 });
      await closeButton.evaluate((node) => (node as HTMLButtonElement).click());
      await expect(modal).toBeHidden({ timeout: 10000 });
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
      await waitForVisible(dashboard);

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

  test('progress export signature modal stores data URL', async ({ browser, request }, testInfo) => {
    if (!backendAvailable) {
      test.skip(true, `Backend not reachable at ${backendBaseUrl}`);
    }

    const { context, page } = await createAuthedPage(browser, request, seededUsers.parent, testInfo.title);

    try {
      await page.goto(buildAppUrl('/dashboard/parent'), { waitUntil: 'domcontentloaded' });
      const dashboard = page.locator('#parent-dashboard');
      await waitForVisible(dashboard);

      const hiddenExport = page.locator('div[style*="pointer-events: none"]', {
        has: page.getByRole('button', { name: /export report/i }),
      });
      await expect(hiddenExport).toHaveCount(1);

      const addSignature = hiddenExport.getByRole('button', { name: /add signature/i });
      await addSignature.waitFor({ state: 'attached', timeout: 20000 });
      await addSignature.evaluate((node) => (node as HTMLButtonElement).click());

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
      const closeButton = modal.getByRole('button', { name: /close/i });
      await closeButton.waitFor({ state: 'attached', timeout: 10000 });
      await closeButton.evaluate((node) => (node as HTMLButtonElement).click());
      await expect(modal).toBeHidden({ timeout: 10000 });
    } finally {
      await context.close();
    }
  });

  test('assessment suite summary signature capture stores data URL', async ({ browser, request }, testInfo) => {
    if (!backendAvailable) {
      test.skip(true, `Backend not reachable at ${backendBaseUrl}`);
    }

    const { context, page } = await createAuthedPage(browser, request, seededUsers.parent, testInfo.title);

    try {
      await page.goto(buildAppUrl('/assessment'), { waitUntil: 'domcontentloaded' });

      const startSuite = page.getByRole('button', { name: english.games.startFullSuite });
      await waitForVisible(startSuite);
      await startSuite.click();

      const suiteHeader = page.getByText(english.games.suite.headerSubtitle);
      await waitForVisible(suiteHeader);
      const suiteModal = page.locator('[role="presentation"]', {
        has: suiteHeader,
      });

      const startSession = suiteModal.getByRole('button', { name: english.games.suite.startSession });
      await waitForVisible(startSession);
      await startSession.click();

      const skipButton = suiteModal.getByRole('button', { name: /skip/i });
      await waitForVisible(skipButton);
      await skipButton.click();

      const deviceCheckButton = suiteModal.getByRole('button', { name: 'Device check' });
      await waitForVisible(deviceCheckButton);

      const actionRow = deviceCheckButton.locator('..');
      const cancelButton = actionRow.getByRole('button').last();
      await cancelButton.click();

      await expect(suiteModal.getByText(english.games.suite.summaryTitle)).toBeVisible();

      const addSignature = suiteModal.getByRole('button', { name: /add signature/i });
      await expect(addSignature).toBeVisible();
      await addSignature.click();

      const canvas = suiteModal.locator('canvas');
      await expect(canvas).toBeVisible();
      await drawSignatureStroke(page, canvas);

      const dataUrl = await canvas.evaluate(
        (node) => (node as HTMLCanvasElement).toDataURL('image/png')
      );
      expect(dataUrl.startsWith('data:image/png')).toBeTruthy();
      expect(dataUrl.length).toBeGreaterThan(200);

      await expect(suiteModal.getByText(/signature saved/i).first()).toBeVisible();
    } finally {
      await context.close();
    }
  });

  test('school demo pack signature modal stores data URL', async ({ browser, request }, testInfo) => {
    if (!backendAvailable) {
      test.skip(true, `Backend not reachable at ${backendBaseUrl}`);
    }

    const { context, page } = await createAuthedPage(browser, request, seededUsers.parent, testInfo.title);

    try {
      await page.goto(buildAppUrl('/partners'), { waitUntil: 'domcontentloaded' });

      const demoTitle = page.getByText(english.schools.demoPack.title);
      await waitForVisible(demoTitle);

      const schoolsSection = page.locator('#schools');
      await waitForVisible(schoolsSection);

      const addSignature = schoolsSection.getByRole('button', { name: /add signature/i });
      await addSignature.scrollIntoViewIfNeeded();
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
