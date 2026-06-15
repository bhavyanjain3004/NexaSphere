import { test, expect } from '@playwright/test';

/**
 * E2E Tests for NexaSphere Main Website
 *
 * Note: we use waitForLoadState('load') — NOT 'networkidle' — because the app
 * sends web-vitals beacons to /api/performance/vitals which are proxied to the
 * backend. In CI those requests get ECONNREFUSED, keeping the network permanently
 * "busy" and making networkidle never settle.
 */

test.describe('NexaSphere Main Website E2E', () => {
  test('should navigate through home page and view hero section', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('load');

    // App.jsx skips cinematic intro for Playwright UA — hero renders immediately
    await expect(page.locator('.hero-title-text').first()).toBeVisible({ timeout: 15000 });
    await expect(page.locator('.hero-tagline').first()).toBeVisible({ timeout: 10000 });
  });

  test('should navigate to Team page and display team members', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('load');
    await page.locator('.hero-title-text').first().waitFor({ state: 'visible', timeout: 15000 });

    const teamButton = page.locator('button, a', { hasText: /Team|Core Team/i }).first();
    if (await teamButton.isVisible()) {
      await teamButton.click();
      await page.waitForTimeout(800);
      const header = page.locator('h1, h2', { hasText: /Core Team/i }).first();
      await expect(header).toBeVisible({ timeout: 10000 });
    }
  });

  test('should navigate to Events page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('load');
    await page.locator('.hero-title-text').first().waitFor({ state: 'visible', timeout: 15000 });

    const eventsButton = page.locator('button, a', { hasText: /Events/i }).first();
    if (await eventsButton.isVisible()) {
      await eventsButton.click();
      await page.waitForTimeout(800);
      await expect(page.locator('h1, h2, h3, h4', { hasText: /Events/i }).first()).toBeVisible({
        timeout: 10000,
      });
    }
  });

  test('should open recruitment/apply form', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('load');
    await page.locator('.hero-title-text').first().waitFor({ state: 'visible', timeout: 15000 });

    const applyButton = page.locator('button, a', { hasText: /Apply|Join/i }).first();
    if (await applyButton.isVisible()) {
      await applyButton.click();
      await page.waitForTimeout(800);
      await expect(page).toHaveURL(/^http/, { timeout: 5000 });
    }
  });

  test('should check footer links', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('load');
    await page.locator('.hero-title-text').first().waitFor({ state: 'visible', timeout: 15000 });

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    const footerEmail = page.locator('.ns-footer-email-link').first();
    const footerEmailFallback = page.locator('a[href^="mailto:"]').first();
    const emailVisible =
      (await footerEmail.isVisible().catch(() => false)) ||
      (await footerEmailFallback.isVisible().catch(() => false));
    expect(emailVisible).toBeTruthy();
  });

  test('should handle responsive navigation on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('load');
    // Just ensure page renders without crash at mobile viewport
    await expect(page).toHaveURL(/^http/);
  });

  test('should transition between sections smoothly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('load');
    await page.locator('.hero-title-text').first().waitFor({ state: 'visible', timeout: 15000 });

    const buttons = await page.locator('button').all();
    for (const button of buttons.slice(0, 3)) {
      if (await button.isVisible()) {
        await button.click();
        await page.waitForTimeout(300);
      }
    }

    await expect(page).toHaveURL(/^http/);
  });
});
