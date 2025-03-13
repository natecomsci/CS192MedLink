import { test, expect } from '@playwright/test';

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
