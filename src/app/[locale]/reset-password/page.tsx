'use client';
import { useTranslation } from '@/app/i18n/client';
import { Namespaces } from '@/app/i18n/settings';
import { resetPassword } from '@/lib/auth/client';
import { getLocalizedPath, paths } from '@/paths';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Box,
  Button,
  FormControl,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

const createSchema = (t: (key: string) => string) =>
  zod.object({
    password: zod.string().min(8, { message: t('passwordMinLength') }),
  });

const defaultValues = { password: '' } as const;

export default function ResetPasswordPage({
  params: { locale },
}: {
  params: { locale: string };
}): React.ReactNode {
  const { t } = useTranslation(locale, Namespaces.resetPassword);
  const schema = React.useMemo(() => createSchema(t), [t]);
  type Values = zod.infer<typeof schema>;

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
        message: t('passwordsDoNotMatch'),
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
        <Typography variant="h4">{t('resetPassword')}</Typography>

        {!hasSent ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <Controller
                control={control}
                name="password"
                render={({ field }) => (
                  <FormControl error={Boolean(errors.password)}>
                    <TextField
                      {...field}
                      label={t('newPassword')}
                      type="password"
                      error={!!errors.password}
                      helperText={errors.password?.message}
                    />
                  </FormControl>
                )}
              />
              <FormControl>
                <TextField
                  label={t('confirmPassword')}
                  type="password"
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                />
              </FormControl>

              {errors.root && (
                <Alert severity="error">{errors.root.message}</Alert>
              )}
              <Button type="submit" variant="contained" disabled={isPending}>
                {t('resetPassword')}
              </Button>
            </Stack>
          </form>
        ) : (
          <Stack spacing={2}>
            <Typography variant="body1">
              {t('successfullyResetPassword')}
            </Typography>
            <Button
              variant="contained"
              onClick={() =>
                router.push(getLocalizedPath(paths.auth.signIn, locale))
              }
            >
              {t('returnToSignIn')}
            </Button>
          </Stack>
        )}
      </Stack>
    </Box>
  );
}
