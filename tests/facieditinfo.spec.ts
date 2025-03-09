import { test, expect } from '@playwright/test';

test.describe('Facility Update Information Test', () => {
    test.beforeEach(async ({ page }) => {
        // 1. Navigate to /facility and log in
        await page.goto('/facility');
        await page.fill('input[name="fid"]', '20250002');
        await page.fill('input[name="password"]', 'password');
        await page.click('button:has-text("Log In")');

        // 2. Verify redirection to facility dashboard
        await expect(page).toHaveURL('/facility/dashboard');

        // 3. Click the "GenInfo" button
        await page.click('a[href="./dashboard/updateFacilityInfo"]');

        // 4. Verify redirection to the update info page
        await expect(page).toHaveURL('/facility/dashboard/updateFacilityInfo');

        // 5. Fill up all required fields before testing validation
        await page.fill('input[name="facilityName"]', 'Valid Facility Name');
        await page.fill('input[name="bookingSystem"]', 'https://example.com');

        // Select dropdown values
        await page.selectOption('select[name="region"]', { label: 'NATIONAL CAPITAL REGION (NCR)' });
        await page.waitForSelector('select[name="province"]:not([disabled])');
        await page.selectOption('select[name="province"]', { label: 'NCR, SECOND DISTRICT' });

        // Wait for city and brgy fields to be enabled before selecting
        await page.waitForSelector('select[name="city"]:not([disabled])');
        await page.selectOption('select[name="city"]', { label: 'QUEZON CITY' });

        await page.waitForSelector('select[name="brgy"]:not([disabled])');
        await page.selectOption('select[name="brgy"]', { label: 'U.P. Campus' });

        await page.fill('input[name="street"]', 'up diliman');

        
    });

    test('Invalid email should show error', async ({ page }) => {
        // Fill valid phone number
        await page.fill('input[name="phoneNumber"]', '+63912 345 6789');

        // Test invalid email format
        await page.fill('input[name="email"]', 'www');
        await page.click('button[type="submit"]');

        // Check for error message
        await expect(page.locator('p.error.s-25fNU1rMC7m9')).toBeVisible();
    });

    test('Invalid phone number should show error', async ({ page }) => {
        // Fill valid email
        await page.fill('input[name="email"]', 'valid@example.com');

        // Test invalid phone number
        await page.fill('input[name="phoneNumber"]', '1234'); // Invalid format
        await page.click('button[type="submit"]');

        // Check for error message
        await expect(page.locator('p.error.s-BsXuYGk0Xggs')).toBeVisible();
    });
});
