export const paths = {
  home: '/',
  auth: {
    signIn: '/auth/sign-in',
    signUp: '/auth/sign-up',
    forgotPassword: '/auth/forgot-password',
  },
  dashboard: {
    overview: '/dashboard',
    budgets: '/dashboard/budgets',
    receipts: '/dashboard/receipts',
    settings: '/dashboard/settings',
  },
} as const;
