export interface BaseResponse {
  code: number;
  message?: string;
  token?: string;
}

export interface ApiResponse<T> extends BaseResponse {
  data: T;
}
