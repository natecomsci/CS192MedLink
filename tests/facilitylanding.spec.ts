import { test, expect } from '@playwright/test';

/*
test.describe('Facility Page UI Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/facility');
  });

  test('Check if "MedLink" text is present', async ({ page }) => {
    await expect(page.getByText('MedLink', { exact: true })).toBeVisible();
  });

  test('Check if "Sign In" text is present', async ({ page }) => {
    await expect(page.getByText('SIGN IN', { exact: true })).toBeVisible();
  });

  test('Check if ID field is present and can be typed into', async ({ page }) => {
    const idField = page.getByPlaceholder('ID');
    await expect(idField).toBeVisible();

    //  Ensure text can be entered
    await idField.fill('ABCDE');
    await expect(idField).toHaveValue('ABCDE');
  });

  test('Check if Password field is present and can be typed into', async ({ page }) => {
    const passwordField = page.getByPlaceholder('Password');
    await expect(passwordField).toBeVisible();

    // Ensure password can be entered
    await passwordField.fill('12345');
    await expect(passwordField).toHaveValue('12345');
  });

  test('Check if "Hide" button is present', async ({ page }) => {
    await expect(page.getByText('Show', { exact: true })).toBeVisible();
  });

  test('Check if "Sign In" button is present', async ({ page }) => {
    await expect(page.getByText('Log in', { exact: true })).toBeVisible();
  });

});
*/

/*
test('Invalid Faci ID', async ({ page }) => {
  await page.goto('/facility');
  await page.fill('input[name="fid"]', 'wrongID');
  await page.fill('input[name="password"]', 'wrongpassword');
  await page.click('button:has-text("Log in")');
  await expect(page.locator('p')).toHaveText('Facility ID not found');
});

test('Wrong Password', async ({ page }) => {
  await page.goto('/facility');
  await page.fill('input[name="fid"]', 'testing');
  await page.fill('input[name="password"]', 'wrongpassword');
  await page.click('button:has-text("Log in")');
  await expect(page.locator('p')).toHaveText('Incorrect ID-password pair');
});
*/
