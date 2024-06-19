import request from '@/lib/request';
import { ApiResponse, BaseResponse } from '@/types/apiResponse';
import { User } from '@/types/user';

export interface SignInParams {
  email: string;
  password: string;
}

export interface SignOutParams {
  email: string;
}

export interface SignUpParams {
  email: string;
  password: string;
  userName: string;
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

export function signOut(data: SignOutParams): Promise<BaseResponse> {
  return request({
    url: '/auth/sign-out',
    method: 'POST',
    data,
  });
}

export function signUp(data: SignUpParams): Promise<ApiResponse<User>> {
  return request({
    url: '/auth/sign-up',
    method: 'POST',
    data,
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
