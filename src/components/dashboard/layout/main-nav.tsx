'use client';
import { usePopover } from '@/hooks/use-popover';
import useUserStore from '@/store/user';
import { List, Logout, Person, Settings, Translate } from '@mui/icons-material';

import { paths } from '@/paths';
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
import { useRouter } from 'next/navigation';
export default function MainNav({
  handleNavOpen,
}: {
  handleNavOpen: () => void;
}) {
  const userPopover = usePopover<HTMLDivElement>();

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
      router.replace(paths.auth.signIn);
    }
  };

  return (
    <Box
      component="header"
      className="sticky top-0 z-10 border-x-0 border-b-2 border-t-0 border-solid border-gray-200 bg-white"
    >
      <Stack
        direction="row"
        spacing={2}
        className="min-h-[64px] items-center justify-between px-4"
      >
        <Stack direction="row" spacing={1} className="items-center">
          <IconButton onClick={handleNavOpen}>
            <List />
          </IconButton>
        </Stack>

        <Stack direction="row" spacing={1} className="items-center">
          <Tooltip title="">
            <IconButton>
              <Translate />
            </IconButton>
          </Tooltip>

          <Tooltip
            title=""
            ref={userPopover.anchorRef}
            onClick={userPopover.handleOpen}
          >
            <IconButton>
              <Person />
            </IconButton>
          </Tooltip>

          <Popover
            anchorEl={userPopover.anchorRef.current}
            open={userPopover.open}
            onClose={userPopover.handleClose}
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
              <MenuItem component={RouterLink} href={paths.dashboard.settings}>
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
        </Stack>
      </Stack>
    </Box>
  );
}
