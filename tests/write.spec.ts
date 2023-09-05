import { test, expect } from '@playwright/test';

test.describe('Write Page', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/write/new');
		await page.waitForLoadState('networkidle');
		await page.waitForTimeout(2000);
	});

	/* 	test('should show source container on load', async ({ page }) => {
			await page.locator('[data-testid="source"]').waitFor({ state: 'visible' })
			expect(page.locator('[data-testid="source"]')).toBeVisible();
		});
	
		test('should not show preview container on load', async ({ page }) => {
			await page.locator('[data-testid="preview"]').waitFor({ state: 'visible' })
			expect(page.locator('[data-testid="preview"]')).not.toBeVisible();
		});
	
		test('should show preview container when preview button is clicked', async ({ page }) => {
			await page.click('[data-testid="preview-button"]');
			await page.waitForSelector('[data-testid="preview"]');
			const previewContainer = await page.locator('[data-testid="preview"]');
			expect(previewContainer).toBeVisible();
		});
	 */
	test('should show preview of markdown in preview container when preview button is clicked', async ({
		page
	}) => {
		const markdown = '# This is a heading';
		const matchRgx = new RegExp('<h1 .*>This is a heading</h1>');
		await page.fill('[data-testid="source"]', markdown);
		await page.click('[data-testid="preview-button"]');
		const previewContent = await page.$eval('[data-testid="preview"]', (el) => el.innerHTML);
		expect(previewContent).toMatch(matchRgx);
	});
});
