import { useTranslation } from '@/app/i18n/client';
import { Namespaces } from '@/app/i18n/settings';
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
  locale,
}: {
  filterProps: OffersFilterProps;
  locale: string;
}): React.ReactNode {
  const { t } = useTranslation(locale, Namespaces.dashboard);
  return (
    <Card className="mb-4 rounded-lg bg-white p-4 shadow">
      <Stack direction="row" spacing={1}>
        <FormControl className="w-44" size="small">
          <InputLabel>Category</InputLabel>
          <Select
            label={t('common.category')}
            variant="outlined"
            value={filterProps.category}
            onChange={(e) => filterProps.setCategory(e.target.value)}
          >
            <MenuItem value="">
              <em>{t('common.all')}</em>
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
          {t('common.clear')}
        </Button>
      </Stack>
    </Card>
  );
}
