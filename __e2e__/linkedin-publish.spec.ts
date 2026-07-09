import { test, expect } from '@playwright/test';
import { promises as fs } from 'fs';
import path from 'path';

test('allows a user to publish a LinkedIn draft from the page', async ({ page }) => {
	await page.goto('/publish');

	await expect(page.getByRole('heading', { name: /publish to linkedin/i })).toBeVisible();
	await expect(page.getByRole('link', { name: /back to dashboard/i })).toBeVisible();
	const textarea = page.getByLabel('LinkedIn Post');
	const publishButton = page.getByRole('button', { name: /publish to linkedin/i });

	expect(await publishButton.isDisabled()).toBeTruthy();

	await textarea.click();
	await textarea.pressSequentially('Hello from Content Creator OS', { delay: 20 });

	await expect(page.getByText(/character count:/i)).toBeVisible();
	await expect(publishButton).toBeEnabled();

	const popupPromise = page.waitForEvent('popup');
	await publishButton.click();
	const popup = await popupPromise;

	await expect(page.getByText(/waiting for human approval/i)).toBeVisible({
		timeout: 10000,
	});
	await expect.poll(() => popup.url()).toContain('linkedin.com');
	await expect
		.poll(() => {
			const url = popup.url();
			const redirectTarget = new URL(url).searchParams.get('session_redirect') ?? url;
			return redirectTarget;
		})
		.toContain('shareActive');
	await expect
		.poll(() => {
			const url = popup.url();
			const redirectTarget = new URL(url).searchParams.get('session_redirect') ?? url;
			return redirectTarget;
		})
		.toContain('text');
});

test('appends publish history to local storage file', async ({ page }) => {
	const dataFile = path.resolve(process.cwd(), 'src', 'data', 'publish-history.json');
	await fs.mkdir(path.dirname(dataFile), { recursive: true });
	await fs.writeFile(
		dataFile,
		JSON.stringify({
			history: [
				{ id: 'existing', status: 'initiated', date: '2024-01-01T00:00:00.000Z' },
			],
		}),
	);

	try {
		await page.goto('/publish');

		const textarea = page.getByLabel('LinkedIn Post');
		const publishButton = page.getByRole('button', { name: /publish to linkedin/i });

		await textarea.click();
		await textarea.fill('Hello from Content Creator OS');

		await expect(page.getByText(/character count:/i)).toBeVisible();
		await expect(publishButton).toBeEnabled();

		const popupPromise = page.waitForEvent('popup');
		await publishButton.click();
		await popupPromise;

		await expect(page.getByText(/waiting for human approval/i)).toBeVisible({
			timeout: 10000,
		});

		const persisted = JSON.parse(await fs.readFile(dataFile, 'utf-8'));
		expect(persisted.history).toHaveLength(2);
		expect(persisted.history[1]).toMatchObject({
			id: expect.any(String),
			platform: 'linkedin',
			status: 'initiated',
			preview: expect.stringContaining('Hello from Content Creator OS'),
		});
	} finally {
		await fs.unlink(dataFile).catch(() => undefined);
	}
});

test('allows a user to navigate back to the dashboard from the publish page', async ({
	page,
}) => {
	await page.goto('/publish');

	await page.getByRole('link', { name: /back to dashboard/i }).click();

	await expect(page).toHaveURL(/\/$/);
	await expect(page.getByRole('heading', { name: /content creator os/i })).toBeVisible();
});
