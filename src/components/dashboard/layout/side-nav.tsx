'use client';
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { NavItemProps, navItems } from './config';

const renderNavItems = (items: NavItemProps[]) => {
  const children = items.map((item: NavItemProps) => {
    // remote the key prop from the item
    const { key, ...rest } = item;
    return <NavItem key={key} {...rest}></NavItem>;
  });
  return <List>{children}</List>;
};

const NavItem = ({ path, icon, label }: NavItemProps) => {
  const pathName = usePathname();
  const Icon = icon;
  const router = useRouter();
  return (
    <ListItemButton
      selected={pathName === path}
      onClick={() => router.replace(path)}
      className="mb-1 h-10 rounded-lg text-gray-300 hover:bg-white/10"
      classes={{ selected: 'bg-white/10 text-emerald-500' }}
    >
      <ListItemIcon
        className={pathName === path ? 'text-emerald-500' : 'text-gray-300'}
      >
        <Icon />
      </ListItemIcon>
      <ListItemText>{label}</ListItemText>
    </ListItemButton>
  );
};

export default function SideNav({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}): React.JSX.Element {
  const theme = useTheme();
  const isPC = useMediaQuery(theme.breakpoints.up('lg'));

  React.useEffect(() => {
    onClose();
  }, [isPC]);

  return (
    <Box>
      <Drawer
        variant={isPC ? 'persistent' : 'temporary'}
        open={open}
        onClose={onClose}
        PaperProps={{ className: 'w-60 py-6 bg-gray-900' }}
        className={
          open
            ? 'ease-[0.4, 0, 0.6, 1] w-60 transition-[width] duration-[195ms]'
            : 'w-0 transition-[width] duration-[225ms] ease-out'
        }
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
      >
        <Stack spacing={3}>
          <Box className="flex justify-center px-4">
            <Box
              component="img"
              alt="logo"
              className="h-10 opacity-80"
              src="/assets/logo.png"
            ></Box>
          </Box>
          <Divider className="bg-gray-800" />
          <Box component="nav" className="px-4">
            {renderNavItems(navItems)}
          </Box>
        </Stack>
      </Drawer>
    </Box>
  );
}
