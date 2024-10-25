import { useTranslation } from '@/app/i18n/client';
import { Namespaces } from '@/app/i18n/settings';
import { getLocalizedPath, paths } from '@/paths';
import useCustomizationStore from '@/store/customization';
import { Budget } from '@/types/budgets';
import {
  Button,
  Card,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import RouterLink from 'next/link';
import { budgetTableColumns } from './config';

interface BudgetTableProps {
  rows: Budget[];
  selectBudget: (budget: Budget) => void;
  paginationProps: {
    page: number;
    size: number;
    count: number;
    handleChangePage: (event: unknown, newPage: number) => void;
    handleChangeRowsPerPage: (
      event: React.ChangeEvent<HTMLInputElement>
    ) => void;
  };
  sortingProps: {
    orderBy?: string;
    orderType?: 'asc' | 'desc';
    handleRequestSort: (property: string) => void;
  };
  locale: string;
}

export default function BudgetTable({
  rows,
  selectBudget,
  sortingProps,
  paginationProps,
  locale,
}: BudgetTableProps) {
  const { t } = useTranslation(locale, Namespaces.dashboard);
  const getFirstAndLastDateOfMonth = (dateString: string) => {
    const date = new Date(dateString);
    const firstDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    return {
      firstDate: `${firstDate.getFullYear()}-${String(
        firstDate.getMonth() + 1
      ).padStart(2, '0')}-${String(firstDate.getDate()).padStart(2, '0')}`,

      lastDate: `${lastDate.getFullYear()}-${String(
        lastDate.getMonth() + 1
      ).padStart(2, '0')}-${String(lastDate.getDate()).padStart(2, '0')}`,
    };
  };

  const getCurrencyString = useCustomizationStore(
    (state) => state.getCurrencyString
  );

  return (
    <Card className="rounded-lg shadow">
      <TableContainer>
        <Table>
          <TableHead className="bg-gray-100">
            <TableRow>
              {budgetTableColumns.map((column) => (
                <TableCell
                  key={column.key}
                  sortDirection={
                    sortingProps.orderBy === column.key
                      ? sortingProps.orderType
                      : false
                  }
                  className="font-bold"
                >
                  {column.sorting ? (
                    <TableSortLabel
                      active={sortingProps.orderBy === column.key}
                      direction={
                        sortingProps.orderBy === column.key
                          ? sortingProps.orderType
                          : 'asc'
                      }
                      onClick={() => sortingProps.handleRequestSort(column.key)}
                    >
                      {t(column.label)}
                    </TableSortLabel>
                  ) : (
                    <>{t(column.label)}</>
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows &&
              rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{getCurrencyString(row.budget)}</TableCell>
                  <TableCell>
                    <Link
                      component={RouterLink}
                      href={`${getLocalizedPath(
                        paths.dashboard.receipts,
                        locale
                      )}?startDate=${getFirstAndLastDateOfMonth(row.date).firstDate}&endDate=${getFirstAndLastDateOfMonth(row.date).lastDate}`}
                      variant="body2"
                    >
                      {getCurrencyString(row.recordedExpense)}
                    </Link>
                  </TableCell>
                  <TableCell>{getCurrencyString(row.otherExpense)}</TableCell>
                  <TableCell>{getCurrencyString(row.surplus)}</TableCell>
                  <TableCell>{row.notes}</TableCell>
                  <TableCell>
                    <Button
                      variant="text"
                      onClick={() => selectBudget({ ...row })}
                    >
                      {t('common.edit')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={paginationProps.count}
        rowsPerPage={paginationProps.size}
        page={paginationProps.page}
        onPageChange={paginationProps.handleChangePage}
        onRowsPerPageChange={paginationProps.handleChangeRowsPerPage}
      />
    </Card>
  );
}
