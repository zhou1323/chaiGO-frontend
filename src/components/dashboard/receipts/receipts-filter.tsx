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
  description,
  category,
  startDate,
  endDate,
  setCategory,
  setDescription,
  setStartDate,
  setEndDate,
  doFilter,
}: {
  description: string;
  category: string;
  startDate: string;
  endDate: string;
  setDescription: (description: string) => void;
  setCategory: (category: string) => void;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  doFilter: () => void;
}): React.JSX.Element {
  const clearFilters = () => {
    setDescription('');
    setCategory('');
    setStartDate('');
    setEndDate('');
  };
  return (
    <Card>
      <Stack direction="row" spacing={1} className="p-3">
        <FormControl size="small">
          <InputLabel>Search description</InputLabel>
          <OutlinedInput
            label="Search description"
            inputProps={{ maxLength: 20 }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            }
          />
        </FormControl>
        <FormControl className="w-44" size="small">
          <InputLabel>Category</InputLabel>
          <Select
            label="Category"
            value={category}
            variant="outlined"
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((category) => (
              <MenuItem key={category.value} value={category.value}>
                {category.label}
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
            label="Start date"
            value={startDate ? dayjs(startDate) : null}
            onChange={(newValue) =>
              setStartDate(newValue?.format('YYYY-MM-DD') || '')
            }
          />

          <DatePicker
            slotProps={{
              textField: { size: 'small' },
            }}
            label="End date"
            className="w-44"
            value={endDate ? dayjs(endDate) : null}
            onChange={(newValue) =>
              setEndDate(newValue?.format('YYYY-MM-DD') || '')
            }
          />
        </LocalizationProvider>
        <Button variant="contained" color="primary" onClick={clearFilters}>
          Reset
        </Button>
        <Button variant="contained" color="primary" onClick={doFilter}>
          Search
        </Button>

        <Button variant="contained" color="error" className="ml-auto">
          <Delete />
        </Button>
      </Stack>
    </Card>
  );
}
