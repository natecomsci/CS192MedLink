import { test, expect } from '@playwright/test';

test('Verify warning appears when no service type is selected', async ({ page }) => {
    // Navigate to the target page
    await page.goto('/facility/1/dashboard/manageServices/addService');

    // Click the "Add" button without selecting anything
    await page.getByRole('button', { name: 'Add' }).click();

    // Check if the warning message appears
    const warning = page.locator('text=Please select an item in the list.');
    await expect(warning).toBeVisible(({ timeout: 30000 }));
});



test('Verify service details appear when selecting "Ambulance" and Cancel button works', async ({ page }) => {
    // Navigate to the target page
    await page.goto('/facility/1/dashboard/manageServices/addService');

    // Select "Ambulance" from the dropdown
    await page.getByRole('combobox', { name: 'Service Type to Offer:' }).selectOption({ label: 'Ambulance' });

    // Wait for elements to appear
    await expect(page.locator('h3', { hasText: 'Ambulance' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Service Phone Number' })).toBeVisible();
    await expect(page.locator('p', { hasText: 'Format: +63 912 345 6789' })).toBeVisible();

    // Verify the phone number input field exists and has the correct default value
    const phoneNumberInput = page.locator('input[name="phoneNumber"][type="tel"]');
    await expect(phoneNumberInput).toBeVisible();
    await expect(phoneNumberInput).toHaveValue('+63 9');

    // Verify other required elements appear
    await expect(page.locator('label:has-text("Operating Time")')).toBeVisible();
    await expect(page.locator('input[name="opening"][type="time"]')).toHaveValue('08:00');
    await expect(page.locator('input[name="closing"][type="time"]')).toHaveValue('16:00');

    await expect(page.locator('label:has-text("Base Price")')).toBeVisible();
    await expect(page.locator('input[name="price"][type="number"]')).toHaveAttribute('placeholder', '100');

    await expect(page.locator('label:has-text("Minimum coverage radius")')).toBeVisible();
    await expect(page.locator('input[name="minCoverageRadius"][type="number"]')).toHaveAttribute('placeholder', '1');

    await expect(page.locator('label:has-text("Mileage rate")')).toBeVisible();
    await expect(page.locator('input[name="mileageRate"][type="number"]')).toHaveAttribute('placeholder', '1.5');

    await expect(page.locator('label:has-text("Maximum coverage radius")')).toBeVisible();
    await expect(page.locator('input[name="maxCoverageRadius"][type="number"]')).toHaveAttribute('placeholder', '1');

    // Verify the "Availability" checkbox exists and is visible
    const availabilityCheckbox = page.locator('input[name="availability"][type="checkbox"]');
    await expect(availabilityCheckbox).toBeVisible();

    // Verify the "Add" button is visible
    await expect(page.getByRole('button', { name: 'Add' })).toBeVisible();

    // Verify the "Cancel" link is visible
    const cancelLink = page.getByRole('link', { name: 'Cancel' });
    await expect(cancelLink).toBeVisible();

    // Click on the "Cancel" link and verify redirection
    await cancelLink.click();
    await expect(page).toHaveURL('http://localhost:5173/facility/1/dashboard');
});
