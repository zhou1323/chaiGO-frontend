'use client';
import { getVerificationCode } from '@/lib/auth/client';
import { getLocalizedPath, paths } from '@/paths';
import useUserStore from '@/store/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, Stack, TextField, Typography } from '@mui/material';
import Link from '@mui/material/Link';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

const schema = zod.object({
  email: zod.string().min(1, { message: 'Email is required' }).email(),
  password: zod
    .string()
    .min(8, { message: 'Password should be at least 8 characters' }),
  username: zod.string().min(1, { message: 'Username is required' }),
  verificationCode: zod
    .string()
    .length(6, { message: 'Verification code should be 6 characters' }),
});

type Values = zod.infer<typeof schema>;

const defaultValues = {
  username: '',
  email: '',
  password: '',
  verificationCode: '',
} satisfies Values;

export default function SignUpPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
    getValues,
    clearErrors,
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const [isPending, setIsPending] = React.useState(false);

  const signUp = useUserStore((state) => state.signUp);
  const [isRequestingVerificationCode, setIsRequestingVerificationCode] =
    React.useState(false);
  const [countdown, setCountdown] = React.useState(60);

  const handleSendVerificationCode = async () => {
    try {
      const email = getValues('email');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('email', { message: 'Invalid email' });
        return;
      }

      setIsRequestingVerificationCode(true);
      const { message } = await getVerificationCode({ email });
      if (message) {
        throw new Error(message);
      }
    } catch (error: any) {
      setError('root', {
        type: 'server',
        message: error.response?.data.detail || error.message,
      });
    } finally {
      setTimeout(() => {
        setIsRequestingVerificationCode(false);
        setCountdown(60);
      }, 60000);
    }
  };

  React.useEffect(() => {
    if (isRequestingVerificationCode) {
      const interval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isRequestingVerificationCode]);

  const router = useRouter();
  const onSubmit = async (values: Values) => {
    setIsPending(true);
    try {
      const { message } = await signUp(values);

      if (message) {
        throw new Error(message);
      } else {
        router.push(getLocalizedPath(paths.auth.signIn, locale));
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
      <Stack spacing={1}>
        <Typography variant="h4" className="font-bold">
          Sign up
        </Typography>
        <Typography variant="body2" className="text-gray-500">
          Already have an account?{' '}
          <Link
            component={RouterLink}
            href={getLocalizedPath(paths.auth.signIn, locale)}
            variant="subtitle2"
            underline="hover"
          >
            Sign in
          </Link>
        </Typography>
      </Stack>

      <form>
        <Stack spacing={3} className="py-4">
          <Controller
            name="username"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                size="small"
                label="Username"
                error={!!errors.username}
                helperText={errors.username?.message}
              ></TextField>
            )}
          ></Controller>

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                size="small"
                label="Email address"
                type="email"
                error={!!errors.email}
                helperText={errors.email?.message}
                onChange={(e) => {
                  field.onChange(e);
                  clearErrors('email');
                }}
              ></TextField>
            )}
          ></Controller>

          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                size="small"
                label="Password"
                type="password"
                error={!!errors.password}
                helperText={errors.password?.message}
                onKeyUp={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit(onSubmit)();
                  }
                }}
              ></TextField>
            )}
          ></Controller>

          <Stack spacing={1} direction="row" className="">
            <Controller
              name="verificationCode"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="flex-1"
                  size="small"
                  label="Verification code"
                  error={!!errors.verificationCode}
                  helperText={errors.verificationCode?.message}
                ></TextField>
              )}
            ></Controller>
            {/* Button used to send verification code */}
            <Button
              variant="outlined"
              className="h-10"
              disabled={isRequestingVerificationCode}
              onClick={handleSendVerificationCode}
            >
              {isRequestingVerificationCode
                ? `Request (${countdown})`
                : 'Request'}
            </Button>
          </Stack>
          {errors.root && <Alert severity="error">{errors.root.message}</Alert>}
        </Stack>
      </form>
      <Button
        disabled={isPending}
        variant="contained"
        onClick={handleSubmit(onSubmit)}
      >
        Sign up
      </Button>
    </Stack>
  );
}
