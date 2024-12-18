import { updatePasswordMe } from '@/lib/dashboard/userClient';
import { getLocalizedPath, paths } from '@/paths';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
const schema = zod
  .object({
    currentPassword: zod
      .string()
      .min(8, { message: 'Password should be at least 8 characters' })
      .max(40, { message: 'Password should be at most 40 characters' }),
    newPassword: zod
      .string()
      .min(8, { message: 'Password should be at least 8 characters' })
      .max(40, { message: 'Password should be at most 40 characters' }),
    confirmPassword: zod
      .string()
      .min(8, { message: 'Password should be at least 8 characters' })
      .max(40, { message: 'Password should be at most 40 characters' }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

type Values = zod.infer<typeof schema>;

export default function SettingsPassword({ locale }: { locale: string }) {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const defaultValues: Values = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const router = useRouter();
  const onSubmit = async (values: Values) => {
    try {
      const { message } = await updatePasswordMe({
        newPassword: values.newPassword,
        currentPassword: values.currentPassword,
      });
      if (message) {
        throw new Error(message);
      }

      setDialogOpen(true);
      setTimeout(() => {
        router.replace(getLocalizedPath(paths.auth.signIn, locale));
      }, 3000);
    } catch (error: any) {
      console.log(error.response?.data.detail || error.message);
    }
  };

  return (
    <Card className="w-1/2">
      <CardHeader title="Change Password" />
      <Divider />
      <CardContent>
        <form>
          <Stack spacing={2}>
            <Box>
              <Typography className="font-bold">Current Password</Typography>
              <Controller
                control={control}
                name="currentPassword"
                render={({ field }) => (
                  <TextField
                    {...field}
                    hiddenLabel
                    className="w-72"
                    size="small"
                    variant="outlined"
                    type="password"
                    error={!!errors.currentPassword}
                    helperText={errors.currentPassword?.message}
                  />
                )}
              />
            </Box>
            <Box>
              <Typography className="font-bold">Set Password</Typography>
              <Controller
                control={control}
                name="newPassword"
                render={({ field }) => (
                  <TextField
                    {...field}
                    hiddenLabel
                    className="w-72"
                    size="small"
                    type="password"
                    variant="outlined"
                    error={!!errors.newPassword}
                    helperText={errors.newPassword?.message}
                  />
                )}
              />
            </Box>
            <Box>
              <Typography className="font-bold">Confirm Password</Typography>
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field }) => (
                  <TextField
                    {...field}
                    hiddenLabel
                    className="w-72"
                    size="small"
                    type="password"
                    variant="outlined"
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                  />
                )}
              />
            </Box>
          </Stack>
        </form>
      </CardContent>
      <Divider />
      <CardActions className="justify-end px-4 py-2">
        <Button
          variant="contained"
          size="small"
          className="w-20"
          onClick={handleSubmit(onSubmit)}
        >
          Save
        </Button>
      </CardActions>

      <Dialog open={dialogOpen}>
        <DialogTitle>Password updated</DialogTitle>
        <DialogContent>
          <Stack spacing={5} className="items-center">
            <Typography>
              You will be redirected to the sign in page in 3 seconds...
            </Typography>
            <CircularProgress color="inherit" />
          </Stack>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
