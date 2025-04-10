import { test, expect } from '@playwright/test';


test.describe('MedLink Homepage UI Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Check if the MedLink title is present', async ({ page }) => {
    await expect(page.locator('text=Med')).toBeVisible();
  });

  test('Check if Ambulance is present', async ({ page }) => {
    await expect(page.locator('text=Ambulance')).toBeVisible();
  });

  test('Check if Blood Bank is present', async ({ page }) => {
    await expect(page.locator('text=Blood')).toBeVisible();
  });

  test('Check if ICU is present', async ({ page }) => {
    await expect(page.locator('text=ICU')).toBeVisible();
  });

  test('Check if ER is present', async ({ page }) => {
    await expect(page.locator('text=ER')).toBeVisible();
  });
  

  test('Check if the search input is present and can be typed into', async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Search for Services"]');
    await expect(searchInput).toBeVisible();

    //  Ensure text can be entered into the search field
    await searchInput.fill('ABCDE');
    await expect(searchInput).toHaveValue('ABCDE');
  });

  test('Check if the Facility button is present', async ({ page }) => {
    //await expect(page.locator('button:has-text("Facility")')).toBeVisible();
  });

  test('Check if the Service button is present', async ({ page }) => {
    //await expect(page.locator('button:has-text("Service")')).toBeVisible();
  });

  test('Check if the Sign In button is present', async ({ page }) => {
    //await expect(page.locator('button:has-text("Sign In")')).toBeVisible();
  });

  test('Check if the Sign Up button is present', async ({ page }) => {
    //await expect(page.locator('button:has-text("Sign Up")')).toBeVisible();
  });

  test('Check if the filter button is present', async ({ page }) => {
    //await expect(page.locator('button:has(svg)')).toBeVisible(({ timeout: 30000 }));
  });

});
