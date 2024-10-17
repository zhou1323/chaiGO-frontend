'use client';
import AuthGuard from '@/components/auth/auth-guard';
import Footer from '@/components/dashboard/layout/footer';
import MainNav from '@/components/dashboard/layout/main-nav';
import SideNav from '@/components/dashboard/layout/side-nav';
import { Box, Container } from '@mui/material';
import * as React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [navOpen, setNavOpen] = React.useState(false);

  return (
    <AuthGuard>
      <Box className="flex min-h-dvh">
        <SideNav open={navOpen} onClose={() => setNavOpen(false)} />
        <Box className="flex flex-auto flex-col">
          <MainNav handleNavOpen={() => setNavOpen(!navOpen)} />
          <main className="flex flex-auto flex-col bg-gray-50 p-6">
            <Container
              maxWidth={false}
              className="min-w-[1024px] flex-auto p-0"
            >
              {children}
            </Container>
            <Footer />
          </main>
        </Box>
      </Box>
    </AuthGuard>
  );
}
