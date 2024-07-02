'use client';
import { recoverPassword } from '@/lib/auth/client';
import { paths } from '@/paths';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowBack } from '@mui/icons-material';
import {
  Alert,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

const schema = zod.object({
  email: zod.string().min(1, { message: 'Email is required' }).email(),
});

type Values = zod.infer<typeof schema>;

const defaultValues: Values = { email: '' };

export default function ForgotPasswordPage() {
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const [isPending, setIsPending] = React.useState(false);
  const [hasSent, setHasSent] = React.useState(false);

  const router = useRouter();

  const onSubmit = async (values: Values) => {
    setIsPending(true);
    try {
      const { message } = await recoverPassword(values);

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
    <Stack spacing={4}>
      <Stack direction="row" spacing={1}>
        <IconButton
          onClick={() => router.push(paths.auth.signIn)}
          className="p-0"
        >
          <ArrowBack />
        </IconButton>
        <Typography variant="h6" color="grey">
          Sign in
        </Typography>
      </Stack>
      <Typography variant="h4">Reset password</Typography>

      {!hasSent ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <FormControl error={Boolean(errors.email)}>
                  <InputLabel>Email address</InputLabel>
                  <OutlinedInput
                    {...field}
                    label="Email address"
                    type="email"
                  />
                  {errors.email && (
                    <FormHelperText>{errors.email.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
            {errors.root && <Alert color="error">{errors.root.message}</Alert>}
            <Button type="submit" variant="contained" disabled={isPending}>
              Send recovery link
            </Button>
          </Stack>
        </form>
      ) : (
        <Typography variant="body1">
          We have sent an email with a password reset link to your registered
          email address. Please check your email and follow the instructions to
          complete the password reset process.
        </Typography>
      )}
    </Stack>
  );
}
