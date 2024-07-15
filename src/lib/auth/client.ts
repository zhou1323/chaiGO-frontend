import request from '@/lib/request';
import {
  ApiResponse,
  ApiResponseWithToken,
  BaseResponse,
} from '@/types/apiResponse';
import { Captcha } from '@/types/captcha';
import { UserWithToken } from '@/types/user';

export interface SignInParams {
  email: string;
  password: string;
  captcha: string;
}

export interface SignOutParams {
  email: string;
}

export interface SignUpParams {
  email: string;
  password: string;
  username: string;
}

export interface revocerPasswordParam {
  email: string;
}

export interface resetPasswordParam {
  newPassword: string;
  token: string;
}

export function signIn(
  data: SignInParams
): Promise<ApiResponseWithToken<UserWithToken>> {
  const { email, password, captcha } = data;
  const formData = new FormData();
  formData.append('username', email);
  formData.append('password', password);
  // formData.append('captcha', captcha);

  return request({
    url: '/api/v1/auth/sign-in',
    method: 'POST',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export function signOut(data: SignOutParams): Promise<BaseResponse> {
  return request({
    url: '/api/v1/auth/sign-out',
    method: 'POST',
    data,
  });
}

export function signUp(data: SignUpParams): Promise<BaseResponse> {
  return request({
    url: '/api/v1/auth/sign-up',
    method: 'POST',
    data,
  });
}

export function recoverPassword(
  data: revocerPasswordParam
): Promise<BaseResponse> {
  return request({
    url: '/api/v1/auth/recover-password',
    method: 'GET',
    params: data,
  });
}

export function resetPassword(data: resetPasswordParam): Promise<BaseResponse> {
  return request({
    url: '/api/v1/auth/reset-password',
    method: 'POST',
    data,
  });
}

export function getCaptcha(): Promise<ApiResponse<Captcha>> {
  return request({
    url: '/api/v1/auth/captcha',
    method: 'GET',
  });
}
