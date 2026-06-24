import { test, expect } from '@playwright/test';

test.describe('NotiFetch Smoke Tests', () => {
  test('homepage loads and shows brand name', async ({ page }) => {
    await page.goto('/');
    // Use first() to avoid strict mode violation if brand name appears multiple times
    await expect(page.locator('text=NotiFetch').first()).toBeVisible();
    await expect(page.locator('text=Doing is Doing — DID').first()).toBeVisible();
  });

  test('navbar theme toggle works', async ({ page }) => {
    await page.goto('/');

    // Wait for the intro animation to finish or hide it if it's intercepting clicks
    // The error showed a fixed inset-0 flex items-center justify-center bg-gradient-to-br from-amber-500 via-orange-500 to-orange-600
    // which is likely the PageLoadAnimation component.
    const intro = page.locator('div.fixed.inset-0.z-\\[100\\]');
    if (await intro.isVisible()) {
        await expect(intro).toBeHidden({ timeout: 10000 });
    }

    const themeToggle = page.locator('button[aria-label="Toggle theme"]');
    await expect(themeToggle).toBeVisible();

    // Get initial theme
    const html = page.locator('html');
    const isDarkInitial = await html.evaluate(el => el.classList.contains('dark'));

    // Click with force: true to bypass interception if needed, or wait for visibility
    await themeToggle.click({ force: true });

    const isDarkAfter = await html.evaluate(el => el.classList.contains('dark'));
    expect(isDarkInitial).not.toBe(isDarkAfter);
  });

  test('signin page handles empty email validation', async ({ page }) => {
    await page.goto('/auth/signin');
    await page.click('button:has-text("Send login code")');
    await expect(page.locator('text=Email is required')).toBeVisible();
  });

  test('signin page rejects 400-char email', async ({ page }) => {
    await page.goto('/auth/signin');
    const longEmail = 'a'.repeat(390) + '@example.com';
    await page.fill('input[type="email"]', longEmail);
    await page.click('button:has-text("Send login code")');
    await expect(page.locator('text=Email is too long')).toBeVisible();
  });

  test('api/notifications POST without auth returns 401', async ({ request }) => {
    const response = await request.post('/api/notifications', {
      data: {
        title: 'Test',
        body: 'Test Body',
        source: 'test'
      }
    });
    expect(response.status()).toBe(401);
  });
});
