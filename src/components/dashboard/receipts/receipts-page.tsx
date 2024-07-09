'use client';
import ReceiptsFilter from '@/components/dashboard/receipts/receipts-filter';
import ReceiptsTable from '@/components/dashboard/receipts/receipts-table';
import { useSelection } from '@/hooks/use-selection';
import { deleteReceipt, getReceiptsList } from '@/lib/dashboard/receiptClient';
import { Receipt, ReceiptFilterParams } from '@/types/receipt';
import { Add, FileDownload, FileUpload } from '@mui/icons-material';
import { Button, Stack, Typography } from '@mui/material';
import * as React from 'react';

export default function ReceiptsPage({
  handleAdd,
  handleEdit,
}: {
  handleAdd: () => void;
  handleEdit: (id: string) => void;
}): React.JSX.Element {
  // Receipt
  const [receipts, setReceipts] = React.useState<Receipt[]>([]);
  const search = async () => {
    try {
      const params = {
        ...filter,
        page: page + 1, // 1-based
        size,
        orderBy,
        orderType,
      };

      const { items, total } = await getReceiptsList(params);

      setReceipts(items);
      setCount(total);
    } catch (error: any) {
      console.log(error.response?.data.detail || error.message);
    }
  };

  // Params to filter receipts
  const [filter, setFilter] = React.useState({} as ReceiptFilterParams);

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

  React.useEffect(() => {
    search();
  }, [page, size, orderBy, orderType]);

  // Selection
  const rowIds = React.useMemo(() => receipts.map((row) => row.id), [receipts]);
  const { selectAll, deselectAll, selectOne, deselectOne, selected } =
    useSelection(rowIds);

  const selectionProps = {
    selected,
    selectOne,
    deselectOne,
    selectAll,
    deselectAll,
  };

  // Daletions
  const handleDeleteReceipt = async (ids: string[]) => {
    try {
      const { message } = await deleteReceipt({ ids });
      if (message) {
        console.log(message);
      } else {
        search();
      }
    } catch (error: any) {
      console.log(error.response?.data.detail || error.message);
    }
  };

  const deletionProps = {
    handleDeleteReceipt,
    selected,
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack className="flex-auto">
          <Typography variant="h4">Receipts</Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Button startIcon={<FileUpload />} color="inherit">
            Upload
          </Button>
          <Button startIcon={<FileDownload />} color="inherit">
            Download
          </Button>
          <Button startIcon={<Add />} variant="contained" onClick={handleAdd}>
            Add
          </Button>
        </Stack>
      </Stack>

      <ReceiptsFilter
        filterProps={filterProps}
        deletionProps={deletionProps}
        doFilter={search}
      />

      <ReceiptsTable
        paginationProps={paginationProps}
        sortingProps={sortingProps}
        selectionProps={selectionProps}
        rows={receipts}
        editReceipt={handleEdit}
      />
    </Stack>
  );
}
