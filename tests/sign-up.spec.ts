import { expect, test, type Page } from '@playwright/test';

import fs from 'fs';
import path from 'path';
import { findLastEmail } from './utils/mailcatcher';
import {
  randomEmail,
  randomPassword,
  randomUsername,
  randomVerificationCode,
} from './utils/random';

test.use({ storageState: { cookies: [], origins: [] } });

const credentialsPath = path.resolve(__dirname, 'test-credentials.json');
const testUser = JSON.parse(fs.readFileSync(credentialsPath, 'utf-8')) as {
  email: string;
  password: string;
};

type OptionsType = {
  exact?: boolean;
};

const fillForm = async (
  page: Page,
  fullName: string,
  email: string,
  password: string,
  verificationCode: string
) => {
  await page.getByLabel('Username').fill(fullName);
  await page.getByLabel('Email address').fill(email);
  await page.getByLabel('Password', { exact: true }).fill(password);
  await page.getByLabel('Verification code').fill(verificationCode);
};

const verifyInput = async (
  page: Page,
  label: string,
  options?: OptionsType
) => {
  const input = page.getByLabel(label, options);
  await expect(input).toBeVisible();
  await expect(input).toHaveText('');
  await expect(input).toBeEditable();
};

test('Inputs are visible, empty and editable', async ({ page }) => {
  await page.goto('/auth/sign-up');

  await verifyInput(page, 'Username');
  await verifyInput(page, 'Email address');
  await verifyInput(page, 'Password', { exact: true });
  await verifyInput(page, 'Verification code');
});

test('Request verification code button is visible', async ({ page }) => {
  await page.goto('/auth/sign-up');

  await expect(page.getByRole('button', { name: 'Request' })).toBeVisible();
});

test('Sign up button is visible', async ({ page }) => {
  await page.goto('/auth/sign-up');

  await expect(page.getByRole('button', { name: 'Sign up' })).toBeVisible();
});

test('Sign In link is visible', async ({ page }) => {
  await page.goto('/auth/sign-up');

  await expect(page.getByRole('link', { name: 'Sign In' })).toBeVisible();
});

test('Sign up with valid name, email, and password', async ({
  page,
  request,
}) => {
  const email = randomEmail();
  await page.goto('/auth/sign-up');
  await fillForm(page, '', email, '', '');
  await page.getByRole('button', { name: 'Request' }).click();

  const emailData = await findLastEmail({
    request,
    filter: (e) => e.recipients.includes(`<${email}>`),
    timeout: 5000,
  });
  await page.goto(`http://localhost:1080/messages/${emailData.id}.html`);
  const selector =
    'body > div:nth-child(1) > div > table > tbody > tr > td > div > table > tbody > tr:nth-child(3) > td > div';
  const verificationCode = (await page.textContent(selector)) || '';

  await page.goto('/auth/sign-up');
  const fullName = randomUsername();
  const password = randomPassword();
  await fillForm(page, fullName, email, password, verificationCode);
  await page.getByRole('button', { name: 'Sign up' }).click();

  await page.waitForURL('/auth/sign-in');
  await expect(page.getByRole('heading', { name: 'Welcome' })).toBeVisible();
});

test('Send verification code with existing email', async ({ page }) => {
  const fullName = randomUsername();
  const email = testUser.email;
  const password = testUser.password;

  await page.goto('/auth/sign-up');

  await fillForm(page, fullName, email, password, '');
  await page.getByRole('button', { name: 'Request' }).click();

  await expect(
    page.getByText('The user with this email already exists in the system.')
  ).toBeVisible();
});

test('Sign up with existing email', async ({ page }) => {
  const fullName = randomUsername();
  const email = testUser.email;
  const password = testUser.password;
  const verificationCode = randomVerificationCode();

  await page.goto('/auth/sign-up');

  await fillForm(page, fullName, email, password, verificationCode);
  await page.getByRole('button', { name: 'Sign up' }).click();

  await expect(page.getByText('Invalid verification code')).toBeVisible();
});

test('Sign up with invalid email', async ({ page }) => {
  await page.goto('/auth/sign-up');

  await fillForm(
    page,
    'Playwright Test',
    'invalid-email',
    'changethis',
    'changethis'
  );
  await page.getByRole('button', { name: 'Sign up' }).click();

  await expect(page.getByText('Invalid email')).toBeVisible();
});

test('Send verification code with invalid email', async ({ page }) => {
  await page.goto('/auth/sign-up');

  await fillForm(page, '', 'invalid-email', '', '');
  await page.getByRole('button', { name: 'Request' }).click();

  await expect(page.getByText('Invalid email')).toBeVisible();
});

test('Sign up with missing full name', async ({ page }) => {
  const fullName = '';
  const email = randomEmail();
  const password = randomPassword();
  const verificationCode = randomVerificationCode();

  await page.goto('/auth/sign-up');

  await fillForm(page, fullName, email, password, verificationCode);
  await page.getByRole('button', { name: 'Sign up' }).click();

  await expect(page.getByText('Username is required')).toBeVisible();
});

test('Sign up with missing email', async ({ page }) => {
  const fullName = randomUsername();
  const email = '';
  const password = randomPassword();
  const verificationCode = randomVerificationCode();

  await page.goto('/auth/sign-up');

  await fillForm(page, fullName, email, password, verificationCode);
  await page.getByRole('button', { name: 'Sign up' }).click();

  await expect(page.getByText('Email is required')).toBeVisible();
});

test('Sign up with missing password', async ({ page }) => {
  const fullName = randomUsername();
  const email = randomEmail();
  const password = '';
  const verificationCode = randomVerificationCode();
  await page.goto('/auth/sign-up');

  await fillForm(page, fullName, email, password, verificationCode);
  await page.getByRole('button', { name: 'Sign up' }).click();

  await expect(
    page.getByText('Password should be at least 8 characters')
  ).toBeVisible();
});

test('Sign up with missing verification code', async ({ page }) => {
  const fullName = randomUsername();
  const email = randomEmail();
  const password = randomPassword();
  const verificationCode = '';
  await page.goto('/auth/sign-up');

  await fillForm(page, fullName, email, password, verificationCode);
  await page.getByRole('button', { name: 'Sign up' }).click();

  await expect(
    page.getByText('Verification code should be 6 characters')
  ).toBeVisible();
});
