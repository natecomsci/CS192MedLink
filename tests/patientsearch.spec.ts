import { test, expect } from '@playwright/test';



test.describe('Results Page Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173/results/20250001');
    });

    test('Check if text "Contact Information" is present', async ({ page }) => {
        await expect(page.locator('text=Contact Information')).toBeVisible();
    });

    test('Check if text "Email" is present', async ({ page }) => {
        await expect(page.locator('text=Email')).toBeVisible();
    });

    test('Check if text "Phone" is present', async ({ page }) => {
        await expect(page.locator('text=Phone')).toBeVisible();
    });

    test('Check if text "Location" is present', async ({ page }) => {
        await expect(page.locator('text=Location')).toBeVisible();
    });

    test('Check if text "Street" is present', async ({ page }) => {
        await expect(page.locator('text=Street')).toBeVisible();
    });

    test('Check if text "Barangay" is present', async ({ page }) => {
        await expect(page.getByText('Barangay:', { exact: true })).toBeVisible();
    });

    test('Check if text "City/Municipality" is present', async ({ page }) => {
        await expect(page.locator('text=City/Municipality')).toBeVisible();
    });

    test('Check if text "Province" is present', async ({ page }) => {
        await expect(page.locator('text=Province')).toBeVisible();
    });

    test('Check if text "Region" is present', async ({ page }) => {
        await expect(page.locator('text=Region')).toBeVisible();
    });

    test('Check if text "Booking System" is present', async ({ page }) => {
        await expect(page.locator('text=Booking System')).toBeVisible();
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
});


/*
test.describe('Facility Search Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173/byFaciSearch');
    });

    test('By Facility - Search "hospital"', async ({ page }) => {
        await page.click('button:text("BY FACILITY")');
        await page.fill('input[name="query"]', 'hospital');
        await page.click('button:text("Search")');
        
       
    });

    test('By Service - Search "hospital"', async ({ page }) => {
      await page.waitForSelector('button:text("BY SERVICE")');
      await page.click('button:text("BY SERVICE")');
      await page.waitForTimeout(500); // Give time for UI state to update
      await page.fill('input[name="query"]', 'hospital');
      await page.click('button:text("Search")');
  
    
  });
  
  test('By Service - Search "ambulance"', async ({ page }) => {
      await page.click('button:text("BY SERVICE")');
      await page.waitForTimeout(500); // Give time for UI state to update
      await page.fill('input[name="query"]', 'ambulance');
      await page.click('button:text("Search")');
  
  });

    test('By Facility - Search "ambulance"', async ({ page }) => {
        await page.click('button:text("BY FACILITY")');
        await page.fill('input[name="query"]', 'ambulance');
        await page.click('button:text("Search")');
    });
});
*/

