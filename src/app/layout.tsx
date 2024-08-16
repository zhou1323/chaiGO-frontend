import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import * as React from 'react';
import MUIThemeProvider from '../components/core/theme-provider';
import './globals.css';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ChaiGO',
  description: '',
  icons: {
    icon: '/assets/introduction.png',
    apple: '/assets/introduction.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <MUIThemeProvider>
        <body className={inter.className} id="__next">
          {children}
        </body>
      </MUIThemeProvider>
    </html>
  );
}
