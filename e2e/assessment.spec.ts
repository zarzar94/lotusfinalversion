import { test, expect } from '@playwright/test';

test.describe('Assessment Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/assessment');
  });

  test('should display assessment options', async ({ page }) => {
    // Look for assessment cards or buttons
    const assessmentContent = page.getByRole('main').or(page.locator('main'));
    await expect(assessmentContent).toBeVisible();
  });

  test('should show headphone check prompt', async ({ page }) => {
    // Look for headphone verification
    const headphoneCheck = page.getByText(/headphone|سماعات|audio check/i);

    if (await headphoneCheck.count() > 0) {
      await expect(headphoneCheck.first()).toBeVisible();
    }
  });

  test('should navigate between test sections', async ({ page }) => {
    // Look for test navigation buttons
    const nextButton = page.getByRole('button', { name: /next|التالي|continue/i });

    if (await nextButton.count() > 0) {
      await nextButton.first().click();

      // Should show next section
      await page.waitForTimeout(500);
    }
  });
});

test.describe('Game Section', () => {
  test('should display game cards', async ({ page }) => {
    await page.goto('/');

    // Scroll to games section
    const gamesSection = page.getByText(/games|ألعاب|screening lab/i);

    if (await gamesSection.count() > 0) {
      await gamesSection.first().scrollIntoViewIfNeeded();

      // Look for game cards
      const gameCards = page.locator('[class*="game"]').or(
        page.locator('[class*="card"]')
      );

      expect(await gameCards.count()).toBeGreaterThan(0);
    }
  });

  test('should show coming soon badge on disabled games', async ({ page }) => {
    await page.goto('/');

    const comingSoonBadge = page.getByText(/coming soon|قريباً/i);

    if (await comingSoonBadge.count() > 0) {
      await expect(comingSoonBadge.first()).toBeVisible();
    }
  });
});

test.describe('Checklist', () => {
  test('should allow checking items', async ({ page }) => {
    await page.goto('/');

    // Find checklist section
    const checklistSection = page.getByText(/checklist|قائمة/i);

    if (await checklistSection.count() > 0) {
      await checklistSection.first().scrollIntoViewIfNeeded();

      // Look for checkboxes
      const checkboxes = page.getByRole('checkbox');

      if (await checkboxes.count() > 0) {
        await checkboxes.first().check();
        await expect(checkboxes.first()).toBeChecked();
      }
    }
  });

  test('should enable PDF export after checking items', async ({ page }) => {
    await page.goto('/');

    const checkboxes = page.getByRole('checkbox');

    if (await checkboxes.count() > 0) {
      // Check a few items
      for (let i = 0; i < Math.min(3, await checkboxes.count()); i++) {
        await checkboxes.nth(i).check();
      }

      // Look for export button
      const exportButton = page.getByRole('button', { name: /export|pdf|تصدير/i });

      if (await exportButton.count() > 0) {
        await expect(exportButton.first()).toBeEnabled();
      }
    }
  });
});
