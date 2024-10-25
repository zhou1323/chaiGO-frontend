'use client';
import { useTranslation } from '@/app/i18n/client';
import { Namespaces } from '@/app/i18n/settings';
import { getBudgetsCurrent } from '@/lib/dashboard/budgetClient';
import { weeksLeftInMonth } from '@/lib/utils';
import useCustomizationStore from '@/store/customization';
import { Budget } from '@/types/budgets';
import { ArrowDropDown, InfoOutlined, Settings } from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  IconButton,
  LinearProgress,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import * as React from 'react';
import BudgetsEditDialog from './budgets-edit-dialog';

interface BudgetsCurrentMonthProps {
  direction?: 'row' | 'column';
  onRefresh?: () => void;
  locale: string;
}

export interface BudgetsCurrentMonthRef {
  refresh: () => void;
}

const BudgetsCurrentMonth = React.forwardRef<
  BudgetsCurrentMonthRef,
  BudgetsCurrentMonthProps
>(function BudgetsCurrentMonth(props, ref) {
  const { t } = useTranslation(props.locale, Namespaces.dashboard);
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
    if (!currentBudget || currentBudget.budget === 0) return 0;
    return Math.round((totalExpense / currentBudget.budget) * 100);
  }, [currentBudget, totalExpense]);

  const weeklyBudget = React.useMemo(() => {
    let weeksLeft = weeksLeftInMonth();
    if (!currentBudget || currentBudget.surplus < 0 || weeksLeft === 0)
      return 0;
    return Math.round(currentBudget.surplus / weeksLeft);
  }, [currentBudget]);

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
                  <Typography variant="overline">
                    {t('budgets.title')}
                  </Typography>
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
                  {t('budgets.sinceLastMonth')}
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
                <Typography variant="overline">
                  {t('budgets.expense')}
                </Typography>
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
                  {t('budgets.sinceLastMonth')}
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
                <Typography variant="overline">
                  {t('budgets.progress')}
                </Typography>
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
                <Typography variant="overline">
                  {t('budgets.remaining')}
                </Typography>
                <Typography variant="h4" className="font-bold">
                  {getCurrencyString(currentBudget?.surplus || 0)}
                </Typography>
              </Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="overline">
                  {t('budgets.weekly')}: {getCurrencyString(weeklyBudget)}
                </Typography>
                <Tooltip
                  title={t('budgets.weeksLeft', { weeks: weeksLeftInMonth() })}
                >
                  <InfoOutlined className="cursor-pointer text-xs font-normal" />
                </Tooltip>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Stack>
      <BudgetsEditDialog
        open={openDialog}
        onClose={handleDialog}
        selectedBudget={currentBudget}
        locale={props.locale}
      ></BudgetsEditDialog>
    </>
  );
});

export default BudgetsCurrentMonth;
