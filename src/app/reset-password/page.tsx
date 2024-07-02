'use client';
import { resetPassword } from '@/lib/auth/client';
import { paths } from '@/paths';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
} from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

const schema = zod.object({
  password: zod
    .string()
    .min(8, { message: 'Password should be at least 6 characters' }),
});

type Values = zod.infer<typeof schema>;

const defaultValues: Values = { password: '' };

export default function ResetPasswordPage() {
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const [isPending, setIsPending] = React.useState(false);
  const [hasSent, setHasSent] = React.useState(false);
  const [repeatPassword, setRepeatPassword] = React.useState('');

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const onSubmit = async (values: Values) => {
    if (repeatPassword !== values.password) {
      setError('password', {
        type: 'manual',
        message: 'Passwords do not match',
      });
      return;
    }

    setIsPending(true);
    try {
      const { password } = values;
      const { message } = await resetPassword({
        newPassword: password,
        token: token || '',
      });

      if (message) {
        setError('root', { type: 'server', message: message });
        setIsPending(false);
        return;
      } else {
        setHasSent(true);
      }
    } catch (error: any) {
      setError('root', {
        type: 'server',
        message: error.response?.data.detail || error.message,
      });
    } finally {
      setIsPending(false);
    }
  };
  return (
    <Box className="flex min-h-full flex-auto items-center justify-center p-3">
      <Stack spacing={4} className="w-full max-w-[450px]">
        <Typography variant="h4">Reset password</Typography>

        {!hasSent ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <Controller
                control={control}
                name="password"
                render={({ field }) => (
                  <FormControl error={Boolean(errors.password)}>
                    <InputLabel>New password</InputLabel>
                    <OutlinedInput
                      {...field}
                      label="New password"
                      type="password"
                    />
                    {errors.password && (
                      <FormHelperText>{errors.password.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
              <FormControl>
                <InputLabel>Repeat password</InputLabel>
                <OutlinedInput
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  label="Repeat password"
                  type="password"
                />
              </FormControl>

              {errors.root && (
                <Alert severity="error">{errors.root.message}</Alert>
              )}
              <Button type="submit" variant="contained" disabled={isPending}>
                Reset password
              </Button>
            </Stack>
          </form>
        ) : (
          <Stack spacing={2}>
            <Typography variant="body1">
              You have successfully reset your password. Please sign in with
              your new password.
            </Typography>
            <Button
              variant="contained"
              onClick={() => router.push(paths.auth.signIn)}
            >
              Return to sign in
            </Button>
          </Stack>
        )}
      </Stack>
    </Box>
  );
}
