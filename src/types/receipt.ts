import { ReceiptItem } from './receiptItem';

export interface Receipt {
  amount?: number;
  category: string;
  date: string;
  description: string;
  id: string;
  notes: string;
  items?: ReceiptItem[];
}
