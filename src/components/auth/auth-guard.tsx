'use client';

import { getToken } from '@/lib/token';
import { paths } from '@/paths';
import { useRouter } from 'next/navigation';
import * as React from 'react';

// AuthGuard is a component that checks if the user is authenticated.
// If the user is authenticated, it will redirect the user to the dashboard.

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const token: string | null = getToken();
  const router = useRouter();

  const checkPermissions = () => {
    if (!token) {
      router.replace(paths.auth.signIn);
    }
  };

  React.useEffect(() => {
    checkPermissions();
  }, [checkPermissions, token, router]);

  return <>{children}</>;
}
