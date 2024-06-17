'use client';

import { paths } from '@/paths';
import useUserStore from '@/store/user';
import { useRouter } from 'next/navigation';
import * as React from 'react';

// AuthGuard is a component that checks if the user is authenticated.
// If the user is authenticated, it will redirect the user to the dashboard.

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const user = useUserStore((state) => state.user);
  const router = useRouter();

  const checkPermissions = () => {
    if (!user) {
      router.replace(paths.auth.signIn);
    }
  };

  React.useEffect(() => {
    checkPermissions();
  }, [checkPermissions, user, router]);

  return <>{children}</>;
}
