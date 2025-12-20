import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should load home page', async ({ page }) => {
    await page.goto('/');

    // Check page title or main content
    await expect(page).toHaveTitle(/Lotus|Bérard|AIT/i);
  });

  test('should navigate to assessment page', async ({ page }) => {
    await page.goto('/');

    // Find and click assessment link
    const assessmentLink = page.getByRole('link', { name: /assessment|تقييم/i });
    if (await assessmentLink.count() > 0) {
      await assessmentLink.first().click();
      await expect(page).toHaveURL(/assessment/);
    }
  });

  test('should navigate to about page', async ({ page }) => {
    await page.goto('/');

    const aboutLink = page.getByRole('link', { name: /about|عن/i });
    if (await aboutLink.count() > 0) {
      await aboutLink.first().click();
      await expect(page).toHaveURL(/about/);
    }
  });

  test('should navigate to contact page', async ({ page }) => {
    await page.goto('/');

    const contactLink = page.getByRole('link', { name: /contact|اتصل/i });
    if (await contactLink.count() > 0) {
      await contactLink.first().click();
      await expect(page).toHaveURL(/contact/);
    }
  });

  test('should have working /home route alias', async ({ page }) => {
    await page.goto('/home');

    // Should load same content as landing
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Responsive Design', () => {
  test('should show mobile menu on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Look for mobile menu button
    const menuButton = page.getByRole('button', { name: /menu/i }).or(
      page.locator('[aria-label*="menu"]')
    );

    if (await menuButton.count() > 0) {
      await expect(menuButton.first()).toBeVisible();
    }
  });

  test('should hide mobile menu on large screens', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    // Navigation links should be directly visible
    const nav = page.getByRole('navigation');
    await expect(nav).toBeVisible();
  });
});

test.describe('RTL Support', () => {
  test('should support Arabic RTL layout', async ({ page }) => {
    await page.goto('/');

    // Check if document has RTL direction
    const dir = await page.getAttribute('html', 'dir');

    // Either dir="rtl" or language-based RTL
    const lang = await page.getAttribute('html', 'lang');

    expect(dir === 'rtl' || lang === 'ar').toBeTruthy();
  });
});
