import { PageRequest } from '@/types/apiRequest';
import { ApiResponse, BaseResponse, PageResponse } from '@/types/apiResponse';
import { Receipt } from '@/types/receipt';
import request from '../request';

export interface GetReceiptsListParams extends PageRequest {
  description?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  orderBy?: string;
  orderType?: 'asc' | 'desc';
}

export interface GetReceiptParams {
  id: string;
}
export interface DeteleReceiptParams {
  ids: string[];
}

export interface UpdateReceiptParams extends Receipt {}

export type CreateReceiptParams = Omit<UpdateReceiptParams, 'id'>;

export interface CreateReceiptsByUploadParams {
  files: { fileName?: string; fileUrl?: string }[];
}

export function getReceiptsList(
  data: GetReceiptsListParams
): Promise<PageResponse<Receipt>> {
  return request({
    url: '/api/v1/receipts/list',
    method: 'GET',
    params: data,
  });
}

export function getReceiptById(
  data: GetReceiptParams
): Promise<ApiResponse<Receipt>> {
  const { id } = data;
  return request({
    url: `/api/v1/receipts/${id}`,
    method: 'GET',
  });
}

export function createReceipt(
  data: CreateReceiptParams
): Promise<ApiResponse<Receipt>> {
  return request({
    url: '/api/v1/receipts',
    method: 'POST',
    data,
  });
}

export function updateReceipt(
  data: UpdateReceiptParams
): Promise<ApiResponse<Receipt>> {
  const { id } = data;
  return request({
    url: `/api/v1/receipts/${id}`,
    method: 'PUT',
    data,
  });
}

export function deleteReceipt(
  data: DeteleReceiptParams
): Promise<BaseResponse> {
  return request({
    url: '/api/v1/receipts',
    method: 'DELETE',
    data,
  });
}

export function createReceiptsByUpload(
  data: CreateReceiptsByUploadParams
): Promise<BaseResponse> {
  return request({
    url: '/api/v1/receipts/create-receipts-by-upload',
    method: 'POST',
    data,
  });
}
