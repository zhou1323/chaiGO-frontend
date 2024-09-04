import { PageRequest } from '@/types/apiRequest';
import { BaseResponse, PageResponse } from '@/types/apiResponse';
import { Offer, OfferFilterParams, OfferInShoppingList } from '@/types/offer';
import request from '../request';

export interface GetOffersListParams extends PageRequest, OfferFilterParams {}

export interface SendShoppingListEmailParams {
  shoppingList: {
    storeName: string;
    offers: OfferInShoppingList[];
    total: string;
  }[];
  total: string;
  weeklyBudget: string;
}

export function getOffersList(
  data: GetOffersListParams
): Promise<PageResponse<Offer>> {
  return request({
    url: '/api/v1/offers/list',
    method: 'GET',
    params: data,
  });
}

export function sendShoppingListEmail(
  data: SendShoppingListEmailParams
): Promise<BaseResponse> {
  return request({
    url: '/api/v1/offers/send-shopping-list-email',
    method: 'POST',
    data,
  });
}
