import {
  CheckCircleOutline,
  HighlightOffOutlined,
  PendingOutlined,
  ScheduleOutlined,
} from '@mui/icons-material';
export const categories = [
  {
    label: 'Groceries',
    value: 'groceries',
  },
  {
    label: 'Transport',
    value: 'transport',
  },
  {
    label: 'Entertainment',
    value: 'entertainment',
  },
  {
    label: 'Health',
    value: 'health',
  },
  {
    label: 'Clothing',
    value: 'clothing',
  },
  {
    label: 'Education',
    value: 'education',
  },
  {
    label: 'Other',
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
    label: 'Date',
    align: 'left',
    sorting: true,
  },
  {
    key: 'description',
    label: 'Description',
    align: 'left',
  },
  {
    key: 'category',
    label: 'Category',
    align: 'center',
  },
  {
    key: 'amount',
    label: 'Amount',
    align: 'left',
    sorting: true,
  },
  {
    key: 'notes',
    label: 'Notes',
    align: 'left',
  },
  {
    key: 'status',
    label: 'Status',
    align: 'center',
  },
  {
    key: 'actions',
    label: 'Actions',
    align: 'center',
  },
];

export const receiptsTaskStatuses = {
  PENDING: {
    label: 'Pending',
    color: 'warning',
    icon: PendingOutlined,
  },
  STARTED: {
    label: 'Started',
    color: 'primary',
    icon: ScheduleOutlined,
  },
  RETRY: {
    label: 'Retry',
    color: 'warning',
    icon: ScheduleOutlined,
  },
  FAILURE: {
    label: 'Failure',
    color: 'error',
    icon: HighlightOffOutlined,
  },
  SUCCESS: {
    label: 'Success',
    color: 'success',
    icon: CheckCircleOutline,
  },
};
