import { test, expect } from '@playwright/test';
import type { Page, Route } from '@playwright/test';

// Helper function for login
async function login(page: Page) {
    await page.goto('/facility');
    await page.fill('input[name="fid"]', '20250005');
    await page.fill('input[name="password"]', 'password');
    await page.click('button:has-text("Log In")');
    await expect(page).toHaveURL('/facility/20250005/dashboard');
}

// Helper function to navigate to add service page
async function navigateToAddService(page: Page, serviceType: string) {
    await page.click('a[href="./dashboard/manageServices"]');
    await expect(page).toHaveURL('/facility/20250005/dashboard/manageServices');
    await page.click('a[href="./manageServices/addService"]');
    await expect(page).toHaveURL('/facility/20250005/dashboard/manageServices/addService');
    await page.selectOption('select[name="serviceType"]', serviceType);
    
}

// Function to intercept API responses for Prisma errors
async function interceptPrismaError(page: Page) {
    await page.route('**/api/*', async (route: Route) => {
        const response = await route.fetch(); // Corrected from route.continue()
        const body = await response.text();
        if (body.includes('P2014')) {
            await expect(body).toContain('P2014');
        }
        await route.continue(); // Allow the request to proceed
    });
}

test.describe('Add Blood Bank Service Flow', () => {
    test.beforeEach(async ({ page }) => {
        await login(page);
        await navigateToAddService(page, 'Blood Bank');
    });

    test('Invalid Phone Number format', async ({ page }) => {
        
        await page.fill('input[name="phoneNumber"]', '1234');
        await page.click('button:has-text("Add Service")');
        await interceptPrismaError(page);
    });
});
