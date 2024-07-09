export interface BaseResponse {
  code: number;
  message?: string;
}

export interface DataWithToken {
  accessToken?: string;
}

export interface ApiResponse<T> extends BaseResponse {
  data?: T;
}

export interface ApiResponseWithToken<T extends DataWithToken>
  extends BaseResponse {
  data: T;
}

export interface PageResponse<T> {
  items: T[];
  total: number; // total number of items.
  pages: number; // total number of pages.
  page: number; // current page number.
  size: number; // number of items per page.
}
