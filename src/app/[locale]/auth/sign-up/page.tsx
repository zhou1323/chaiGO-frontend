'use client';
import { useTranslation } from '@/app/i18n/client';
import { Namespaces } from '@/app/i18n/settings';
import { getVerificationCode } from '@/lib/auth/client';
import { getLocalizedPath, paths } from '@/paths';
import useUserStore from '@/store/user';
import { zodResolver } from '@hookform/resolvers/zod';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Alert, Button, Stack, TextField, Typography } from '@mui/material';
import Link from '@mui/material/Link';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
const createSchema = (t: (key: string) => string) =>
  zod.object({
    email: zod
      .string()
      .min(1, { message: t('common.emailRequired') })
      .email({ message: t('common.invalidEmail') }),
    password: zod.string().min(8, { message: t('common.passwordMinLength') }),
    username: zod.string().min(1, { message: t('common.usernameRequired') }),
    verificationCode: zod
      .string()
      .length(6, { message: t('common.verificationCodeLength') }),
  });

const defaultValues = {
  username: '',
  email: '',
  password: '',
  verificationCode: '',
} as const;

export default function SignUpPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const { t } = useTranslation(locale, Namespaces.auth);
  const schema = React.useMemo(() => createSchema(t), [t]);
  type Values = zod.infer<typeof schema>;

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
    getValues,
    clearErrors,
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const [isPending, setIsPending] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const signUp = useUserStore((state) => state.signUp);
  const [isRequestingVerificationCode, setIsRequestingVerificationCode] =
    React.useState(false);
  const [countdown, setCountdown] = React.useState(60);

  const handleSendVerificationCode = async () => {
    try {
      const email = getValues('email');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('email', { message: `${t('common.invalidEmail')}` });
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
          {t('signUp.title')}
        </Typography>
        <Typography variant="body2" className="text-gray-500">
          {t('signUp.alreadyHaveAnAccount')}
          <Link
            component={RouterLink}
            href={getLocalizedPath(paths.auth.signIn, locale)}
            variant="subtitle2"
            underline="hover"
          >
            {t('signIn.title')}
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
                label={t('common.username')}
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
                label={t('common.email')}
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
                label={t('common.password')}
                type={showPassword ? 'text' : 'password'}
                error={!!errors.password}
                helperText={errors.password?.message}
                onKeyUp={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit(onSubmit)();
                  }
                }}
                InputProps={
                  showPassword
                    ? {
                        endAdornment: (
                          <VisibilityOutlinedIcon
                            cursor="pointer"
                            onClick={() => {
                              setShowPassword(false);
                            }}
                          />
                        ),
                      }
                    : {
                        endAdornment: (
                          <VisibilityOffOutlinedIcon
                            cursor="pointer"
                            onClick={() => {
                              setShowPassword(true);
                            }}
                          />
                        ),
                      }
                }
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
                  label={t('common.verificationCode')}
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
                ? `${t('common.request')} (${countdown})`
                : t('common.request')}
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
        {t('signUp.title')}
      </Button>
    </Stack>
  );
}
