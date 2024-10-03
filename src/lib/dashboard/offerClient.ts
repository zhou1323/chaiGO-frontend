import { PageRequest } from '@/types/apiRequest';
import { PageResponse } from '@/types/apiResponse';
import { Offer, OfferFilterParams } from '@/types/offer';
import request from '../request';

export interface GetOffersListParams extends PageRequest, OfferFilterParams {}

export function getOffersList(
  data: GetOffersListParams
): Promise<PageResponse<Offer>> {
  return request({
    url: '/api/v1/offers/list',
    method: 'GET',
    params: data,
  });
}
