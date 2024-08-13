'use client';
import { recoverPassword } from '@/lib/auth/client';
import { paths } from '@/paths';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowBack } from '@mui/icons-material';
import {
  Alert,
  Button,
  IconButton,
  Stack,
  TextField,
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
    <Stack spacing={1}>
      <Stack direction="row" spacing={1}>
        <IconButton
          onClick={() => router.push(paths.auth.signIn)}
          className="p-0"
        >
          <ArrowBack />
        </IconButton>
        <Typography variant="body1" className="text-gray-500">
          Sign in
        </Typography>
      </Stack>
      <Typography variant="h4" className="font-bold">
        Reset password
      </Typography>

      {!hasSent ? (
        <>
          <form>
            <Stack spacing={3} className="py-4">
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email address"
                    type="email"
                    size="small"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  ></TextField>
                )}
              />
              {errors.root && (
                <Alert severity="error">{errors.root.message}</Alert>
              )}
            </Stack>
          </form>
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            disabled={isPending}
          >
            Send recovery link
          </Button>
        </>
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
