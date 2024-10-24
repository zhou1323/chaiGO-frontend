'use client';
import BudgetsCurrentMonth, {
  BudgetsCurrentMonthRef,
} from '@/app/[locale]/components/dashboard/budgets/budgets-current-month';
import BudgetsEditDialog from '@/app/[locale]/components/dashboard/budgets/budgets-edit-dialog';
import BudgetsFilter from '@/app/[locale]/components/dashboard/budgets/budgets-filter';
import BudgetsTable from '@/app/[locale]/components/dashboard/budgets/budgets-table';
import { getBudgetsList } from '@/lib/dashboard/budgetClient';
import { Budget, BudgetFilterParams } from '@/types/budgets';

import { Add } from '@mui/icons-material';
import { Button, Stack, Typography } from '@mui/material';
import * as React from 'react';

export default function BudgetPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  // Params to filter budgets
  const [filter, setFilter] = React.useState<BudgetFilterParams>({});

  const filterProps = {
    filter,
    setFilter,
  };

  // Sorting
  const [orderBy, setOrderBy] = React.useState('');
  const [orderType, setOrderType] = React.useState<'asc' | 'desc'>('asc');

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && orderType === 'asc';
    setOrderType(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortingProps = {
    orderBy,
    orderType,
    handleRequestSort,
  };

  // Pagination
  const [count, setCount] = React.useState(0);
  const [page, setPage] = React.useState(0);
  const [size, setSize] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number): void => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginationProps = {
    page,
    size,
    count,
    handleChangePage,
    handleChangeRowsPerPage,
  };

  // Get budgets
  const [budgets, setBudgets] = React.useState<Budget[]>([]);

  const getBudgets = async () => {
    try {
      const params = {
        ...filter,
        orderBy,
        orderType,
        page: page + 1,
        size,
      };
      const { items, total } = await getBudgetsList(params);
      setBudgets(items);
      setCount(total);
    } catch (error: any) {
      console.log(error.response?.data.detail || error.message);
    }
  };

  React.useEffect(() => {
    getBudgets();
  }, [page, size, orderBy, orderType]);

  const [openDialog, setOpenDialog] = React.useState(false);
  const handleDialog = (refresh = false) => {
    setOpenDialog(!openDialog);
    if (refresh) {
      // refresh page
      getBudgets();
      currentBudget.current?.refresh();
    }
  };
  const [selectedBudget, setSelectedBudget] = React.useState<Budget>();

  const selectBudget = (budget?: Budget) => {
    setSelectedBudget(budget);
    setOpenDialog(true);
  };

  const addBudget = () => {
    setSelectedBudget(undefined);
    setOpenDialog(true);
  };

  const currentBudget = React.useRef<BudgetsCurrentMonthRef>(null);

  return (
    <>
      <Stack spacing={2}>
        <Stack direction="row" alignItems="center">
          <Typography variant="h4" className="flex-1 font-bold">
            Budgets
          </Typography>
          <Button startIcon={<Add />} variant="contained" onClick={addBudget}>
            Add
          </Button>
        </Stack>

        <Stack direction="row" spacing={2}>
          <BudgetsCurrentMonth
            direction="column"
            onRefresh={getBudgets}
            ref={currentBudget}
          ></BudgetsCurrentMonth>
          <Stack spacing={2} className="flex-auto">
            <BudgetsFilter
              doFilter={getBudgets}
              filterProps={filterProps}
            ></BudgetsFilter>
            <BudgetsTable
              rows={budgets}
              selectBudget={selectBudget}
              paginationProps={paginationProps}
              sortingProps={sortingProps}
              locale={locale}
            ></BudgetsTable>
          </Stack>
        </Stack>
      </Stack>

      <BudgetsEditDialog
        open={openDialog}
        onClose={handleDialog}
        selectedBudget={selectedBudget}
      ></BudgetsEditDialog>
    </>
  );
}
