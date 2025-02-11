import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('Check if all elements are present on MedLink homepage', async ({ page }) => {
  // Get the absolute path of +page.svelte
  //const filePath = `file://${path.resolve(__dirname, '../src/routes/patient/+page.svelte')}`;

  // Navigate to the local file
  //await page.goto(filePath);

  await page.goto('http://localhost:5173');

  // Check if the MedLink title is present
  await expect(page.locator('text=MedLink')).toBeVisible();

  // Check if the search input is present
  await expect(page.locator('input[placeholder="Search"]')).toBeVisible();

  // Check if the Facility button is present
  await expect(page.locator('button:has-text("Facility")')).toBeVisible();

  // Check if the Service button is present
  await expect(page.locator('button:has-text("Service")')).toBeVisible();

  // Check if the Sign In button is present
  await expect(page.locator('button:has-text("Sign In")')).toBeVisible();

  // Check if the Sign Up button is present
  await expect(page.locator('button:has-text("Sign Up")')).toBeVisible();

  // Check if any button contains an SVG (e.g., icons) -> filter
  await expect(page.locator('button:has(svg)')).toBeVisible();
});
