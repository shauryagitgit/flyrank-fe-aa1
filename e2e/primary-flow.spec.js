import { test, expect } from '@playwright/test';

test('primary flow: submit a valid ranking prompt and receive a response', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Testing pass.' })).toBeVisible();
  const prompt = page.getByRole('textbox', { name: 'Ask the assistant' });
  await prompt.fill('rank these pages');
  await page.getByRole('button', { name: 'Send' }).click();
  await expect(page.getByText('Working…')).toBeVisible();
  await expect(page.getByText('I received: “rank these pages”')).toBeVisible({ timeout: 5000 });
  await expect(page.getByRole('region', { name: 'rank_pages tool result' }).last()).toContainText('3 pages scored');
});
