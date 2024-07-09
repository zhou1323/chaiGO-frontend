import { ReceiptItem } from './receiptItem';

export interface ReceiptFilterParams {
  description?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
}

export interface Receipt {
  amount?: number;
  category: string;
  date: string;
  description: string;
  id: string;
  notes: string;
  items?: ReceiptItem[];
}
