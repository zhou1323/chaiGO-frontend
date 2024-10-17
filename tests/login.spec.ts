import { expect, test, type Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';
test.use({ storageState: { cookies: [], origins: [] } });

type OptionsType = {
  exact?: boolean;
};

const credentialsPath = path.resolve(__dirname, 'test-credentials.json');
const testUser = JSON.parse(fs.readFileSync(credentialsPath, 'utf-8')) as {
  email: string;
  password: string;
};

const fillForm = async (page: Page, email: string, password: string) => {
  await page.getByPlaceholder('Enter your email').fill(email);
  await page
    .getByPlaceholder('Enter your password', { exact: true })
    .fill(password);
};

const verifyInput = async (
  page: Page,
  placeholder: string,
  options?: OptionsType
) => {
  const input = page.getByPlaceholder(placeholder, options);
  await expect(input).toBeVisible();
  await expect(input).toHaveText('');
  await expect(input).toBeEditable();
};

test('Inputs are visible, empty and editable', async ({ page }) => {
  await page.goto('/auth/sign-in');

  await verifyInput(page, 'Enter your email');
  await verifyInput(page, 'Enter your password', { exact: true });
});

test('Log In button is visible', async ({ page }) => {
  await page.goto('/auth/sign-in');

  await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
});

test('Forgot Password link is visible', async ({ page }) => {
  await page.goto('/auth/sign-in');

  await expect(
    page.getByRole('link', { name: 'Forgot password?' })
  ).toBeVisible();
});

test('Log in with valid email and password ', async ({ page }) => {
  await page.goto('/auth/sign-in');

  await fillForm(page, testUser.email, testUser.password);
  await page.getByRole('button', { name: 'Sign in' }).click();

  await page.waitForURL('/dashboard');
  await expect(page.getByRole('heading', { name: 'Overview' })).toBeVisible();
});

test('Log in with invalid email', async ({ page }) => {
  await page.goto('/auth/sign-in');

  await fillForm(page, 'invalidemail', testUser.password);
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page.getByText('Invalid email')).toBeVisible();
});

test('Log in with invalid password', async ({ page }) => {
  await page.goto('/auth/sign-in');
  await fillForm(page, testUser.email, 'invalidpassword');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByText('Incorrect email or password')).toBeVisible();
});

// Log out

test('Successful log out', async ({ page }) => {
  await page.goto('/auth/sign-in');

  await fillForm(page, testUser.email, testUser.password);
  await page.getByRole('button', { name: 'Sign in' }).click();

  await page.waitForURL('/dashboard');
  await expect(page.getByRole('heading', { name: 'Overview' })).toBeVisible();

  await page.getByTestId('user-menu').click();
  await page.getByRole('menuitem', { name: 'Sign out' }).click();

  await page.waitForURL('/auth/sign-in');
  await expect(page.getByRole('heading', { name: 'Welcome' })).toBeVisible();
});

test('Logged-out user cannot access protected routes', async ({ page }) => {
  await page.goto('/auth/sign-in');

  await fillForm(page, testUser.email, testUser.password);
  await page.getByRole('button', { name: 'Sign in' }).click();

  await page.waitForURL('/dashboard');

  await expect(page.getByRole('heading', { name: 'Overview' })).toBeVisible();

  await page.getByTestId('user-menu').click();
  await page.getByRole('menuitem', { name: 'Sign out' }).click();
  await page.waitForURL('/auth/sign-in');
  await expect(page.getByRole('heading', { name: 'Welcome' })).toBeVisible();
  await page.goto('/dashboard');
  await page.waitForURL('/auth/sign-in');
  await expect(page.getByRole('heading', { name: 'Welcome' })).toBeVisible();
});
