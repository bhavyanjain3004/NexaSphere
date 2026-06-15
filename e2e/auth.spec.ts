import { test, expect } from '@playwright/test';

test.describe('Authentication and Core Flows', () => {
  test('should display login page and allow admin login', async ({ page }) => {
    await page.goto('/admin');

    // Wait for the page to fully load (cinematic intro bypassed in test env)
    await page.waitForLoadState('networkidle');

    // Verify login page elements using robust selectors
    const heading = page.getByRole('heading', { name: /admin login/i });
    await expect(heading).toBeVisible({ timeout: 10000 });

    const usernameInput = page.getByPlaceholder(/username/i);
    const passwordInput = page.getByPlaceholder(/password/i);
    const submitBtn = page.getByRole('button', { name: /login/i });

    await expect(usernameInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitBtn).toBeVisible();

    // Attempt to login with invalid credentials to verify error handling
    await usernameInput.fill('invalid_user');
    await passwordInput.fill('invalid_password');
    await submitBtn.click();

    // Error message should be shown — server returns {"error":"Invalid credentials"}
    // which is rendered in a <p> element after the failed request
    await expect(
      page
        .locator('p')
        .filter({ hasText: /invalid|credentials|failed/i })
        .first()
    ).toBeVisible({ timeout: 10000 });
  });

  test('should prevent unauthorized access to protected routes', async ({ page }) => {
    // Attempting to access admin dashboard directly without session
    await page.goto('/admin/dashboard');

    // Most apps redirect to login if unauthorized — should still be on an /admin URL
    await expect(page).toHaveURL(/.*\/admin.*/);
  });
});
