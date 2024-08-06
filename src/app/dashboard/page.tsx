'use client';

import BudgetsCurrentMonth from '@/components/dashboard/budgets/budgets-current-month';
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
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack className="flex-auto">
          <Typography variant="h4">Overview</Typography>
        </Stack>
      </Stack>

      <Stack direction="row" spacing={3}>
        <BudgetsCurrentMonth
          direction="column"
          onRefresh={afterUpdateCurrent}
        ></BudgetsCurrentMonth>

        <OverviewBudgetChart ref={overviewBudget}></OverviewBudgetChart>
      </Stack>
    </Stack>
  );
}
