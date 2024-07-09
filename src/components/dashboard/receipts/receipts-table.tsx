import { Receipt } from '@/types/receipt';
import { ArrowForward } from '@mui/icons-material';
import {
  Card,
  Checkbox,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import dayjs from 'dayjs';
import * as React from 'react';
import { receiptsTableColumns } from './config';

interface ReceiptsTableProps {
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
  selectionProps: {
    selectAll: () => void;
    deselectAll: () => void;
    selectOne: (id: string) => void;
    deselectOne: (id: string) => void;
    selected: Set<string>;
  };
  rows: Receipt[];
  editReceipt: (id: string) => void;
}

export default function ReceiptsTable({
  paginationProps,
  sortingProps,
  selectionProps,
  rows = [],
  editReceipt,
}: ReceiptsTableProps): React.JSX.Element {
  const selectedAll = selectionProps.selected.size === rows.length;
  const selectedSome = selectionProps.selected.size > 0 && !selectedAll;

  return (
    <Card className="flex-auto overflow-auto">
      <TableContainer className="">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={(e) => {
                    if (e.target.checked) {
                      selectionProps.selectAll();
                    } else {
                      selectionProps.deselectAll();
                    }
                  }}
                />
              </TableCell>
              {receiptsTableColumns.map((column) => (
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
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectionProps.selected.has(row.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        selectionProps.selectOne(row.id);
                      } else {
                        selectionProps.deselectOne(row.id);
                      }
                    }}
                  />
                </TableCell>
                <TableCell>{dayjs(row.date).format('YYYY-MM-DD')}</TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell>
                  <Chip label={row.category} variant="outlined"></Chip>
                </TableCell>
                <TableCell align="right">{row.amount}</TableCell>
                <TableCell>{row.notes}</TableCell>
                <TableCell>
                  <ArrowForward
                    className="cursor-pointer"
                    onClick={() => editReceipt(row.id)}
                  />
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
