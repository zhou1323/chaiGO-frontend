'use client';

import OffersCart from '@/components/dashboard/offers/offers-cart';
import OffersList from '@/components/dashboard/offers/offers-list';
import { getBudgetsCurrent } from '@/lib/dashboard/budgetClient';
import { weeksLeftInMonth } from '@/lib/utils';
import { Budget } from '@/types/budgets';
import { Offer } from '@/types/offer';
import { Stack, Typography } from '@mui/material';
import * as React from 'react';

export default function OffersPage(): React.ReactNode {
  const [category, setCategory] = React.useState<string>('');
  const filterProps = {
    category,
    setCategory,
  };
  const [offers, setOffers] = React.useState<{
    [key: string]: { open: boolean; items: (Offer & { checked: boolean })[] };
  }>({});

  const operationProps = {
    offers,
    setOffers,
  };

  // Get current month budget
  const [currentBudget, setCurrentBudget] = React.useState<Budget>();
  const getCurrentBudget = async () => {
    try {
      const { data, message } = await getBudgetsCurrent();

      if (message) {
        throw new Error(message);
      }

      if (data) {
        setCurrentBudget(data);
      }
    } catch (error: any) {
      console.log(error.response?.data.detail || error.message);
    }
  };

  React.useEffect(() => {
    getCurrentBudget();
  }, []);

  const weeklyBudget = React.useMemo(() => {
    if (!currentBudget || currentBudget.surplus < 0) return 0;
    return Math.round(currentBudget.surplus / weeksLeftInMonth());
  }, [currentBudget]);

  return (
    <Stack spacing={2}>
      <Typography variant="h4" className="font-bold">
        Offers
      </Typography>
      <Stack direction="row" spacing={2} className="relative">
        <Stack flex={1}>
          {/* TODO: add filter functionality */}
          {/* <OffersFilter filterProps={filterProps} /> */}
          <OffersList operationProps={operationProps} />
        </Stack>
        <OffersCart
          operationProps={operationProps}
          weeklyBudget={weeklyBudget}
        />
      </Stack>
    </Stack>
  );
}
