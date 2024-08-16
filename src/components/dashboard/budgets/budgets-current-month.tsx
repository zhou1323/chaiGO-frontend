import { getBudgetsCurrent } from '@/lib/dashboard/budgetClient';
import { weeksLeftInMonth } from '@/lib/utils';
import useCustomizationStore from '@/store/customization';
import { Budget } from '@/types/budgets';
import { ArrowDropDown, Settings } from '@mui/icons-material';
import {
  Box,
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

  const countryCode = 'sv-SE';

  const getCurrencyString = useCustomizationStore(
    (state) => state.getCurrencyString
  );

  return (
    <>
      <Stack
        direction={props.direction}
        spacing={2}
        className={props.direction === 'column' ? 'w-80' : ''}
      >
        <Card
          className={`${props.direction === 'column' ? 'flex-0' : 'flex-1'} h-32 rounded-lg bg-white px-4 py-2 shadow`}
        >
          <CardContent className="p-0">
            <Box>
              <Stack direction="row" spacing={2} alignItems="start">
                <Box>
                  <Typography variant="overline">Budget</Typography>
                  <Typography variant="h4" className="font-bold">
                    {getCurrencyString(currentBudget?.budget || 0)}
                  </Typography>
                </Box>
                <IconButton
                  className="ml-auto"
                  onClick={() => setOpenDialog(true)}
                >
                  <Settings />
                </IconButton>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <ArrowDropDown />
                <Typography className="text-xs font-normal leading-tight text-gray-500">
                  {0.0 + '%'}
                </Typography>
                <Typography className="text-xs font-normal leading-tight text-gray-500">
                  Since last month
                </Typography>
              </Stack>
            </Box>
          </CardContent>
        </Card>
        <Card
          className={`${props.direction === 'column' ? 'flex-0' : 'flex-1'} h-32 rounded-lg bg-white px-4 py-2 shadow`}
        >
          <CardContent className="p-0">
            <Box>
              <Box>
                <Typography variant="overline">Expense</Typography>
                <Typography variant="h4" className="font-bold">
                  {getCurrencyString(
                    (currentBudget?.otherExpense || 0) +
                      (currentBudget?.recordedExpense || 0)
                  )}
                </Typography>
              </Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <ArrowDropDown />
                <Typography className="text-xs font-normal leading-tight text-gray-500">
                  {0.0 + '%'}
                </Typography>
                <Typography className="text-xs font-normal leading-tight text-gray-500">
                  Since last month
                </Typography>
              </Stack>
            </Box>
          </CardContent>
        </Card>
        <Card
          className={`${props.direction === 'column' ? 'flex-0' : 'flex-1'} h-32 rounded-lg bg-white px-4 py-2 shadow`}
        >
          <CardContent className="p-0">
            <Box>
              <Box>
                <Typography variant="overline">Progress</Typography>
                <Typography variant="h4" className="font-bold">
                  {expenseProgress}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                className="mt-2"
                value={expenseProgress}
              />
            </Box>
          </CardContent>
        </Card>
        <Card
          className={`${props.direction === 'column' ? 'flex-0' : 'flex-1'} h-32 rounded-lg bg-white px-4 py-2 shadow`}
        >
          <CardContent className="p-0">
            <Box>
              <Box>
                <Typography variant="overline">Remaining</Typography>
                <Typography variant="h4" className="font-bold">
                  {getCurrencyString(currentBudget?.surplus || 0)}
                </Typography>
              </Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="overline">
                  Weekly: {getCurrencyString(weeklyBudget)}
                </Typography>
                <Typography variant="overline">
                  ({weeksLeftInMonth()} weeks left)
                </Typography>
              </Stack>
            </Box>
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
