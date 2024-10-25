import { useTranslation } from '@/app/i18n/client';
import { Namespaces } from '@/app/i18n/settings';
import useCustomizationStore from '@/store/customization';
import { Receipt } from '@/types/receipt';
import { ArrowForward, CheckCircleOutline } from '@mui/icons-material';
import {
  Card,
  Checkbox,
  Chip,
  Icon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Tooltip,
} from '@mui/material';
import dayjs from 'dayjs';
import * as React from 'react';
import { receiptsTableColumns, receiptsTaskStatuses } from './config';
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
  locale: string;
}

export default function ReceiptsTable({
  paginationProps,
  sortingProps,
  selectionProps,
  rows = [],
  editReceipt,
  locale,
}: ReceiptsTableProps): React.JSX.Element {
  const { t } = useTranslation(locale, Namespaces.dashboard);
  const selectedAll = selectionProps.selected.size === rows.length;
  const selectedSome = selectionProps.selected.size > 0 && !selectedAll;

  const getCurrencyString = useCustomizationStore(
    (state) => state.getCurrencyString
  );

  return (
    <Card className="flex-auto overflow-auto rounded-lg shadow">
      <TableContainer className="">
        <Table>
          <TableHead className="bg-gray-100">
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
                  className="font-bold"
                  align={column.align}
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
                <TableCell align="center">
                  <Chip
                    label={row.category}
                    variant="outlined"
                    size="medium"
                  ></Chip>
                </TableCell>
                <TableCell>{getCurrencyString(row.amount || 0)}</TableCell>
                <TableCell>{row.notes}</TableCell>
                <TableCell align="center">
                  {row.taskStatus ? (
                    <Tooltip title={row.taskMessage || row.taskStatus}>
                      <Icon
                        component={receiptsTaskStatuses[row.taskStatus].icon}
                        color={
                          receiptsTaskStatuses[row.taskStatus].color as any
                        }
                      />
                    </Tooltip>
                  ) : (
                    <CheckCircleOutline color="success" />
                  )}
                </TableCell>
                <TableCell align="center">
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
