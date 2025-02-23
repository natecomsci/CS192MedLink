import { test, expect } from '@playwright/test';

test('Verify warning appears when no service type is selected', async ({ page }) => {
    // Navigate to the target page
    await page.goto('/facility/1/dashboard/manageServices/addService');

    // Verify the "Add" button is visible
    await expect(page.getByRole('button', { name: 'Add' })).toBeVisible();
    
    // Verify the "Cancel" link is visible
    const cancelLink = page.getByRole('link', { name: 'Cancel' });
    await expect(cancelLink).toBeVisible();

    // Click on the "Cancel" link and verify redirection
    await cancelLink.click();
    await expect(page).toHaveURL('http://localhost:5173/facility/1/dashboard');
});



test('Ambulance', async ({ page }) => {
    // Navigate to the target page
    await page.goto('/facility/1/dashboard/manageServices/addService');

    // Select "Ambulance" from the dropdown
    await page.getByRole('combobox', { name: 'Service Type to Offer:' }).selectOption({ label: 'Ambulance' });
});

test('Blood Bank', async ({ page }) => {
    // Navigate to the target page
    await page.goto('/facility/1/dashboard/manageServices/addService');

    // Select "Ambulance" from the dropdown
    await page.getByRole('combobox', { name: 'Service Type to Offer:' }).selectOption({ label: 'Blood Bank' });
});

test('Emergency Room', async ({ page }) => {
    // Navigate to the target page
    await page.goto('/facility/1/dashboard/manageServices/addService');

    // Select "Ambulance" from the dropdown
    await page.getByRole('combobox', { name: 'Service Type to Offer:' }).selectOption({ label: 'Emergency Room' });
});

test('ICU', async ({ page }) => {
    // Navigate to the target page
    await page.goto('/facility/1/dashboard/manageServices/addService');

    // Select "Ambulance" from the dropdown
    await page.getByRole('combobox', { name: 'Service Type to Offer:' }).selectOption({ label: 'ICU' });
});

test('Outpatient', async ({ page }) => {
    // Navigate to the target page
    await page.goto('/facility/1/dashboard/manageServices/addService');

    // Select "Ambulance" from the dropdown
    await page.getByRole('combobox', { name: 'Service Type to Offer:' }).selectOption({ label: 'Outpatient' });
});

