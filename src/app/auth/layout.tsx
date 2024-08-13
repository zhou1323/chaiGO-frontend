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
                A website that helps track where money goes and where it should
                go.
              </Typography>
            </Stack>
          </Stack>
        </Box>
        <Box className="flex items-center justify-center bg-[#f9fafc]">
          <Box className="w-2/3 rounded-lg border border-zinc-200 bg-white p-12 shadow">
            {children}
          </Box>
        </Box>
      </Box>
    </GuestGuard>
  );
}
