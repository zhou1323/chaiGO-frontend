import { getBudgetsCurrent } from '@/lib/dashboard/budgetClient';
import { weeksLeftInMonth } from '@/lib/utils';
import { Budget } from '@/types/budgets';
import {
  AccountBalanceWallet,
  Savings,
  Settings,
  TrendingUp,
} from '@mui/icons-material';
import {
  Card,
  CardContent,
  IconButton,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import * as React from 'react';
import BudgetsEditDialog from './budgets-edit-dialog';

interface BudgetsCurrentMonthProps {
  direction?: 'row' | 'column';
  onRefresh?: () => void;
}

export interface BudgetsCurrentMonthRef {
  refresh: () => void;
}

const BudgetsCurrentMonth = React.forwardRef<
  BudgetsCurrentMonthRef,
  BudgetsCurrentMonthProps
>(function BudgetsCurrentMonth(props, ref) {
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

  // Dialog
  const [openDialog, setOpenDialog] = React.useState(false);
  const handleDialog = (refresh = false) => {
    setOpenDialog(!openDialog);
    if (refresh) {
      getCurrentBudget();
      props.onRefresh?.();
    }
  };

  React.useImperativeHandle(ref, () => ({
    refresh: getCurrentBudget,
  }));

  // Dialog values
  const totalExpense = React.useMemo(() => {
    if (!currentBudget) return 0;
    return currentBudget.otherExpense + currentBudget.recordedExpense;
  }, [currentBudget]);

  const expenseProgress = React.useMemo(() => {
    if (!currentBudget) return 0;
    return Math.round((totalExpense / currentBudget.budget) * 100);
  }, [currentBudget, totalExpense]);

  const weeklyBudget = React.useMemo(() => {
    if (!currentBudget || currentBudget.surplus < 0) return 0;
    return Math.round(currentBudget.surplus / weeksLeftInMonth());
  }, [currentBudget]);

  return (
    <>
      <Stack direction={props.direction} spacing={2}>
        <Card className="w-64 bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl">
          <CardContent className="">
            <Stack spacing={1}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Savings />
                <Typography variant="h6">Current Month</Typography>
                <IconButton
                  className="ml-auto"
                  onClick={() => setOpenDialog(true)}
                >
                  <Settings />
                </IconButton>
              </Stack>
              <Typography variant="h5">
                {currentBudget?.budget || 0}
                {' SEK'}
              </Typography>
              <Typography variant="subtitle1">Monthly Budget</Typography>
            </Stack>
          </CardContent>
        </Card>
        <Card className="w-64 bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl">
          <CardContent>
            <Stack spacing={1}>
              <Stack direction="row" spacing={1} alignItems="center">
                <TrendingUp />
                <Typography variant="h6">Progress</Typography>
                <Typography variant="h6" className="ml-auto">
                  {expenseProgress}%
                </Typography>
              </Stack>
              <Typography variant="h5">
                {totalExpense}
                {' SEK'}
              </Typography>
              <LinearProgress variant="determinate" value={expenseProgress} />
            </Stack>
          </CardContent>
        </Card>
        <Card className="w-64 bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl">
          <CardContent>
            <Stack spacing={1}>
              <Stack direction="row" spacing={1} alignItems="center">
                <AccountBalanceWallet></AccountBalanceWallet>
                <Typography variant="h6">Remaining</Typography>
              </Stack>
              <Typography variant="h5">
                {currentBudget?.surplus || 0}
                {' SEK'}
              </Typography>
              <Typography variant="subtitle1">
                Weekly: {weeklyBudget} SEK ({weeksLeftInMonth()} weeks left)
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
      <BudgetsEditDialog
        open={openDialog}
        onClose={handleDialog}
        selectedBudget={currentBudget}
      ></BudgetsEditDialog>
    </>
  );
});

export default BudgetsCurrentMonth;
