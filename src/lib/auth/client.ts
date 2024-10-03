import request from '@/lib/request';
import {
  ApiResponse,
  ApiResponseWithToken,
  BaseResponse,
} from '@/types/apiResponse';
import { Captcha } from '@/types/captcha';
import { CloudfrontCookie } from '@/types/cookie';
import { UserWithToken } from '@/types/user';

export interface SignInParams {
  email: string;
  password: string;
  captcha: string;
}

export interface SignOutParams {
  email: string;
}

export interface VerificationCodeParams {
  email: string;
}

export interface SignUpParams {
  email: string;
  password: string;
  username: string;
}

export interface recoverPasswordParam {
  email: string;
}

export interface resetPasswordParam {
  newPassword: string;
  token: string;
}

export interface GeneratePresignedUrlParams {
  fileName: string;
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

export function getVerificationCode(
  data: VerificationCodeParams
): Promise<BaseResponse> {
  return request({
    url: '/api/v1/auth/verification-code',
    method: 'GET',
    params: data,
  });
}

export function recoverPassword(
  data: recoverPasswordParam
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

export function generatePresignedUrl(
  data: GeneratePresignedUrlParams
): Promise<ApiResponse<{ url: string }>> {
  return request({
    url: '/api/v1/auth/aws/generate-presigned-url',
    method: 'GET',
    params: data,
  });
}

export function generatePresignedCookie(): Promise<
  ApiResponse<CloudfrontCookie>
> {
  return request({
    url: '/api/v1/auth/aws/generate-presigned-cookie',
    method: 'GET',
    withCredentials: true,
  });
}
