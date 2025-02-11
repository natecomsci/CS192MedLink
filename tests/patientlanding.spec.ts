import { test, expect } from '@playwright/test';

test('Check if all elements are present on MedLink homepage', async ({ page }) => {
  // Navigate to the webpage
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

  // 
  await expect(page.locator('button:has(svg)')).toBeVisible();


})

/*
test('Check if filter button toggles filter options', async ({ page }) => {
  // Navigate to the webpage
  await page.goto('http://localhost:4173');

  // Locate the filter button (assuming it's the button with an SVG inside)
  const filterButton = page.locator('button:has(svg)');

  // Ensure the filter button is visible before interacting
  await expect(filterButton).toBeVisible();

  // Click the filter button
  await filterButton.click();

  await expect(page.getByText('Type', { exact: true })).toBeVisible();
  await expect(page.getByText('Ownership', { exact: true })).toBeVisible();
  await expect(page.getByText('Distance Range', { exact: true })).toBeVisible();
  await expect(page.getByText('Insurance Coverage', { exact: true })).toBeVisible();
  await expect(page.getByText('Show Only Covered Facilities', { exact: true })).toBeVisible();
  await expect(page.getByText('View Filtered Results', { exact: true })).toBeVisible();

  // (Optional) Click again to hide the filters
  await filterButton.click();

  // Ensure the options are hidden
  await expect(page.getByText('Type', { exact: true })).not.toBeVisible();
  await expect(page.getByText('Ownership', { exact: true })).not.toBeVisible();
});
*/
