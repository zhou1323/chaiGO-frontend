import { APIRequestContext, expect, type Page } from '@playwright/test';
import { findLastEmail } from './mailcatcher';

export async function signUpNewUser(
  request: APIRequestContext,
  page: Page,
  name: string,
  email: string,
  password: string
) {
  await page.goto('/auth/sign-up');
  await page.getByLabel('Email address').fill(email);
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
  await page.getByLabel('Username').fill(name);
  await page.getByLabel('Email address').fill(email);
  await page.getByLabel('Password', { exact: true }).fill(password);
  await page.getByLabel('Verification code').fill(verificationCode);

  await page.getByRole('button', { name: 'Sign up' }).click();
  await page.waitForURL('/auth/sign-in');
  await expect(page.getByRole('heading', { name: 'Welcome' })).toBeVisible();
}

export async function logInUser(page: Page, email: string, password: string) {
  await page.goto('/auth/sign-in');

  await page.getByPlaceholder('Enter your email').fill(email);
  await page
    .getByPlaceholder('Enter your password', { exact: true })
    .fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();

  await page.waitForURL('/dashboard');
  await expect(page.getByRole('heading', { name: 'Overview' })).toBeVisible();
}

export async function logOutUser(page: Page) {
  await page.getByTestId('user-menu').click();
  await page.getByRole('menuitem', { name: 'Sign out' }).click();

  await page.waitForURL('/auth/sign-in');
  await expect(page.getByRole('heading', { name: 'Welcome' })).toBeVisible();
}
