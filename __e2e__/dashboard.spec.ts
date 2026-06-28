import { test, expect } from '@playwright/test';

test('shows the dashboard landing page and primary action', async ({ page }) => {
	await page.goto('/');

	await expect(page.getByRole('heading', { name: /content creator os/i })).toBeVisible();
	await expect(page.getByText(/version/i)).toBeVisible();
	await expect(page.getByText(/v0\.1\.0-alpha/i)).toBeVisible();
	await expect(
		page.getByText(/good (morning|afternoon|evening|night), prad/i),
	).toBeVisible();
	await expect(page.getByRole('link', { name: /\+ new linkedin post/i })).toBeVisible();
	await expect(page.getByText(/total published/i)).toBeVisible();
	await expect(page.getByText('3')).toBeVisible();
});
