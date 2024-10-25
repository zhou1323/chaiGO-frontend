import {
  CheckCircleOutline,
  HighlightOffOutlined,
  PendingOutlined,
  ScheduleOutlined,
} from '@mui/icons-material';
export const categories = [
  {
    label: 'receipts.groceries',
    value: 'groceries',
  },
  {
    label: 'receipts.transport',
    value: 'transport',
  },
  {
    label: 'receipts.entertainment',
    value: 'entertainment',
  },
  {
    label: 'receipts.health',
    value: 'health',
  },
  {
    label: 'receipts.clothing',
    value: 'clothing',
  },
  {
    label: 'receipts.education',
    value: 'education',
  },
  {
    label: 'receipts.other',
    value: 'other',
  },
];

export const receiptsTableColumns: {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right' | 'justify' | 'inherit';
  sorting?: boolean;
}[] = [
  {
    key: 'date',
    label: 'common.date',
    align: 'left',
    sorting: true,
  },
  {
    key: 'description',
    label: 'common.description',
    align: 'left',
  },
  {
    key: 'category',
    label: 'common.category',
    align: 'center',
  },
  {
    key: 'amount',
    label: 'common.amount',
    align: 'left',
    sorting: true,
  },
  {
    key: 'notes',
    label: 'common.notes',
    align: 'left',
  },
  {
    key: 'status',
    label: 'common.status',
    align: 'center',
  },
  {
    key: 'actions',
    label: 'common.actions',
    align: 'center',
  },
];

export const receiptsTaskStatuses = {
  PENDING: {
    label: 'common.pending',
    color: 'warning',
    icon: PendingOutlined,
  },
  STARTED: {
    label: 'common.started',
    color: 'primary',
    icon: ScheduleOutlined,
  },
  RETRY: {
    label: 'common.retry',
    color: 'warning',
    icon: ScheduleOutlined,
  },
  FAILURE: {
    label: 'common.failure',
    color: 'error',
    icon: HighlightOffOutlined,
  },
  SUCCESS: {
    label: 'common.success',
    color: 'success',
    icon: CheckCircleOutline,
  },
};
