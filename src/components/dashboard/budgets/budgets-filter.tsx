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
}

export default function BudgetsFilter({
  doFilter,
  filterProps,
}: BudgetsFilterProps): React.JSX.Element {
  const clearFilters = () => {
    filterProps.setFilter({});
  };

  return (
    <Card>
      <Stack direction="row" spacing={1} className="p-3">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            slotProps={{
              textField: { size: 'small' },
            }}
            className="w-48"
            label="Start date"
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
            label="End date"
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

        <Button variant="contained" color="primary" onClick={clearFilters}>
          Reset
        </Button>
        <Button
          variant="contained"
          color="primary"
          className="mr-3"
          onClick={doFilter}
        >
          Search
        </Button>
      </Stack>
    </Card>
  );
}
