'use client';
import { paths } from '@/paths';
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
});

type Values = zod.infer<typeof schema>;

const defaultValues = {
  username: '',
  email: '',
  password: '',
} satisfies Values;

export default function SignUpPage() {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const [isPending, setIsPending] = React.useState(false);

  const signUp = useUserStore((state) => state.signUp);

  const router = useRouter();
  const onSubmit = async (values: Values) => {
    setIsPending(true);

    const { message } = await signUp(values);

    if (message) {
      setError('root', { type: 'server', message: message });
    } else {
      router.push(paths.auth.signIn);
    }
    setIsPending(false);
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
            href={paths.auth.signIn}
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
              ></TextField>
            )}
          ></Controller>

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
