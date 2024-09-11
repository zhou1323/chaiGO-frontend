import { expect, test } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { findLastEmail } from './utils/mailcatcher';
import { randomPassword } from './utils/random';
import { logInUser } from './utils/user';

test.use({ storageState: { cookies: [], origins: [] } });

const credentialsPath = path.resolve(__dirname, './test-credentials.json');
const testUser = JSON.parse(fs.readFileSync(credentialsPath, 'utf-8')) as {
  email: string;
  password: string;
};

test('Reset password title is visible', async ({ page }) => {
  await page.goto('/auth/forgot-password');

  await expect(
    page.getByRole('heading', { name: 'Reset password' })
  ).toBeVisible();
});

test('Input is visible, empty and editable', async ({ page }) => {
  await page.goto('/auth/forgot-password');

  await expect(page.getByLabel('Email address')).toBeVisible();
  await expect(page.getByLabel('Email address')).toHaveText('');
  await expect(page.getByLabel('Email address')).toBeEditable();
});

test('Send recovery link button is visible', async ({ page }) => {
  await page.goto('/auth/forgot-password');

  await expect(
    page.getByRole('button', { name: 'Send recovery link' })
  ).toBeVisible();
});

test('User can reset password successfully using the link', async ({
  page,
  request,
}) => {
  const newPassword = randomPassword();

  await page.goto('/auth/forgot-password');
  await page.getByLabel('Email address').fill(testUser.email);

  await page.getByRole('button', { name: 'Send recovery link' }).click();

  const emailData = await findLastEmail({
    request,
    filter: (e) => e.recipients.includes(`<${testUser.email}>`),
    timeout: 5000,
  });

  await page.goto(`http://localhost:1080/messages/${emailData.id}.html`);

  const selector = 'a[href*="/reset-password?token="]';

  let url = await page.getAttribute(selector, 'href');

  const parts = url!.split('/reset-password');
  const newUrl = parts.length > 1 ? '/reset-password' + parts[1] : '';

  await page.goto(newUrl);

  await page.getByLabel('New password').fill(newPassword);
  await page.getByLabel('Confirm password').fill(newPassword);
  await page.getByRole('button', { name: 'Reset password' }).click();
  await expect(
    page.getByText('You have successfully reset your password.')
  ).toBeVisible();

  const credentials = { email: testUser.email, password: newPassword };
  fs.writeFileSync(credentialsPath, JSON.stringify(credentials, null, 2));

  await logInUser(page, testUser.email, newPassword);
});

test('Expired or invalid reset link', async ({ page }) => {
  const password = randomPassword();
  const invalidUrl = '/reset-password?token=invalidtoken';

  await page.goto(invalidUrl);

  await page.getByLabel('New password').fill(password);
  await page.getByLabel('Confirm Password').fill(password);
  await page.getByRole('button', { name: 'Reset password' }).click();

  await expect(page.getByText('Invalid token')).toBeVisible();
});
