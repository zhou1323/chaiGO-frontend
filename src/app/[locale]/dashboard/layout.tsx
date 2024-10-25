'use client';
import AuthGuard from '@/app/[locale]/components/auth/auth-guard';
import Footer from '@/app/[locale]/components/dashboard/layout/footer';
import MainNav from '@/app/[locale]/components/dashboard/layout/main-nav';
import SideNav from '@/app/[locale]/components/dashboard/layout/side-nav';
import { Box, Container } from '@mui/material';
import * as React from 'react';

export default function Layout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const [navOpen, setNavOpen] = React.useState(false);

  return (
    <AuthGuard locale={locale}>
      <Box className="flex min-h-dvh">
        <SideNav
          open={navOpen}
          onClose={() => setNavOpen(false)}
          locale={locale}
        />
        <Box className="flex flex-auto flex-col">
          <MainNav handleNavOpen={() => setNavOpen(!navOpen)} locale={locale} />
          <main className="flex flex-auto flex-col bg-gray-50 p-6">
            <Container
              maxWidth={false}
              className="min-w-[1024px] flex-auto p-0"
            >
              {children}
            </Container>
            <Footer locale={locale} />
          </main>
        </Box>
      </Box>
    </AuthGuard>
  );
}
