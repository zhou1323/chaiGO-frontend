import { dir } from 'i18next';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import * as React from 'react';
import { languages } from '../i18n/settings';
import MUIThemeProvider from './components/core/theme-provider';
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

export async function generateStaticParams() {
  return languages.map((locale) => ({ locale }));
}

export default function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  return (
    <html lang={locale} dir={dir(locale)}>
      <MUIThemeProvider locale={locale}>
        <body className={inter.className} id="__next">
          {children}
        </body>
      </MUIThemeProvider>
    </html>
  );
}
