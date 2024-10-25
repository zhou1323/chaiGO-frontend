'use client';

import BudgetsCurrentMonth from '@/app/[locale]/components/dashboard/budgets/budgets-current-month';
import OffersList from '@/app/[locale]/components/dashboard/offers/offers-list';
import OverviewBudgetChart, {
  BudgetsOverviewRef,
} from '@/app/[locale]/components/dashboard/overview/overview-budget-chart';
import { useTranslation } from '@/app/i18n/client';
import { Namespaces } from '@/app/i18n/settings';
import { Stack, Typography } from '@mui/material';
import * as React from 'react';

export default function Page({
  params: { locale },
}: {
  params: { locale: string };
}): React.ReactNode {
  const { t } = useTranslation(locale, Namespaces.dashboard);

  const overviewBudget = React.useRef<BudgetsOverviewRef>(null);

  const afterUpdateCurrent = () => {
    overviewBudget.current?.refresh();
  };

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={3}>
        <Stack className="flex-auto">
          <Typography variant="h4" className="font-bold">
            {t('overview.title')}
          </Typography>
        </Stack>
      </Stack>

      <BudgetsCurrentMonth
        direction="row"
        onRefresh={afterUpdateCurrent}
        locale={locale}
      ></BudgetsCurrentMonth>

      <Stack direction="row" spacing={2} className="h-[36rem]">
        <OverviewBudgetChart
          ref={overviewBudget}
          locale={locale}
        ></OverviewBudgetChart>
        <OffersList isMinimal locale={locale} />
      </Stack>
    </Stack>
  );
}
