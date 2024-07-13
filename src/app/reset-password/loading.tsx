import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingPage = () => {
  return (
    <Box className="flex h-screen flex-col items-center justify-center bg-gray-100">
      <CircularProgress />
      <Typography variant="h6" className="mt-2">
        Loading...
      </Typography>
    </Box>
  );
};

export default LoadingPage;
