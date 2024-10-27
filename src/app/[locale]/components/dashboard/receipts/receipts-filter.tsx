import { useTranslation } from '@/app/i18n/client';
import { Namespaces } from '@/app/i18n/settings';
import { ReceiptFilterParams } from '@/types/receipt';
import { Delete, Search } from '@mui/icons-material';
import {
  Button,
  Card,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { categories } from './config';

export default function ReceiptsFilter({
  doFilter,
  filterProps,
  deletionProps,
  locale,
}: {
  doFilter: () => void;
  filterProps: {
    filter: ReceiptFilterParams;
    setFilter: (filter: ReceiptFilterParams) => void;
  };
  deletionProps: {
    selected: Set<string>;
    handleDeleteReceipt: (ids: string[]) => void;
  };
  locale: string;
}): React.JSX.Element {
  const { t } = useTranslation(locale, Namespaces.dashboard);

  const clearFilters = () => {
    filterProps.setFilter({});
  };

  return (
    <Card className="rounded-lg p-4 shadow">
      <Stack direction="row" spacing={1}>
        <FormControl size="small">
          <InputLabel>{t('receipts.searchDescription')}</InputLabel>
          <OutlinedInput
            label={t('receipts.searchDescription')}
            inputProps={{ maxLength: 20 }}
            value={filterProps.filter.description || ''}
            onChange={(e) =>
              filterProps.setFilter({
                ...filterProps.filter,
                description: e.target.value,
              })
            }
            startAdornment={
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            }
          />
        </FormControl>
        <FormControl className="w-44" size="small">
          <InputLabel>{t('common.category')}</InputLabel>
          <Select
            label={t('common.category')}
            value={filterProps.filter.category || ''}
            variant="outlined"
            onChange={(e) =>
              filterProps.setFilter({
                ...filterProps.filter,
                category: e.target.value,
              })
            }
          >
            <MenuItem value="">
              <em>{t('common.all')}</em>
            </MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.value} value={category.value}>
                {t(category.label)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            slotProps={{
              textField: { size: 'small' },
            }}
            className="w-44"
            label={t('common.startDate')}
            value={
              filterProps.filter.startDate
                ? dayjs(filterProps.filter.startDate)
                : null
            }
            onChange={(newValue) =>
              filterProps.setFilter({
                ...filterProps.filter,
                startDate: newValue?.format('YYYY-MM-DD') || '',
              })
            }
          />

          <DatePicker
            slotProps={{
              textField: { size: 'small' },
            }}
            label={t('common.endDate')}
            className="w-44"
            value={
              filterProps.filter.endDate
                ? dayjs(filterProps.filter.endDate)
                : null
            }
            onChange={(newValue) =>
              filterProps.setFilter({
                ...filterProps.filter,
                endDate: newValue?.format('YYYY-MM-DD') || '',
              })
            }
          />
        </LocalizationProvider>
        <Button
          variant="contained"
          color="primary"
          onClick={clearFilters}
          className="w-20"
        >
          {t('common.reset')}
        </Button>
        <Button
          variant="contained"
          color="primary"
          className="mr-3 w-20"
          onClick={doFilter}
        >
          {t('common.search')}
        </Button>

        <Button
          variant="contained"
          color="error"
          className="ml-auto"
          onClick={() => {
            deletionProps.handleDeleteReceipt(
              Array.from(deletionProps.selected)
            );
          }}
        >
          <Delete />
        </Button>
      </Stack>
    </Card>
  );
}
