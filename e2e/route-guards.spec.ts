import { test, expect, type Page } from '@playwright/test';

const seedAuth = async (page: Page, role: string) => {
  await page.addInitScript((userRole) => {
    localStorage.setItem('lotus_first_visit', 'true');
    localStorage.setItem('lotus_auth_token', 'test-token');
    localStorage.setItem('lotus_user_state', JSON.stringify({
      user: {
        id: 'test-user',
        name: 'Test User',
        role: userRole,
        createdAt: Date.now(),
        lastLogin: Date.now(),
      },
    }));
    localStorage.setItem('lotus_language', 'en');
  }, role);
};

const allowedRoutes = [
  { role: 'parent', path: '/dashboard/parent', heading: /Parent Dashboard/i },
  { role: 'clinician', path: '/dashboard/clinician', heading: /Clinician Dashboard/i },
  { role: 'school_admin', path: '/dashboard/educator', heading: /School Analytics Dashboard/i },
];

test.describe('Route guards', () => {
  test('redirects unauthenticated users to login', async ({ page }) => {
    await page.goto('/dashboard/clinician');
    await expect(page).toHaveURL(/\/login\?next=%2Fdashboard%2Fclinician/);
  });

  test('blocks users without the required role', async ({ page }) => {
    await seedAuth(page, 'parent');
    await page.goto('/dashboard/clinician');

    const restricted = page.getByText(/Access restricted/i);
    await expect(restricted).toBeVisible();
  });

  for (const route of allowedRoutes) {
    test(`allows ${route.role} to access ${route.path}`, async ({ page }) => {
      await seedAuth(page, route.role);
      await page.goto(route.path);
      await expect(page.getByText(route.heading)).toBeVisible();
    });
  }
});
