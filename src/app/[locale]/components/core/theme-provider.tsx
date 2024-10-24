'use client';
import { ThemeProvider, createTheme } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import CssBaseline from '@mui/material/CssBaseline';
import * as locales from '@mui/material/locale';
import * as React from 'react';

const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: () => `
            * {
              margin: 0;
              padding: 0;
            }
        `,
    },
  },
});

type Props = {
  children: React.ReactNode;
  locale: string;
};

export default function MUIThemeProvider({ children, locale }: Props) {
  const themeWithLocale = React.useMemo(() => {
    // BCP 47 language tag
    const formattedLocale = locale.replace('-', '');
    return createTheme(theme, locales[formattedLocale as keyof typeof locales]);
  }, [locale]);
  return (
    <AppRouterCacheProvider options={{ key: 'css' }}>
      <ThemeProvider theme={themeWithLocale}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
