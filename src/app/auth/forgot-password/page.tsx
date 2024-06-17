'use client';
import { resetPassword } from '@/lib/auth/client';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
} from '@mui/material';
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

  const onSubmit = async (values: Values) => {
    setIsPending(true);

    const { message } = await resetPassword(values);

    if (message) {
      setError('root', { type: 'server', message: message });
      setIsPending(false);
      return;
    }

    setIsPending(false);
  };
  return (
    <Stack spacing={4}>
      <Typography variant="h4">Reset password</Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <FormControl error={Boolean(errors.email)}>
                <InputLabel>Email address</InputLabel>
                <OutlinedInput {...field} label="Email address" type="email" />
                {errors.email && (
                  <FormHelperText>{errors.email.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
          {errors.root && <Alert color="error">{errors.root.message}</Alert>}
          <Button type="submit" variant="contained">
            Send recovery link
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
