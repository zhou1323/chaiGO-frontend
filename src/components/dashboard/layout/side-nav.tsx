'use client';
import {
  Box,
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
    >
      <ListItemIcon>
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
  return (
    <Box>
      <Drawer
        variant={isPC ? 'persistent' : 'temporary'}
        open={open}
        onClose={onClose}
        PaperProps={{ className: 'w-60' }}
      >
        <Stack>
          <Box className="min-h-16">
            <Box
              component="img"
              alt="logo"
              className="h-16"
              src="/assets/logo.png"
            ></Box>
          </Box>
          <Box component="nav">{renderNavItems(navItems)}</Box>
        </Stack>
      </Drawer>
    </Box>
  );
}
