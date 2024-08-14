'use client';
import AuthGuard from '@/components/auth/auth-guard';
import MainNav from '@/components/dashboard/layout/main-nav';
import SideNav from '@/components/dashboard/layout/side-nav';
import { Box, Container } from '@mui/material';
import * as React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [navOpen, setNavOpen] = React.useState(false);

  return (
    <AuthGuard>
      <Box className="flex h-full">
        <SideNav open={navOpen} onClose={() => setNavOpen(false)} />
        <Box className="flex flex-auto flex-col">
          <MainNav handleNavOpen={() => setNavOpen(!navOpen)} />
          <main className="flex-auto">
            <Container maxWidth={false} className="h-full bg-gray-50 p-6">
              {children}
            </Container>
          </main>
        </Box>
      </Box>
    </AuthGuard>
  );
}
