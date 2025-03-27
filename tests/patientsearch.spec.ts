import { test, expect } from '@playwright/test';



test.describe('From service search', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173/serviceInfo/Ambulance/ambulance-5');
    });

    test('Check if text "Facility Name" is present', async ({ page }) => {
        await expect(page.locator('text=Facility Name')).toBeVisible();
    });

    test('Check if text "Address" is present', async ({ page }) => {
        await expect(page.locator('text=Address')).toBeVisible();
    });

    test('Check if text "Phone" is present', async ({ page }) => {
        await expect(page.locator('text=Phone')).toBeVisible();
    });

    test('Check if text "Opening Time" is present', async ({ page }) => {
        await expect(page.locator('text=Opening Time')).toBeVisible();
    });

    test('Check if text "Closing Time" is present', async ({ page }) => {
        await expect(page.locator('text=Closing Time')).toBeVisible();
    });

    test('Check if text "Base Rate" is present', async ({ page }) => {
        await expect(page.getByText('Base Rate')).toBeVisible();
    });

    test('Check if text "Minimum Coverage Radius" is present', async ({ page }) => {
        await expect(page.locator('text=Minimum Coverage Radius')).toBeVisible();
    });

    test('Check if text "Mileage Rate" is present', async ({ page }) => {
        await expect(page.locator('text=Mileage Rate')).toBeVisible();
    });

    test('Check if text "Maximum Coverage Radius" is present', async ({ page }) => {
        await expect(page.locator('text=Maximum Coverage Radius:')).toBeVisible();
    });

    test('Check if text "Availability" is present', async ({ page }) => {
        await expect(page.locator('text=Availability')).toBeVisible();
    });

    
});



test.describe('From Facility Search', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173/results/5');
    });
    test('Check if "Services Offered" button is present', async ({ page }) => {
        await expect(
            page.locator('button', { hasText: 'Services Offered' })
        ).toBeVisible();
    });

    test('Check if "Divisions" button is present', async ({ page }) => {
        await expect(
            page.locator('button', { hasText: 'Divisions' })
        ).toBeVisible();
    });

    test('Check if text "Contact Information" is present', async ({ page }) => {
        await expect(page.locator('text=Contact Information')).toBeVisible();
    });

    test('Check if text "Email" is present', async ({ page }) => {
        await expect(page.locator('text=Email')).toBeVisible();
    });

    test('Check if text "Phone', async ({ page }) => {
        await expect(page.locator('text=Phone')).toBeVisible();
    });

    test('Check if text "Address" is present', async ({ page }) => {
        await expect(page.locator('text=Address')).toBeVisible();
    });


    
});

