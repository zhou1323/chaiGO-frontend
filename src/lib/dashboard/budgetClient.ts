import { PageRequest } from '@/types/apiRequest';
import { ApiResponse, BaseResponse, PageResponse } from '@/types/apiResponse';
import {
  Budget,
  BudgetFilterParams,
  BudgetSortingParams,
  BudgetsOverview,
} from '@/types/budgets';
import request from '../request';

export interface GetBudgetsListParams
  extends PageRequest,
    BudgetSortingParams,
    BudgetFilterParams {}

export interface CreateBudgetParams {
  date: string;
  budget: number;
  otherExpense: number;
  surplus: number;
  notes?: string;
}

export interface UpdateBudgetParams {
  id: string;
  budget: number;
  otherExpense: number;
  surplus: number;
  notes?: string;
}

export function getBudgetsList(
  data: GetBudgetsListParams
): Promise<PageResponse<Budget>> {
  return request({
    url: '/api/v1/budgets/list',
    method: 'GET',
    params: data,
  });
}

export function createBudget(data: CreateBudgetParams): Promise<BaseResponse> {
  return request({
    url: '/api/v1/budgets',
    method: 'POST',
    data,
  });
}

export function updateBudget(data: UpdateBudgetParams): Promise<BaseResponse> {
  const { id } = data;
  return request({
    url: `/api/v1/budgets/${id}`,
    method: 'PUT',
    data,
  });
}

export function getBudgetsCurrent(): Promise<ApiResponse<Budget>> {
  return request({
    url: '/api/v1/budgets/current',
    method: 'GET',
  });
}

export function getBudgetsOverview(): Promise<ApiResponse<BudgetsOverview[]>> {
  return request({
    url: '/api/v1/budgets/overview',
    method: 'GET',
  });
}
