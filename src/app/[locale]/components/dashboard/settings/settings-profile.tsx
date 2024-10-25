import { useTranslation } from '@/app/i18n/client';
import { Namespaces } from '@/app/i18n/settings';
import { updateUserMe } from '@/lib/dashboard/userClient';
import useUserStore from '@/store/user';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

const createSchema = (t: (key: string) => string) =>
  zod.object({
    username: zod
      .string()
      .min(1, { message: t('settings.usernameMinLength') })
      .max(30, { message: t('settings.usernameMaxLength') }),
    email: zod.string().email({ message: t('settings.invalidEmail') }),
  });

export default function SettingsProfile({ locale }: { locale: string }) {
  const { t } = useTranslation(locale, Namespaces.dashboard);
  const schema = React.useMemo(() => createSchema(t), [t]);
  type Values = zod.infer<typeof schema>;

  const [toSet, setToSet] = React.useState(false);

  const user = useUserStore((state) => state.user);
  const updateUser = useUserStore((state) => state.updateUser);

  const defaultValues: Values = {
    username: user?.username || '',
    email: user?.email || '',
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Values>({
    defaultValues,
    values: { username: user?.username || '', email: user?.email || '' },
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: Values) => {
    try {
      const { message, data } = await updateUserMe(values);
      if (message) {
        throw new Error(message);
      }
      data && updateUser(data);
      setToSet(false);
    } catch (error: any) {
      console.log(error.response?.data.detail || error.message);
    }
  };

  const onCancel = () => {
    setToSet(false);
    reset({ ...defaultValues });
  };

  return (
    <Card className="w-1/2">
      <CardHeader title={t('settings.userInfoHeader')} />
      <Divider />
      <CardContent>
        <form>
          <Stack spacing={2}>
            <Box>
              <Typography className="font-bold">
                {t('settings.username')}
              </Typography>
              <Controller
                control={control}
                name="username"
                render={({ field }) =>
                  toSet ? (
                    <TextField
                      {...field}
                      hiddenLabel
                      className="w-72"
                      size="small"
                      variant="outlined"
                      error={!!errors.username}
                      helperText={errors.username?.message}
                    />
                  ) : (
                    <>
                      <Typography className="h-10 leading-10">
                        {user?.username}
                      </Typography>
                    </>
                  )
                }
              />
            </Box>
            <Box>
              <Typography className="font-bold">
                {t('settings.email')}
              </Typography>
              <Controller
                control={control}
                name="email"
                render={({ field }) =>
                  toSet ? (
                    <TextField
                      {...field}
                      hiddenLabel
                      className="w-72"
                      size="small"
                      variant="outlined"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  ) : (
                    <>
                      <Typography className="h-10 leading-10">
                        {user?.email}
                      </Typography>
                    </>
                  )
                }
              />
            </Box>
          </Stack>
        </form>
      </CardContent>
      <Divider />
      <CardActions className="justify-end px-4 py-2">
        {toSet ? (
          <Stack direction="row" spacing={2}>
            <Button
              className="w-20"
              type="button"
              size="small"
              variant="outlined"
              onClick={onCancel}
            >
              {t('common.cancel')}
            </Button>
            <Button
              variant="contained"
              className="w-20"
              size="small"
              onClick={handleSubmit(onSubmit)}
            >
              {t('common.save')}
            </Button>
          </Stack>
        ) : (
          <Button
            className="inline w-20"
            variant="contained"
            size="small"
            onClick={() => setToSet(true)}
          >
            {t('common.edit')}
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
