'use client';

import { getToken } from '@/lib/token';
import { paths } from '@/paths';
import { useRouter } from 'next/navigation';
import * as React from 'react';

// GuestGuard is a component that checks if the user is a guest.
// If the user is a guest, it will render the children(sign in page).
// If the user is a user, it will redirect the user to the dashboard.

export default function GuestGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isChecking, setIsChecking] = React.useState(true);
  const token: string | null = getToken();
  const router = useRouter();

  const checkPermissions = () => {
    if (token) {
      router.replace(paths.dashboard.overview);
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
