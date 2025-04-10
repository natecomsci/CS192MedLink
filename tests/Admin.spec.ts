
/*
import { test, expect } from '@playwright/test';

test.describe('Manage Admins Page UI Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/facility/dashboard/manageAdmins');
  });

  test('Back button is visible', async ({ page }) => {
    //await expect(page.locator('a[href="/facility/dashboard"]')).toBeHidden();
  });

  test('Manage Admins heading is visible', async ({ page }) => {
    await expect(page.locator('text=Manage Admins')).toBeHidden();
  });


  test('Search input is visible', async ({ page }) => {
    await expect(page.locator('input[type="text"]')).toBeVisible();
  });

  test('View By heading is visible', async ({ page }) => {
    await expect(page.locator('text=View By')).toBeHidden();
  });

  test('Dropdown is visible', async ({ page }) => {
    await expect(page.locator('select')).toBeHidden();
  });

  test('Previous button is visible', async ({ page }) => {
    await expect(page.locator('button:has-text("Previous")')).toBeHidden();
  });

  test('Next button is visible', async ({ page }) => {
    await expect(page.locator('button:has-text("Next ⟩")')).toBeHidden();
  });

  test('Add Admin button is visible', async ({ page }) => {
    await expect(page.locator('button:has-text("+ Add Admin")')).toBeHidden();
  });
});



/*
import { test, expect } from '@playwright/test';

test('Add Admin and Verify that it remained', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.goto('http://localhost:5173/');
});


test.describe('MedLink Homepage UI Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Check if the MedLink title is present', async ({ page }) => {
    await expect(page.locator('text=MedLink')).toBeVisible();
  });

  test('Check if the search input is present and can be typed into', async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Search"]');
    await expect(searchInput).toBeVisible();

    //  Ensure text can be entered into the search field
    await searchInput.fill('ABCDE');
    await expect(searchInput).toHaveValue('ABCDE');
  });

  test('Check if the Facility button is present', async ({ page }) => {
    //await expect(page.locator('button:has-text("Facility")')).toBeVisible();
  });

  test('Check if the Service button is present', async ({ page }) => {
    //await expect(page.locator('button:has-text("Service")')).toBeVisible();
  });

  test('Check if the Sign In button is present', async ({ page }) => {
    await expect(page.locator('button:has-text("Sign In")')).toBeVisible();
  });

  test('Check if the Sign Up button is present', async ({ page }) => {
    await expect(page.locator('button:has-text("Sign Up")')).toBeVisible();
  });

  test('Check if the filter button is present', async ({ page }) => {
    await expect(page.locator('button:has(svg)')).toBeVisible(({ timeout: 30000 }));
  });

});

test.describe('MedLink Homepage1 UI Tests', () => {

    test.beforeEach(async ({ page }) => {
      await page.goto('/');
    });
  
    test('Check if the MedLink title is present', async ({ page }) => {
      await expect(page.locator('text=MedLink')).toBeVisible();
    });
  
    test('Check if the search input is present and can be typed into', async ({ page }) => {
      const searchInput = page.locator('input[placeholder="Search"]');
      await expect(searchInput).toBeVisible();
  
      //  Ensure text can be entered into the search field
      await searchInput.fill('ABCDE');
      await expect(searchInput).toHaveValue('ABCDE');
    });
  
    test('Check if the Facility button is present', async ({ page }) => {
      //await expect(page.locator('button:has-text("Facility")')).toBeVisible();
    });
  
    test('Check if the Service button is present', async ({ page }) => {
      //await expect(page.locator('button:has-text("Service")')).toBeVisible();
    });
  
    test('Check if the Sign In button is present', async ({ page }) => {
      await expect(page.locator('button:has-text("Sign In")')).toBeVisible();
    });
  
    test('Check if the Sign Up button is present', async ({ page }) => {
      await expect(page.locator('button:has-text("Sign Up")')).toBeVisible();
    });
  
    test('Check if the filter button is present', async ({ page }) => {
      await expect(page.locator('button:has(svg)')).toBeVisible(({ timeout: 30000 }));
    });
  
  });

  test.describe('MedLink2 Homepage UI Tests', () => {

    test.beforeEach(async ({ page }) => {
      await page.goto('/');
    });
  
    test('Check if the MedLink title is present', async ({ page }) => {
      await expect(page.locator('text=MedLink')).toBeVisible();
    });
  
    test('Check if the search input is present and can be typed into', async ({ page }) => {
      const searchInput = page.locator('input[placeholder="Search"]');
      await expect(searchInput).toBeVisible();
  
      //  Ensure text can be entered into the search field
      await searchInput.fill('ABCDE');
      await expect(searchInput).toHaveValue('ABCDE');
    });
  
    test('Check if the Facility button is present', async ({ page }) => {
      //await expect(page.locator('button:has-text("Facility")')).toBeVisible();
    });
  
    test('Check if the Service button is present', async ({ page }) => {
      //await expect(page.locator('button:has-text("Service")')).toBeVisible();
    });
  
    test('Check if the Sign In button is present', async ({ page }) => {
      await expect(page.locator('button:has-text("Sign In")')).toBeVisible();
    });
  
    test('Check if the Sign Up button is present', async ({ page }) => {
      await expect(page.locator('button:has-text("Sign Up")')).toBeVisible();
    });
  
    test('Check if the filter button is present', async ({ page }) => {
      await expect(page.locator('button:has(svg)')).toBeVisible(({ timeout: 30000 }));
    });
  
  });

  test.describe('MedLink3 Homepage UI Tests', () => {

    test.beforeEach(async ({ page }) => {
      await page.goto('/');
    });
  
    test('Check if the MedLink title is present', async ({ page }) => {
      await expect(page.locator('text=MedLink')).toBeVisible();
    });
  
    test('Check if the search input is present and can be typed into', async ({ page }) => {
      const searchInput = page.locator('input[placeholder="Search"]');
      await expect(searchInput).toBeVisible();
  
      //  Ensure text can be entered into the search field
      await searchInput.fill('ABCDE');
      await expect(searchInput).toHaveValue('ABCDE');
    });
  
    test('Check if the Facility button is present', async ({ page }) => {
      //await expect(page.locator('button:has-text("Facility")')).toBeVisible();
    });
  
    test('Check if the Service button is present', async ({ page }) => {
      //await expect(page.locator('button:has-text("Service")')).toBeVisible();
    });
  
    test('Check if the Sign In button is present', async ({ page }) => {
      await expect(page.locator('button:has-text("Sign In")')).toBeVisible();
    });
  
    test('Check if the Sign Up button is present', async ({ page }) => {
      await expect(page.locator('button:has-text("Sign Up")')).toBeVisible();
    });
  
    test('Check if the filter button is present', async ({ page }) => {
      await expect(page.locator('button:has(svg)')).toBeVisible(({ timeout: 30000 }));
    });
  
  });

  */


