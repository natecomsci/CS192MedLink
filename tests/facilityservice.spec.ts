
/*
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
    await page.selectOption('select[name="serviceType"]', 'Ambulance');


    await expect(page.getByText('Hours of Operation')).toBeVisible();
    await expect(page.getByText('Minimum coverage radius')).toBeVisible();
    await expect(page.getByText('Base Price')).toBeVisible();
    await expect(page.getByText('Mileage Rate')).toBeVisible();

    // Selectors for each input field
    const phoneInput = page.locator('input[placeholder="Phone No."]');
    const openingTime = page.locator('input[name="opening"]');
    const closingTime = page.locator('input[name="closing"]');
    const basePrice = page.locator('input[name="price"]');
    const minCoverageRadius = page.locator('input[name="minCoverageRadius"]');
    const maxCoverageRadius = page.locator('input[name="maxCoverageRadius"]');
    const mileageRate = page.locator('input[placeholder="Mileage Rate"]');

    // Assertions to check if elements are visible
    await expect(phoneInput).toBeVisible();
    await expect(openingTime).toBeVisible();
    await expect(closingTime).toBeVisible();
    await expect(basePrice).toBeVisible();
    await expect(minCoverageRadius).toBeVisible();
    await expect(maxCoverageRadius).toBeVisible();
    await expect(mileageRate).toBeVisible();
});

test('Blood Bank', async ({ page }) => {
    // Navigate to the target page
    await page.goto('/facility/1/dashboard/manageServices/addService');

    // Select "Ambulance" from the dropdown
    await page.selectOption('select[name="serviceType"]', 'Blood Bank');

    const phoneNumber = page.locator('input[name="phoneNumber"]');
    const openingTime = page.locator('input[name="opening"]');
    const closingTime = page.locator('input[name="closing"]');
    const basePrice = page.locator('input[name="price"]');
    const turnaroundDays = page.locator('input[name="turnaroundDays"]');
    const turnaroundHours = page.locator('input[name="turnaroundHours"]');

    // Assertions to check if elements are visible
    await expect(phoneNumber).toBeVisible();
    await expect(openingTime).toBeVisible();
    await expect(closingTime).toBeVisible();
    await expect(basePrice).toBeVisible();
    await expect(turnaroundDays).toBeVisible();
    await expect(turnaroundHours).toBeVisible();
});

test('Emergency Room', async ({ page }) => {
    // Navigate to the target page
    await page.goto('/facility/1/dashboard/manageServices/addService');

    // Select "Ambulance" from the dropdown
    await page.selectOption('select[name="serviceType"]', 'Emergency Room');

    const phoneNumber = page.locator('input[name="phoneNumber"]');
    await expect(phoneNumber).toBeVisible();

    
});

test('ICU', async ({ page }) => {
    // Navigate to the target page
    await page.goto('/facility/1/dashboard/manageServices/addService');

    // Select "Ambulance" from the dropdown
    await page.selectOption('select[name="serviceType"]', 'ICU');

    const phoneNumber = page.locator('input[name="phoneNumber"]');
    await expect(phoneNumber).toBeVisible();

    const basePrice = page.locator('input[name="price"]');
    await expect(basePrice).toBeVisible();
});

test('Outpatient', async ({ page }) => {
    // Navigate to the target page
    await page.goto('/facility/1/dashboard/manageServices/addService');

    // Select "Ambulance" from the dropdown
    await page.selectOption('select[name="serviceType"]', 'Outpatient');
    
     // Selectors for each input field
     const serviceTypeDropdown = page.locator('select[name="OPserviceType"]');
     const phoneNumber = page.locator('input[name="phoneNumber"]');
     const openingTime = page.locator('input[name="opening"]');
     const closingTime = page.locator('input[name="closing"]');
     const completionDays = page.locator('input[name="completionDays"]');
     const completionHours = page.locator('input[name="completionHours"]');
     const acceptWalkins = page.locator('input[name="acceptWalkins"]');
 
     // Assertions to check if elements are visible
     await expect(serviceTypeDropdown).toBeVisible();
     await expect(phoneNumber).toBeVisible();
     await expect(openingTime).toBeVisible();
     await expect(closingTime).toBeVisible();
     await expect(completionDays).toBeVisible();
     await expect(completionHours).toBeVisible();
     await expect(acceptWalkins).toBeVisible();
});

*/