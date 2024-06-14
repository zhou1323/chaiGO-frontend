'use client';
import { ThemeProvider, createTheme } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import CssBaseline from '@mui/material/CssBaseline';
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
};

export default function MUIThemeProvider({ children }: Props) {
  return (
    <AppRouterCacheProvider options={{ key: 'css' }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
