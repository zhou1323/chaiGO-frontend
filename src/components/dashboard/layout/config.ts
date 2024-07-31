import { paths } from '@/paths';
import {
  Assessment,
  Leaderboard,
  Receipt,
  Settings,
  SvgIconComponent,
} from '@mui/icons-material';

export interface NavItemProps {
  key: string;
  label: string;
  path: string;
  icon: SvgIconComponent;
}

export const navItems = [
  {
    key: 'overview',
    label: 'Overview',
    path: paths.dashboard.overview,
    icon: Assessment,
  },
  {
    key: 'budgets',
    label: 'Budgets',
    path: paths.dashboard.budgets,
    icon: Leaderboard,
  },
  {
    key: 'receipts',
    label: 'Receipts',
    path: paths.dashboard.receipts,
    icon: Receipt,
  },
  {
    key: 'settings',
    label: 'Settings',
    path: paths.dashboard.settings,
    icon: Settings,
  },
];
