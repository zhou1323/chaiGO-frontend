'use client';
import { useTranslation } from '@/app/i18n/client';
import { Namespaces } from '@/app/i18n/settings';
import { getBudgetsOverview } from '@/lib/dashboard/budgetClient';
import { getLocalizedPath, paths } from '@/paths';
import { BudgetsOverview } from '@/types/budgets';
import { ArrowRight } from '@mui/icons-material';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
} from '@mui/material';
import {
  ChartsAxisHighlight,
  ChartsLegend,
  ChartsTooltip,
} from '@mui/x-charts';
import { BarPlot } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { LineHighlightPlot, LinePlot, MarkPlot } from '@mui/x-charts/LineChart';
import { ResponsiveChartContainer } from '@mui/x-charts/ResponsiveChartContainer';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { monthsAxis } from './config';
export interface BudgetsOverviewRef {
  refresh: () => void;
}

const OverviewBudgetChart = React.forwardRef<
  BudgetsOverviewRef,
  { locale: string }
>(function OverviewBudgetChart({ locale }, ref) {
  const { t } = useTranslation(locale, Namespaces.dashboard);
  const [budgets, setBudgets] = React.useState<BudgetsOverview[]>([]);
  const getBudgetsOverviewData = async () => {
    try {
      const { data, message } = await getBudgetsOverview();
      if (message) {
        throw new Error(message);
      }
      if (data) {
        setBudgets(data);
      }
    } catch (error: any) {
      console.log(error.response?.data.detail || error.message);
    }
  };

  const paddedBudgets = React.useMemo(() => {
    if (budgets.length === 0) {
      return [];
    }
    const paddedBudgets = [];
    for (let i = 1; i <= 12; i++) {
      const defaultBudget = {
        month: i,
      };
      const recordedBudget = budgets.find((budget) => budget.month === i);
      paddedBudgets.push({ ...defaultBudget, ...recordedBudget });
    }
    return paddedBudgets;
  }, [budgets]);

  React.useEffect(() => {
    getBudgetsOverviewData();
  }, []);

  React.useImperativeHandle(ref, () => ({
    refresh: getBudgetsOverviewData,
  }));

  const router = useRouter();

  return (
    <Card className="flex h-full w-2/3 flex-col">
      <CardHeader title={t('overview.analysis')} />
      <Divider />
      <CardContent className="flex-1">
        <ResponsiveChartContainer
          xAxis={[
            {
              scaleType: 'band',
              data: monthsAxis.map((month) => month.label),
              id: 'month',
              label: t('common.months'),
            },
          ]}
          yAxis={[{ id: 'money' }]}
          series={[
            {
              type: 'bar',
              label: t('common.budget'),
              id: 'budget',
              yAxisId: 'money',
              data: paddedBudgets.map((item) => item.currentYear?.budget || 0),
            },
            {
              type: 'line',
              label: t('overview.expensesLastYear'),
              id: 'lastYear',
              yAxisId: 'money',
              data: paddedBudgets.map((item) =>
                item.lastYear
                  ? item.lastYear.recordedExpense + item.lastYear.otherExpense
                  : 0
              ),
            },
            {
              type: 'line',
              id: 'thisYear',
              label: t('overview.expensesThisYear'),
              yAxisId: 'money',
              data: paddedBudgets.map((item) =>
                item.currentYear
                  ? item.currentYear.recordedExpense +
                    item.currentYear.otherExpense
                  : 0
              ),
            },
          ]}
          height={425}
          margin={{ left: 70, right: 70 }}
          sx={{
            [`.${axisClasses.left} .${axisClasses.label}`]: {
              transform: 'translate(-25px, 0)',
            },
          }}
        >
          <BarPlot />
          <LinePlot />
          <ChartsXAxis axisId="month" label={t('common.months')} />
          <ChartsYAxis axisId="money" label={t('common.money')} />
          <ChartsLegend />
          {/* Circles show each data point */}
          <MarkPlot />
          {/* Highlight the circles */}
          <LineHighlightPlot />
          {/* Highlight the area */}
          <ChartsAxisHighlight x="band" />
          <ChartsTooltip trigger="axis" />
        </ResponsiveChartContainer>
      </CardContent>
      <Divider />
      <CardActions className="justify-end px-4 py-2">
        <Button
          size="small"
          endIcon={<ArrowRight></ArrowRight>}
          onClick={() =>
            router.push(getLocalizedPath(paths.dashboard.budgets, locale))
          }
        >
          {t('common.viewAll')}
        </Button>
      </CardActions>
    </Card>
  );
});

export default OverviewBudgetChart;
