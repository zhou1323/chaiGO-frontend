export interface OfferFilterParams {
  description?: string;
  category?: string;
}

export interface Offer {
  img: string;
  imgUrl: string;
  id: string;
  item: string;
  itemEn: string;
  itemSv: string;
  itemZh: string;
  startDate: string; // valid from
  endDate: string; // valid to
  category: string;
  price: number; // final price
  quantity: number; // the number covered in the item
  unit: string; // g/kg/l/ml/piece
  unitRangeFrom: number; // some items will have unfixed weight, e.g. 400-500g
  unitRangeTo: number; // When the weight is fixed, unitRangeFrom is just the same as unitRangeTo.
  ordinaryPrice: number;
  storeName: string;
}

export interface OfferInShoppingList extends Offer {
  priceString: string;
  offerInfo: string;
}
