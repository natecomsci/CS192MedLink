import { test, expect } from '@playwright/test';

test('Manage Services - Edit ER Service Validation', async ({ page }) => {
  // Navigate to the facility login page
  await page.goto('http://localhost:5174/facility');

  // Fill in login credentials
  await page.fill('input[name="fid"]', 'testing');
  await page.fill('input[name="password"]', 'password');
  await page.keyboard.press('Enter');

  // Wait for redirection and verify the new URL
  await page.waitForURL('http://localhost:5174/facility/dashboard');

  // Click on "Manage Services"
  await page.click('a[href="./dashboard/manageServices"]');

  // Click on "edit" for the specific ER Service
  await page.click('a[href="./manageServices/editERService/160e111b-7bd5-4b58-89f4-cfad112478da"]');

  // Validate nonUrgentPatients field
  const nonUrgentPatients = page.locator('input[name="nonUrgentPatients"]');
  await nonUrgentPatients.fill('-10');
  await page.click('button.mt-auto.bg-purple-600.text-white.p-3.rounded-lg.hover\\:bg-purple-700');
  await expect(nonUrgentPatients).toHaveJSProperty('validationMessage', 'Value must be greater than or equal to 0.');
  await nonUrgentPatients.fill('');
  await page.click('button.mt-auto.bg-purple-600.text-white.p-3.rounded-lg.hover\\:bg-purple-700');
  await expect(nonUrgentPatients).toHaveJSProperty('validationMessage', 'Please fill out this field.');

  // Validate availableBeds field
  const availableBeds = page.locator('input[name="availableBeds"]');
  await availableBeds.fill('-10');
  await page.click('button.mt-auto.bg-purple-600.text-white.p-3.rounded-lg.hover\\:bg-purple-700');
  await expect(availableBeds).toHaveJSProperty('validationMessage', 'Value must be greater than or equal to 0.');
  await availableBeds.fill('');
  await page.click('button.mt-auto.bg-purple-600.text-white.p-3.rounded-lg.hover\\:bg-purple-700');
  await expect(availableBeds).toHaveJSProperty('validationMessage', 'Please fill out this field.');

  // Validate nonUrgentQueueLength field
  const nonUrgentQueueLength = page.locator('input[name="nonUrgentQueueLength"]');
  await nonUrgentQueueLength.fill('-10');
  await page.click('button.mt-auto.bg-purple-600.text-white.p-3.rounded-lg.hover\\:bg-purple-700');
  await expect(nonUrgentQueueLength).toHaveJSProperty('validationMessage', 'Value must be greater than or equal to 0.');
  await nonUrgentQueueLength.fill('');
  await page.click('button.mt-auto.bg-purple-600.text-white.p-3.rounded-lg.hover\\:bg-purple-700');
  await expect(nonUrgentQueueLength).toHaveJSProperty('validationMessage', 'Please fill out this field.');

  // Validate urgentPatients field
  const urgentPatients = page.locator('input[name="urgentPatients"]');
  await urgentPatients.fill('-10');
  await page.click('button.mt-auto.bg-purple-600.text-white.p-3.rounded-lg.hover\\:bg-purple-700');
  await expect(urgentPatients).toHaveJSProperty('validationMessage', 'Value must be greater than or equal to 0.');
  await urgentPatients.fill('');
  await page.click('button.mt-auto.bg-purple-600.text-white.p-3.rounded-lg.hover\\:bg-purple-700');
  await expect(urgentPatients).toHaveJSProperty('validationMessage', 'Please fill out this field.');

  // Validate urgentQueueLength field
  const urgentQueueLength = page.locator('input[name="urgentQueueLength"]');
  await urgentQueueLength.fill('-10');
  await page.click('button.mt-auto.bg-purple-600.text-white.p-3.rounded-lg.hover\\:bg-purple-700');
  await expect(urgentQueueLength).toHaveJSProperty('validationMessage', 'Value must be greater than or equal to 0.');
  await urgentQueueLength.fill('');
  await page.click('button.mt-auto.bg-purple-600.text-white.p-3.rounded-lg.hover\\:bg-purple-700');
  await expect(urgentQueueLength).toHaveJSProperty('validationMessage', 'Please fill out this field.');

  // Validate criticalPatients field
  const criticalPatients = page.locator('input[name="criticalPatients"]');
  await criticalPatients.fill('-10');
  await page.click('button.mt-auto.bg-purple-600.text-white.p-3.rounded-lg.hover\\:bg-purple-700');
  await expect(criticalPatients).toHaveJSProperty('validationMessage', 'Value must be greater than or equal to 0.');
  await criticalPatients.fill('');
  await page.click('button.mt-auto.bg-purple-600.text-white.p-3.rounded-lg.hover\\:bg-purple-700');
  await expect(criticalPatients).toHaveJSProperty('validationMessage', 'Please fill out this field.');

  // Validate criticalQueueLength field
  const criticalQueueLength = page.locator('input[name="criticalQueueLength"]');
  await criticalQueueLength.fill('-10');
  await page.click('button.mt-auto.bg-purple-600.text-white.p-3.rounded-lg.hover\\:bg-purple-700');
  await expect(criticalQueueLength).toHaveJSProperty('validationMessage', 'Value must be greater than or equal to 0.');
  await criticalQueueLength.fill('');
  await page.click('button.mt-auto.bg-purple-600.text-white.p-3.rounded-lg.hover\\:bg-purple-700');
  await expect(criticalQueueLength).toHaveJSProperty('validationMessage', 'Please fill out this field.');
});


test('Manage Services - Edit ER Service Successful', async ({ page }) => {
  // Navigate to the facility login page
  await page.goto('http://localhost:5174/facility');

  // Fill in login credentials
  await page.fill('input[name="fid"]', 'testing');
  await page.fill('input[name="password"]', 'password');
  await page.keyboard.press('Enter');

  // Wait for redirection and verify the new URL
  await page.waitForURL('http://localhost:5174/facility/dashboard');

  // Click on "Manage Services"
  await page.click('a[href="./dashboard/manageServices"]');

  // Click on "edit" for the specific ER Service
  await page.click('a[href="./manageServices/editERService/160e111b-7bd5-4b58-89f4-cfad112478da"]');

  // fill  nonUrgentPatients field
  const nonUrgentPatients = page.locator('input[name="nonUrgentPatients"]');
  await nonUrgentPatients.fill('10');
  
  // Validate availableBeds field
  const availableBeds = page.locator('input[name="availableBeds"]');
  await availableBeds.fill('10');

  // Validate nonUrgentQueueLength field
  const nonUrgentQueueLength = page.locator('input[name="nonUrgentQueueLength"]');
  await nonUrgentQueueLength.fill('10');
  

  // Validate urgentPatients field
  const urgentPatients = page.locator('input[name="urgentPatients"]');
  await urgentPatients.fill('10');


  // Validate urgentQueueLength field
  const urgentQueueLength = page.locator('input[name="urgentQueueLength"]');
  await urgentQueueLength.fill('10');


  // Validate criticalPatients field
  const criticalPatients = page.locator('input[name="criticalPatients"]');
  await criticalPatients.fill('10');
  

  // Validate criticalQueueLength field
  const criticalQueueLength = page.locator('input[name="criticalQueueLength"]');
  await criticalQueueLength.fill('10');
  await page.click('button.mt-auto.bg-purple-600.text-white.p-3.rounded-lg.hover\\:bg-purple-700');

  // click on edit again
  await page.click('a[href="./manageServices/editERService/160e111b-7bd5-4b58-89f4-cfad112478da"]');
  // no changes
  await page.click('button.mt-auto.bg-purple-600.text-white.p-3.rounded-lg.hover\\:bg-purple-700');
  await expect(page.locator('p.error')).toHaveText('No changes made');



});