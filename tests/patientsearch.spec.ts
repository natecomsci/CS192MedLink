import { test, expect } from '@playwright/test';



test.describe('From service search', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173/facilityInfo/5/serviceInfo/Ambulance/ambulance-5---prev=search');
    });

   

    test('Check if text "Address" is present', async ({ page }) => {
        await expect(page.locator('text=Location')).toBeVisible();
    });

    test('Check if text "Phone" is present', async ({ page }) => {
        await expect(page.locator('text=Phone')).toBeVisible();
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
        await page.goto('http://localhost:5173/facilityInfo/5');
    });
    test('Check if "Services Offered" button is present', async ({ page }) => {
        await expect(
            page.locator('button', { hasText: 'Services' })
        ).toBeVisible();
    });

   

    test('Check if text "Accepted Providers" is present', async ({ page }) => {
        await expect(page.locator('text=Accepted Providers')).toBeVisible();
    });

    test('Check if text "Booking System Link" is present', async ({ page }) => {
        await expect(page.locator('text=Booking System Link')).toBeVisible();
    });

    test('Check if text "Phone', async ({ page }) => {
        await expect(page.locator('text=Phone')).toBeVisible();
    });

    test('Check if text "Contact Information" is present', async ({ page }) => {
        await expect(page.locator('text=Contact Information')).toBeVisible();
    });


    
});

