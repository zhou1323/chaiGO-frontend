import { Budget } from '@/types/budgets';
import {
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import Link from 'next/link';
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
}

export default function BudgetTable({
  rows,
  selectBudget,
  sortingProps,
  paginationProps,
}: BudgetTableProps) {
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

  return (
    <Card>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {budgetTableColumns.map((column) => (
                <TableCell
                  key={column.key}
                  sortDirection={
                    sortingProps.orderBy === column.key
                      ? sortingProps.orderType
                      : false
                  }
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
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    <>{column.label}</>
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
                  <TableCell>{row.budget}</TableCell>
                  <TableCell>
                    <Link
                      href={`/dashboard/receipts?startDate=${getFirstAndLastDateOfMonth(row.date).firstDate}&endDate=${getFirstAndLastDateOfMonth(row.date).lastDate}`}
                    >
                      {row.recordedExpense}
                    </Link>
                  </TableCell>
                  <TableCell>{row.otherExpense}</TableCell>
                  <TableCell>{row.surplus}</TableCell>
                  <TableCell>{row.notes}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() => selectBudget({ ...row })}
                    >
                      Edit
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
