import GuestGuard from '@/components/auth/guest-guard';
import { Box, Stack, Typography } from '@mui/material';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GuestGuard>
      <Box className="flex min-h-full flex-col lg:grid lg:grid-cols-2">
        <Box className="hidden items-center justify-center bg-[#ffd001] p-3 lg:flex">
          <Stack spacing={3}>
            <Stack spacing={1}>
              <Typography
                color="White"
                className="text-center text-2xl"
                variant="h1"
              >
                Welcome to{' '}
                <Box component="span" className="text-neutral-500">
                  Chai GO
                </Box>
              </Typography>
              <Typography variant="subtitle1" align="center" color="white">
                A website that helps track where money goes and where it should
                go.
              </Typography>
            </Stack>
            <Box className="flex justify-center">
              <Box
                component="img"
                className="h-auto w-full max-w-[600px]"
                src="/assets/logo.png"
              ></Box>
            </Box>
          </Stack>
        </Box>
        <Box className="flex flex-auto flex-col">
          <Box className="p-3">{/* logo */}</Box>
          <Box className="flex flex-auto items-center justify-center p-3">
            <Box className="w-full max-w-[450px]">{children}</Box>
          </Box>
        </Box>
      </Box>
    </GuestGuard>
  );
}
