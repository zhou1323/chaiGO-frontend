'use client';
import MainNav from '@/components/dashboard/layout/main-nav';
import SideNav from '@/components/dashboard/layout/side-nav';
import { Box, Container } from '@mui/material';
import * as React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [navOpen, setNavOpen] = React.useState(false);

  return (
    <>
      <Box className="flex flex-row">
        <SideNav open={navOpen} onClose={() => setNavOpen(false)} />
        <Box
          className={`flex flex-auto flex-col pl-0 ${navOpen ? 'lg:pl-60' : ''}`}
        >
          <MainNav handleNavOpen={() => setNavOpen(!navOpen)} />
          <main>
            <Container maxWidth={false} className="py-10">
              {children}
            </Container>
          </main>
        </Box>
      </Box>
    </>
  );
}
