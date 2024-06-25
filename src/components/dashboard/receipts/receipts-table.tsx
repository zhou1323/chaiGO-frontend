import { useSelection } from '@/hooks/use-selection';
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
import * as React from 'react';
import { receiptsTableColumns } from './config';
interface ReceiptsTableProps {
  count: number;
  rows: Receipt[];
  page: number;
  limit: number;
  orderBy?: string;
  orderType?: 'asc' | 'desc';
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  sortColumn: (property: string) => void;
  deleteReceipt: (ids: string[]) => void;
  editReceipt: (id: string) => void;
}
export default function ReceiptsTable({
  count = 0,
  rows = [],
  page = 0,
  limit = 10,
  orderBy,
  orderType,
  setPage,
  setLimit,
  sortColumn,
  deleteReceipt,
  editReceipt,
}: ReceiptsTableProps): React.JSX.Element {
  const rowIds = React.useMemo(() => rows.map((row) => row.id), [rows]);

  const { selectAll, deselectAll, selectOne, deselectOne, selected } =
    useSelection(rowIds);

  const selectedAll = selected.size === rowIds.length;
  const selectedSome = selected.size > 0 && !selectedAll;

  const handleChangePage = (event: unknown, newPage: number): void => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setLimit(parseInt(event.target.value, 10));
    setPage(0);
  };

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
                      selectAll();
                    } else {
                      deselectAll();
                    }
                  }}
                />
              </TableCell>
              {receiptsTableColumns.map((column) => (
                <TableCell
                  key={column.key}
                  sortDirection={orderBy === column.key ? orderType : false}
                >
                  {column.sorting ? (
                    <TableSortLabel
                      active={orderBy === column.key}
                      direction={orderBy === column.key ? orderType : 'asc'}
                      onClick={() => sortColumn(column.key)}
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
                    checked={selected.has(row.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        selectOne(row.id);
                      } else {
                        deselectOne(row.id);
                      }
                    }}
                  />
                </TableCell>
                <TableCell>{row.date}</TableCell>
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
        count={count}
        rowsPerPage={limit}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Card>
  );
}
