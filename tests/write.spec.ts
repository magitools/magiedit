import { test, expect } from '@playwright/test';

test('on load, should show source container', async ({ page }) => {
	await page.goto('/write/new', { waitUntil: 'domcontentloaded' });
	const container = await page.getByTestId('source');
	expect(await container).toBeVisible();
});
