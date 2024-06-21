import { ApiResponse, BaseResponse, PageResponse } from '@/types/apiResponse';
import { Receipt } from '@/types/receipt';
import request from '../request';

export interface GetReceiptsListParams {
  page: number;
  limit: number;
  description?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
}

export interface GetReceiptParams {
  id: string;
}
export interface DeteleReceiptParams {
  ids: string[];
}

export interface UpdateReceiptParams extends Receipt {}

export type CreateReceiptParams = Omit<UpdateReceiptParams, 'id'>;

export function getReceiptsList(
  data: GetReceiptsListParams
): Promise<PageResponse<Receipt>> {
  return request({
    url: '/receipts/list',
    method: 'GET',
    data,
  });
}

export function getReceiptById(
  data: GetReceiptParams
): Promise<ApiResponse<Receipt>> {
  return request({
    url: '/receipts',
    method: 'GET',
    data,
  });
}

export function createReceipt(
  data: CreateReceiptParams
): Promise<ApiResponse<Receipt>> {
  return request({
    url: '/receipts',
    method: 'POST',
    data,
  });
}

export function updateReceipt(
  data: UpdateReceiptParams
): Promise<ApiResponse<Receipt>> {
  return request({
    url: '/receipts',
    method: 'PUT',
    data,
  });
}

export function deleteReceipt(
  data: DeteleReceiptParams
): Promise<BaseResponse> {
  return request({
    url: '/receipts',
    method: 'DELETE',
    data,
  });
}
