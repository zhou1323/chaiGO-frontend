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

export interface PageResponse<T> extends BaseResponse {
  data: {
    items: T[];
    total: number;
    pages: number;
  };
}
