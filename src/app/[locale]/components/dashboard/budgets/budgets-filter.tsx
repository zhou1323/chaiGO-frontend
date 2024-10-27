import { useTranslation } from '@/app/i18n/client';
import { Namespaces } from '@/app/i18n/settings';
import { ReceiptFilterParams } from '@/types/receipt';
import { Button, Card, Stack } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

interface BudgetsFilterProps {
  doFilter: () => void;
  filterProps: {
    filter: ReceiptFilterParams;
    setFilter: (filter: ReceiptFilterParams) => void;
  };
  locale: string;
}

export default function BudgetsFilter({
  doFilter,
  filterProps,
  locale,
}: BudgetsFilterProps): React.JSX.Element {
  const { t } = useTranslation(locale, Namespaces.dashboard);
  const clearFilters = () => {
    filterProps.setFilter({});
  };

  return (
    <Card className="rounded-lg p-4 shadow">
      <Stack direction="row" spacing={1}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            slotProps={{
              textField: { size: 'small' },
            }}
            className="w-48"
            label={t('common.startDate')}
            views={['month', 'year']}
            value={
              filterProps.filter.startDate
                ? dayjs(filterProps.filter.startDate)
                : null
            }
            onChange={(newValue) =>
              filterProps.setFilter({
                ...filterProps.filter,
                startDate: newValue?.format('YYYY-MM') || '',
              })
            }
          />

          <DatePicker
            slotProps={{
              textField: { size: 'small' },
            }}
            label={t('common.endDate')}
            className="w-48"
            views={['month', 'year']}
            value={
              filterProps.filter.endDate
                ? dayjs(filterProps.filter.endDate)
                : null
            }
            onChange={(newValue) =>
              filterProps.setFilter({
                ...filterProps.filter,
                endDate: newValue?.format('YYYY-MM') || '',
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
      </Stack>
    </Card>
  );
}
