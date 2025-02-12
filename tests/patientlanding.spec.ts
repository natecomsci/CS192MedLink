import { test, expect } from '@playwright/test';


test.describe('MedLink Homepage UI Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Check if the MedLink title is present', async ({ page }) => {
    await expect(page.locator('text=MedLink')).toBeVisible();
  });

  test('Check if the search input is present and can be typed into', async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Search"]');
    await expect(searchInput).toBeVisible();

    //  Ensure text can be entered into the search field
    await searchInput.fill('ABCDE');
    await expect(searchInput).toHaveValue('ABCDE');
  });

  test('Check if the Facility button is present', async ({ page }) => {
    await expect(page.locator('button:has-text("Facility")')).toBeVisible();
  });

  test('Check if the Service button is present', async ({ page }) => {
    await expect(page.locator('button:has-text("Service")')).toBeVisible();
  });

  test('Check if the Sign In button is present', async ({ page }) => {
    await expect(page.locator('button:has-text("Sign In")')).toBeVisible();
  });

  test('Check if the Sign Up button is present', async ({ page }) => {
    await expect(page.locator('button:has-text("Sign Up")')).toBeVisible();
  });

  test('Check if the filter button is present', async ({ page }) => {
    await expect(page.locator('button:has(svg)')).toBeVisible(({ timeout: 30000 }));
  });

});


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
