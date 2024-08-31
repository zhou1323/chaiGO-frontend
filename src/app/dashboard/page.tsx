'use client';

import BudgetsCurrentMonth from '@/components/dashboard/budgets/budgets-current-month';
import OffersList from '@/components/dashboard/offers/offers-list';
import OverviewBudgetChart, {
  BudgetsOverviewRef,
} from '@/components/dashboard/overview/overview-budget-chart';
import { Stack, Typography } from '@mui/material';
import * as React from 'react';

export default function Page() {
  const overviewBudget = React.useRef<BudgetsOverviewRef>(null);

  const afterUpdateCurrent = () => {
    overviewBudget.current?.refresh();
  };

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={3}>
        <Stack className="flex-auto">
          <Typography variant="h4" className="font-bold">
            Overview
          </Typography>
        </Stack>
      </Stack>

      <BudgetsCurrentMonth
        direction="row"
        onRefresh={afterUpdateCurrent}
      ></BudgetsCurrentMonth>

      <Stack direction="row" spacing={2} className="h-[36rem]">
        <OverviewBudgetChart ref={overviewBudget}></OverviewBudgetChart>
        <OffersList isMinimal />
      </Stack>
    </Stack>
  );
}
