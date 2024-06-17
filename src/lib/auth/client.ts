import request from '@/lib/request';
import { ApiResponse, BaseResponse } from '@/types/apiResponse';
import { User } from '@/types/user';

export interface SignInParams {
  email: string;
  password: string;
}

export interface resetPasswordParams {
  email: string;
}

export function signIn(data: SignInParams): Promise<ApiResponse<User>> {
  return request({
    url: '/auth/sign-in',
    method: 'POST',
    data,
  });
}

export function signOut(): Promise<BaseResponse> {
  return request({
    url: '/auth/sign-out',
    method: 'POST',
  });
}

export function resetPassword(
  data: resetPasswordParams
): Promise<BaseResponse> {
  return request({
    url: '/auth/reset-password',
    method: 'POST',
    data,
  });
}
