import ClearIcon from '@mui/icons-material/Clear';
import {
  Button,
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from '@mui/material';
import * as React from 'react';
import { categories } from './config';

export interface OffersFilterProps {
  category: string;
  setCategory: (category: string) => void;
}

export default function OffersFilter({
  filterProps,
}: {
  filterProps: OffersFilterProps;
}): React.ReactNode {
  return (
    <Card className="mb-4 rounded-lg bg-white p-4 shadow">
      <Stack direction="row" spacing={1}>
        <FormControl className="w-44" size="small">
          <InputLabel>Category</InputLabel>
          <Select
            label="Category"
            variant="outlined"
            value={filterProps.category}
            onChange={(e) => filterProps.setCategory(e.target.value)}
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.value} value={category.value}>
                {category.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          className={`${filterProps.category ? 'visible' : 'hidden'}`}
          onClick={() => filterProps.setCategory('')}
        >
          <ClearIcon />
          Clear
        </Button>
      </Stack>
    </Card>
  );
}
