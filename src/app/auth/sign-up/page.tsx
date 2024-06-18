'use client';
import { paths } from '@/paths';
import useUserStore from '@/store/user';
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
import Link from '@mui/material/Link';
import RouterLink from 'next/link';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

const schema = zod.object({
  email: zod.string().min(1, { message: 'Email is required' }).email(),
  password: zod
    .string()
    .min(6, { message: 'Password should be at least 6 characters' }),
  userName: zod.string().min(1, { message: 'Username is required' }),
});

type Values = zod.infer<typeof schema>;

const defaultValues = {
  userName: '',
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

  const onSubmit = async (values: Values) => {
    const { user, message } = await signUp(values);
    if (message) {
      setError('root', { type: 'server', message: message });
      setIsPending(false);
      return;
    }
    setIsPending(false);
  };

  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography variant="h4">Sign up</Typography>
        <Typography variant="body2" color="text.secondary">
          Already have an account?&nbsp;
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

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            name="userName"
            control={control}
            render={({ field }) => (
              <FormControl error={Boolean(errors.userName)}>
                <InputLabel>Username</InputLabel>
                <OutlinedInput {...field} label="Username" />
                {errors.userName && (
                  <FormHelperText>{errors.userName.message}</FormHelperText>
                )}
              </FormControl>
            )}
          ></Controller>

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <FormControl error={Boolean(errors.email)}>
                <InputLabel>Email address</InputLabel>
                <OutlinedInput {...field} label="Email address" type="email" />
                {errors.email && (
                  <FormHelperText>{errors.email.message}</FormHelperText>
                )}
              </FormControl>
            )}
          ></Controller>

          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <FormControl error={Boolean(errors.password)}>
                <InputLabel>Password</InputLabel>
                <OutlinedInput {...field} label="Password" type="password" />
                {errors.password && (
                  <FormHelperText>{errors.password.message}</FormHelperText>
                )}
              </FormControl>
            )}
          ></Controller>

          {errors.root && <Alert severity="error">{errors.root.message}</Alert>}

          <Button disabled={isPending} type="submit" variant="contained">
            Sign up
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
