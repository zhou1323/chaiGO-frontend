'use client';

import GuestGuard from '@/app/[locale]/components/auth/guest-guard';
import { useTranslation } from '@/app/i18n/client';
import { Namespaces } from '@/app/i18n/settings';
import { WarningOutlined } from '@mui/icons-material';
import {
  Box,
  createTheme,
  CssBaseline,
  Modal,
  Stack,
  ThemeProvider,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';

// Always use light theme for auth layout [config for MaterialUI]
const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});
export default function AuthLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const [openModal, setOpenModal] = useState(false);
  const { t } = useTranslation(locale, Namespaces.auth);
  useEffect(() => {
    const checkDeviceAndOrientation = () => {
      const isMobile =
        /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      const isTablet =
        /iPad/i.test(navigator.userAgent) ||
        (/Android/i.test(navigator.userAgent) &&
          !/Mobile/i.test(navigator.userAgent));
      const isPortrait = window.innerHeight > window.innerWidth;

      const shouldRestrict = isMobile || (isTablet && isPortrait);

      setOpenModal(shouldRestrict);
    };

    checkDeviceAndOrientation();
    window.addEventListener('resize', checkDeviceAndOrientation);
    return () =>
      window.removeEventListener('resize', checkDeviceAndOrientation);
  }, []);
  return (
    <GuestGuard locale={locale}>
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <Box className="flex h-full flex-col lg:grid lg:grid-cols-2">
          <Box className="hidden items-center justify-center bg-[#122647] p-3 lg:flex">
            <Stack spacing={3} className="w-2/3">
              <Box className="flex justify-center">
                <Box
                  component="img"
                  className="h-64 w-64 animate-bounce-slow"
                  src="/assets/introduction.png"
                ></Box>
              </Box>
              <Stack spacing={1} alignItems="center">
                <Typography color="White" variant="h2">
                  chaiGO
                </Typography>
                <Typography variant="h5" align="center" color="white">
                  {t('common.introduction')}
                </Typography>
              </Stack>
            </Stack>
          </Box>
          <Box className="flex h-full items-center justify-center bg-[#f9fafc]">
            <Box className="w-2/3 rounded-lg border border-zinc-200 bg-white p-12 shadow">
              {children}
            </Box>
          </Box>
        </Box>
        <Modal open={openModal} onClose={() => setOpenModal(false)}>
          <Box className="absolute left-1/2 top-1/2 w-[300px] -translate-x-1/2 -translate-y-1/2 transform bg-white p-8 shadow-md">
            <WarningOutlined className="text-red-500" />
            <Typography id="mobile-warning-description" sx={{ mt: 2 }}>
              {t('common.mobileWarning')}
            </Typography>
          </Box>
        </Modal>
      </ThemeProvider>
    </GuestGuard>
  );
}
