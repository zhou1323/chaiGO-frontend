'use client';
import { useTranslation } from '@/app/i18n/client';
import { Namespaces } from '@/app/i18n/settings';
import { recoverPassword } from '@/lib/auth/client';
import { getLocalizedPath, paths } from '@/paths';
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

const createSchema = (t: (key: string) => string) =>
  zod.object({
    email: zod
      .string()
      .min(1, { message: t('common.emailRequired') })
      .email({ message: t('common.invalidEmail') }),
  });

const defaultValues = { email: '' } as const;

export default function ForgotPasswordPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const { t } = useTranslation(locale, Namespaces.auth);
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
          onClick={() =>
            router.push(getLocalizedPath(paths.auth.signIn, locale))
          }
          className="p-0"
        >
          <ArrowBack />
        </IconButton>
        <Typography variant="body1" className="text-gray-500">
          {t('signIn.title')}
        </Typography>
      </Stack>
      <Typography variant="h4" className="font-bold">
        {t('forgotPassword.title')}
      </Typography>

      {!hasSent ? (
        <>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(onSubmit)();
            }}
          >
            <Stack spacing={3} className="py-4">
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('common.email')}
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
            {t('forgotPassword.sendRecoveryLink')}
          </Button>
        </>
      ) : (
        <Typography variant="body1">{t('forgotPassword.emailSent')}</Typography>
      )}
    </Stack>
  );
}
