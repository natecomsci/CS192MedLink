import { test, expect } from '@playwright/test';

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
    await expect(page.getByText('Hide', { exact: true })).toBeVisible();
  });

  test('Check if "Sign In" button is present', async ({ page }) => {
    await expect(page.getByText('Sign In', { exact: true })).toBeVisible();
  });

});



/*
test('Check password hide functionality', async ({ page }) => {

  await page.goto('http://localhost:5173/facility');
  // Locate the password field
  const passwordField = page.getByPlaceholder('Password');
  await expect(passwordField).toBeVisible();

  // Type a password (e.g., "12345")
  await passwordField.fill('12345');

  //  Ensure password is initially visible (type is 'text')
  await expect(passwordField).toHaveAttribute('type', 'text');

  // Click the Hide button
  await page.getByText('Hide', { exact: true }).click({force: true});

  //  Ensure password is  hidden
  await expect(passwordField).toHaveAttribute('type', 'password');

  // Click the Hide button again (toggle back)
  await page.getByText('Show', { exact: true }).click({force: true});

  //  Ensure password is visible again
  await expect(passwordField).toHaveAttribute('type', 'text');
});
*/
