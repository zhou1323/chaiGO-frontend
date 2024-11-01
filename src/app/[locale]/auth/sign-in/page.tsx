'use client';

import { useTranslation } from '@/app/i18n/client';
import { languages, Namespaces } from '@/app/i18n/settings';
import { usePopover } from '@/hooks/use-popover';
import { getCaptcha } from '@/lib/auth/client';
import { getLocalizedPath, paths } from '@/paths';
import useUserStore from '@/store/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { Translate } from '@mui/icons-material';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import {
  Alert,
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  ListItemIcon,
  MenuItem,
  MenuList,
  OutlinedInput,
  Popover,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import Link from '@mui/material/Link';
import Image from 'next/image';
import RouterLink from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

const createSchema = (t: (key: string) => string) =>
  zod.object({
    email: zod
      .string()
      .min(1, { message: t('common.emailRequired') })
      .email({ message: t('common.invalidEmail') }),
    password: zod.string().min(1, { message: t('common.passwordRequired') }),
    captcha: zod.string().min(1, { message: t('common.captchaRequired') }),
  });

const defaultValues = {
  email: 'test@chaigo.com',
  password: 'password',
  captcha: '',
} as const;

export default function SignInPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const { t } = useTranslation(locale, Namespaces.auth);
  const schema = React.useMemo(() => createSchema(t), [t]);
  type Values = zod.infer<typeof schema>;

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

  const fetchCaptcha = React.useCallback(async () => {
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
  }, [setError, setIsPending]);

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
      router.push(getLocalizedPath(paths.dashboard.overview, locale));
    }

    setIsPending(false);
  };

  const pathname = usePathname();
  const languagePopover = usePopover<HTMLDivElement>();
  const getNewUrl = React.useMemo(() => {
    return (lang: string) => pathname.replace(locale, lang);
  }, [pathname, locale]);
  const LanguageMenu = ({
    anchorRef,
    open,
    handleClose,
    t,
    getNewUrl,
  }: {
    anchorRef: React.MutableRefObject<HTMLElement | null>;
    open: boolean;
    handleClose: () => void;
    t: any;
    getNewUrl: (lang: string) => string;
  }) => {
    return (
      <Popover
        anchorEl={anchorRef.current}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        slotProps={{ paper: { className: 'w-36' } }}
      >
        <MenuList>
          {languages.map((lang, index) => {
            const newUrl = getNewUrl(lang);
            return (
              <MenuItem key={lang} component={RouterLink} href={newUrl}>
                <ListItemIcon>{t(`common.languages.${lang}`)}</ListItemIcon>
              </MenuItem>
            );
          })}
        </MenuList>
      </Popover>
    );
  };

  React.useEffect(() => {
    if (enableCaptcha) {
      fetchCaptcha();
    } else {
      setValue('captcha', 'captcha');
    }
  }, [enableCaptcha, fetchCaptcha, setValue]);

  return (
    <Stack spacing={1}>
      <Stack spacing={1}>
        <Box className="flex items-center justify-between">
          <Typography variant="h4" className="font-bold">
            {t('signIn.welcome')}
          </Typography>
          <Box>
            <Link
              href="https://github.com/zhou1323/chaiGO"
              target="_blank"
              component={RouterLink}
            >
              <IconButton>
                <Image
                  src="/assets/github-mark.svg"
                  alt="github"
                  width={24}
                  height={24}
                />
              </IconButton>
            </Link>
            <Tooltip
              title=""
              ref={languagePopover.anchorRef}
              onClick={languagePopover.handleOpen}
            >
              <IconButton>
                <Translate />
              </IconButton>
            </Tooltip>
            <LanguageMenu
              anchorRef={languagePopover.anchorRef}
              open={languagePopover.open}
              handleClose={languagePopover.handleClose}
              t={t}
              getNewUrl={getNewUrl}
            />
          </Box>
        </Box>

        <Typography variant="body2" className="text-gray-500">
          {t('signIn.noAccount')}
          <Link
            component={RouterLink}
            href={getLocalizedPath(paths.auth.signUp, locale)}
            variant="body2"
          >
            {t('signUp.title')}
          </Link>
        </Typography>
      </Stack>

      <form>
        <Stack spacing={2} className="py-4">
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <Box>
                <Typography variant="subtitle1" className="mb-2">
                  {t('common.email')}
                </Typography>
                <TextField
                  {...field}
                  fullWidth
                  hiddenLabel
                  size="small"
                  placeholder={t('common.emailPlaceholder')}
                  type="email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                ></TextField>
              </Box>
            )}
          ></Controller>

          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <Box>
                <Box className="flex justify-between">
                  <Typography variant="subtitle1" className="mb-2">
                    {t('common.password')}
                  </Typography>

                  <Link
                    component={RouterLink}
                    href={getLocalizedPath(paths.auth.forgotPassword, locale)}
                    variant="subtitle2"
                  >
                    {t('common.forgotPassword')}
                  </Link>
                </Box>
                <TextField
                  {...field}
                  fullWidth
                  hiddenLabel
                  size="small"
                  placeholder={t('common.passwordPlaceholder')}
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
              </Box>
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
                  <InputLabel>{t('common.captcha')}</InputLabel>
                  <OutlinedInput
                    {...field}
                    label={t('common.captcha')}
                    type="text"
                  />
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

          {errors.root && <Alert severity="error">{errors.root.message}</Alert>}
        </Stack>
      </form>
      <Button
        disabled={isPending}
        variant="contained"
        color="primary"
        onClick={handleSubmit(onSubmit)}
      >
        {t('signIn.title')}
      </Button>
    </Stack>
  );
}
