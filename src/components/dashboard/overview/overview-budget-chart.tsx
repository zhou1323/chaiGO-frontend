import { getBudgetsOverview } from '@/lib/dashboard/budgetClient';
import { paths } from '@/paths';
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

const OverviewBudgetChart = React.forwardRef<BudgetsOverviewRef>(
  function OverviewBudgetChart(props, ref) {
    const [budgets, setBudgets] = React.useState<BudgetsOverview[]>([]);
    const getBudgetsOverviewData = async () => {
      try {
        const { data, message } = await getBudgetsOverview();
        if (message) {
          throw new Error(message);
        }
        console.log(data, 123);
        if (data) {
          setBudgets(data);
        }
      } catch (error: any) {
        console.log(error.response?.data.detail || error.message);
      }
    };

    React.useEffect(() => {
      getBudgetsOverviewData();
    }, []);

    React.useImperativeHandle(ref, () => ({
      refresh: getBudgetsOverviewData,
    }));

    const router = useRouter();

    return (
      <Card className="w-full">
        <CardHeader title="Analysis" />
        <Divider />
        <CardContent>
          <ResponsiveChartContainer
            xAxis={[
              {
                scaleType: 'band',
                data: monthsAxis.map((month) => month.label),
                id: 'month',
                label: 'Month',
              },
            ]}
            yAxis={[{ id: 'money' }]}
            series={[
              {
                type: 'bar',
                label: 'budget',
                id: 'budget',
                yAxisId: 'money',
                data: budgets.map((item) => item.currentYear.budget),
              },
              {
                type: 'line',
                label: 'expenses(last year)',
                id: 'lastYear',
                yAxisId: 'money',
                data: budgets.map((item) =>
                  item.lastYear
                    ? item.lastYear.recordedExpense + item.lastYear.otherExpense
                    : 0
                ),
              },
              {
                type: 'line',
                id: 'thisYear',
                label: 'expenses(this year)',
                yAxisId: 'money',
                data: budgets.map((item) =>
                  item.currentYear
                    ? item.currentYear.recordedExpense +
                      item.currentYear.otherExpense
                    : 0
                ),
              },
            ]}
            height={400}
            margin={{ left: 70, right: 70 }}
            sx={{
              [`.${axisClasses.left} .${axisClasses.label}`]: {
                transform: 'translate(-25px, 0)',
              },
            }}
          >
            <BarPlot />
            <LinePlot />
            <ChartsXAxis axisId="month" label="Month" />
            <ChartsYAxis axisId="money" label="Money" />
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
            onClick={() => router.push(paths.dashboard.budgets)}
          >
            View all
          </Button>
        </CardActions>
      </Card>
    );
  }
);

export default OverviewBudgetChart;
