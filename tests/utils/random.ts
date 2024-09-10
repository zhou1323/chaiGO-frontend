export const randomEmail = () =>
  `test_${Math.random().toString(36).substring(7)}@example.com`;

export const randomUsername = () =>
  `Test User ${Math.random().toString(36).substring(7)}`;

export const randomPassword = () =>
  `${Math.random().toString(36).substring(2)}`;

export const randomVerificationCode = (length: number = 6): string => {
  return Math.random()
    .toString(36)
    .slice(2, 2 + length)
    .toUpperCase();
};

export const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');
