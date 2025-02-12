import { test, expect } from '@playwright/test';

test('Check UI elements and password toggle', async ({ page }) => {
  // Navigate to the webpage
  await page.goto('/facility');

  // ✅ Check if "MedLink" text is present
  await expect(page.getByText('MedLink', { exact: true })).toBeVisible();

  // ✅ Check if "Sign In" text is present
  await expect(page.getByText('SIGN IN', { exact: true })).toBeVisible();

  const idField = page.getByPlaceholder('ID');
  await expect(idField).toBeVisible();

  const passwordField = page.getByPlaceholder('Password');
  await expect(passwordField).toBeVisible();


  // ✅ Check if "Hide" button is present
  const hideButton = page.getByText('Hide', { exact: true });
  await expect(hideButton).toBeVisible();

  // ✅ Check if "Sign In" button is present
  const signInButton = page.getByText('Sign In', { exact: true });
  await expect(signInButton).toBeVisible();
});


test('Check password hide functionality', async ({ page }) => {

  await page.goto('http://localhost:5173/facility');
  // Locate the password field
  const passwordField = page.getByPlaceholder('Password');
  await expect(passwordField).toBeVisible();

  // Type a password (e.g., "12345")
  await passwordField.fill('12345');

  // ✅ Ensure password is initially visible (assuming default type is 'text')
  await expect(passwordField).toHaveAttribute('type', 'text');

  // Click the Hide button
  await page.getByText('Hide', { exact: true }).click();

  // ✅ Ensure password is now hidden
  await expect(passwordField).toHaveAttribute('type', 'password');

  // Click the Hide button again (toggle back)
  await page.getByText('Show', { exact: true }).click();

  // ✅ Ensure password is visible again
  await expect(passwordField).toHaveAttribute('type', 'text');
});

