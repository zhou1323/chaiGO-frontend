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
    align: 'left',
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
    key: 'actions',
    label: 'Actions',
    align: 'center',
  },
];
