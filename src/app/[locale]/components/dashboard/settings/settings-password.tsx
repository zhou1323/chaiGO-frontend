import { useTranslation } from '@/app/i18n/client';
import { Namespaces } from '@/app/i18n/settings';
import { updatePasswordMe } from '@/lib/dashboard/userClient';
import { getLocalizedPath, paths } from '@/paths';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

const createSchema = (t: (key: string) => string) => {
  return zod
    .object({
      currentPassword: zod
        .string()
        .min(8, { message: t('settings.passwordMinLength') })
        .max(40, { message: t('settings.passwordMaxLength') }),
      newPassword: zod
        .string()
        .min(8, { message: t('settings.passwordMinLength') })
        .max(40, { message: t('settings.passwordMaxLength') }),
      confirmPassword: zod
        .string()
        .min(8, { message: t('settings.passwordMinLength') })
        .max(40, { message: t('settings.passwordMaxLength') }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      path: ['confirmPassword'],
      message: t('settings.passwordsDoNotMatch'),
    });
};

export default function SettingsPassword({ locale }: { locale: string }) {
  const { t } = useTranslation(locale, Namespaces.dashboard);
  const schema = React.useMemo(() => createSchema(t), [t]);
  type Values = zod.infer<typeof schema>;

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const defaultValues: Values = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const router = useRouter();
  const onSubmit = async (values: Values) => {
    try {
      const { message } = await updatePasswordMe({
        newPassword: values.newPassword,
        currentPassword: values.currentPassword,
      });
      if (message) {
        throw new Error(message);
      }

      setDialogOpen(true);
      setTimeout(() => {
        router.replace(getLocalizedPath(paths.auth.signIn, locale));
      }, 3000);
    } catch (error: any) {
      console.log(error.response?.data.detail || error.message);
    }
  };

  return (
    <Card className="w-1/2">
      <CardHeader title={t('settings.passwordHeader')} />
      <Divider />
      <CardContent>
        <form>
          <Stack spacing={2}>
            <Box>
              <Typography className="font-bold">
                {t('settings.currentPassword')}
              </Typography>
              <Controller
                control={control}
                name="currentPassword"
                render={({ field }) => (
                  <TextField
                    {...field}
                    hiddenLabel
                    className="w-72"
                    size="small"
                    variant="outlined"
                    type="password"
                    error={!!errors.currentPassword}
                    helperText={errors.currentPassword?.message}
                  />
                )}
              />
            </Box>
            <Box>
              <Typography className="font-bold">
                {t('settings.newPassword')}
              </Typography>
              <Controller
                control={control}
                name="newPassword"
                render={({ field }) => (
                  <TextField
                    {...field}
                    hiddenLabel
                    className="w-72"
                    size="small"
                    type="password"
                    variant="outlined"
                    error={!!errors.newPassword}
                    helperText={errors.newPassword?.message}
                  />
                )}
              />
            </Box>
            <Box>
              <Typography className="font-bold">
                {t('settings.confirmPassword')}
              </Typography>
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field }) => (
                  <TextField
                    {...field}
                    hiddenLabel
                    className="w-72"
                    size="small"
                    type="password"
                    variant="outlined"
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                  />
                )}
              />
            </Box>
          </Stack>
        </form>
      </CardContent>
      <Divider />
      <CardActions className="justify-end px-4 py-2">
        <Button
          variant="contained"
          size="small"
          className="w-20"
          onClick={handleSubmit(onSubmit)}
        >
          {t('common.save')}
        </Button>
      </CardActions>

      <Dialog open={dialogOpen}>
        <DialogTitle>{t('settings.passwordUpdated')}</DialogTitle>
        <DialogContent>
          <Stack spacing={5} className="items-center">
            <Typography>{t('settings.successfullyResetPassword')}</Typography>
            <CircularProgress color="inherit" />
          </Stack>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
