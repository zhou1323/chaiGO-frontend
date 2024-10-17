// global-setup.ts
import { chromium, FullConfig, request } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { randomEmail, randomPassword, randomUsername } from './random';
import { signUpNewUser } from './user';

async function globalSetup(config: FullConfig) {
  const credentialsPath = path.resolve(
    __dirname,
    '..',
    'test-credentials.json'
  );

  if (fs.existsSync(credentialsPath)) {
    console.log(
      'The test account already exists, skipping the registration step'
    );
    return;
  }

  const browser = await chromium.launch();
  const page = await browser.newPage({
    baseURL: 'http://localhost:3000',
  });
  const apiRequest = await request.newContext();

  const fullName = randomUsername();
  const email = randomEmail();
  const password = randomPassword();

  // Sign up a new user
  await signUpNewUser(apiRequest, page, fullName, email, password);

  // Save the credentials to a JSON file
  const credentials = { email, password };
  fs.writeFileSync(credentialsPath, JSON.stringify(credentials, null, 2));

  await browser.close();
}

export default globalSetup;
