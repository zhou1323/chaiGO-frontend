'use client';
import ReceiptsFilter from '@/components/dashboard/receipts/receipts-filter';
import ReceiptsTable from '@/components/dashboard/receipts/receipts-table';
import { useSelection } from '@/hooks/use-selection';
import { generatePresignedUrl } from '@/lib/auth/client';
import {
  createReceiptsByUpload,
  CreateReceiptsByUploadParams,
  deleteReceipt,
  getReceiptsList,
} from '@/lib/dashboard/receiptClient';
import { ImageFile } from '@/types/imageFile';
import { Receipt, ReceiptFilterParams } from '@/types/receipt';
import { Add, FileDownload, FileUpload } from '@mui/icons-material';
import { Button, Stack, Typography } from '@mui/material';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import * as React from 'react';
import UploadDialog from './upload-dialog';

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
  const params = useSearchParams();
  const [filter, setFilter] = React.useState({
    startDate: params.get('startDate') || undefined,
    endDate: params.get('endDate') || undefined,
  } as ReceiptFilterParams);

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

  // Upload picture
  const [openUploadDialog, setOpenUploadDialog] = React.useState(false);

  const handleUploadClose = () => {
    setOpenUploadDialog(false);
  };

  const getUploadPresignedUrl = async (fileName: string) => {
    try {
      const { message, data } = await generatePresignedUrl({ fileName });
      if (message) {
        throw new Error(message);
      }
      return data?.url;
    } catch (error: any) {
      console.log(error.response?.data.detail || error.message);
    }
  };

  const handleUpload = async (files: ImageFile[]) => {
    if (files.length === 0) return Promise.resolve();

    const uploadPromises = files.map(async (file: File) => {
      return getUploadPresignedUrl(file.name).then((url) => {
        if (!url) return Promise.reject('No URL');

        return axios.put(url, file, {
          headers: {
            'Content-Type': file.type,
          },
        });
      });
    });

    return Promise.all(uploadPromises)
      .then((values) => {
        const createdFiles = values.map((value, index) => {
          return {
            fileName: files[index].name,
          };
        });
        createReceiptsByUpload({
          files: createdFiles,
        } as CreateReceiptsByUploadParams);
      })
      .then(() => {
        handleUploadClose();
        search();
      })
      .catch((error) => {
        console.log(
          'Upload failed',
          error.response?.data.detail || error.message
        );
      });
  };

  const uploadProps = {
    openUploadDialog,
    handleUploadClose,
    handleUpload,
  };

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={3} alignItems="center">
        <Stack className="flex-auto">
          <Typography variant="h4" className="font-bold">
            Receipts
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Button
            startIcon={<FileUpload />}
            color="primary"
            onClick={() => setOpenUploadDialog(true)}
          >
            Upload
          </Button>
          {/* TODO: Implement download */}
          <Button startIcon={<FileDownload />} color="primary">
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

      <UploadDialog uploadProps={uploadProps} />
    </Stack>
  );
}
