'use client';

import { usePopover } from '@/hooks/use-popover';
import useUserStore from '@/store/user';
import { List, Logout, Person, Settings, Translate } from '@mui/icons-material';

import { useTranslation } from '@/app/i18n/client';
import { languages, Namespaces } from '@/app/i18n/settings';
import { getLocalizedPath, paths } from '@/paths';
import { User } from '@/types/user';
import {
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  MenuItem,
  MenuList,
  Popover,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import RouterLink from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
export default function MainNav({
  handleNavOpen,
  locale,
}: {
  handleNavOpen: () => void;
  locale: string;
}) {
  const userPopover = usePopover<HTMLDivElement>();
  const languagePopover = usePopover<HTMLDivElement>();

  const { t } = useTranslation(locale, Namespaces.dashboard);

  const user = useUserStore((state) => state.user);

  const router = useRouter();

  const handleSignOut = async () => {
    if (!user?.email) return;
    const { message } = await useUserStore
      .getState()
      .signOut({ email: user?.email });

    if (message) {
      return;
    } else {
      router.replace(getLocalizedPath(paths.auth.signIn, locale));
    }
  };

  const pathname = usePathname();

  const getNewUrl = React.useMemo(() => {
    return (lang: string) => pathname.replace(locale, lang);
  }, [pathname, locale]);

  return (
    <Box
      component="header"
      className="sticky top-0 z-10 h-16 bg-white px-6 py-3 shadow"
    >
      <Stack direction="row" className="items-center justify-between">
        <Stack direction="row" spacing={1} className="items-center">
          <IconButton onClick={handleNavOpen}>
            <List />
          </IconButton>
        </Stack>

        <Stack direction="row" spacing={1} className="items-center">
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

          <Tooltip
            title=""
            ref={userPopover.anchorRef}
            onClick={userPopover.handleOpen}
          >
            <IconButton data-testid="user-menu">
              <Person />
            </IconButton>
          </Tooltip>

          <UserMenu
            anchorRef={userPopover.anchorRef}
            open={userPopover.open}
            handleClose={userPopover.handleClose}
            user={user}
            handleSignOut={handleSignOut}
            locale={locale}
          />
        </Stack>
      </Stack>
    </Box>
  );
}

const UserMenu = ({
  anchorRef,
  open,
  handleClose,
  user,
  handleSignOut,
  locale,
}: {
  anchorRef: React.MutableRefObject<HTMLElement | null>;
  open: boolean;
  handleClose: () => void;
  user: User | null;
  handleSignOut: () => void;
  locale: string;
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
      slotProps={{ paper: { className: 'w-60' } }}
    >
      <Box className="px-4 py-5">
        <Typography variant="subtitle1">{user?.username}</Typography>
        <Typography color="text.secondary" variant="body2">
          {user?.email}
        </Typography>
      </Box>
      <Divider />
      <MenuList>
        <MenuItem
          component={RouterLink}
          href={getLocalizedPath(paths.dashboard.settings, locale)}
        >
          <ListItemIcon>
            <Settings className="mr-3" />
            Settings
          </ListItemIcon>
        </MenuItem>
        <MenuItem onClick={handleSignOut}>
          <ListItemIcon>
            <Logout className="mr-3" />
            Sign out
          </ListItemIcon>
        </MenuItem>
      </MenuList>
    </Popover>
  );
};

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
          console.log(newUrl);
          return (
            <MenuItem key={lang} component={RouterLink} href={newUrl}>
              <ListItemIcon>{t(`language.${lang}`)}</ListItemIcon>
            </MenuItem>
          );
        })}
      </MenuList>
    </Popover>
  );
};
