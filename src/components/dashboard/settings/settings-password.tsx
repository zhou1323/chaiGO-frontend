import { updatePasswordMe } from '@/lib/dashboard/userClient';
import { paths } from '@/paths';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
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

export default function SettingsPassword() {
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
        router.replace(paths.auth.signIn);
      }, 3000);
    } catch (error: any) {
      console.log(error.response?.data.detail || error.message);
    }
  };

  return (
    <Stack spacing={3}>
      <Typography className="font-bold" variant="h6">
        Change Password
      </Typography>

      <form>
        <Stack spacing={1}>
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
        </Stack>
      </form>
      <Button
        variant="contained"
        className="w-20"
        onClick={handleSubmit(onSubmit)}
      >
        Save
      </Button>

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
    </Stack>
  );
}
