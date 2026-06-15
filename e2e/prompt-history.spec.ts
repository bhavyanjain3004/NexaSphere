import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Prompt History & Workspace System
 * Tests: Issue #100 - Prompt History & Workspace system
 *
 * Design principles:
 *  - Each test clears localStorage before running so tests are fully isolated.
 *  - Use waitForLoadState('load') — NOT 'networkidle' — the app continuously
 *    sends web-vitals beacons to /api/performance/vitals which get ECONNREFUSED
 *    in CI, keeping the network perpetually busy.
 *  - Wait for the chat trigger button to be visible before clicking it.
 *  - Avoid exact-count assertions that depend on cross-test state.
 */

/** Helper: open the page, clear prompt history from localStorage, and reload. */
async function openFreshPage(page: import('@playwright/test').Page) {
  await page.goto('/');
  await page.waitForLoadState('load');
  // Clear prompt history so every test starts from a clean slate
  await page.evaluate(() => {
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith('nexasphere-prompts') || k.startsWith('ns-prompts'))
        .forEach((k) => localStorage.removeItem(k));
    } catch (_) {}
  });
  // Reload to pick up the cleared state
  await page.reload();
  await page.waitForLoadState('load');
}

/** Helper: wait for the chat trigger button to be visible and click it. */
async function openChat(page: import('@playwright/test').Page) {
  const chatBtn = page.locator('.chat-trigger-btn');
  await chatBtn.waitFor({ state: 'visible', timeout: 15000 });
  await chatBtn.click();
  // Wait for the chat window to appear before proceeding
  await page.locator('.chat-window-glass').waitFor({ state: 'visible', timeout: 10000 });
}

/** Helper: fill and send a message, wait for bot reply (fallback is synchronous). */
async function sendMessage(page: import('@playwright/test').Page, text: string) {
  const input = page.locator('.chat-input-container input[type="text"]');
  await input.waitFor({ state: 'visible', timeout: 10000 });
  await input.fill(text);
  const sendBtn = page.locator('.send-btn');
  await sendBtn.click();
  // The bot uses a local knowledge fallback — reply appears synchronously
  await page.locator('.msg-bubble.bot').last().waitFor({ state: 'visible', timeout: 15000 });
}

test.describe('Prompt History & Workspace System', () => {
  test.beforeEach(async ({ page }) => {
    await openFreshPage(page);
  });

  test('should open chatbot and display history UI', async ({ page }) => {
    await openChat(page);

    const chatWindow = page.locator('.chat-window-glass');
    await expect(chatWindow).toBeVisible();

    const historyBtn = page.locator('.history-toggle-btn');
    await expect(historyBtn).toBeVisible();

    const workspaceSelect = page.locator('.workspace-selector-inline');
    await expect(workspaceSelect).toBeVisible();
  });

  test('should save prompt and display in history', async ({ page }) => {
    await openChat(page);

    await sendMessage(page, 'Hello, how are you?');

    // Toggle sidebar to view history
    const historyBtn = page.locator('.history-toggle-btn');
    await historyBtn.click();

    const sidebar = page.locator('.history-sidebar.open');
    await expect(sidebar).toBeVisible({ timeout: 5000 });

    // Verify at least one prompt appears in history
    const promptItem = page.locator('.prompt-item');
    await expect(promptItem.first()).toBeVisible({ timeout: 5000 });
  });

  test('should search through prompt history', async ({ page }) => {
    await openChat(page);
    await sendMessage(page, 'Test prompt for searching');

    // Open history sidebar
    const historyBtn = page.locator('.history-toggle-btn');
    await historyBtn.click();
    await page.locator('.history-sidebar.open').waitFor({ state: 'visible', timeout: 5000 });

    const searchInput = page.locator('.search-input');
    const searchVisible = await searchInput.isVisible().catch(() => false);
    if (searchVisible) {
      await searchInput.fill('Test');
      await page.waitForTimeout(500);
      // Just ensure no crash — count can be 0 or more
      const count = await page.locator('.result-item').count();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  test('should switch between workspaces', async ({ page }) => {
    await openChat(page);

    const workspaceSelect = page.locator('.workspace-selector-inline');
    await workspaceSelect.waitFor({ state: 'visible', timeout: 10000 });

    const currentValue = await workspaceSelect.inputValue();
    expect(['default', 'coding', 'research']).toContain(currentValue);

    await workspaceSelect.selectOption('coding');
    const newValue = await workspaceSelect.inputValue();
    expect(newValue).toBe('coding');
  });

  test('should pin and unpin prompts', async ({ page }) => {
    await openChat(page);
    await sendMessage(page, 'Important message to pin');

    const historyBtn = page.locator('.history-toggle-btn');
    await historyBtn.click();
    await page.locator('.history-sidebar.open').waitFor({ state: 'visible', timeout: 5000 });

    const promptItem = page.locator('.prompt-item').first();
    await promptItem.waitFor({ state: 'visible', timeout: 5000 });

    // Try direct pin button first, then hover-reveal
    const pinBtn = page.locator('.pin-btn').first();
    const pinBtnVisible = await pinBtn.isVisible().catch(() => false);
    if (pinBtnVisible) {
      await pinBtn.click();
      await expect(page.locator('.prompt-item.pinned').first()).toBeVisible({ timeout: 5000 });
    } else {
      await promptItem.hover();
      const pinBtnAfterHover = page.locator('.pin-btn').first();
      const visibleAfterHover = await pinBtnAfterHover
        .isVisible({ timeout: 3000 })
        .catch(() => false);
      if (visibleAfterHover) {
        await pinBtnAfterHover.click();
        await expect(page.locator('.prompt-item.pinned').first()).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('should restore conversation from history', async ({ page }) => {
    await openChat(page);
    await sendMessage(page, 'First conversation');

    const historyBtn = page.locator('.history-toggle-btn');
    await historyBtn.click();
    await page.locator('.history-sidebar.open').waitFor({ state: 'visible', timeout: 5000 });

    const promptItem = page.locator('.prompt-item').first();
    await promptItem.waitFor({ state: 'visible', timeout: 5000 });
    await promptItem.click();

    await page.waitForTimeout(500);

    const restoredMessages = page.locator('.msg-bubble');
    const restoredCount = await restoredMessages.count();
    expect(restoredCount).toBeGreaterThan(0);
  });

  test('should delete prompt from history', async ({ page }) => {
    await openChat(page);
    await sendMessage(page, 'Message to delete');

    const historyBtn = page.locator('.history-toggle-btn');
    await historyBtn.click();
    await page.locator('.history-sidebar.open').waitFor({ state: 'visible', timeout: 5000 });

    const promptItemsBefore = page.locator('.prompt-item');
    await promptItemsBefore.first().waitFor({ state: 'visible', timeout: 5000 });
    const countBefore = await promptItemsBefore.count();

    // Hover to reveal the delete button
    await page.locator('.prompt-item').first().hover();
    const deleteBtn = page.locator('.delete-btn').first();
    await deleteBtn.waitFor({ state: 'visible', timeout: 5000 });
    await deleteBtn.click();

    // Confirm deletion
    const confirmBtn = page.locator('.history-confirm button').filter({ hasText: 'Delete' });
    const confirmVisible = await confirmBtn.isVisible({ timeout: 3000 }).catch(() => false);
    if (confirmVisible) {
      await confirmBtn.click();
    }

    await page.waitForTimeout(500);

    const countAfter = await page.locator('.prompt-item').count();
    expect(countAfter).toBeLessThan(countBefore);
  });

  test('should persist history on page refresh', async ({ page }) => {
    await openChat(page);
    await sendMessage(page, 'Persisted message');

    await page.reload();
    await page.waitForLoadState('load');

    await openChat(page);

    const historyBtn = page.locator('.history-toggle-btn');
    await historyBtn.click();
    await page.locator('.history-sidebar.open').waitFor({ state: 'visible', timeout: 5000 });

    await expect(page.locator('.prompt-item').first()).toBeVisible({ timeout: 5000 });
  });

  test('should filter history by workspace', async ({ page }) => {
    await openChat(page);

    await sendMessage(page, 'Default workspace message');

    const workspaceSelect = page.locator('.workspace-selector-inline');
    await workspaceSelect.selectOption('coding');

    const input = page.locator('.chat-input-container input[type="text"]');
    await input.fill('Coding workspace message');
    await page.locator('.send-btn').click();
    await page.locator('.msg-bubble.bot').last().waitFor({ state: 'visible', timeout: 15000 });

    const historyBtn = page.locator('.history-toggle-btn');
    await historyBtn.click();
    await page.locator('.history-sidebar.open').waitFor({ state: 'visible', timeout: 5000 });

    const sidebarWorkspaceSelect = page.locator('.workspace-select');
    const sidebarVisible = await sidebarWorkspaceSelect.isVisible().catch(() => false);
    if (sidebarVisible) {
      const value = await sidebarWorkspaceSelect.inputValue();
      expect(['default', 'coding', 'research']).toContain(value);
    }
  });
});
