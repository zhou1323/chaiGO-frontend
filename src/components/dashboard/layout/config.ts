import { paths } from '@/paths';
import { Assessment, Settings } from '@mui/icons-material';
export const navItems = [
  {
    key: 'overview',
    label: 'Overview',
    path: paths.dashboard.overview,
    icon: Assessment,
  },
  {
    key: 'settings',
    label: 'Settings',
    path: paths.dashboard.settings,
    icon: Settings,
  },
];
