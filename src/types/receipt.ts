import { ReceiptItem } from './receiptItem';

export interface ReceiptFilterParams {
  description?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
}

export interface ReceiptSortingParams {
  orderBy?: string;
  orderType?: 'asc' | 'desc';
}

export interface Receipt {
  amount?: number;
  category: string;
  date: string;
  description: string;
  id: string;
  notes: string;
  fileName?: string;
  fileUrl?: string;
  taskId?: string;
  taskStatus?: 'PENDING' | 'STARTED' | 'RETRY' | 'FAILURE' | 'SUCCESS';
  taskMessage?: string;
  items?: ReceiptItem[];
}
