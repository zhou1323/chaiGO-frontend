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
import { usePathname, useRouter } from 'next/navigation';
import { navItems } from './config';
const renderNavItems = (items: any) => {
  const children = items.map((item: any) => {
    return <NavItem key={item.key} {...item}></NavItem>;
  });
  return <List>{children}</List>;
};

const NavItem = ({ path, icon, label }: any) => {
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

export default function SideNav({ open, onClose }: any) {
  return (
    <Box>
      <Drawer
        variant="persistent"
        open={open}
        className="hidden lg:block"
        PaperProps={{ className: 'w-60' }}
      >
        <Stack>
          <Box className="min-h-16">
            <Box
              component="img"
              alt="logo"
              className="h-16"
              src="/assets/image.png"
            ></Box>
          </Box>
          <Box component="nav">{renderNavItems(navItems)}</Box>
        </Stack>
      </Drawer>
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        className="block lg:hidden"
        PaperProps={{ className: 'w-60' }}
      >
        <Stack>
          <Box component="nav">{renderNavItems(navItems)}</Box>
        </Stack>
      </Drawer>
    </Box>
  );
}
