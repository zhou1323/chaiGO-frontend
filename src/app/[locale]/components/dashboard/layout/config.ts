import { paths } from '@/paths';
import {
  Assessment,
  Leaderboard,
  LocalOffer,
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
    label: 'overview.title',
    path: paths.dashboard.overview,
    icon: Assessment,
  },
  {
    key: 'offers',
    label: 'offers.title',
    path: paths.dashboard.offers,
    icon: LocalOffer,
  },
  {
    key: 'budgets',
    label: 'budgets.title',
    path: paths.dashboard.budgets,
    icon: Leaderboard,
  },
  {
    key: 'receipts',
    label: 'receipts.title',
    path: paths.dashboard.receipts,
    icon: Receipt,
  },
  {
    key: 'settings',
    label: 'settings.title',
    path: paths.dashboard.settings,
    icon: Settings,
  },
];
