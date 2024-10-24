'use client';

import { getToken } from '@/lib/token';
import { getLocalizedPath, paths } from '@/paths';
import { useRouter } from 'next/navigation';
import * as React from 'react';

// AuthGuard is a component that checks if the user is authenticated.
// If the user is authenticated, it will redirect the user to the dashboard.

export default function AuthGuard({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  const [isChecking, setIsChecking] = React.useState(true);
  const token: string | null = getToken();
  const router = useRouter();

  const checkPermissions = () => {
    if (!token) {
      router.replace(getLocalizedPath(paths.auth.signIn, locale));
      return;
    }
    setIsChecking(false);
  };

  React.useEffect(() => {
    checkPermissions();
  }, [token]);

  if (isChecking) {
    return null;
  }

  return <>{children}</>;
}
