'use client';

import { getCaptcha } from '@/lib/auth/client';
import { paths } from '@/paths';
import useUserStore from '@/store/user';
import { zodResolver } from '@hookform/resolvers/zod';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
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
import Link from '@mui/material/Link';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

const schema = zod.object({
  email: zod.string().min(1, { message: 'Email is required' }).email(),
  password: zod.string().min(1, { message: 'Password is required' }),
  captcha: zod.string().min(1, { message: 'Captcha is required' }),
});

type Values = zod.infer<typeof schema>;

const defaultValues: Values = {
  email: 'test@chaigo.com',
  password: 'password',
  captcha: '',
};

export default function SignInPage() {
  const {
    control,
    setValue,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const signIn = useUserStore((state) => state.signIn);
  const router = useRouter();

  const [isPending, setIsPending] = React.useState(false);
  const [captcha, setCaptcha] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);

  // Set to true to enable captcha
  const enableCaptcha = false;

  const fetchCaptcha = async () => {
    setIsPending(true);
    try {
      const { data, message } = await getCaptcha();

      if (message) {
        setError('root', { type: 'server', message });
        return;
      }

      if (data?.image && data?.imageType === 'base64') {
        const base64Image = `data:image/png;base64,${data.image}`;
        setCaptcha(base64Image);
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

  const onSubmit = async (values: Values) => {
    setIsPending(true);

    const { user, message } = await signIn({
      email: values.email,
      password: values.password,
      captcha: values.captcha,
    });

    if (message) {
      setError('root', { type: 'server', message: message });
    } else {
      router.push(paths.dashboard.overview);
    }

    setIsPending(false);
  };

  React.useEffect(() => {
    if (enableCaptcha) {
      fetchCaptcha();
    } else {
      setValue('captcha', 'captcha');
    }
  }, []);

  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography variant="h4">Sign in</Typography>
        <Typography variant="body2" color="text.secondary">
          Don&apos;t have an account?{' '}
          <Link
            component={RouterLink}
            href={paths.auth.signUp}
            underline="hover"
            variant="subtitle2"
          >
            Sign up
          </Link>
        </Typography>
      </Stack>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <FormControl error={Boolean(errors.email)}>
                <InputLabel>Email address</InputLabel>
                <OutlinedInput {...field} label="Email Address" type="email" />
                {errors.email && (
                  <FormHelperText>{errors.email.message}</FormHelperText>
                )}
              </FormControl>
            )}
          ></Controller>

          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <FormControl error={Boolean(errors.password)}>
                <InputLabel>Password</InputLabel>
                <OutlinedInput
                  {...field}
                  endAdornment={
                    showPassword ? (
                      <VisibilityOutlinedIcon
                        cursor="pointer"
                        onClick={() => {
                          setShowPassword(false);
                        }}
                      />
                    ) : (
                      <VisibilityOffOutlinedIcon
                        cursor="pointer"
                        onClick={() => {
                          setShowPassword(true);
                        }}
                      />
                    )
                  }
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                ></OutlinedInput>
                {errors.password && (
                  <FormHelperText>{errors.password.message}</FormHelperText>
                )}
              </FormControl>
            )}
          ></Controller>

          <Stack
            direction="row"
            spacing={3}
            className={enableCaptcha ? '' : 'hidden'}
          >
            <Controller
              control={control}
              name="captcha"
              render={({ field }) => (
                <FormControl
                  error={Boolean(errors.captcha)}
                  className="flex-auto"
                >
                  <InputLabel>Captcha</InputLabel>
                  <OutlinedInput {...field} label="Captcha" type="text" />
                </FormControl>
              )}
            ></Controller>
            {captcha ? (
              <Box
                component="img"
                className="w-28"
                src={captcha}
                onClick={fetchCaptcha}
              ></Box>
            ) : (
              <Box className="w-28"></Box>
            )}
          </Stack>

          <Box>
            <Link
              component={RouterLink}
              href={paths.auth.forgotPassword}
              variant="subtitle2"
            >
              Forgot password?
            </Link>
          </Box>

          {errors.root && <Alert severity="error">{errors.root.message}</Alert>}

          <Button disabled={isPending} type="submit" variant="contained">
            Sign in
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
