import { PageRequest } from '@/types/apiRequest';
import { ApiResponse, BaseResponse, PageResponse } from '@/types/apiResponse';
import {
  Receipt,
  ReceiptFilterParams,
  ReceiptSortingParams,
} from '@/types/receipt';
import request from '../request';

export interface GetReceiptsListParams
  extends PageRequest,
    ReceiptFilterParams,
    ReceiptSortingParams {}

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
    url: `/api/v1/receipts/receipt/${id}`,
    method: 'GET',
  });
}

export function createReceipt(
  data: CreateReceiptParams
): Promise<ApiResponse<Receipt>> {
  return request({
    url: '/api/v1/receipts/receipt',
    method: 'POST',
    data,
  });
}

export function updateReceipt(
  data: UpdateReceiptParams
): Promise<ApiResponse<Receipt>> {
  const { id } = data;
  return request({
    url: `/api/v1/receipts/receipt/${id}`,
    method: 'PUT',
    data,
  });
}

export function deleteReceipt(
  data: DeteleReceiptParams
): Promise<BaseResponse> {
  return request({
    url: '/api/v1/receipts/receipt',
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
