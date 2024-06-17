'use client';

import { paths } from '@/paths';
import useUserStore from '@/store/user';
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
  const user = useUserStore((state) => state.user);
  const router = useRouter();

  const checkPermissions = () => {
    if (user) {
      router.replace(paths.dashboard.overview);
    }
  };

  React.useEffect(() => {
    checkPermissions();
  }, [checkPermissions, user, router]);

  return <>{children}</>;
}
