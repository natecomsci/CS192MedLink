import { test, expect } from '@playwright/test';



test.describe('Add Ambulance Service Flow', () => {
    test.beforeEach(async ({ page }) => {
        // Step 1: Go to the login page
        await page.goto('/facility');

        // Step 2: Fill in login credentials
        await page.fill('input[name="fid"]', '20250005');
        await page.fill('input[name="password"]', 'password');

        // Step 3: Click the "Log in" button
        await page.click('button:has-text("Log In")');

        // Step 4: Verify redirection to dashboard
        await expect(page).toHaveURL('/facility/dashboard');

        // Step 5: Click "Manage Services"
        await page.click('a[href="./dashboard/manageServices"]');

        // Step 6: Verify navigation to "Manage Services"
        await expect(page).toHaveURL('/facility/dashboard/manageServices');

        // Step 7: Click "Add Service"
        await page.click('a[href="./manageServices/addService"]');

        // Step 8: Verify navigation to "Add Service"
        await expect(page).toHaveURL('/facility/dashboard/manageServices/addService');

        // Step 9: Select "Ambulance" from the dropdown
        await page.selectOption('select[name="serviceType"]', 'Ambulance');
        //await page.selectOption('select', { label: 'Division' });
    });

    
    test('Invalid Phone Number format', async ({ page }) => {
        await page.fill('input[name="phoneNumber"]', '1234'); // Invalid format
        await page.fill('input[name="opening"]', '08:00');
      await page.fill('input[name="closing"]', '16:00');
      await page.fill('input[name="price"]', '10');
      await page.fill('input[name="minCoverageRadius"]', '5');
        await page.fill('input[name="maxCoverageRadius"]', '10');
        await page.fill('input[placeholder="Mileage Rate"]', '1');
        await page.click('button:has-text("Add Service")');
        await expect(page.locator('p.error')).toBeVisible();
    });

    test('Closing Time is earlier than Opening Time', async ({ page }) => {
        await page.fill('input[name="opening"]', '16:00'); //inval
        await page.fill('input[name="closing"]', '08:00'); //inval
        await page.fill('input[name="phoneNumber"]', '1234'); // Invalid format
      
      await page.fill('input[name="price"]', '10');
      await page.fill('input[name="minCoverageRadius"]', '5');
        await page.fill('input[name="maxCoverageRadius"]', '10');
        await page.fill('input[placeholder="Mileage Rate"]', '1');
        await page.click('button:has-text("Add Service")');
        await page.click('button:has-text("Add Service")');
        await expect(page.locator('p.error')).toBeVisible();
    });

    test('Invalid Base Rate format', async ({ page }) => {
        await page.fill('input[name="price"]', '-1'); // Invalid format
        await page.click('button:has-text("Add Service")');
        await page.fill('input[name="phoneNumber"]', '1234'); // Invalid format
        await page.fill('input[name="opening"]', '08:00');
      await page.fill('input[name="closing"]', '16:00');
      await page.fill('input[name="price"]', '10');
      await page.fill('input[name="minCoverageRadius"]', '5');
        await page.fill('input[name="maxCoverageRadius"]', '10');
        await page.fill('input[placeholder="Mileage Rate"]', '1');
        await page.click('button:has-text("Add Service")');
      
    });

    test('Invalid Minimum Coverage Radius format', async ({ page }) => {
        await page.fill('input[name="phoneNumber"]', '1234'); // Invalid format
        await page.fill('input[name="opening"]', '08:00');
      await page.fill('input[name="closing"]', '16:00');
      await page.fill('input[name="price"]', '10');
      await page.fill('input[name="minCoverageRadius"]', '5');
        await page.fill('input[name="maxCoverageRadius"]', '10');
        await page.fill('input[placeholder="Mileage Rate"]', '1');
        await page.click('button:has-text("Add Service")');
    });

    test('Invalid Mileage Rate format', async ({ page }) => {
        await page.fill('input[name="phoneNumber"]', '1234'); // Invalid format
        await page.fill('input[name="opening"]', '08:00');
      await page.fill('input[name="closing"]', '16:00');
      await page.fill('input[name="price"]', '10');
      await page.fill('input[name="minCoverageRadius"]', '5');
        await page.fill('input[name="maxCoverageRadius"]', '10');
        await page.fill('input[placeholder="Mileage Rate"]', '1');
        await page.click('button:has-text("Add Service")');
    });

    test('Invalid Maximum Coverage Radius format', async ({ page }) => {
        await page.fill('input[name="phoneNumber"]', '1234'); // Invalid format
        await page.fill('input[name="opening"]', '08:00');
      await page.fill('input[name="closing"]', '16:00');
      await page.fill('input[name="price"]', '10');
      await page.fill('input[name="minCoverageRadius"]', '5');
        await page.fill('input[name="maxCoverageRadius"]', '10');
        await page.fill('input[placeholder="Mileage Rate"]', '1');
        await page.click('button:has-text("Add Service")');
    });

    test('Maximum Coverage Radius is less than Minimum Coverage Radius', async ({ page }) => {
        await page.fill('input[name="minCoverageRadius"]', '10');
        await page.fill('input[name="maxCoverageRadius"]', '5'); // Invalid case

        await page.fill('input[name="phoneNumber"]', '1234'); // Invalid format
        await page.fill('input[name="opening"]', '08:00');
      await page.fill('input[name="closing"]', '16:00');
      await page.fill('input[name="price"]', '10');
        await page.fill('input[placeholder="Mileage Rate"]', '1');
        await page.click('button:has-text("Add Service")');
        await page.click('button:has-text("Add Service")');
        await expect(page.locator('p.error')).toBeVisible();
    });
});



test.describe('Add Blood Bank Service Flow', () => {
    test.beforeEach(async ({ page }) => {
        // Step 1: Go to the login page
        await page.goto('/facility');

        // Step 2: Fill in login credentials
        await page.fill('input[name="fid"]', '20250005');
        await page.fill('input[name="password"]', 'password');

        // Step 3: Click the "Log in" button
        await page.click('button:has-text("Log In")');

        // Step 4: Verify redirection to dashboard
        await expect(page).toHaveURL('/facility/dashboard');

        // Step 5: Click "Manage Services"
        await page.click('a[href="./dashboard/manageServices"]');

        // Step 6: Verify navigation to "Manage Services"
        await expect(page).toHaveURL('/facility/dashboard/manageServices');

        // Step 7: Click "Add Service"
        await page.click('a[href="./manageServices/addService"]');

        // Step 8: Verify navigation to "Add Service"
        await expect(page).toHaveURL('/facility/dashboard/manageServices/addService');

        // Step 9: Select "Ambulance" from the dropdown
        await page.selectOption('select[name="serviceType"]', 'Blood Bank');
        //await page.selectOption('select', { label: 'Division 1' });
    });

    test('Invalid Phone Number format', async ({ page }) => {
      await page.fill('input[name="phoneNumber"]', '1234'); // invalid
      await page.fill('input[name="opening"]', '08:00');
      await page.fill('input[name="closing"]', '16:00');
      await page.fill('input[name="price"]', '10');
      await page.fill('input[name="turnaroundHours"]', '20');
      await page.fill('input[name="turnaroundDays"]', '1');
      await page.click('button:has-text("Add Service")');
      await expect(page.locator('p.error')).toBeVisible();
  });

  test('Closing Time is earlier than the Opening Time', async ({ page }) => {
      await page.fill('input[name="opening"]', '16:00'); //inval
      await page.fill('input[name="closing"]', '08:00'); //inval
      await page.fill('input[name="price"]', '10');
      await page.fill('input[name="turnaroundHours"]', '20');
      await page.fill('input[name="turnaroundDays"]', '1');
      await page.fill('input[name="phoneNumber"]', '+63 912 123 1234');
      await page.click('button:has-text("Add Service")');
      await expect(page.locator('p.error')).toBeVisible();
  });

  test('Invalid Price Per Unit format', async ({ page }) => {
      await page.fill('input[name="price"]', '-1'); //inval
      await page.fill('input[name="opening"]', '08:00');
      await page.fill('input[name="closing"]', '16:00');
      await page.fill('input[name="turnaroundHours"]', '20');
      await page.fill('input[name="turnaroundDays"]', '1');
      await page.fill('input[name="phoneNumber"]', '+63 912 123 1234');
      await page.click('button:has-text("Add Service")');
      // await expect(page.locator('p.error')).toBeVisible();
  });

  test('Invalid Turnaround Time days format', async ({ page }) => {
    await page.fill('input[name="price"]', '1'); 
      await page.fill('input[name="opening"]', '08:00');
      await page.fill('input[name="closing"]', '16:00');
      await page.fill('input[name="turnaroundHours"]', '20');
      await page.fill('input[name="turnaroundDays"]', '-1'); //inval
      await page.fill('input[name="phoneNumber"]', '+63 912 123 1234');
      await page.click('button:has-text("Add Service")');
      await expect(page.locator('p.error')).toBeVisible();
  });

  test('Invalid Turnaround Time hours format', async ({ page }) => {
      await page.fill('input[name="turnaroundHours"]', '25'); //inval
      await page.fill('input[name="price"]', '1'); 
      await page.fill('input[name="opening"]', '08:00');
      await page.fill('input[name="closing"]', '16:00');
      await page.fill('input[name="turnaroundDays"]', '1');
      await page.fill('input[name="phoneNumber"]', '+63 912 123 1234');
      await page.click('button:has-text("Add Service")');
      await expect(page.locator('p.error')).toBeVisible();
  });
});



test.describe('Add ICU', () => {
  test.beforeEach(async ({ page }) => {
      // Step 1: Go to the login page
      await page.goto('/facility');

      // Step 2: Fill in login credentials
      await page.fill('input[name="fid"]', '20250005');
      await page.fill('input[name="password"]', 'password');

      // Step 3: Click the "Log in" button
      await page.click('button:has-text("Log In")');

      // Step 4: Verify redirection to dashboard
      await expect(page).toHaveURL('/facility/dashboard');

      // Step 5: Click "Manage Services"
      await page.click('a[href="./dashboard/manageServices"]');

      // Step 6: Verify navigation to "Manage Services"
      await expect(page).toHaveURL('/facility/dashboard/manageServices');

      // Step 7: Click "Add Service"
      await page.click('a[href="./manageServices/addService"]');

      // Step 8: Verify navigation to "Add Service"
      await expect(page).toHaveURL('/facility/dashboard/manageServices/addService');

      // Step 9: Select "Ambulance" from the dropdown
      await page.selectOption('select[name="serviceType"]', 'ICU');
      //await page.selectOption('select', { label: 'Division 1' });
  });

  test('Invalid Phone Number format', async ({ page }) => {
    await page.fill('input[name="phoneNumber"]', '1234'); // invalid
       await page.fill('input[name="price"]', '10');
    await page.click('button:has-text("Add Service")');
    await expect(page.locator('p.error')).toBeVisible();
});

test('Invalid Base', async ({ page }) => {
  await page.fill('input[name="phoneNumber"]', '+63 912 1234 123'); 
     await page.fill('input[name="price"]', '-1'); // invalid
  await page.click('button:has-text("Add Service")');
});

});

test.describe('Add Outpatient', () => {
  test.beforeEach(async ({ page }) => {
      // Step 1: Go to the login page
      await page.goto('/facility');

      // Step 2: Fill in login credentials
      await page.fill('input[name="fid"]', '20250005');
      await page.fill('input[name="password"]', 'password');

      // Step 3: Click the "Log in" button
      await page.click('button:has-text("Log In")');

      // Step 4: Verify redirection to dashboard
      await expect(page).toHaveURL('/facility/dashboard');

      // Step 5: Click "Manage Services"
      await page.click('a[href="./dashboard/manageServices"]');

      // Step 6: Verify navigation to "Manage Services"
      await expect(page).toHaveURL('/facility/dashboard/manageServices');

      // Step 7: Click "Add Service"
      await page.click('a[href="./manageServices/addService"]');

      // Step 8: Verify navigation to "Add Service"
      await expect(page).toHaveURL('/facility/dashboard/manageServices/addService');

      // Step 9: Select "Ambulance" from the dropdown
      await page.selectOption('select[name="serviceType"]', 'Outpatient');
      //await page.selectOption('select', { label: 'Division 1' });
  });

  test('Invalid Hour', async ({ page }) => {
    await page.selectOption('select[name="OPserviceType"]', 'CONSULTATION_GENERAL');
    
       await page.fill('input[name="completionDays"]', '1');
       await page.fill('input[name="completionHours"]', '24');
       await page.fill('input[name="price"]', '10');
    await page.click('button:has-text("Add Service")');
    await expect(page.locator('p.error')).toBeVisible();
  });
});