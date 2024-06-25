'use client';
import ReceiptsFilter from '@/components/dashboard/receipts/receipts-filter';
import ReceiptsTable from '@/components/dashboard/receipts/receipts-table';
import { deleteReceipt, getReceiptsList } from '@/lib/dashboard/receiptClient';
import { Receipt } from '@/types/receipt';
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
  const [description, setDescription] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [receipts, setReceipts] = React.useState<Receipt[]>([]);
  const [orderBy, setOrderBy] = React.useState('');
  const [orderType, setOrderType] = React.useState<'asc' | 'desc'>('asc');

  const [count, setCount] = React.useState(0);
  const [page, setPage] = React.useState(0);
  const [limit, setLimit] = React.useState(10);

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && orderType === 'asc';
    setOrderType(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const search = async () => {
    const { message, data } = await getReceiptsList({
      page,
      limit,
      description,
      category,
      startDate,
      endDate,
    });
    if (message) {
      console.log(message);
    } else {
      console.log(data);
      const { items, total, totalPage } = data;
      setReceipts(items);
      setCount(total);
    }
  };

  const handleDeleteReceipt = async (ids: string[]) => {
    const { message } = await deleteReceipt({ ids });
    if (message) {
      console.log(message);
    } else {
      search();
    }
  };

  React.useEffect(() => {
    search();
  }, [page, limit]);

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
        description={description}
        setDescription={setDescription}
        category={category}
        setCategory={setCategory}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        doFilter={search}
      />

      <ReceiptsTable
        count={count}
        setPage={setPage}
        setLimit={setLimit}
        page={page}
        rows={receipts}
        limit={limit}
        orderBy={orderBy}
        orderType={orderType}
        sortColumn={handleRequestSort}
        deleteReceipt={handleDeleteReceipt}
        editReceipt={handleEdit}
      />
    </Stack>
  );
}
