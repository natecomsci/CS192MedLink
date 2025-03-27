import { test, expect } from '@playwright/test';

test('Add Admin (w invalid then valid) and Verify that it stayed', async ({ page }) => {
    // Navigate to facility login page
    
    await page.goto('http://localhost:5173/facility');

    // Fill in Employee ID and Password
    await page.fill('input[name="employeeID"]', '001');
    await page.fill('input[name="password"]', 'qwerty');
    await page.click('button:has-text("Log In")');

    // Ensure redirection to dashboard
    await expect(page).toHaveURL('http://localhost:5173/facility/dashboard');

    // Click on Manage Admins
    await page.click('a[href="./dashboard/manageAdmins"]');
    await expect(page).toHaveURL('http://localhost:5173/facility/dashboard/manageAdmins');

    // Click on Add Admin button
    await page.click('button:has-text("+ Add Admin")');

    // Fill in admin details
    await page.fill('input[name="fname"]', 'red');
    
    await page.fill('input[name="mname"]', 'green');
    await page.fill('input[name="lname"]', 'blue');

    // Click Add Admin button
   await page.click('button:has-text("Add Admin")');

    // Refresh page
    await page.reload();

    // Ensure newly added admin is visible
    await expect(page.locator('text=red green blue')).toBeVisible();
});
test('Delete Admin but missing/wrong manager password', async ({ page }) => {
    // Navigate to facility login page
    
    await page.goto('http://localhost:5173/facility');

    // Fill in Employee ID and Password
    await page.fill('input[name="employeeID"]', '001');
    await page.fill('input[name="password"]', 'qwerty');
    await page.click('button:has-text("Log In")');

    // Ensure redirection to dashboard
    await expect(page).toHaveURL('http://localhost:5173/facility/dashboard');

    // Click on Manage Admins
    await page.click('a[href="./dashboard/manageAdmins"]');
    await expect(page).toHaveURL('http://localhost:5173/facility/dashboard/manageAdmins');

    // Click on Add Admin button
    await page.click('button:has-text("+ Add Admin")');

    // Fill in admin details
    await page.fill('input[name="fname"]', 'red');
    
    await page.fill('input[name="mname"]', 'green');
    await page.fill('input[name="lname"]', 'blue');

    // Click Add Admin button
   await page.click('button:has-text("Add Admin")');

    // Refresh page
    await page.reload();

    // Ensure newly added admin is visible
    await expect(page.locator('text=red green blue')).toBeVisible();
});

test('Delete Admin succesfully', async ({ page }) => {
    // Navigate to facility login page
    
    await page.goto('http://localhost:5173/facility');

    // Fill in Employee ID and Password
    await page.fill('input[name="employeeID"]', '001');
    await page.fill('input[name="password"]', 'qwerty');
    await page.click('button:has-text("Log In")');

    // Ensure redirection to dashboard
    await expect(page).toHaveURL('http://localhost:5173/facility/dashboard');

    // Click on Manage Admins
    await page.click('a[href="./dashboard/manageAdmins"]');
    await expect(page).toHaveURL('http://localhost:5173/facility/dashboard/manageAdmins');

    // Click on Add Admin button
    await page.click('button:has-text("+ Add Admin")');

    // Fill in admin details
    await page.fill('input[name="fname"]', 'red');
    
    await page.fill('input[name="mname"]', 'green');
    await page.fill('input[name="lname"]', 'blue');

    // Click Add Admin button
   await page.click('button:has-text("Add Admin")');

    // Refresh page
    await page.reload();

    // Ensure newly added admin is visible
    await expect(page.locator('text=red green blue')).toBeVisible();
});

test('Add Admin and Verify that it stayed', async ({ page }) => {
    // Navigate to facility login page
    
    await page.goto('http://localhost:5173/facility');

    // Fill in Employee ID and Password
    await page.fill('input[name="employeeID"]', '001');
    await page.fill('input[name="password"]', 'qwerty');
    await page.click('button:has-text("Log In")');

    // Ensure redirection to dashboard
    await expect(page).toHaveURL('http://localhost:5173/facility/dashboard');

    // Click on Manage Admins
    await page.click('a[href="./dashboard/manageAdmins"]');
    await expect(page).toHaveURL('http://localhost:5173/facility/dashboard/manageAdmins');

    // Click on Add Admin button
    await page.click('button:has-text("+ Add Admin")');

    // Fill in admin details
    await page.fill('input[name="fname"]', 'red');
    
    await page.fill('input[name="mname"]', 'green');
    await page.fill('input[name="lname"]', 'blue');

    // Click Add Admin button
   await page.click('button:has-text("Add Admin")');

    // Refresh page
    await page.reload();

    // Ensure newly added admin is visible
    await expect(page.locator('text=red green blue')).toBeVisible();
});

test('Search within list of Admin', async ({ page }) => {
    // Navigate to facility login page
    
    await page.goto('http://localhost:5173/facility');

    // Fill in Employee ID and Password
    await page.fill('input[name="employeeID"]', '001');
    await page.fill('input[name="password"]', 'qwerty');
    await page.click('button:has-text("Log In")');

    // Ensure redirection to dashboard
    await expect(page).toHaveURL('http://localhost:5173/facility/dashboard');

    // Click on Manage Admins
    await page.click('a[href="./dashboard/manageAdmins"]');
    await expect(page).toHaveURL('http://localhost:5173/facility/dashboard/manageAdmins');

    // Click on Add Admin button
    await page.click('button:has-text("+ Add Admin")');

    // Fill in admin details
    await page.fill('input[name="fname"]', 'red');
    
    await page.fill('input[name="mname"]', 'green');
    await page.fill('input[name="lname"]', 'blue');

    // Click Add Admin button
   await page.click('button:has-text("Add Admin")');

    // Refresh page
    await page.reload();

    // Ensure newly added admin is visible
    await expect(page.locator('text=red green blue')).toBeVisible();
});

test('Edit admin name and change password', async ({ page }) => {
    // Navigate to facility login page
    
    await page.goto('http://localhost:5173/facility');

    // Fill in Employee ID and Password
    await page.fill('input[name="employeeID"]', '001');
    await page.fill('input[name="password"]', 'qwerty');
    await page.click('button:has-text("Log In")');

    // Ensure redirection to dashboard
    await expect(page).toHaveURL('http://localhost:5173/facility/dashboard');

    // Click on Manage Admins
    await page.click('a[href="./dashboard/manageAdmins"]');
    await expect(page).toHaveURL('http://localhost:5173/facility/dashboard/manageAdmins');

    // Click on Add Admin button
    await page.click('button:has-text("+ Add Admin")');

    // Fill in admin details
    await page.fill('input[name="fname"]', 'red');
    
    await page.fill('input[name="mname"]', 'green');
    await page.fill('input[name="lname"]', 'blue');

    // Click Add Admin button
   await page.click('button:has-text("Add Admin")');

    // Refresh page
    await page.reload();

    // Ensure newly added admin is visible
    await expect(page.locator('text=red green blue')).toBeVisible();
});